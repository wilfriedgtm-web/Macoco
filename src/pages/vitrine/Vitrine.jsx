import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, formatPrix, PHOTOS_DEFAUT, waLink } from '../../lib/supabase'

const HEURES = ['08h00','08h30','09h00','09h30','10h00','10h30','11h00','11h30','12h00','13h00','14h00','14h30','15h00','15h30','16h00','16h30','17h00','17h30','18h00']

const AVIS_DEFAUT = [
  { nom:'Patience Ekambi', emoji:'👩🏿', bg:'#F9F0F2', presta:'Tresse box braids', date:'Il y a 3 jours', texte:'"Grâce est vraiment talentueuse ! Zéro attente, résultat magnifique 🙌"' },
  { nom:'Diane Moukoko', emoji:'👩🏽', bg:'#FDF6E7', presta:'Coupe + Brushing', date:'Il y a 1 semaine', texte:'"Elles me préviennent quand c\'est mon tour. Je viens pile à l\'heure 😍"' },
  { nom:'Solange Bello', emoji:'👩🏾', bg:'#f0fdf4', presta:'Manucure', date:'Il y a 2 semaines', texte:'"Les meilleurs ongles de Douala Akwa ! J\'ai réservé depuis chez moi ✨"' },
]

function getCoverDefault(nom) {
  const k = (nom||'').toLowerCase()
  if(k.includes('braid')||k.includes('tresse')) return PHOTOS_DEFAUT.braids
  if(k.includes('coupe')||k.includes('brush')) return PHOTOS_DEFAUT.coupe
  if(k.includes('manu')||k.includes('ongle')) return PHOTOS_DEFAUT.manu
  if(k.includes('defris')||k.includes('liss')) return PHOTOS_DEFAUT.defrisage
  if(k.includes('cil')) return PHOTOS_DEFAUT.cils
  return PHOTOS_DEFAUT.default
}

function getNextDays(n = 30) {
  const days = []
  const today = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const iso = d.toISOString().split('T')[0]
    days.push({
      iso,
      short: d.toLocaleDateString('fr-FR',{weekday:'short'}),
      day: d.getDate(),
      isToday: i === 0,
      monthYear: d.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}),
    })
  }
  return days
}

function groupByMonth(days) {
  const g = {}
  days.forEach(d => { if(!g[d.monthYear]) g[d.monthYear]=[]; g[d.monthYear].push(d) })
  return g
}

