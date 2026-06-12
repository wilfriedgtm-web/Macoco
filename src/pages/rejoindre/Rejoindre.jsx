import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const FEATURES = [
  { icon:'📅', titre:'Zéro RDV perdu', desc:"Vos clientes réservent depuis votre vitrine Ma'coco, même quand vous dormez." },
  { icon:'⏱️', titre:'Fini l\'attente', desc:"Prévenez vos clientes par WhatsApp quand c'est leur tour. Elles attendent chez elles." },
  { icon:'💬', titre:'WhatsApp intégré', desc:"Confirmez chaque RDV en un clic. Le message part automatiquement." },
  { icon:'🌐', titre:'Vitrine en ligne', desc:"Une page publique avec vos photos et prix. Partagez le lien sur Instagram." },
  { icon:'📊', titre:'Planning clair', desc:"Voyez tous vos RDV du jour en un coup d'œil. Plus de cahier, plus de confusion." },
  { icon:'💰', titre:'Gratuit pour commencer', desc:"Créez votre salon en 5 minutes. Aucune carte bancaire requise." },
]

const PROBLEMES = [
  'Messages WhatsApp non répondus',
  'Clientes qui attendent 2h et repartent',
  'Agenda papier ou dans la tête',
  'Double booking et confusion',
  'Pas de vitrine pour attirer de nouvelles clientes',
]

function useReveal() {
  const ref = useRef()
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: 0.1 })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return [ref, v]
}

function Reveal({ children, style, delay = 0 }) {
  const [ref, v] = useReveal()
  return (
    <div ref={ref} style={{ opacity:v?1:0, transform:v?'translateY(0)':'translateY(28px)', transition:`opacity .6s ease ${delay}s, transform .6s ease ${delay}s`, ...style }}>
      {children}
    </div>
  )
}

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [ref, v] = useReveal()
  useEffect(() => {
    if (!v) return
    let c = 0
    const step = Math.max(1, Math.ceil(target / 50))
    const t = setInterval(() => {
      c += step
      if (c >= target) { setCount(target); clearInterval(t) }
      else setCount(c)
    }, 25)
    return () => clearInterval(t)
  }, [v, target])
  return <span ref={ref}>{count.toLocaleString('fr')}{suffix}</span>
}

