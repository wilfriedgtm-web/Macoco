import { useState, useEffect, useRef } from 'react'
import { supabase, formatPrix, PHOTOS_DEFAUT } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Btn, Modal, Input, Textarea, Gallery, Spinner, Empty } from '../../components/UI'
import { useToast } from '../../hooks/useToast'

const ICONS = ['✂️','🪢','💅','🧴','👁️','💆','💇','🌸','✨','💋']

function getCoverDefault(nom) {
  const k = (nom||'').toLowerCase()
  if(k.includes('braid')||k.includes('tresse')) return PHOTOS_DEFAUT.braids
  if(k.includes('coupe')||k.includes('brush')) return PHOTOS_DEFAUT.coupe
  if(k.includes('manu')||k.includes('ongle')) return PHOTOS_DEFAUT.manu
  if(k.includes('defris')||k.includes('liss')) return PHOTOS_DEFAUT.defrisage
  if(k.includes('cil')) return PHOTOS_DEFAUT.cils
  return PHOTOS_DEFAUT.default
}

export default function Catalogue() {
  const { salon } = useAuth()
  const { toast, showToast } = useToast()
  const [presta, setPresta]   = useState([])
  const [photos, setPhotos]   = useState({})
  const [loading, setLoading] = useState(true)
  const [modalNew, setModalNew]   = useState(false)
  const [modalEdit, setModalEdit] = useState(null) // prestation en cours d'édition
  const [gallery, setGallery] = useState({ open:false, photos:[], label:'', startIdx:0 })
  const [uploading, setUploading] = useState({})
  const uploadRefs = useRef({})

  // form nouveau
  const [fNom,setFNom]=useState('')
  const [fDesc,setFDesc]=useState('')
  const [fPrix,setFPrix]=useState('')
  const [fDuree,setFDuree]=useState('')
  const [fIcon,setFIcon]=useState('✂️')
  const [saving,setSaving]=useState(false)

  // form édition
  const [eNom,setENom]=useState('')
  const [eDesc,setEDesc]=useState('')
  const [ePrix,setEPrix]=useState('')
  const [eDuree,setEDuree]=useState('')
  const [eIcon,setEIcon]=useState('✂️')
  const [eSaving,setESaving]=useState(false)

  useEffect(()=>{ if(salon) load() },[salon])

  async function load() {
    setLoading(true)
    const {data:p} = await supabase.from('prestations').select('*').eq('salon_id',salon.id).order('ordre')
    setPresta(p||[])
    if(p?.length) {
      const {data:ph} = await supabase.from('presta_photos').select('*').in('prestation_id',p.map(x=>x.id)).order('ordre')
      const map={}
      ;(ph||[]).forEach(x=>{ if(!map[x.prestation_id]) map[x.prestation_id]=[]; map[x.prestation_id].push({id:x.id,url:x.url}) })
      setPhotos(map)
    }
    setLoading(false)
  }

  function openEdit(p) {
    setENom(p.nom); setEDesc(p.description||''); setEPrix(String(p.prix)); setEDuree(p.duree||''); setEIcon(p.icon||'✂️')
    setModalEdit(p)
  }

  async function saveEdit() {
    if(!eNom.trim()||!ePrix){showToast('Nom et prix requis','err');return}
    setESaving(true)
    await supabase.from('prestations').update({
      nom:eNom.trim(), description:eDesc.trim(),
      prix:parseInt(ePrix), duree:eDuree, icon:eIcon
    }).eq('id',modalEdit.id)
    setESaving(false); showToast('✓ Prestation modifiée','ok'); setModalEdit(null); load()
  }

  async function uploadPhoto(prestaId, e) {
    const file = e.target.files?.[0]
    if(!file) return
    if(file.size > 5*1024*1024){showToast('Photo trop lourde (max 5Mo)','err');return}
    setUploading(u=>({...u,[prestaId]:true}))
    const ext = file.name.split('.').pop()
    const path = `${salon.id}/${prestaId}/${Date.now()}.${ext}`
    const {error} = await supabase.storage.from('presta-photos').upload(path, file, {upsert:false})
    if(error){showToast('Erreur upload : '+error.message,'err');setUploading(u=>({...u,[prestaId]:false}));return}
    const {data:{publicUrl}} = supabase.storage.from('presta-photos').getPublicUrl(path)
    await supabase.from('presta_photos').insert({prestation_id:prestaId,url:publicUrl,ordre:(photos[prestaId]?.length||0)})
    setUploading(u=>({...u,[prestaId]:false})); showToast('✓ Photo ajoutée','ok'); load()
    // reset input
    if(uploadRefs.current[prestaId]) uploadRefs.current[prestaId].value = ''
  }

  async function deletePhoto(photoId) {
    await supabase.from('presta_photos').delete().eq('id',photoId)
    showToast('Photo supprimée','ok'); load()
  }

  async function creer() {
    if(!fNom.trim()||!fPrix){showToast('Nom et prix requis','err');return}
    setSaving(true)
    await supabase.from('prestations').insert({salon_id:salon.id,nom:fNom.trim(),description:fDesc.trim(),prix:parseInt(fPrix),duree:fDuree,icon:fIcon,actif:true,ordre:presta.length})
    setSaving(false); showToast(`✓ ${fNom} ajoutée`,'ok')
    setModalNew(false); setFNom(''); setFDesc(''); setFPrix(''); setFDuree(''); load()
  }

  async function toggleActif(p) {
    await supabase.from('prestations').update({actif:!p.actif}).eq('id',p.id)
    showToast(p.actif?'Désactivée':'Activée','ok'); load()
  }

  async function supprimer(p) {
    if(!window.confirm(`Supprimer "${p.nom}" ?`)) return
    await supabase.from('prestations').delete().eq('id',p.id)
    showToast('Prestation supprimée','ok'); load()
  }

  const getPhotos = (p) => photos[p.id]?.map(x=>x.url)||[]
  const getCover  = (p) => getPhotos(p)[0] || getCoverDefault(p.nom)

  if(loading) return <Spinner/>

  return (
    <div className="page">
      <div style={{margin:'14px 16px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:18,fontWeight:900}}>Catalogue</div>
          <div style={{fontSize:12,color:'var(--gris)',marginTop:2}}>{presta.length} prestation{presta.length>1?'s':''}</div>
        </div>
        <Btn variant="bx" sm onClick={()=>setModalNew(true)}>+ Ajouter</Btn>
      </div>

      {presta.length===0
        ? <Empty icon="✂️" title="Aucune prestation" sub="Ajoutez vos prestations pour que vos clientes puissent réserver." action="+ Ajouter" onAction={()=>setModalNew(true)}/>
        : presta.map(p=>(
          <div key={p.id} className="presta-card" style={{opacity:p.actif?1:.6}}>

            {/* HERO */}
            <div className="pc-hero" onClick={()=>getPhotos(p).length>0&&setGallery({open:true,photos:getPhotos(p),label:p.nom,startIdx:0})}>
              <img src={getCover(p)} alt={p.nom}/>
              <div className="pc-overlay"/>
              <div className="pc-bottom">
                <span style={{fontSize:17,fontWeight:900,color:'#fff'}}>{p.icon} {p.nom}</span>
                <span style={{fontSize:15,fontWeight:900,color:'var(--or-l)'}}>{formatPrix(p.prix)}</span>
              </div>
              {getPhotos(p).length>0&&<button className="pc-btn-photos">📸 {getPhotos(p).length}</button>}
            </div>

            {/* PHOTOS STRIP */}
            <div style={{padding:'10px 0 4px'}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--gris)',padding:'0 16px',marginBottom:6}}>📸 Photos du salon</div>
              <div className="photo-strip">
                {(photos[p.id]||[]).map((ph,i)=>(
                  <div key={ph.id} style={{position:'relative',flexShrink:0}}>
                    <img src={ph.url} alt=""
                      onClick={()=>setGallery({open:true,photos:getPhotos(p),label:p.nom,startIdx:i})}
                      style={{width:110,height:80,objectFit:'cover',borderRadius:10,cursor:'pointer'}}/>
                    <button onClick={()=>deletePhoto(ph.id)}
                      style={{position:'absolute',top:4,right:4,background:'rgba(0,0,0,.65)',border:'none',color:'#fff',borderRadius:'50%',width:20,height:20,fontSize:10,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      ✕
                    </button>
                  </div>
                ))}
                {/* ADD PHOTO */}
                <div onClick={()=>uploadRefs.current[p.id]?.click()}
                  style={{width:110,height:80,borderRadius:10,border:'2px dashed #e2e8f0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0,background:'#fafafa',gap:4}}>
                  {uploading[p.id]
                    ? <div className="spin" style={{width:20,height:20,borderWidth:2,borderTopColor:'var(--bx)',borderColor:'var(--gl)'}}/>
                    : <><span style={{fontSize:20}}>📷</span><span style={{fontSize:10,fontWeight:700,color:'var(--gris)'}}>Ajouter</span></>
                  }
                </div>
                <input ref={el=>uploadRefs.current[p.id]=el} type="file" accept="image/*" style={{display:'none'}} onChange={e=>uploadPhoto(p.id,e)}/>
              </div>
            </div>

            {/* BODY */}
            <div className="pc-body">
              {p.description&&<div style={{fontSize:13,color:'var(--gris)',lineHeight:1.55,marginBottom:8}}>{p.description}</div>}
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
                {p.duree&&<span className="tag tag-bx">⏱️ {p.duree}</span>}
                <span className="tag tag-or">{formatPrix(p.prix)}</span>
                <span className={`tag ${p.actif?'tag-vt':''}`} style={!p.actif?{background:'var(--rougep)',color:'var(--rouge)'}:{}}>{p.actif?'✓ Active':'✗ Inactive'}</span>
              </div>
              <div style={{display:'flex',gap:8}}>
                <Btn variant="bx" sm onClick={()=>openEdit(p)} style={{flex:1}}>✏️ Modifier</Btn>
                <Btn variant="ghost" sm onClick={()=>toggleActif(p)} style={{flex:1}}>{p.actif?'Désactiver':'Réactiver'}</Btn>
                <button onClick={()=>supprimer(p)}
                  style={{background:'var(--rougep)',color:'var(--rouge)',border:'none',borderRadius:10,padding:'7px 12px',fontSize:12,fontWeight:700,cursor:'pointer'}}>
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))
      }

      {/* MODAL NOUVELLE PRESTATION */}
      <Modal open={modalNew} onClose={()=>setModalNew(false)} title="Nouvelle prestation" sub="Visible sur votre vitrine">
        <div className="fg">
          <label className="lbl">Icône</label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:4}}>
            {ICONS.map(ic=><button key={ic} onClick={()=>setFIcon(ic)} style={{width:40,height:40,borderRadius:10,border:`2px solid ${fIcon===ic?'var(--bx)':'#e2e8f0'}`,background:fIcon===ic?'var(--bx-p)':'#fff',fontSize:20,cursor:'pointer'}}>{ic}</button>)}
          </div>
        </div>
        <Input label="Nom *" value={fNom} onChange={setFNom} placeholder="Ex : Tresse box braids"/>
        <Textarea label="Description" value={fDesc} onChange={setFDesc} placeholder="Décrivez la prestation..."/>
        <Input label="Prix (FCFA) *" value={fPrix} onChange={setFPrix} type="number" placeholder="Ex : 5000"/>
        <Input label="Durée" value={fDuree} onChange={setFDuree} placeholder="Ex : ~2h"/>
        <Btn variant="bx" full disabled={saving} onClick={creer} style={{marginBottom:8}}>{saving?'Ajout…':'Ajouter la prestation'}</Btn>
        <Btn variant="ghost" full onClick={()=>setModalNew(false)}>Annuler</Btn>
      </Modal>

      {/* MODAL MODIFIER PRESTATION */}
      <Modal open={!!modalEdit} onClose={()=>setModalEdit(null)} title={`Modifier · ${modalEdit?.nom}`} sub="Mettez à jour cette prestation">
        <div className="fg">
          <label className="lbl">Icône</label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:4}}>
            {ICONS.map(ic=><button key={ic} onClick={()=>setEIcon(ic)} style={{width:40,height:40,borderRadius:10,border:`2px solid ${eIcon===ic?'var(--bx)':'#e2e8f0'}`,background:eIcon===ic?'var(--bx-p)':'#fff',fontSize:20,cursor:'pointer'}}>{ic}</button>)}
          </div>
        </div>
        <Input label="Nom *" value={eNom} onChange={setENom} placeholder="Ex : Tresse box braids"/>
        <Textarea label="Description" value={eDesc} onChange={setEDesc} placeholder="Décrivez la prestation..."/>
        <Input label="Prix (FCFA) *" value={ePrix} onChange={setEPrix} type="number" placeholder="Ex : 5000"/>
        <Input label="Durée" value={eDuree} onChange={setEDuree} placeholder="Ex : ~2h"/>
        <Btn variant="bx" full disabled={eSaving} onClick={saveEdit} style={{marginBottom:8}}>{eSaving?'Enregistrement…':'✓ Enregistrer les modifications'}</Btn>
        <Btn variant="ghost" full onClick={()=>setModalEdit(null)}>Annuler</Btn>
      </Modal>

      <Gallery open={gallery.open} photos={gallery.photos} startIdx={gallery.startIdx} label={gallery.label} onClose={()=>setGallery(g=>({...g,open:false}))}/>
      <div className={`toast${toast.show?' show':''} ${toast.type}`}>{toast.msg}</div>
    </div>
  )
}
