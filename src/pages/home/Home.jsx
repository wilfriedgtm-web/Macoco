import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase, PHOTOS_DEFAUT } from '../../lib/supabase'

const MOTS = ['nianga ✨', 'douce 💆', 'belle 💅', 'fraîche 🌸', 'stylée 👑', 'rayonnante 🌟']

const CATEGORIES = [
  { icon: '🪢', label: 'Tresses', keys: ['tresse','braid','braids','nattes'] },
  { icon: '✂️', label: 'Coupe', keys: ['coupe','brush','coiffure','cheveux'] },
  { icon: '💅', label: 'Ongles', keys: ['manu','ongle','nail','onglerie'] },
  { icon: '🧴', label: 'Soin', keys: ['soin','defris','liss','traitement','kerat'] },
  { icon: '👁️', label: 'Cils', keys: ['cil','lash','extension'] },
  { icon: '🌸', label: 'Maquillage', keys: ['make','maquil','beauty'] },
]

const STEPS = [
  { icon: '🔍', titre: 'Cherche ton salon', desc: "Tape une prestation, un nom ou ta ville." },
  { icon: '📅', titre: 'Choisis ton créneau', desc: "Sélectionne ta date et ton heure en quelques secondes." },
  { icon: '💬', titre: 'Reçois ta confirmation', desc: "Le salon confirme par WhatsApp. Tu arrives à l'heure." },
]

const TEMOIGNAGES = [
  { nom: 'Patience E.', ville: 'Douala', emoji: '👩🏿', texte: '"J\'ai réservé mes box braids depuis mon téléphone. Confirmé en 2 minutes. Zéro attente !"' },
  { nom: 'Diane M.', ville: 'Yaoundé', emoji: '👩🏽', texte: '"Je reçois un WhatsApp quand c\'est mon tour. Je viens pile à l\'heure 😍"' },
  { nom: 'Christelle N.', ville: 'Douala', emoji: '👩🏾', texte: '"Simple, rapide, et les prix sont clairs. Je recommande à toutes mes amies !"' },
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
    <div ref={ref} style={{ opacity: v?1:0, transform: v?'translateY(0)':'translateY(28px)', transition:`opacity .6s ease ${delay}s,transform .6s ease ${delay}s`, ...style }}>
      {children}
    </div>
  )
}

