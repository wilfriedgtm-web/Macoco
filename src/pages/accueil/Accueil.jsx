import { useState } from 'react'
import { RDV_JOUR } from '../../lib/data'
import { Badge, Modal, Btn, useToast } from '../../components/UI'

export default function Accueil({ onGoTo }) {
  const { toast } = useToast()
  const [rdvs, setRdvs] = useState(RDV_JOUR)
  const [modalRdv, setModalRdv] = useState(false)
  const [modalConfirm, setModalConfirm] = useState(null)
  const [nomNouv, setNomNouv] = useState('')

  const confirmerRdv = (rdv) => setModalConfirm(rdv)

  const envoyerConfirmation = () => {
    const rdv = modalConfirm
    setRdvs(prev => prev.map(r => r.id === rdv.id ? { ...r, statut: 'ok' } : r))
    const msg = encodeURIComponent(`Bonjour ${rdv.nom}, votre rendez-vous au Salon Grâce est confirmé pour aujourd'hui à ${rdv.heure} — ${rdv.svc}. À tout à l'heure ! ✂️`)
    window.open(`https://wa.me/${rdv.tel}?text=${msg}`, '_blank')
    setModalConfirm(null)
    toast(`✓ ${rdv.nom} confirmée`, 'success')
  }

  const waRapide = (rdv) => {
    const msg = encodeURIComponent(`Bonjour ${rdv.nom}, votre RDV de ${rdv.heure} pour ${rdv.svc} est confirmé. À tout à l'heure au Salon Grâce ! ✂️`)
    window.open(`https://wa.me/${rdv.tel}?text=${msg}`, '_blank')
    toast(`WhatsApp ouvert pour ${rdv.nom}`, 'wa')
  }

  const creerRdv = () => {
    if (!nomNouv.trim()) { toast('⚠️ Entrez le nom de la cliente'); return }
    toast(`✓ RDV créé pour ${nomNouv}`, 'success')
    setNomNouv('')
    setModalRdv(false)
  }

  const done = rdvs.filter(r => r.statut === 'done').length
  const recettes = rdvs.filter(r => r.statut === 'done').reduce((s, r) => s + r.prix, 0)

  return (
    <>
      {/* ATTENTE BANNER */}
      <div style={{ margin: '14px 16px 10px', background: 'linear-gradient(135deg,#FDF6E7,#fef9ee)', border: '1.5px solid var(--or-light)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 28 }}>⏱️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--or)' }}>File d'attente active</div>
          <div style={{ fontSize: 12, color: 'var(--gris)', marginTop: 2 }}>3 clientes en attente · Attente moy. 42 min</div>
        </div>
        <Btn variant="or" sm onClick={() => onGoTo('attente')}>Gérer</Btn>
      </div>

      {/* KPI */}
      <div className="mc-kpi-grid">
        <div className="mc-kpi">
          <div className="mc-kpi-label">RDV aujourd'hui</div>
          <div className="mc-kpi-val">{rdvs.length}</div>
          <div className="mc-kpi-sub">{rdvs.filter(r => r.statut === 'ok').length} confirmés · {rdvs.filter(r => r.statut === 'wait').length} en attente</div>
        </div>
        <div className="mc-kpi or">
          <div className="mc-kpi-label">Recettes du jour</div>
          <div className="mc-kpi-val">{recettes.toLocaleString('fr')}</div>
          <div className="mc-kpi-sub">FCFA encaissés</div>
        </div>
      </div>

      {/* LISTE RDV */}
      <div className="mc-section-title">RDV du jour — Vendredi 13 juin</div>

      {rdvs.map(rdv => (
        <div key={rdv.id} className={`mc-rdv ${rdv.statut}`}>
          <div className="mc-rdv-avatar">{rdv.emoji}</div>
          <div className="mc-rdv-body">
            <div className="mc-rdv-name">{rdv.nom}</div>
            <div className="mc-rdv-svc">{rdv.svc}</div>
            <div className="mc-rdv-meta">
              <span className="mc-rdv-time">{rdv.heure}</span>
              <span className="mc-rdv-staff">✂️ {rdv.coiffeuse}</span>
              <Badge statut={rdv.statut} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {rdv.statut === 'wait' && (
              <Btn variant="bordeaux" sm onClick={() => confirmerRdv(rdv)}>✓</Btn>
            )}
            {rdv.statut === 'ok' && (
              <Btn variant="wa" sm onClick={() => waRapide(rdv)}>💬</Btn>
            )}
            {rdv.statut === 'done' && (
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gris)', alignSelf: 'center' }}>{rdv.prix.toLocaleString('fr')} F</span>
            )}
          </div>
        </div>
      ))}

      <div style={{ margin: '16px 16px 0' }}>
        <Btn variant="bordeaux" full onClick={() => setModalRdv(true)}>+ Ajouter un rendez-vous</Btn>
      </div>

      {/* MODAL NOUVEAU RDV */}
      <Modal id="modal-new-rdv" open={modalRdv} onClose={() => setModalRdv(false)}
        title="Nouveau rendez-vous" sub="Ajoutez manuellement un RDV client">
        <div className="mc-form-group">
          <label className="mc-label">Nom de la cliente</label>
          <input className="mc-input" placeholder="Ex : Fatima Ngando"
            value={nomNouv} onChange={e => setNomNouv(e.target.value)} />
        </div>
        <div className="mc-form-group">
          <label className="mc-label">Téléphone</label>
          <input className="mc-input" type="tel" placeholder="+237 6XX XXX XXX" />
        </div>
        <div className="mc-form-group">
          <label className="mc-label">Prestation</label>
          <select className="mc-input">
            <option>Tresse box braids — 5 000 F</option>
            <option>Coupe + Brushing — 3 500 F</option>
            <option>Manucure complète — 2 500 F</option>
            <option>Soin Défrisage — 8 000 F</option>
            <option>Pose de cils — 6 000 F</option>
          </select>
        </div>
        <div className="mc-form-group">
          <label className="mc-label">Heure</label>
          <select className="mc-input">
            {['08h00','09h00','10h00','11h00','12h00','13h00','14h00','15h00','16h00','17h00','18h00'].map(h =>
              <option key={h}>{h}</option>
            )}
          </select>
        </div>
        <div className="mc-form-group">
          <label className="mc-label">Coiffeuse</label>
          <select className="mc-input">
            <option>✂️ Grâce</option>
            <option>✂️ Sandrine</option>
          </select>
        </div>
        <Btn variant="bordeaux" full onClick={creerRdv} style={{ marginBottom: 8 }}>Créer le rendez-vous</Btn>
        <Btn variant="ghost" full onClick={() => setModalRdv(false)}>Annuler</Btn>
      </Modal>

      {/* MODAL CONFIRMATION */}
      <Modal id="modal-confirm-rdv" open={!!modalConfirm} onClose={() => setModalConfirm(null)}
        title={`Confirmer · ${modalConfirm?.nom}`}
        sub={`${modalConfirm?.heure} — ${modalConfirm?.svc}`}>
        {modalConfirm && (
          <>
            <div style={{ background: 'var(--bordeaux-pale)', borderRadius: 14, padding: 14, marginBottom: 20, borderLeft: '3px solid var(--bordeaux)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gris)', textTransform: 'uppercase', marginBottom: 6 }}>Message à envoyer</div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                Bonjour <strong>{modalConfirm.nom}</strong>, votre rendez-vous au <strong>Salon Grâce</strong> est confirmé pour aujourd'hui à <strong>{modalConfirm.heure}</strong> — {modalConfirm.svc}. À tout à l'heure ! ✂️
              </div>
            </div>
            <Btn variant="wa" full onClick={envoyerConfirmation} style={{ marginBottom: 8 }}>💬 Envoyer via WhatsApp</Btn>
            <Btn variant="ghost" full onClick={() => setModalConfirm(null)}>Plus tard</Btn>
          </>
        )}
      </Modal>
    </>
  )
}