export default function Rejoindre() {
  const [scrolled, setScrolled] = useState(false)
  const [faqOpen, setFaqOpen] = useState(null)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const FAQS = [
    { q: "C'est vraiment gratuit ?", r: "Oui, le plan Starter est gratuit. Vous créez votre salon, ajoutez vos prestations et recevez des RDV sans payer. Le plan Pro sera disponible bientôt pour les salons qui veulent plus de fonctionnalités." },
    { q: "Mes clientes ont besoin de créer un compte ?", r: "Non. Vos clientes réservent directement depuis votre vitrine sans créer de compte. Elles renseignent juste leur nom et leur numéro WhatsApp." },
    { q: "Comment mes clientes me trouvent ?", r: "Vous partagez le lien de votre vitrine sur WhatsApp, Instagram, et en story. Ma'coco vous donne aussi un QR code à afficher dans votre salon." },
    { q: "Et si je n'ai pas internet tout le temps ?", r: "L'app fonctionne avec une connexion 3G standard. Les demandes de RDV arrivent sur votre téléphone même avec une connexion limitée." },
  ]

  return (
    <div style={{ minHeight:'100dvh',background:'#fff',maxWidth:430,margin:'0 auto',fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @keyframes pulse2{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.2);opacity:.7}}
        @keyframes gradMove{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
      `}</style>

      {/* HEADER */}
      <div style={{ position:'fixed',top:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,zIndex:100,background:scrolled?'rgba(26,10,14,.95)':'transparent',backdropFilter:scrolled?'blur(16px)':'none',padding:'14px 20px',transition:'all .3s',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <Link to="/" style={{ fontSize:22,fontWeight:900,color:'#fff',letterSpacing:-1,textDecoration:'none' }}>Ma'<span style={{color:'#E8B84B'}}>coco</span></Link>
        <Link to="/app" style={{ background:'#E8B84B',color:'#1A0A0E',fontSize:13,fontWeight:800,textDecoration:'none',padding:'7px 14px',borderRadius:20 }}>Créer mon salon</Link>
      </div>

      {/* HERO */}
      <div style={{ minHeight:'90dvh',position:'relative',overflow:'hidden',background:'linear-gradient(160deg,#1A0A0E 0%,#6B1A2A 60%,#3D0A14 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'100px 24px 60px',textAlign:'center' }}>
        <div style={{ position:'absolute',top:'5%',right:'-20%',width:300,height:300,borderRadius:'50%',background:'rgba(201,150,42,.06)',animation:'pulse2 5s ease-in-out infinite' }}/>
        <div style={{ position:'absolute',bottom:'8%',left:'-15%',width:250,height:250,borderRadius:'50%',background:'rgba(201,150,42,.05)',animation:'pulse2 5s ease-in-out infinite .6s' }}/>

        <Reveal>
          <div style={{ background:'rgba(232,184,75,.12)',border:'1px solid rgba(232,184,75,.25)',borderRadius:20,padding:'6px 16px',fontSize:12,fontWeight:700,color:'#E8B84B',marginBottom:24,display:'inline-block' }}>
            ✂️ Pour les gérants de salon
          </div>
          <div style={{ fontSize:32,fontWeight:900,color:'#fff',lineHeight:1.25,marginBottom:12 }}>
            Votre salon mérite<br/>plus de clientes.
          </div>
          <div style={{ fontSize:15,color:'rgba(255,255,255,.65)',lineHeight:1.7,marginBottom:32,maxWidth:300 }}>
            Fini les RDV perdus sur WhatsApp. Ma'coco automatise vos réservations et réduit l'attente dans votre salon.
          </div>
          <Link to="/app" style={{ background:'#E8B84B',color:'#1A0A0E',padding:'15px 32px',borderRadius:14,fontSize:15,fontWeight:800,textDecoration:'none',boxShadow:'0 4px 24px rgba(232,184,75,.4)',display:'inline-block',marginBottom:12 }}>
            Créer mon salon gratuitement →
          </Link>
          <div style={{ fontSize:12,color:'rgba(255,255,255,.4)' }}>5 minutes · Aucune carte bancaire</div>
        </Reveal>

        {/* COMPTEURS */}
        <div style={{ display:'flex',gap:28,marginTop:44 }}>
          {[{t:12,s:'+',l:'Salons inscrits'},{t:3400,s:'+',l:'RDV générés'},{t:100,s:'%',l:'Gratuit'}].map((s,i)=>(
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontSize:24,fontWeight:900,color:'#E8B84B' }}><Counter target={s.t} suffix={s.s}/></div>
              <div style={{ fontSize:11,color:'rgba(255,255,255,.4)',marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLÈME */}
      <div style={{ padding:'40px 24px',background:'var(--gl)' }}>
        <Reveal>
          <div style={{ fontSize:11,fontWeight:700,color:'var(--rouge)',textTransform:'uppercase',letterSpacing:.6,marginBottom:8 }}>Le problème</div>
          <div style={{ fontSize:22,fontWeight:900,lineHeight:1.3,marginBottom:20 }}>Combien de clientes avez-vous perdu cette semaine ?</div>
        </Reveal>
        {PROBLEMES.map((p,i) => (
          <Reveal key={i} delay={i*0.1}>
            <div style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#fff',borderRadius:12,marginBottom:8,boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
              <span style={{ fontSize:18 }}>❌</span>
              <span style={{ fontSize:14,color:'var(--noir)',fontWeight:500 }}>{p}</span>
            </div>
          </Reveal>
        ))}
      </div>

      {/* SOLUTION */}
      <div style={{ padding:'40px 24px',background:'#fff' }}>
        <Reveal style={{ marginBottom:24 }}>
          <div style={{ fontSize:11,fontWeight:700,color:'var(--bx)',textTransform:'uppercase',letterSpacing:.6,marginBottom:8 }}>La solution</div>
          <div style={{ fontSize:22,fontWeight:900,lineHeight:1.3 }}>Tout ce dont votre salon a besoin.</div>
        </Reveal>
        {FEATURES.map((f,i) => (
          <Reveal key={i} delay={i*0.1} style={{ display:'flex',gap:14,marginBottom:20 }}>
            <div style={{ width:48,height:48,borderRadius:14,background:'var(--bx-p)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0 }}>{f.icon}</div>
            <div>
              <div style={{ fontSize:15,fontWeight:800,marginBottom:3 }}>{f.titre}</div>
              <div style={{ fontSize:13,color:'var(--gris)',lineHeight:1.55 }}>{f.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* TÉMOIGNAGE GÉRANT */}
      <Reveal style={{ margin:'0 16px 32px' }}>
        <div style={{ background:'linear-gradient(135deg,var(--bx),#3D0A14)',borderRadius:20,padding:24 }}>
          <div style={{ fontSize:32,marginBottom:12 }}>👩🏿</div>
          <div style={{ fontSize:14,color:'rgba(255,255,255,.9)',lineHeight:1.7,fontStyle:'italic',marginBottom:16 }}>
            "Avant je perdais 3 à 4 clientes par semaine à cause des messages WhatsApp non répondus. Avec Ma'coco, toutes mes clientes réservent en ligne. Mon chiffre d'affaires a augmenté dès le premier mois."
          </div>
          <div style={{ fontSize:14,fontWeight:800,color:'#fff' }}>Grâce Mballa</div>
          <div style={{ fontSize:12,color:'rgba(255,255,255,.5)',marginTop:2 }}>Salon Grâce · Douala Akwa</div>
        </div>
      </Reveal>

      {/* PRICING */}
      <div style={{ padding:'0 24px 32px' }}>
        <Reveal style={{ textAlign:'center',marginBottom:20 }}>
          <div style={{ fontSize:22,fontWeight:900,marginBottom:6 }}>Simple et transparent</div>
          <div style={{ fontSize:14,color:'var(--gris)' }}>Commencez gratuitement.</div>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ background:'var(--bx-p)',borderRadius:16,padding:20,marginBottom:12,border:'2px solid var(--bx)' }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12 }}>
              <div style={{ fontSize:18,fontWeight:900 }}>Starter</div>
              <div style={{ fontSize:24,fontWeight:900,color:'var(--bx)' }}>Gratuit</div>
            </div>
            {['Vitrine publique','Jusqu\'à 30 RDV/mois','2 coiffeuses','File d\'attente WhatsApp','Support communautaire'].map((f,i)=>(
              <div key={i} style={{ fontSize:13,color:'var(--gris)',padding:'5px 0',display:'flex',gap:8 }}><span style={{color:'var(--vert)'}}>✓</span>{f}</div>
            ))}
            <Link to="/app" style={{ display:'block',marginTop:14,background:'var(--bx)',color:'#fff',padding:'12px',borderRadius:12,fontSize:14,fontWeight:700,textDecoration:'none',textAlign:'center' }}>
              Commencer gratuitement →
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ background:'var(--bx)',borderRadius:16,padding:20,position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',top:12,right:12,background:'#E8B84B',color:'#1A0A0E',fontSize:10,fontWeight:800,padding:'3px 8px',borderRadius:10 }}>Bientôt</div>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4 }}>
              <div style={{ fontSize:18,fontWeight:900,color:'#fff' }}>Pro</div>
              <div><span style={{ fontSize:22,fontWeight:900,color:'#E8B84B' }}>15 000 F</span><span style={{ fontSize:12,color:'rgba(255,255,255,.5)' }}>/mois</span></div>
            </div>
            <div style={{ fontSize:11,color:'rgba(255,255,255,.5)',marginBottom:12 }}>≈ 23€/mois</div>
            {['RDV illimités','Coiffeuses illimitées','Statistiques avancées','Rappels automatiques','Support prioritaire'].map((f,i)=>(
              <div key={i} style={{ fontSize:13,color:'rgba(255,255,255,.75)',padding:'5px 0',display:'flex',gap:8 }}><span style={{color:'#E8B84B'}}>✓</span>{f}</div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* FAQ */}
      <div style={{ padding:'0 24px 32px' }}>
        <Reveal style={{ marginBottom:16 }}>
          <div style={{ fontSize:22,fontWeight:900 }}>Questions fréquentes</div>
        </Reveal>
        {FAQS.map((f,i) => (
          <Reveal key={i} delay={i*0.08}>
            <div style={{ background:'var(--gl)',borderRadius:14,marginBottom:8,overflow:'hidden' }}>
              <button onClick={()=>setFaqOpen(faqOpen===i?null:i)}
                style={{ width:'100%',padding:'14px 16px',background:'none',border:'none',textAlign:'left',fontFamily:'inherit',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12 }}>
                <span style={{ fontSize:14,fontWeight:700,color:'var(--noir)' }}>{f.q}</span>
                <span style={{ fontSize:18,color:'var(--bx)',flexShrink:0,transition:'transform .2s',transform:faqOpen===i?'rotate(45deg)':'rotate(0)' }}>+</span>
              </button>
              {faqOpen === i && (
                <div style={{ padding:'0 16px 14px',fontSize:13,color:'var(--gris)',lineHeight:1.6 }}>{f.r}</div>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {/* CTA FINAL */}
      <Reveal style={{ padding:'0 24px 48px',textAlign:'center' }}>
        <div style={{ fontSize:24,fontWeight:900,marginBottom:8,lineHeight:1.3 }}>Prêt à développer<br/>votre salon ?</div>
        <div style={{ fontSize:14,color:'var(--gris)',lineHeight:1.6,marginBottom:24 }}>Rejoignez les premiers salons sur Ma'coco.</div>
        <Link to="/app" style={{ display:'block',background:'var(--bx)',color:'#fff',padding:'16px 24px',borderRadius:14,fontSize:16,fontWeight:800,textDecoration:'none',marginBottom:12,boxShadow:'0 4px 20px rgba(107,26,42,.3)' }}>
          Créer mon salon gratuitement →
        </Link>
        <Link to="/" style={{ fontSize:13,color:'var(--gris)',textDecoration:'none' }}>← Voir les salons</Link>
      </Reveal>

      {/* FOOTER */}
      <div style={{ background:'#1A0A0E',padding:'28px 24px',textAlign:'center' }}>
        <div style={{ fontSize:22,fontWeight:900,color:'#fff',letterSpacing:-1,marginBottom:6 }}>Ma'<span style={{color:'#E8B84B'}}>coco</span></div>
        <div style={{ fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:16 }}>Plus de clientes, moins d'attente.</div>
        <div style={{ display:'flex',gap:20,justifyContent:'center',marginBottom:16 }}>
          <Link to="/" style={{ fontSize:13,color:'rgba(255,255,255,.45)',textDecoration:'none' }}>Accueil</Link>
          <Link to="/app" style={{ fontSize:13,color:'rgba(255,255,255,.45)',textDecoration:'none' }}>Connexion</Link>
        </div>
        <div style={{ fontSize:11,color:'rgba(255,255,255,.2)' }}>© 2025 Ma'coco · Douala, Cameroun</div>
      </div>
    </div>
  )
}
