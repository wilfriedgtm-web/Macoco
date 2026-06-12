import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase, formatPrix, PHOTOS_DEFAUT, waLink } from '../../lib/supabase'
import { Modal, Gallery } from '../../components/UI'

const HEURES_DISPO = ['09h00','10h00','11h00','14h00','15h30','17h00']
const AVIS_DEFAUT = [
  { nom:'Patience Ekambi', emoji:'👩🏿', bg:'#F9F0F2', presta:'Tresse box braids', date:'Il y a 3 jours', texte:'"Grâce est vraiment talentueuse ! Réservé via WhatsApp, réponse en 2 minutes. Venue à l\'heure, zéro attente. Résultat magnifique 🙌"' },
  { nom:'Diane Moukoko', emoji:'👩🏽', bg:'#FDF6E7', presta:'Coupe + Brushing', date:'Il y a 1 semaine', texte:'"Avant j\'attendais 1h30. Maintenant elles me préviennent quand c\'est mon tour. Je viens pile à l\'heure 😍"' },
  { nom:'Solange Bello', emoji:'👩🏾', bg:'#f0fdf4', presta:'Manucure', date:'Il y a 2 semaines', texte:'"Sandrine fait les meilleurs ongles de Douala Akwa ! J\'ai réservé depuis chez moi. Je recommande à toutes ✨"' },
]

function getCover(nom) {
  const k = (nom||'').toLowerCase()
  if (k.includes('braid')||k.includes('tresse')) return PHOTOS_DEFAUT.braids
  if (k.includes('coupe')||k.includes('brush')) return PHOTOS_DEFAUT.coupe
  if (k.includes('manu')||k.includes('ongle')) return PHOTOS_DEFAUT.manu
  if (k.includes('defris')||k.includes('liss')) return PHOTOS_DEFAUT.defrisage
  if (k.includes('cil')) return PHOTOS_DEFAUT.cils
  return PHOTOS_DEFAUT.default
}

