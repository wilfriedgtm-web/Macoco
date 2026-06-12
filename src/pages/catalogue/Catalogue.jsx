import { useState, useEffect } from 'react'
import { supabase, formatPrix, PHOTOS_DEFAUT } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Btn, Modal, Input, Textarea, Gallery, Spinner, Empty } from '../../components/UI'
import { useToast } from '../../hooks/useToast'

const ICONS = ['✂️','🪢','💅','🧴','👁️','💆','💇','🌸','✨','💋']

export default function Catalogue() {
  const { salon } = useAuth()
  const { toast, showToast } = useToast()
  const [presta, setPresta] = useState([])
  const [photos, setPhotos] = useState({})
  const [loading, setLoading] = useState(true)
  const [modalNew, setModalNew] = useState(false)
  const [gallery, setGallery] = useState({ open:false, photos:[], label:'', startIdx:0 })
  const [fNom,setFNom]=useState(''); const [fDesc,setFDesc]=useState(''); const [fPrix,setFPrix]=useState(''); const [fDuree,setFDuree]=useState(''); const [fIcon,setFIcon]=useState('✂️'); const [saving,setSaving]=useState(false)

  useEffect(()=>{ if(salon) load() },[salon])

  async function load() {
    setLoading(true)
    const {data:p} = await supabase.from('prestations').select('*').eq('salon_id',salon.id).order('ordre')
    setPresta(p||[])
    if(p?.length){
      const {data:ph} = await supabase.from('presta_photos').select('*').in('prestation_id',p.map(x=>x.id)).order('ordre')
      const map={}; (ph||[]).forEach(x=>{ if(!map[x.prestation_id]) map[x.prestation_id]=[]; map[x.prestation_id].push(x.url) })
      setPhotos(map)
    }
    setLoading(false)
  }

  async function creer() {
    if(!fNom.trim()||!fPrix){showToast('Nom et prix requis','err');return}
    setSaving(true)
    await supabase.from('prestations').insert({salon_id:salon.id,nom:fNom.trim(),description:fDesc.trim(),prix:parseInt(fPrix),duree:fDuree,icon:fIcon,actif:true,ordre:presta.length})
    setSaving(false); showToast(`✓ ${fNom} ajoutée`,'ok'); setModalNew(false); setFNom(''); setFDesc(''); setFPrix(''); setFDuree(''); load()
  }

  async function toggleActif(p) {
    await supabase.from('prestations').update({actif:!p.actif}).eq('id',p.id)
    showToast(p.actif?'Désactivée':'Activée','ok'); load()
  }

  const getCover = (p) => {
    if(photos[p.id]?.length) return photos[p.id][0]
    const k = p.nom.toLowerCase()
    if(k.includes('braid')||k.includes('tresse')) return PHOTOS_DEFAUT.braids
    if(k.includes('coupe')||k.includes('brush')) return PHOTOS_DEFAUT.coupe
    if(k.includes('manu')||k.includes('ongle')) return PHOTOS_DEFAUT.manu
    if(k.includes('defris')||k.includes('liss')) return PHOTOS_DEFAUT.defrisage
    if(k.includes('cil')) return PHOTOS_DEFAUT.cils
    return PHOTOS_DEFAUT.default
  }
  const getPhotos = (p) => photos[p.id]?.length ? photos[p.id] : [getCover(p)]

  if(loading) return <Spinner/>

  return (
    <div className="page">
      <div style={{margin:'14px 16px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div><div style={{fontSize:18,fontWeight:900}}>Catalogue</div><div style={{fontSize:12,color:'var(--gris)',marginTop:2}}>{presta.length} prestation{presta.length>1?'s':''}</div></div>
        <Btn variant="bx" sm onClick={()=>setModalNew(true)}>+ Ajouter</Btn>
      </div>

      {presta.length===0?<Empty icon="✂️" title="Aucune prestation" sub="Ajoutez vos prestations pour que vos clientes puissent réserver." action="+ Ajouter" onAction={()=>setModalNew(true)}/>:
        presta.map(p=>(
          <div key={p.id} className="presta-card" style={{opacity:p.actif?1:.55}}>
            <div className="pc-hero" onClick={()=>setGallery({open:true,photos:getPhotos(p),label:p.nom,startIdx:0})}>
              <img src={getCover(p)} alt={p.nom}/>
              <div className="pc-overlay"/>
              <div className="pc-bottom">
                <span style={{fontSize:17,fontWeight:900,color:'#fff'}}>{p.icon} {p.nom}</span>
                <span style={{fontSize:15,fontWeight:900,color:'var(--or-l)'}}>{formatPrix(p.prix)}</span>
              </div>
              <button className="pc-btn-photos" onClick={e=>{e.stopPropagation();setGallery({open:true,photos:getPhotos(p),label:p.nom,startIdx:0})}}>📸 {getPhotos(p).length}</button>
            </div>
            <div className="photo-strip">
              {getPhotos(p).map((src,i)=><img key={i} src={src} alt="" onClick={()=>setGallery({open:true,photos:getPhotos(p),label:p.nom,startIdx:i})}/>)}
            </div>
            <div className="pc-body">
              {p.description&&<div style={{fontSize:13,color:'var(--gris)',lineHeight:1.55,marginBottom:8}}>{p.description}</div>}
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
                {p.duree&&<span className="tag tag-bx">⏱️ {p.duree}</span>}
                <span className="tag tag-or">{formatPrix(p.prix)}</span>
                <span className={`tag ${p.actif?'tag-vt':''}`} style={!p.actif?{background:'var(--rougep)',color:'var(--rouge)'}:{}}>{p.actif?'✓ Active':'✗ Inactive'}</span>
              </div>
              <Btn variant="ghost" sm full onClick={()=>toggleActif(p)}>{p.actif?'Désactiver':'Réactiver'}</Btn>
            </div>
          </div>
        ))
      }

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

      <Gallery open={gallery.open} photos={gallery.photos} startIdx={gallery.startIdx} label={gallery.label} onClose={()=>setGallery(g=>({...g,open:false}))}/>
      <div className={`toast${toast.show?' show':''} ${toast.type}`}>{toast.msg}</div>
    </div>
  )
}
