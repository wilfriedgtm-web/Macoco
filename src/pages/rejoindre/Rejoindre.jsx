import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '📅', titre: 'Zéro RDV perdu', desc: 'Vos clientes réservent depuis votre vitrine Ma\'coco, même quand vous dormez.' },
  { icon: '⏱️', titre: 'Fini l\'attente', desc: 'Prévenez vos clientes par WhatsApp quand c\'est leur tour. Elles attendent chez elles.' },
  { icon: '💬', titre: 'WhatsApp intégré', desc: 'Confirmez chaque RDV en un clic. Le message part automatiquement sur WhatsApp.' },
  { icon: '🌐', titre: 'Votre vitrine en ligne', desc: 'Une page publique avec vos photos, prestations et prix. Partagez le lien sur Instagram.' },
  { icon: '📊', titre: 'Planning clair', desc: 'Voyez tous vos RDV du jour en un coup d\'œil. Plus de cahier, plus de confusion.' },
  { icon: '💰', titre: 'Gratuit pour commencer', desc: 'Créez votre salon en 5 minutes. Aucune carte bancaire requise.' },
]

const TEMOIGNAGE = {
  nom: 'Grâce Mballa',
  salon: 'Salon Grâce, Douala Akwa',
  emoji: '👩🏿',
  texte: '"Avant je perdais 3 à 4 clientes par semaine à cause des messages WhatsApp non répondus. Avec Ma\'coco, toutes mes clientes réservent en ligne et je confirme en un clic. Mon chiffre d\'affaires a augmenté dès le premier mois."',
}

export default function Rejoindre() {
  return (
    <div style={{ minHeight: '100dvh', background: '#fff', maxWidth: 430, margin: '0 auto' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, var(--bx) 0%, #3D0A14 100%)', padding: '48px 24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 4 }}>
          Ma'<span style={{ color: 'var(--or-l)' }}>coco</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1.3, margin: '16px 0 12px' }}>
          Plus de clientes,<br />moins d'attente.
        </div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,.75)', lineHeight: 1.6, marginBottom: 28 }}>
          L'app de gestion pour les salons de coiffure en Afrique. Gérez vos RDV, prévenez vos clientes, et développez votre salon.
        </div>
        <Link to="/app" style={{ display: 'inline-block', background: 'var(--or)', color: '#fff', padding: '15px 32px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
          Créer mon salon gratuitement →
        </Link>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 10 }}>
          5 minutes · Aucune carte bancaire
        </div>
      </div>

      {/* PROBLÈME */}
      <div style={{ padding: '32px 24px', background: 'var(--gl)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gris)', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 12 }}>Le problème</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--noir)', lineHeight: 1.3, marginBottom: 16 }}>
          Combien de clientes avez-vous perdu cette semaine ?
        </div>
        {[
          '❌ Messages WhatsApp non répondus',
          '❌ Clientes qui attendent 2h et repartent',
          '❌ Agenda sur papier ou dans la tête',
          '❌ Double booking et confusion',
          '❌ Pas de vitrine en ligne pour attirer de nouvelles clientes',
        ].map((p, i) => (
          <div key={i} style={{ fontSize: 14, color: 'var(--gris)', padding: '8px 0', borderBottom: i < 4 ? '1px solid #e2e8f0' : 'none', fontWeight: 500 }}>
            {p}
          </div>
        ))}
      </div>

      {/* SOLUTION */}
      <div style={{ padding: '32px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--bx)', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 12 }}>La solution</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--noir)', lineHeight: 1.3, marginBottom: 20 }}>
          Tout ce dont votre salon a besoin, dans une seule app.
        </div>
        {FEATURES.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bx-p)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {f.icon}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 3 }}>{f.titre}</div>
              <div style={{ fontSize: 13, color: 'var(--gris)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TÉMOIGNAGE */}
      <div style={{ margin: '0 16px 32px', background: 'linear-gradient(135deg,var(--bx),#3D0A14)', borderRadius: 20, padding: 24 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>{TEMOIGNAGE.emoji}</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,.9)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 16 }}>
          {TEMOIGNAGE.texte}
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{TEMOIGNAGE.nom}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>{TEMOIGNAGE.salon}</div>
      </div>

      {/* PRICING */}
      <div style={{ padding: '0 24px 32px' }}>
        <div style={{ fontSize: 20, fontWeight: 900, textAlign: 'center', marginBottom: 6 }}>Simple et transparent</div>
        <div style={{ fontSize: 14, color: 'var(--gris)', textAlign: 'center', marginBottom: 20 }}>Commencez gratuitement, évoluez quand vous êtes prêt.</div>

        <div style={{ background: 'var(--bx-p)', borderRadius: 16, padding: 20, marginBottom: 12, border: '2px solid var(--bx)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>Starter</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--bx)' }}>Gratuit</div>
          </div>
          {['Vitrine publique', 'Jusqu\'à 30 RDV/mois', '2 coiffeuses', 'File d\'attente WhatsApp'].map((f, i) => (
            <div key={i} style={{ fontSize: 13, color: 'var(--gris)', padding: '5px 0', display: 'flex', gap: 8 }}>
              <span style={{ color: 'var(--vert)' }}>✓</span> {f}
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bx)', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>Pro</div>
            <div>
              <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--or-l)' }}>15 000 F</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>/mois</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', marginBottom: 12 }}>Bientôt disponible</div>
          {['RDV illimités', 'Coiffeuses illimitées', 'Statistiques avancées', 'Support prioritaire', 'Rappels automatiques'].map((f, i) => (
            <div key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,.8)', padding: '5px 0', display: 'flex', gap: 8 }}>
              <span style={{ color: 'var(--or-l)' }}>✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{ padding: '0 24px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Prêt à développer votre salon ?</div>
        <div style={{ fontSize: 14, color: 'var(--gris)', marginBottom: 24 }}>Rejoignez les premiers salons sur Ma'coco.</div>
        <Link to="/app" style={{ display: 'block', background: 'var(--bx)', color: '#fff', padding: '16px 24px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', marginBottom: 12 }}>
          Créer mon salon gratuitement →
        </Link>
        <Link to="/" style={{ fontSize: 13, color: 'var(--gris)', textDecoration: 'none' }}>
          ← Voir les salons
        </Link>
      </div>
    </div>
  )
}