export default function Vitrine() {
  const { slug } = useParams()
  const [salon, setSalon]     = useState(null)
  const [presta, setPresta]   = useState([])
  const [avis, setAvis]       = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedP, setSelectedP] = useState(null)
  const [selectedH, setSelectedH] = useState('15h30')
  const [gallery, setGallery] = useState({ open:false, photos:[], label:'' })
  const [modalResa, setModalResa] = useState(false)
  const [nom, setNom] = useState('')
  const [tel, setTel] = useState('')
  const [msg, setMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => { load() }, [slug])

  async function load() {
    const { data: s } = await supabase.from('salons').select('*').eq('slug', slug).eq('vitrine_active', true).single()
    if (!s) { setNotFound(true); setLoading(false); return }
    setSalon(s)
    const [{ data: p }, { data: av }] = await Promise.all([
      supabase.from('prestations').select('*, presta_photos(url, ordre)').eq('salon_id', s.id).eq('actif', true).order('ordre'),
      supabase.from('avis').select('*').eq('salon_id', s.id).eq('visible', true).order('created_at', { ascending: false }).limit(6),
    ])
    setPresta(p || [])
    if (p?.length) setSelectedP(p[0])
    setAvis(av || [])
    setLoading(false)
  }

  async function reserver() {
    if (!nom.trim() || !tel.trim()) return
    setSending(true)
    await supabase.from('rendez_vous').insert({
      salon_id: salon.id,
      prestation_id: selectedP?.id || null,
      client_nom: nom.trim(),
      client_tel: tel.trim(),
      date: new Date().toISOString().split('T')[0],
      heure: selectedH,
      message: msg.trim(),
      statut: 'en_attente',
      montant: selectedP?.prix || 0,
      source: 'booking_public',
    })
    setSending(false); setSent(true)
  }

  function waReserve() {
    const p = selectedP?.nom || 'une prestation'
    const m = `Bonjour, je voudrais réserver ${p} (${formatPrix(selectedP?.prix || 0)}) pour aujourd'hui à ${selectedH}. Merci !`
    window.open(waLink(salon.tel, m), '_blank')
  }

  if (loading) return <div style={{minHeight:'100dvh',background:'var(--bx)',display:'flex',alignItems:'center',justifyContent:'center'}}><div className="spin"/></div>
  if (notFound) return <div style={{minHeight:'100dvh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,textAlign:'center'}}><div style={{fontSize:48}}>✂️</div><div style={{fontSize:20,fontWeight:800,margin:'12px 0 8px'}}>Salon introuvable</div><div style={{fontSize:14,color:'var(--gris)'}}>Ce salon n'existe pas ou n'est plus actif.</div></div>

  const photos = (p) => { const ph = p.presta_photos?.map(x=>x.url).filter(Boolean); return ph?.length ? ph : [getCover(p.nom)] }

  return (
    <div style={{maxWidth:430,margin:'0 auto',background:'var(--gl)',minHeight:'100dvh',paddingBottom:24}}>
      {/* HERO */}
      <div style={{position:'relative',height:240,overflow:'hidden'}}>
        <img src={salon.cover_url || PHOTOS_DEFAUT.salon} alt={salon.nom} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.1) 0%,rgba(107,26,42,.88) 100%)'}}/>
        <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'18px 20px'}}>
          <div style={{fontSize:28,fontWeight:900,color:'#fff'}}>{salon.nom} ✂️</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.8)',marginTop:3}}>📍 {salon.adresse || salon.ville}</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:6}}>
            <span style={{color:'var(--or-l)',fontSize:13,letterSpacing:2}}>★★★★★</span>
            <span style={{fontSize:12,color:'rgba(255,255,255,.8)',fontWeight:700}}>4.9</span>
            <span style={{fontSize:12,color:'rgba(255,255,255,.6)'}}>· {avis.length > 0 ? avis.length : '127'} avis</span>
          </div>
        </div>
        <div style={{position:'absolute',top:14,right:14,background:'var(--vm)',color:'#fff',fontSize:11,fontWeight:800,padding:'5px 12px',borderRadius:20}}>🟢 Ouvert</div>
      </div>

      {/* INFOS RAPIDES */}
      <div style={{display:'flex',background:'#fff',borderBottom:'1px solid #f1f5f9'}}>
        <div style={{flex:1,padding:12,textAlign:'center',borderRight:'1px solid #f1f5f9'}}><div style={{fontSize:18,fontWeight:900,color:'var(--bx)'}}>{presta.length}</div><div style={{fontSize:11,color:'var(--gris)',fontWeight:600}}>Prestations</div></div>
        <div style={{flex:1,padding:12,textAlign:'center',borderRight:'1px solid #f1f5f9'}}><div style={{fontSize:13,fontWeight:900,color:'var(--bx)'}}>⏱️</div><div style={{fontSize:11,color:'var(--gris)',fontWeight:600}}>{salon.heures || '8h–19h'}</div></div>
        <div style={{flex:1,padding:12,textAlign:'center'}}><div style={{fontSize:13,fontWeight:900,color:'var(--bx)'}}>💬</div><div style={{fontSize:11,color:'var(--gris)',fontWeight:600}}>WhatsApp</div></div>
      </div>

      <div style={{padding:16}}>
        {/* DISPO */}
        <div style={{background:'var(--vp)',border:'1.5px solid #bbf7d0',borderRadius:14,padding:'12px 14px',display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
          <span style={{fontSize:22}}>📅</span>
          <div><div style={{fontSize:13,fontWeight:800,color:'var(--vert)'}}>Prochain créneau disponible</div><div style={{fontSize:12,color:'var(--vert)',marginTop:1}}>Aujourd'hui à <strong>15h30</strong></div></div>
        </div>

        {/* PRESTATIONS */}
        <div className="stitle" style={{margin:'0 0 12px'}}>Nos prestations</div>
        {presta.map(p => (
          <div key={p.id} className={`vp-card${selectedP?.id === p.id ? ' sel' : ''}`} onClick={() => setSelectedP(p)}>
            <div className="vp-hero">
              <img src={photos(p)[0]} alt={p.nom}/>
              <div className="vp-overlay"/>
              <div className="vp-bottom">
                <span className="vp-name">{p.icon || '✂️'} {p.nom}</span>
                <span className="vp-prix">{formatPrix(p.prix)}</span>
              </div>
              <div className="vp-check" style={{ background: selectedP?.id === p.id ? 'var(--bx)' : 'rgba(255,255,255,.25)', color: selectedP?.id === p.id ? '#fff' : 'transparent', border: selectedP?.id === p.id ? 'none' : '2px solid rgba(255,255,255,.5)' }}>
                {selectedP?.id === p.id ? '✓' : ''}
              </div>
            </div>
            {/* PHOTOS STRIP */}
            {photos(p).length > 1 && (
              <div className="photo-strip" style={{paddingTop:10}}>
                {photos(p).map((src,i) => <img key={i} src={src} alt="" onClick={e=>{e.stopPropagation();setGallery({open:true,photos:photos(p),label:p.nom,startIdx:i})}}/>)}
              </div>
            )}
            <div className="vp-body">
              {p.description && <div className="vp-desc">{p.description}</div>}
              <div className="vp-tags">
                {p.duree && <span className="tag tag-bx">⏱️ {p.duree}</span>}
                <span className="tag tag-or">{formatPrix(p.prix)}</span>
              </div>
              <button className="btn btn-md btn-bx btn-full" style={{marginTop:10}} onClick={e=>{e.stopPropagation();setSelectedP(p);setModalResa(true)}}>
                Réserver {p.nom}
              </button>
            </div>
          </div>
        ))}

        {/* CRENEAUX */}
        <div className="stitle" style={{margin:'20px 0 12px'}}>Choisir un créneau</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:20}}>
          {HEURES_DISPO.map(h => (
            <button key={h} onClick={() => setSelectedH(h)}
              className={`btn btn-sm${selectedH === h ? ' btn-bx' : ' btn-ghost'}`}
              style={{padding:'10px 4px',border:selectedH===h?'none':'1.5px solid #e2e8f0'}}>
              {h}{selectedH === h ? ' ✓' : ''}
            </button>
          ))}
        </div>

        <button className="btn btn-md btn-bx btn-full" style={{marginBottom:10}} onClick={() => setModalResa(true)}>📅 Réserver maintenant</button>
        <button className="btn btn-md btn-wa btn-full" onClick={waReserve}>💬 Réserver via WhatsApp</button>

        {/* AVIS */}
        <div className="stitle" style={{margin:'28px 0 14px'}}>Avis clientes ★★★★★</div>
        {(avis.length > 0 ? avis.map(a => ({
          nom: a.client_nom, texte: `"${a.texte}"`, date: new Date(a.created_at).toLocaleDateString('fr-FR'), emoji: '👩🏿', bg: 'var(--bx-p)', presta: ''
        })) : AVIS_DEFAUT).map((a, i) => (
          <div key={i} className="avis-card">
            <div className="avis-head">
              <div className="avis-av" style={{background:a.bg}}>{a.emoji}</div>
              <div><div style={{fontSize:14,fontWeight:800}}>{a.nom}</div><div style={{fontSize:11,color:'var(--gris)'}}>{a.date}{a.presta ? ' · '+a.presta : ''}</div></div>
              <div className="avis-stars">★★★★★</div>
            </div>
            <div className="avis-txt">{a.texte}</div>
          </div>
        ))}

        <div style={{textAlign:'center',fontSize:11,color:'var(--gris)',paddingTop:8}}>
          Propulsé par <strong style={{color:'var(--bx)'}}>Ma'coco</strong>
        </div>
      </div>

      {/* MODAL RÉSERVATION */}
      <Modal open={modalResa} onClose={() => { if (!sent) setModalResa(false) }} title={sent ? '✅ Demande envoyée !' : `Réserver · ${selectedP?.nom || ''}`} sub={sent ? '' : `${selectedH} · ${formatPrix(selectedP?.prix || 0)}`}>
        {sent ? (
          <div style={{textAlign:'center',padding:'20px 0'}}>
            <div style={{fontSize:48,marginBottom:12}}>✅</div>
            <div style={{fontSize:16,fontWeight:800,marginBottom:8}}>Demande envoyée à {salon.nom} !</div>
            <div style={{fontSize:13,color:'var(--gris)',lineHeight:1.6,marginBottom:20}}>Le salon va confirmer votre rendez-vous par WhatsApp très bientôt.</div>
            <button className="btn btn-wa btn-md btn-full" onClick={() => window.open(waLink(salon.tel, `Bonjour, j'ai fait une demande de RDV pour ${selectedP?.nom} à ${selectedH}. Pouvez-vous confirmer ?`), '_blank')}>
              💬 Confirmer sur WhatsApp
            </button>
          </div>
        ) : (
          <>
            <div className="fg">
              <label className="lbl">Votre nom *</label>
              <input className="inp" value={nom} onChange={e=>setNom(e.target.value)} placeholder="Ex : Aminata Fouda"/>
            </div>
            <div className="fg">
              <label className="lbl">WhatsApp *</label>
              <input className="inp" type="tel" value={tel} onChange={e=>setTel(e.target.value)} placeholder="+237 6XX XXX XXX"/>
            </div>
            <div className="fg">
              <label className="lbl">Message (optionnel)</label>
              <textarea className="inp" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Des précisions sur votre demande..."/>
            </div>
            <button className="btn btn-bx btn-md btn-full" disabled={sending || !nom.trim() || !tel.trim()} onClick={reserver} style={{marginBottom:8}}>
              {sending ? 'Envoi…' : '📅 Envoyer ma demande'}
            </button>
            <button className="btn btn-wa btn-md btn-full" onClick={waReserve}>💬 Réserver via WhatsApp</button>
          </>
        )}
      </Modal>

      <Gallery open={gallery.open} photos={gallery.photos} startIdx={gallery.startIdx||0} label={gallery.label} onClose={()=>setGallery(g=>({...g,open:false}))}/>
    </div>
  )
}