// MODAL RÉSERVATION TOUT EN UN
function ModalReservation({ open, onClose, salon, presta, prestas, onSuccess }) {
  const [step, setStep] = useState(1) // 1=prestation+date+heure 2=coordonnées
  const [selectedP, setSelectedP] = useState(presta)
  const [selectedDate, setSelectedDate] = useState(getNextDays(1)[0].iso)
  const [selectedH, setSelectedH] = useState('10h00')
  const [nom, setNom] = useState('')
  const [tel, setTel] = useState('')
  const [msg, setMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [dates] = useState(() => getNextDays(30))

  useEffect(() => { if (presta) setSelectedP(presta) }, [presta])
  useEffect(() => { if (open) setStep(1) }, [open])

  async function reserver() {
    if (!nom.trim() || !tel.trim()) return
    setSending(true)
    await supabase.from('rendez_vous').insert({
      salon_id: salon.id,
      prestation_id: selectedP?.id || null,
      client_nom: nom.trim(),
      client_tel: tel.trim(),
      date: selectedDate,
      heure: selectedH,
      message: msg.trim(),
      statut: 'en_attente',
      montant: selectedP?.prix || 0,
      source: 'booking_public',
    })
    setSending(false)
    onSuccess({ nom, heure: selectedH, date: selectedDate, prestaName: selectedP?.nom })
  }

  if (!open) return null

  const dateLabel = selectedDate === new Date().toISOString().split('T')[0]
    ? "Aujourd'hui"
    : new Date(selectedDate + 'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:200,display:'flex',alignItems:'flex-end',backdropFilter:'blur(4px)' }}
      onClick={e => { if(e.target===e.currentTarget) onClose() }}>
      <div style={{ background:'#fff',borderRadius:'24px 24px 0 0',width:'100%',maxHeight:'92dvh',overflow:'auto',padding:'0 0 40px' }}>

        {/* HANDLE + HEADER */}
        <div style={{ position:'sticky',top:0,background:'#fff',zIndex:10,padding:'16px 20px 12px',borderBottom:'1px solid #f1f5f9' }}>
          <div style={{ width:36,height:4,borderRadius:2,background:'#e2e8f0',margin:'0 auto 14px' }}/>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:17,fontWeight:800 }}>Réserver au {salon?.nom}</div>
              <div style={{ fontSize:12,color:'var(--gris)',marginTop:2 }}>
                {selectedP ? selectedP.nom : 'Choisissez une prestation'} · {dateLabel} · {selectedH}
              </div>
            </div>
            <button onClick={onClose} style={{ width:34,height:34,borderRadius:'50%',background:'var(--gl)',border:'none',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>✕</button>
          </div>
          {/* PROGRESS */}
          <div style={{ display:'flex',gap:4,marginTop:12 }}>
            <div style={{ flex:1,height:3,borderRadius:2,background:step>=1?'var(--bx)':'#e2e8f0',transition:'background .3s' }}/>
            <div style={{ flex:1,height:3,borderRadius:2,background:step>=2?'var(--bx)':'#e2e8f0',transition:'background .3s' }}/>
          </div>
        </div>

        <div style={{ padding:'16px 20px' }}>
          {step === 1 && (
            <>
              {/* PRESTATION */}
              <div style={{ fontSize:11,fontWeight:700,color:'var(--gris)',textTransform:'uppercase',letterSpacing:.5,marginBottom:10 }}>Prestation</div>
              <div style={{ display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none',paddingBottom:8,marginBottom:16 }}>
                {prestas.map(p => (
                  <button key={p.id} onClick={() => setSelectedP(p)}
                    style={{ flexShrink:0,padding:'10px 14px',borderRadius:14,border:'none',background:selectedP?.id===p.id?'var(--bx)':'var(--gl)',color:selectedP?.id===p.id?'#fff':'var(--noir)',cursor:'pointer',fontFamily:'inherit',transition:'all .15s',textAlign:'left',minWidth:120 }}>
                    <div style={{ fontSize:13,fontWeight:700 }}>{p.icon||'✂️'} {p.nom}</div>
                    <div style={{ fontSize:11,opacity:.7,marginTop:2 }}>{formatPrix(p.prix)} · {p.duree||''}</div>
                  </button>
                ))}
              </div>

              {/* DATE */}
              <div style={{ fontSize:11,fontWeight:700,color:'var(--gris)',textTransform:'uppercase',letterSpacing:.5,marginBottom:10 }}>Date</div>
              {Object.entries(groupByMonth(dates)).map(([my, days]) => (
                <div key={my} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11,fontWeight:700,color:'var(--gris)',marginBottom:8 }}>{my}</div>
                  <div style={{ display:'flex',gap:7,overflowX:'auto',scrollbarWidth:'none',paddingBottom:4 }}>
                    {days.map(d => (
                      <button key={d.iso} onClick={() => setSelectedDate(d.iso)}
                        style={{ flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',padding:'9px 11px',borderRadius:13,border:'none',background:selectedDate===d.iso?'var(--bx)':'var(--gl)',cursor:'pointer',fontFamily:'inherit',minWidth:50,transition:'all .15s' }}>
                        <span style={{ fontSize:9,fontWeight:700,color:selectedDate===d.iso?'rgba(255,255,255,.7)':'var(--gris)',textTransform:'uppercase' }}>{d.short}</span>
                        <span style={{ fontSize:18,fontWeight:900,color:selectedDate===d.iso?'#fff':'var(--noir)',lineHeight:1.2 }}>{d.day}</span>
                        {d.isToday && <span style={{ fontSize:8,fontWeight:800,color:selectedDate===d.iso?'var(--or-l)':'var(--bx)',marginTop:1 }}>auj.</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* HEURE */}
              <div style={{ fontSize:11,fontWeight:700,color:'var(--gris)',textTransform:'uppercase',letterSpacing:.5,marginBottom:10 }}>Heure</div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:7,marginBottom:20 }}>
                {HEURES.map(h => (
                  <button key={h} onClick={() => setSelectedH(h)}
                    style={{ padding:'10px 4px',borderRadius:11,border:'none',background:selectedH===h?'var(--bx)':'var(--gl)',color:selectedH===h?'#fff':'var(--noir)',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit',transition:'all .15s' }}>
                    {h}
                  </button>
                ))}
              </div>

              <button onClick={() => setStep(2)}
                disabled={!selectedP || !selectedDate || !selectedH}
                style={{ width:'100%',padding:'14px',borderRadius:14,border:'none',background:'var(--bx)',color:'#fff',fontSize:15,fontWeight:800,cursor:'pointer',fontFamily:'inherit',opacity:(!selectedP||!selectedDate||!selectedH)?.5:1 }}>
                Continuer → {selectedP ? `${formatPrix(selectedP.prix)}` : ''}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {/* RÉCAP */}
              <div style={{ background:'var(--bx-p)',borderRadius:14,padding:'14px 16px',marginBottom:20,borderLeft:'3px solid var(--bx)' }}>
                <div style={{ fontSize:11,fontWeight:700,color:'var(--gris)',textTransform:'uppercase',marginBottom:6 }}>Récapitulatif</div>
                <div style={{ fontSize:14,fontWeight:700 }}>{selectedP?.icon} {selectedP?.nom}</div>
                <div style={{ fontSize:13,color:'var(--gris)',marginTop:2 }}>{dateLabel} à {selectedH} · {formatPrix(selectedP?.prix||0)}</div>
              </div>

              {/* COORDONNÉES */}
              <div style={{ fontSize:11,fontWeight:700,color:'var(--gris)',textTransform:'uppercase',letterSpacing:.5,marginBottom:10 }}>Vos coordonnées</div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11,fontWeight:700,color:'var(--gris)',textTransform:'uppercase',letterSpacing:.4,display:'block',marginBottom:6 }}>Votre prénom *</label>
                <input value={nom} onChange={e=>setNom(e.target.value)} placeholder="Ex : Aminata"
                  style={{ width:'100%',padding:'13px 14px',borderRadius:12,border:'1.5px solid #e2e8f0',fontFamily:'inherit',fontSize:15,outline:'none',boxSizing:'border-box' }}
                  autoFocus/>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11,fontWeight:700,color:'var(--gris)',textTransform:'uppercase',letterSpacing:.4,display:'block',marginBottom:6 }}>WhatsApp *</label>
                <input value={tel} onChange={e=>setTel(e.target.value)} type="tel" placeholder="+237 6XX XXX XXX"
                  style={{ width:'100%',padding:'13px 14px',borderRadius:12,border:'1.5px solid #e2e8f0',fontFamily:'inherit',fontSize:15,outline:'none',boxSizing:'border-box' }}/>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11,fontWeight:700,color:'var(--gris)',textTransform:'uppercase',letterSpacing:.4,display:'block',marginBottom:6 }}>Message (optionnel)</label>
                <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Précisions sur votre demande..."
                  style={{ width:'100%',padding:'13px 14px',borderRadius:12,border:'1.5px solid #e2e8f0',fontFamily:'inherit',fontSize:14,outline:'none',boxSizing:'border-box',resize:'none',height:80 }}/>
              </div>

              <button onClick={reserver} disabled={sending||!nom.trim()||!tel.trim()}
                style={{ width:'100%',padding:'14px',borderRadius:14,border:'none',background:'var(--bx)',color:'#fff',fontSize:15,fontWeight:800,cursor:'pointer',fontFamily:'inherit',marginBottom:10,opacity:(sending||!nom.trim()||!tel.trim())?.6:1 }}>
                {sending ? 'Envoi…' : '📅 Confirmer ma réservation'}
              </button>
              <button onClick={() => {
                const msg2 = `Bonjour, je voudrais réserver ${selectedP?.nom||'une prestation'} le ${dateLabel} à ${selectedH}. Merci !`
                window.open(waLink(salon.tel, msg2), '_blank')
              }}
                style={{ width:'100%',padding:'13px',borderRadius:14,border:'none',background:'#25D366',color:'#fff',fontSize:14,fontWeight:800,cursor:'pointer',fontFamily:'inherit',marginBottom:10 }}>
                💬 Réserver via WhatsApp
              </button>
              <button onClick={() => setStep(1)}
                style={{ width:'100%',padding:'11px',borderRadius:14,border:'none',background:'var(--gl)',color:'var(--gris)',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>
                ← Modifier
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// MODAL SUCCÈS
function ModalSucces({ open, onClose, salon, data }) {
  if (!open) return null
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:300,display:'flex',alignItems:'flex-end',backdropFilter:'blur(4px)' }}>
      <div style={{ background:'#fff',borderRadius:'24px 24px 0 0',width:'100%',padding:'28px 24px 48px',textAlign:'center' }}>
        <div style={{ fontSize:56,marginBottom:16 }}>🎉</div>
        <div style={{ fontSize:20,fontWeight:900,marginBottom:8 }}>Demande envoyée !</div>
        <div style={{ fontSize:14,color:'var(--gris)',lineHeight:1.6,marginBottom:6 }}>
          <strong>{data?.nom}</strong>, votre demande au <strong>{salon?.nom}</strong> a été reçue.
        </div>
        <div style={{ background:'var(--bx-p)',borderRadius:12,padding:'12px 16px',marginBottom:24,fontSize:13,color:'var(--bx)',fontWeight:600 }}>
          📅 {data?.prestaName} · {data?.heure}
        </div>
        <div style={{ fontSize:13,color:'var(--gris)',marginBottom:20,lineHeight:1.6 }}>
          Le salon va confirmer votre RDV par WhatsApp. Gardez votre téléphone à portée.
        </div>
        <button onClick={() => window.open(waLink(salon?.tel, `Bonjour, j'ai fait une demande de RDV pour ${data?.prestaName} à ${data?.heure}. Pouvez-vous confirmer ?`), '_blank')}
          style={{ width:'100%',padding:'14px',borderRadius:14,border:'none',background:'#25D366',color:'#fff',fontSize:14,fontWeight:800,cursor:'pointer',fontFamily:'inherit',marginBottom:10 }}>
          💬 Confirmer sur WhatsApp
        </button>
        <button onClick={onClose}
          style={{ width:'100%',padding:'12px',borderRadius:14,border:'none',background:'var(--gl)',color:'var(--gris)',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>
          Retour au salon
        </button>
      </div>
    </div>
  )
}

// GALERIE
function Gallery({ open, photos, startIdx, label, onClose }) {
  const [idx, setIdx] = useState(startIdx)
  useEffect(() => { if(open) setIdx(startIdx) }, [open, startIdx])
  if (!open||!photos.length) return null
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.96)',zIndex:300,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
      <button onClick={onClose} style={{ position:'absolute',top:16,right:16,background:'rgba(255,255,255,.15)',border:'none',color:'#fff',fontSize:18,width:40,height:40,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
      <img src={photos[idx]} alt="" style={{ maxWidth:'100%',maxHeight:'72dvh',objectFit:'contain',borderRadius:10 }}/>
      <div style={{ display:'flex',gap:8,marginTop:16,overflow:'auto',padding:'0 16px',scrollbarWidth:'none' }}>
        {photos.map((src,i)=><img key={i} src={src} alt="" onClick={()=>setIdx(i)} style={{ width:54,height:54,objectFit:'cover',borderRadius:8,cursor:'pointer',opacity:i===idx?1:.45,border:`2px solid ${i===idx?'#fff':'transparent'}`,transition:'all .15s',flexShrink:0 }}/>)}
      </div>
      <div style={{ color:'rgba(255,255,255,.4)',fontSize:12,marginTop:12 }}>{label} · {idx+1}/{photos.length}</div>
    </div>
  )
}

export default function Vitrine() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [salon, setSalon]   = useState(null)
  const [presta, setPresta] = useState([])
  const [avis, setAvis]     = useState([])
  const [photos, setPhotos] = useState({})
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [modalResa, setModalResa] = useState(false)
  const [modalSucces, setModalSucces] = useState(false)
  const [resaData, setResaData] = useState(null)
  const [selectedPrestaForModal, setSelectedPrestaForModal] = useState(null)
  const [gallery, setGallery] = useState({ open:false, photos:[], label:'', startIdx:0 })

  useEffect(() => { load() }, [slug])

  async function load() {
    const { data: s } = await supabase.from('salons').select('*').eq('slug', slug).eq('vitrine_active', true).single()
    if (!s) { setNotFound(true); setLoading(false); return }
    setSalon(s)
    const [{ data: p }, { data: av }, { data: ph }] = await Promise.all([
      supabase.from('prestations').select('*').eq('salon_id', s.id).eq('actif', true).order('ordre'),
      supabase.from('avis').select('*').eq('salon_id', s.id).eq('visible', true).order('created_at', { ascending:false }).limit(6),
      supabase.from('presta_photos').select('*').eq('prestation_id', 'any').limit(50),
    ])
    setPresta(p||[])
    setAvis(av||[])

    // Load photos per prestation
    if (p?.length) {
      const { data: phAll } = await supabase.from('presta_photos').select('*').in('prestation_id', p.map(x=>x.id)).order('ordre')
      const map = {}
      ;(phAll||[]).forEach(x=>{ if(!map[x.prestation_id]) map[x.prestation_id]=[]; map[x.prestation_id].push(x.url) })
      setPhotos(map)
    }
    setLoading(false)
  }

  function openResa(p) {
    setSelectedPrestaForModal(p)
    setModalResa(true)
  }

  function onSuccess(data) {
    setResaData(data)
    setModalResa(false)
    setModalSucces(true)
  }

  const getPhotos = (p) => photos[p.id]?.length ? photos[p.id] : [getCoverDefault(p.nom)]

  if (loading) return <div style={{ minHeight:'100dvh',background:'var(--bx)',display:'flex',alignItems:'center',justifyContent:'center' }}><div className="spin"/></div>
  if (notFound) return (
    <div style={{ minHeight:'100dvh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,textAlign:'center' }}>
      <div style={{ fontSize:48 }}>✂️</div>
      <div style={{ fontSize:20,fontWeight:800,margin:'12px 0 8px' }}>Salon introuvable</div>
      <div style={{ fontSize:14,color:'var(--gris)',marginBottom:20 }}>Ce salon n'existe pas ou n'est plus actif.</div>
      <button onClick={()=>navigate('/')} style={{ background:'var(--bx)',color:'#fff',border:'none',borderRadius:12,padding:'12px 24px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>← Retour à l'accueil</button>
    </div>
  )

  return (
    <div style={{ minHeight:'100dvh',background:'var(--gl)',maxWidth:430,margin:'0 auto',fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* BOUTON RETOUR */}
      <div style={{ position:'fixed',top:16,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,padding:'0 16px',zIndex:50,pointerEvents:'none' }}>
        <button onClick={()=>navigate(-1)}
          style={{ pointerEvents:'all',background:'rgba(0,0,0,.45)',backdropFilter:'blur(8px)',border:'none',color:'#fff',borderRadius:20,padding:'8px 16px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:6 }}>
          ← Retour
        </button>
      </div>

      {/* HERO */}
      <div style={{ position:'relative',height:260,overflow:'hidden' }}>
        <img src={(salon.cover_url||PHOTOS_DEFAUT.salon)+'?t='+salon.updated_at} alt={salon.nom} style={{ width:'100%',height:'100%',objectFit:'cover',display:'block' }}/>
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.1) 0%,rgba(107,26,42,.88) 100%)' }}/>
        <div style={{ position:'absolute',bottom:0,left:0,right:0,padding:'18px 20px' }}>
          <div style={{ fontSize:26,fontWeight:900,color:'#fff' }}>{salon.nom} ✂️</div>
          <div style={{ fontSize:13,color:'rgba(255,255,255,.8)',marginTop:3 }}>📍 {salon.adresse||salon.ville}</div>
          <div style={{ display:'flex',alignItems:'center',gap:8,marginTop:6 }}>
            <span style={{ color:'#E8B84B',fontSize:13,letterSpacing:2 }}>★★★★★</span>
            <span style={{ fontSize:12,color:'rgba(255,255,255,.8)',fontWeight:700 }}>4.9</span>
            <span style={{ fontSize:12,color:'rgba(255,255,255,.6)' }}>· {avis.length>0?avis.length:127} avis</span>
          </div>
        </div>
        <div style={{ position:'absolute',top:56,right:14,background:'var(--vm)',color:'#fff',fontSize:11,fontWeight:800,padding:'5px 12px',borderRadius:20 }}>🟢 Ouvert</div>
      </div>

      {/* INFOS */}
      <div style={{ display:'flex',background:'#fff',borderBottom:'1px solid #f1f5f9' }}>
        <div style={{ flex:1,padding:12,textAlign:'center',borderRight:'1px solid #f1f5f9' }}><div style={{ fontSize:18,fontWeight:900,color:'var(--bx)' }}>{presta.length}</div><div style={{ fontSize:11,color:'var(--gris)',fontWeight:600 }}>Prestations</div></div>
        <div style={{ flex:1,padding:12,textAlign:'center',borderRight:'1px solid #f1f5f9' }}><div style={{ fontSize:13,fontWeight:900,color:'var(--bx)' }}>⏱️</div><div style={{ fontSize:11,color:'var(--gris)',fontWeight:600 }}>{salon.heures||'8h–19h'}</div></div>
        <div style={{ flex:1,padding:12,textAlign:'center' }}><div style={{ fontSize:13,fontWeight:900,color:'var(--bx)' }}>💬</div><div style={{ fontSize:11,color:'var(--gris)',fontWeight:600 }}>WhatsApp</div></div>
      </div>

      {/* CTA STICKY */}
      <div style={{ position:'sticky',top:0,zIndex:40,background:'#fff',padding:'10px 16px',borderBottom:'1px solid #f1f5f9',display:'flex',gap:8 }}>
        <button onClick={()=>{ setSelectedPrestaForModal(presta[0]||null); setModalResa(true) }}
          style={{ flex:1,padding:'12px',borderRadius:12,border:'none',background:'var(--bx)',color:'#fff',fontSize:14,fontWeight:800,cursor:'pointer',fontFamily:'inherit' }}>
          📅 Réserver maintenant
        </button>
        <button onClick={()=>window.open(waLink(salon.tel,`Bonjour, je voudrais prendre un RDV au ${salon.nom}.`),'_blank')}
          style={{ padding:'12px 14px',borderRadius:12,border:'none',background:'#25D366',color:'#fff',fontSize:18,cursor:'pointer' }}>
          💬
        </button>
      </div>

      <div style={{ padding:'16px 16px 80px' }}>
        {/* PRESTATIONS */}
        {presta.length>0 && (
          <>
            <div style={{ fontSize:12,fontWeight:700,color:'var(--gris)',textTransform:'uppercase',letterSpacing:.6,margin:'8px 0 12px' }}>Nos prestations</div>
            {presta.map(p => (
              <div key={p.id} style={{ background:'#fff',borderRadius:16,marginBottom:12,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,.08)' }}>
                <div style={{ position:'relative',height:150,overflow:'hidden',cursor:'pointer' }} onClick={()=>setGallery({open:true,photos:getPhotos(p),label:p.nom,startIdx:0})}>
                  <img src={getPhotos(p)[0]} alt={p.nom} style={{ width:'100%',height:'100%',objectFit:'cover',display:'block' }}/>
                  <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 35%,rgba(0,0,0,.55))' }}/>
                  <div style={{ position:'absolute',bottom:10,left:14,right:14,display:'flex',alignItems:'flex-end',justifyContent:'space-between' }}>
                    <span style={{ fontSize:16,fontWeight:900,color:'#fff' }}>{p.icon||'✂️'} {p.nom}</span>
                    <span style={{ fontSize:15,fontWeight:900,color:'#E8B84B' }}>{formatPrix(p.prix)}</span>
                  </div>
                  {getPhotos(p).length>1 && <button style={{ position:'absolute',top:10,right:10,background:'rgba(0,0,0,.4)',border:'none',color:'#fff',fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:20,cursor:'pointer' }}>📸 {getPhotos(p).length}</button>}
                </div>

                {/* PHOTO STRIP */}
                {getPhotos(p).length>1 && (
                  <div style={{ display:'flex',gap:7,overflowX:'auto',padding:'10px 14px 4px',scrollbarWidth:'none' }}>
                    {getPhotos(p).map((src,i)=>(
                      <img key={i} src={src} alt="" onClick={()=>setGallery({open:true,photos:getPhotos(p),label:p.nom,startIdx:i})} style={{ width:80,height:60,objectFit:'cover',borderRadius:8,cursor:'pointer',flexShrink:0 }}/>
                    ))}
                  </div>
                )}

                <div style={{ padding:'10px 14px 14px' }}>
                  {p.description && <div style={{ fontSize:13,color:'var(--gris)',lineHeight:1.5,marginBottom:8 }}>{p.description}</div>}
                  <div style={{ display:'flex',gap:6,flexWrap:'wrap',marginBottom:10 }}>
                    {p.duree&&<span style={{ fontSize:11,background:'var(--bx-p)',color:'var(--bx)',padding:'3px 10px',borderRadius:20,fontWeight:700 }}>⏱️ {p.duree}</span>}
                    <span style={{ fontSize:11,background:'var(--or-p)',color:'var(--or)',padding:'3px 10px',borderRadius:20,fontWeight:700 }}>{formatPrix(p.prix)}</span>
                  </div>
                  <button onClick={()=>openResa(p)}
                    style={{ width:'100%',padding:'11px',borderRadius:12,border:'none',background:'var(--bx)',color:'#fff',fontSize:14,fontWeight:800,cursor:'pointer',fontFamily:'inherit' }}>
                    Réserver {p.nom}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* AVIS */}
        <div style={{ fontSize:12,fontWeight:700,color:'var(--gris)',textTransform:'uppercase',letterSpacing:.6,margin:'20px 0 12px' }}>Avis clientes ★★★★★</div>
        {(avis.length>0 ? avis.map(a=>({nom:a.client_nom,texte:`"${a.texte}"`,date:new Date(a.created_at).toLocaleDateString('fr-FR'),emoji:'👩🏿',bg:'var(--bx-p)'})) : AVIS_DEFAUT).map((a,i)=>(
          <div key={i} style={{ background:'#fff',borderRadius:16,padding:16,marginBottom:10,boxShadow:'0 1px 3px rgba(0,0,0,.06)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8 }}>
              <div style={{ width:38,height:38,borderRadius:'50%',background:a.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>{a.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14,fontWeight:800 }}>{a.nom}</div>
                <div style={{ fontSize:11,color:'var(--gris)' }}>{a.date}{a.presta?' · '+a.presta:''}</div>
              </div>
              <div style={{ color:'#E8B84B',fontSize:13 }}>★★★★★</div>
            </div>
            <div style={{ fontSize:13,color:'var(--gris)',lineHeight:1.6 }}>{a.texte}</div>
          </div>
        ))}

        <div style={{ textAlign:'center',fontSize:11,color:'var(--gris)',paddingTop:8 }}>
          Propulsé par <strong style={{color:'var(--bx)'}}>Ma'coco</strong>
        </div>
      </div>

      {/* MODALS */}
      <ModalReservation
        open={modalResa}
        onClose={() => setModalResa(false)}
        salon={salon}
        presta={selectedPrestaForModal}
        prestas={presta}
        onSuccess={onSuccess}
      />
      <ModalSucces
        open={modalSucces}
        onClose={() => setModalSucces(false)}
        salon={salon}
        data={resaData}
      />
      <Gallery
        open={gallery.open}
        photos={gallery.photos}
        startIdx={gallery.startIdx}
        label={gallery.label}
        onClose={() => setGallery(g=>({...g,open:false}))}
      />
    </div>
  )
}
