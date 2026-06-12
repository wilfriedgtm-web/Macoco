import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const METIERS = [
  { icon: '✂️', label: 'Coiffeur·se' },
  { icon: '💅', label: 'Ongleriste' },
  { icon: '👁️', label: 'Poseur·se de cils' },
  { icon: '💆', label: 'Esthéticien·ne' },
  { icon: '💇', label: 'Barbier' },
  { icon: '🌸', label: 'Maquilleur·se' },
]

const FEATURES = [
  { icon: '🌐', titre: 'Votre vitrine en ligne', desc: 'Une page publique avec vos photos, prestations et prix. Partagez en un lien.' },
  { icon: '📅', titre: 'Agenda intelligent', desc: 'Vos clientes réservent en ligne. Vous voyez tout dans un seul planning clair.' },
  { icon: '💬', titre: 'Confirmations WhatsApp', desc: 'Chaque RDV confirmé en un clic. Le message part automatiquement à la cliente.' },
  { icon: '⏱️', titre: 'File d\'attente digitale', desc: 'Prévenez vos clientes quand c\'est leur tour. Plus personne n\'attend sur une chaise.' },
  { icon: '📸', titre: 'Galerie photos', desc: 'Ajoutez vos plus belles réalisations. Vos clientes réservent en voyant votre travail.' },
  { icon: '📊', titre: 'Suivi des revenus', desc: 'Voyez vos recettes du jour en temps réel. Sachez exactement ce que vous gagnez.' },
]