export default function Home() {
  const [salons, setSalons] = useState([])
  const [allPrestas, setAllPrestas] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [villeFilter, setVilleFilter] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [motIdx, setMotIdx] = useState(0)
  const [motV, setMotV] = useState(true)
  const [temoIdx, setTemoIdx] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => { load() }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setMotV(false)
      setTimeout(() => { setMotIdx(i => (i + 1) % MOTS.length); setMotV(true) }, 380)
    }, 2600)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTemoIdx(i => (i + 1) % TEMOIGNAGES.length), 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  async function load() {
    const [{ data: s }, { data: p }] = await Promise.all([
      supabase.from('salons').select('id,nom,slug,ville,cover_url,heures,description').eq('vitrine_active', true).order('created_at', { ascending: false }).limit(20),
      supabase.from('prestations').select('salon_id,nom').eq('actif', true),
    ])
    setSalons(s || [])
    setAllPrestas(p || [])
    setLoading(false)
  }

  const villes = [...new Set(salons.map(s => s.ville).filter(Boolean))]

  // Salons qui ont une prestation correspondant à la catégorie
  const salonsByCat = (salonId) => {
    if (!catFilter) return true
    const cat = CATEGORIES.find(c => c.label === catFilter)
    if (!cat) return true
    return allPrestas.some(p => p.salon_id === salonId && cat.keys.some(k => p.nom.toLowerCase().includes(k)))
  }

  const filtered = salons.filter(s => {
    const q = search.toLowerCase().trim()
    const matchSearch = !q ||
      s.nom.toLowerCase().includes(q) ||
      s.ville?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      allPrestas.some(p => p.salon_id === s.id && p.nom.toLowerCase().includes(q))
    const matchVille = !villeFilter || s.ville === villeFilter
    const matchCat = salonsByCat(s.id)
    return matchSearch && matchVille && matchCat
  })

  const clearFilters = () => { setSearch(''); setVilleFilter(''); setCatFilter('') }
  const hasFilters = search || villeFilter || catFilter

  return (
    <div style={{ minHeight:'100dvh',background:'#fff',maxWidth:430,margin:'0 auto',fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @keyframes pulse2{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.2);opacity:.8}}
        @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(10px)}}
        .cat-btn:active{transform:scale(.94)}
        input::placeholder{color:#94a3b8}
      `}</style>

      {/* HEADER */}
      <div style={{ position:'fixed',top:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,zIndex:100,background:scrolled?'rgba(26,10,14,.96)':'transparent',backdropFilter:scrolled?'blur(16px)':'none',padding:'14px 20px',transition:'all .3s',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <div style={{ fontSize:22,fontWeight:900,color:'#fff',letterSpacing:-1 }}>Ma'<span style={{color:'#E8B84B'}}>coco</span></div>
        <div style={{ display:'flex',gap:8 }}>
          <Link to="/pro" style={{ color:'rgba(255,255,255,.8)',fontSize:13,fontWeight:600,textDecoration:'none',padding:'7px 12px' }}>Je suis pro</Link>
          <Link to="/app" style={{ background:'#E8B84B',color:'#1A0A0E',fontSize:13,fontWeight:800,textDecoration:'none',padding:'7px 14px',borderRadius:20 }}>Connexion</Link>
        </div>
      </div>

      {/* HERO */}
      <div style={{ minHeight:'100dvh',position:'relative',overflow:'hidden',background:'linear-gradient(160deg,#1A0A0E 0%,#6B1A2A 55%,#3D0A14 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'100px 24px 40px',textAlign:'center' }}>
        <div style={{ position:'absolute',top:'8%',right:'-25%',width:320,height:320,borderRadius:'50%',background:'rgba(201,150,42,.07)',animation:'pulse2 5s ease-in-out infinite' }}/>
        <div style={{ position:'absolute',bottom:'10%',left:'-20%',width:280,height:280,borderRadius:'50%',background:'rgba(201,150,42,.05)',animation:'pulse2 5s ease-in-out infinite .8s' }}/>

        <div style={{ background:'rgba(232,184,75,.12)',border:'1px solid rgba(232,184,75,.25)',borderRadius:20,padding:'6px 16px',fontSize:12,fontWeight:700,color:'#E8B84B',marginBottom:20 }}>
          ✂️ Douala · Yaoundé · Cameroun
        </div>

        <div style={{ fontSize:30,fontWeight:900,color:'#fff',lineHeight:1.25,marginBottom:6 }}>
          Ma'coco, réserve<br/>ton RDV pour être
        </div>
        <div style={{ fontSize:38,fontWeight:900,color:'#E8B84B',opacity:motV?1:0,transform:motV?'translateY(0) scale(1)':'translateY(-14px) scale(.93)',transition:'all .38s cubic-bezier(.4,0,.2,1)',minHeight:54,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16 }}>
          {MOTS[motIdx]}
        </div>
        <div style={{ fontSize:15,color:'rgba(255,255,255,.6)',lineHeight:1.7,marginBottom:28,maxWidth:300 }}>
          Votre beauté mérite mieux qu'une attente de 2h.
        </div>

        {/* BARRE DE RECHERCHE PRINCIPALE */}
        <div style={{ width:'100%',maxWidth:380 }}>
          <div style={{ position:'relative',marginBottom:10 }}>
            <span style={{ position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',fontSize:18 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Tresse, onglerie, coupe, salon..."
              style={{ width:'100%',padding:'16px 48px 16px 48px',borderRadius:16,border:'none',fontFamily:'inherit',fontSize:15,outline:'none',boxSizing:'border-box',boxShadow:'0 8px 32px rgba(0,0,0,.35)' }}
            />
            {search && (
              <button onClick={() => setSearch('')}
                style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'#e2e8f0',border:'none',borderRadius:'50%',width:24,height:24,cursor:'pointer',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center' }}>
                ✕
              </button>
            )}
          </div>

          {/* FILTRE VILLE */}
          <div style={{ display:'flex',gap:6,overflowX:'auto',scrollbarWidth:'none',paddingBottom:4,marginBottom:8 }}>
            <button onClick={() => setVilleFilter('')}
              style={{ flexShrink:0,padding:'7px 14px',borderRadius:20,border:'none',background:!villeFilter?'rgba(255,255,255,.25)':'rgba(255,255,255,.1)',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',transition:'all .2s' }}>
              📍 Toutes villes
            </button>
            {villes.map(v => (
              <button key={v} onClick={() => setVilleFilter(villeFilter === v ? '' : v)}
                style={{ flexShrink:0,padding:'7px 14px',borderRadius:20,border:'none',background:villeFilter===v?'#E8B84B':'rgba(255,255,255,.1)',color:villeFilter===v?'#1A0A0E':'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',transition:'all .2s' }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <a href="#salons" onClick={e => { e.preventDefault(); document.getElementById('salons')?.scrollIntoView({ behavior:'smooth' }) }}
          style={{ background:'#E8B84B',color:'#1A0A0E',padding:'14px 32px',borderRadius:14,fontSize:15,fontWeight:800,textDecoration:'none',boxShadow:'0 4px 24px rgba(232,184,75,.4)',marginTop:8 }}>
          Trouver mon salon →
        </a>

        <div style={{ display:'flex',gap:28,marginTop:40 }}>
          {[{v:salons.length||'12',s:'+',l:'Salons'},{v:'3 400',s:'+',l:'RDV réservés'},{v:'4.9',s:'',l:'⭐ Note'}].map((s,i)=>(
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontSize:22,fontWeight:900,color:'#E8B84B' }}>{s.v}{s.s}</div>
              <div style={{ fontSize:11,color:'rgba(255,255,255,.45)',marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ position:'absolute',bottom:24,left:'50%',animation:'bounce 2s infinite' }}>
          <div style={{ width:22,height:22,borderRight:'2px solid rgba(255,255,255,.35)',borderBottom:'2px solid rgba(255,255,255,.35)',transform:'rotate(45deg)' }}/>
        </div>
      </div>

      {/* SALONS */}
      <div id="salons" style={{ background:'var(--gl)',padding:'28px 16px 24px' }}>
        {/* FILTRES CATÉGORIE */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11,fontWeight:700,color:'var(--gris)',textTransform:'uppercase',letterSpacing:.5,marginBottom:10 }}>Type de prestation</div>
          <div style={{ display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none',paddingBottom:4 }}>
            <button onClick={() => setCatFilter('')}
              className="cat-btn"
              style={{ flexShrink:0,padding:'8px 14px',borderRadius:20,border:'none',background:!catFilter?'var(--bx)':'#fff',color:!catFilter?'#fff':'var(--gris)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 1px 3px rgba(0,0,0,.08)',transition:'all .2s' }}>
              Tous
            </button>
            {CATEGORIES.map((c,i) => (
              <button key={i} onClick={() => setCatFilter(catFilter === c.label ? '' : c.label)}
                className="cat-btn"
                style={{ flexShrink:0,padding:'8px 14px',borderRadius:20,border:'none',background:catFilter===c.label?'var(--bx)':'#fff',color:catFilter===c.label?'#fff':'var(--gris)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 1px 3px rgba(0,0,0,.08)',transition:'all .2s',display:'flex',alignItems:'center',gap:5 }}>
                <span>{c.icon}</span><span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RÉSULTATS */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12 }}>
          <div style={{ fontSize:13,fontWeight:700,color:'var(--gris)' }}>
            {filtered.length} salon{filtered.length > 1 ? 's' : ''}
            {hasFilters && <span style={{ color:'var(--bx)' }}> · filtrés</span>}
          </div>
          {hasFilters && (
            <button onClick={clearFilters} style={{ background:'none',border:'none',color:'var(--bx)',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>
              Effacer ✕
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display:'flex',justifyContent:'center',padding:32 }}>
            <div className="spin" style={{ borderTopColor:'var(--bx)',borderColor:'var(--gl)' }}/>
          </div>
        ) : filtered.length === 0 ? (
          <Reveal style={{ textAlign:'center',padding:'32px 16px',color:'var(--gris)' }}>
            <div style={{ fontSize:40,marginBottom:12 }}>✂️</div>
            <div style={{ fontSize:15,fontWeight:700,marginBottom:6,color:'var(--noir)' }}>Aucun salon trouvé</div>
            <div style={{ fontSize:13,marginBottom:16 }}>Essayez une autre recherche</div>
            {hasFilters && <button onClick={clearFilters} style={{ background:'var(--bx)',color:'#fff',border:'none',borderRadius:12,padding:'10px 20px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>Réinitialiser les filtres</button>}
          </Reveal>
        ) : (
          filtered.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06}>
              <Link to={`/book/${s.slug}`} style={{ textDecoration:'none',display:'block',marginBottom:14 }}>
                <div style={{ background:'#fff',borderRadius:18,overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,.08)',transition:'transform .15s' }}
                  onTouchStart={e=>e.currentTarget.style.transform='scale(.98)'}
                  onTouchEnd={e=>e.currentTarget.style.transform='scale(1)'}>
                  <div style={{ position:'relative',height:170 }}>
                    <img src={(s.cover_url||PHOTOS_DEFAUT.salon)+'?t='+s.id} alt={s.nom} style={{ width:'100%',height:'100%',objectFit:'cover',display:'block' }}/>
                    <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 35%,rgba(0,0,0,.6))' }}/>
                    <div style={{ position:'absolute',bottom:12,left:14,right:14,display:'flex',alignItems:'flex-end',justifyContent:'space-between' }}>
                      <div>
                        <div style={{ fontSize:18,fontWeight:900,color:'#fff' }}>{s.nom}</div>
                        <div style={{ fontSize:12,color:'rgba(255,255,255,.8)',marginTop:2 }}>📍 {s.ville}</div>
                      </div>
                      <div style={{ background:'var(--vm)',color:'#fff',fontSize:10,fontWeight:800,padding:'4px 10px',borderRadius:20 }}>🟢 Ouvert</div>
                    </div>
                  </div>
                  <div style={{ padding:'12px 14px 14px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                      <span style={{ color:'#E8B84B',fontSize:12 }}>★★★★★</span>
                      <span style={{ fontSize:13,fontWeight:700 }}>4.9</span>
                      <span style={{ fontSize:12,color:'var(--gris)' }}>· {s.heures||'8h–19h'}</span>
                    </div>
                    <div style={{ background:'var(--bx)',color:'#fff',fontSize:12,fontWeight:700,padding:'7px 16px',borderRadius:10 }}>Réserver →</div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))
        )}
      </div>

      {/* COMMENT ÇA MARCHE */}
      <div style={{ padding:'40px 24px',background:'#fff' }}>
        <Reveal style={{ textAlign:'center',marginBottom:28 }}>
          <div style={{ fontSize:11,fontWeight:700,color:'var(--bx)',textTransform:'uppercase',letterSpacing:.6,marginBottom:6 }}>Simple</div>
          <div style={{ fontSize:22,fontWeight:900 }}>Comment ça marche ?</div>
        </Reveal>
        {STEPS.map((s,i) => (
          <Reveal key={i} delay={i*0.12} style={{ display:'flex',gap:16,marginBottom:24 }}>
            <div style={{ width:52,height:52,borderRadius:16,background:'var(--bx-p)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:4 }}>
                <span style={{ width:20,height:20,borderRadius:'50%',background:'var(--bx)',color:'#fff',fontSize:11,fontWeight:900,display:'inline-flex',alignItems:'center',justifyContent:'center' }}>{i+1}</span>
                <span style={{ fontSize:16,fontWeight:800 }}>{s.titre}</span>
              </div>
              <div style={{ fontSize:13,color:'var(--gris)',lineHeight:1.6 }}>{s.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* TÉMOIGNAGES */}
      <div style={{ padding:'40px 24px',background:'linear-gradient(135deg,#1A0A0E,#6B1A2A)' }}>
        <Reveal style={{ textAlign:'center',marginBottom:24 }}>
          <div style={{ fontSize:22,fontWeight:900,color:'#fff' }}>Elles nous font confiance</div>
        </Reveal>
        <div style={{ position:'relative',minHeight:190 }}>
          {TEMOIGNAGES.map((t,i) => (
            <div key={i} style={{ position:i===0?'relative':'absolute',top:0,left:0,right:0,opacity:temoIdx===i?1:0,transform:temoIdx===i?'translateX(0)':'translateX(24px)',transition:'all .5s ease',pointerEvents:temoIdx===i?'all':'none' }}>
              <div style={{ background:'rgba(255,255,255,.08)',borderRadius:20,padding:20 }}>
                <div style={{ fontSize:32,marginBottom:10 }}>{t.emoji}</div>
                <div style={{ fontSize:14,color:'rgba(255,255,255,.9)',lineHeight:1.7,fontStyle:'italic',marginBottom:14 }}>{t.texte}</div>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontSize:14,fontWeight:800,color:'#fff' }}>{t.nom}</div>
                    <div style={{ fontSize:12,color:'rgba(255,255,255,.45)' }}>{t.ville}</div>
                  </div>
                  <div style={{ color:'#E8B84B',fontSize:14 }}>★★★★★</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex',justifyContent:'center',gap:6,marginTop:20 }}>
          {TEMOIGNAGES.map((_,i) => (
            <button key={i} onClick={()=>setTemoIdx(i)} style={{ width:temoIdx===i?20:6,height:6,borderRadius:3,background:temoIdx===i?'#E8B84B':'rgba(255,255,255,.25)',border:'none',cursor:'pointer',transition:'all .3s',padding:0 }}/>
          ))}
        </div>
      </div>

      {/* CTA PRO */}
      <Reveal style={{ padding:'40px 24px',textAlign:'center',background:'#fff' }}>
        <div style={{ fontSize:13,fontWeight:700,color:'var(--bx)',textTransform:'uppercase',letterSpacing:.5,marginBottom:8 }}>Vous êtes professionnel ?</div>
        <div style={{ fontSize:22,fontWeight:900,marginBottom:8,lineHeight:1.3 }}>Développez votre activité avec Ma'coco</div>
        <div style={{ fontSize:14,color:'var(--gris)',lineHeight:1.6,marginBottom:24 }}>Rejoignez les pros qui ne perdent plus de clientes.</div>
        <Link to="/pro" style={{ display:'block',background:'var(--bx)',color:'#fff',padding:'15px 24px',borderRadius:14,fontSize:15,fontWeight:800,textDecoration:'none',marginBottom:10 }}>
          Je suis professionnel →
        </Link>
      </Reveal>

      {/* FOOTER */}
      <div style={{ background:'#1A0A0E',padding:'28px 24px',textAlign:'center' }}>
        <div style={{ fontSize:22,fontWeight:900,color:'#fff',letterSpacing:-1,marginBottom:6 }}>Ma'<span style={{color:'#E8B84B'}}>coco</span></div>
        <div style={{ fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:16 }}>Plus de clientes, moins d'attente.</div>
        <div style={{ display:'flex',gap:20,justifyContent:'center',marginBottom:16 }}>
          <Link to="/pro" style={{ fontSize:13,color:'rgba(255,255,255,.45)',textDecoration:'none' }}>Professionnels</Link>
          <Link to="/app" style={{ fontSize:13,color:'rgba(255,255,255,.45)',textDecoration:'none' }}>Connexion</Link>
        </div>
        <div style={{ fontSize:11,color:'rgba(255,255,255,.2)' }}>© 2025 Ma'coco · Douala, Cameroun</div>
      </div>
    </div>
  )
}