const TEMOIGNAGES = [
  { nom: 'Grâce M.', metier: 'Coiffeuse · Douala', emoji: '👩🏿', texte: '"Avant je perdais 4 clientes par semaine. Maintenant tout est organisé et je ne rate plus aucun RDV."' },
  { nom: 'Sandra K.', metier: 'Ongleriste · Yaoundé', emoji: '👩🏽', texte: '"Mes clientes adorent réserver en ligne. Elles voient mes photos et elles viennent déjà convaincues."' },
  { nom: 'Patrick N.', metier: 'Barbier · Douala', emoji: '👨🏿', texte: '"Le planning est tellement clair. Je sais exactement qui vient à quelle heure. Fini le chaos."' },
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
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(28px)', transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`, ...style }}>
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

export default function Pro() {
  const [scrolled, setScrolled] = useState(false)
  const [temoIdx, setTemoIdx] = useState(0)
  const [metierSel, setMetierSel] = useState(null)
  const [faqOpen, setFaqOpen] = useState(null)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTemoIdx(i => (i + 1) % TEMOIGNAGES.length), 4000)
    return () => clearInterval(t)
  }, [])

  const FAQS = [
    { q: "Je travaille seul·e, c'est fait pour moi ?", r: "Oui, Ma'coco est fait pour les indépendants. Vous gérez votre planning seul, sans équipe." },
    { q: "C'est vraiment gratuit ?", r: "Le plan Starter est 100% gratuit. Vitrine, réservations, WhatsApp — tout inclus sans carte bancaire." },
    { q: "Mes clientes doivent créer un compte ?", r: "Non. Elles réservent en tapant juste leur nom et leur numéro WhatsApp. C'est tout." },
    { q: "Je peux ajouter mes photos de réalisations ?", r: "Oui, directement depuis votre téléphone. Chaque prestation peut avoir sa propre galerie photos." },
  ]

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', maxWidth: 430, margin: '0 auto', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @keyframes pulse2{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.2);opacity:.7}}
      `}</style>

      {/* HEADER */}
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, zIndex: 100, background: scrolled ? 'rgba(26,10,14,.95)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', padding: '14px 20px', transition: 'all .3s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -1, textDecoration: 'none' }}>Ma'<span style={{ color: '#E8B84B' }}>coco</span></Link>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, fontWeight: 600, textDecoration: 'none', padding: '7px 12px' }}>Clientes</Link>
          <Link to="/app" style={{ background: '#E8B84B', color: '#1A0A0E', fontSize: 13, fontWeight: 800, textDecoration: 'none', padding: '7px 14px', borderRadius: 20 }}>Démarrer</Link>
        </div>
      </div>

      {/* HERO */}
      <div style={{ minHeight: '90dvh', position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg,#0A1A1A 0%,#1A3A3A 50%,#0D2B2B 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '8%', right: '-20%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(232,184,75,.07)', animation: 'pulse2 5s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-15%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(232,184,75,.05)', animation: 'pulse2 5s ease-in-out infinite .6s' }} />

        <div style={{ background: 'rgba(232,184,75,.12)', border: '1px solid rgba(232,184,75,.25)', borderRadius: 20, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: '#E8B84B', marginBottom: 20 }}>
          💼 Pour les professionnels de la beauté
        </div>

        <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 12 }}>
          Gérez votre activité.<br />Développez votre clientèle.
        </div>

        <div style={{ fontSize: 15, color: 'rgba(255,255,255,.6)', lineHeight: 1.7, marginBottom: 28, maxWidth: 300 }}>
          Ma'coco est l'outil de gestion pensé pour les coiffeurs, ongleristes et esthéticiens d'Afrique francophone.
        </div>

        {/* SÉLECTEUR MÉTIER */}
        <div style={{ width: '100%', maxWidth: 360, marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10 }}>Je suis...</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {METIERS.map((m, i) => (
              <button key={i} onClick={() => setMetierSel(i)}
                style={{ padding: '10px 8px', borderRadius: 12, border: 'none', background: metierSel === i ? '#E8B84B' : 'rgba(255,255,255,.1)', color: metierSel === i ? '#1A0A0E' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, transition: 'all .2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 22 }}>{m.icon}</span>
                <span style={{ fontSize: 11 }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Link to="/app" style={{ background: '#E8B84B', color: '#1A0A0E', padding: '15px 32px', borderRadius: 14, fontSize: 15, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 24px rgba(232,184,75,.4)', display: 'inline-block', marginBottom: 12 }}>
          Créer mon espace gratuitement →
        </Link>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>5 minutes · Aucune carte bancaire</div>

        {/* COMPTEURS */}
        <div style={{ display: 'flex', gap: 28, marginTop: 44 }}>
          {[{ t: 12, s: '+', l: 'Pros inscrits' }, { t: 3400, s: '+', l: 'RDV gérés' }, { t: 5, s: '', l: 'Villes' }].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#E8B84B' }}><Counter target={s.t} suffix={s.s} /></div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '40px 24px', background: '#fff' }}>
        <Reveal style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1A3A3A', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 8 }}>Fonctionnalités</div>
          <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.3 }}>Tout ce qu'il vous faut pour briller.</div>
        </Reveal>
        {FEATURES.map((f, i) => (
          <Reveal key={i} delay={i * 0.1} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f0f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{f.icon}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 3 }}>{f.titre}</div>
              <div style={{ fontSize: 13, color: 'var(--gris)', lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* TÉMOIGNAGES */}
      <div style={{ padding: '40px 24px', background: 'linear-gradient(135deg,#0A1A1A,#1A3A3A)' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 6 }}>Ils nous font confiance</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Des pros comme vous</div>
        </Reveal>
        <div style={{ position: 'relative', minHeight: 200 }}>
          {TEMOIGNAGES.map((t, i) => (
            <div key={i} style={{ position: i === 0 ? 'relative' : 'absolute', top: 0, left: 0, right: 0, opacity: temoIdx === i ? 1 : 0, transform: temoIdx === i ? 'translateX(0)' : 'translateX(24px)', transition: 'all .5s ease', pointerEvents: temoIdx === i ? 'all' : 'none' }}>
              <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 20, padding: 20 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{t.emoji}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,.9)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 14 }}>{t.texte}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{t.nom}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>{t.metier}</div>
                  </div>
                  <div style={{ color: '#E8B84B', fontSize: 14 }}>★★★★★</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          {TEMOIGNAGES.map((_, i) => (
            <button key={i} onClick={() => setTemoIdx(i)} style={{ width: temoIdx === i ? 20 : 6, height: 6, borderRadius: 3, background: temoIdx === i ? '#E8B84B' : 'rgba(255,255,255,.25)', border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0 }} />
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: '40px 24px 16px' }}>
        <Reveal style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>Questions fréquentes</div>
        </Reveal>
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div style={{ background: 'var(--gl)', borderRadius: 14, marginBottom: 8, overflow: 'hidden' }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{f.q}</span>
                <span style={{ fontSize: 18, color: '#1A3A3A', flexShrink: 0, transition: 'transform .2s', transform: faqOpen === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
              </button>
              {faqOpen === i && <div style={{ padding: '0 16px 14px', fontSize: 13, color: 'var(--gris)', lineHeight: 1.6 }}>{f.r}</div>}
            </div>
          </Reveal>
        ))}
      </div>

      {/* CTA FINAL */}
      <Reveal style={{ padding: '24px 24px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, lineHeight: 1.3 }}>Prêt à passer au niveau supérieur ?</div>
        <div style={{ fontSize: 14, color: 'var(--gris)', lineHeight: 1.6, marginBottom: 24 }}>Rejoignez les professionnels qui gèrent leur activité avec Ma'coco.</div>
        <Link to="/app" style={{ display: 'block', background: '#1A3A3A', color: '#fff', padding: '16px 24px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', marginBottom: 10, boxShadow: '0 4px 20px rgba(26,58,58,.3)' }}>
          Créer mon espace gratuitement →
        </Link>
        <Link to="/" style={{ fontSize: 13, color: 'var(--gris)', textDecoration: 'none' }}>← Retour accueil</Link>
      </Reveal>

      {/* FOOTER */}
      <div style={{ background: '#1A0A0E', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 6 }}>Ma'<span style={{ color: '#E8B84B' }}>coco</span></div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 16 }}>
          <Link to="/" style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>Clientes</Link>
          <Link to="/salons" style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>Salons</Link>
          <Link to="/app" style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>Connexion</Link>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.2)' }}>© 2025 Ma'coco · Douala, Cameroun</div>
      </div>
    </div>
  )
}
