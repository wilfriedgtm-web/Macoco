import { useState, useEffect } from 'react'
import { supabase, today, formatPrix, waLink, STATUTS } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Badge, Btn, Modal, Input, Select, Spinner, Empty, PhoneInputCM } from '../../components/UI'
import { useToast } from '../../hooks/useToast'
import { wa } from '../../lib/i18n'

export default function Dashboard({ onGoTo }) {
  const { salon } = useAuth()
  const { toast, showToast } = useToast()
  const [rdvs, setRdvs]       = useState([])
  const [rdvsAvenir, setRdvsAvenir] = useState([])
  const [presta, setPresta]   = useState([])
  const [coifs, setCoifs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modalNew, setModalNew] = useState(false)
  const [modalConfirm, setModalConfirm] = useState(null)
  // form
  const [fNom, setFNom]     = useState('')
  const [fTel, setFTel]     = useState('')
  const [fPresta, setFPresta] = useState('')
  const [fHeure, setFHeure] = useState('09h00')
  const [fCoif, setFCoif]   = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (salon) load() }, [salon])

  async function load() {
    setLoading(true)
    const [{ data: r }, { data: rv }, { data: p }, { data: c }] = await Promise.all([
      supabase.from('rendez_vous').select('*, prestations(nom,prix), coiffeuses(nom)')
        .eq('salon_id', salon.id).eq('date', today()).order('heure'),
      supabase.from('rendez_vous').select('*, prestations(nom,prix), coiffeuses(nom)')
        .eq('salon_id', salon.id).gt('date', today())
        .in('statut', ['en_attente','confirme'])
        .order('date').order('heure').limit(10),
      supabase.from('prestations').select('*').eq('salon_id', salon.id).eq('actif', true).order('ordre'),
      supabase.from('coiffeuses').select('*').eq('salon_id', salon.id).eq('actif', true),
    ])
    setRdvs(r || [])
    setRdvsAvenir(rv || [])
    setPresta(p || [])
    setCoifs(c || [])
    if (p?.length) setFPresta(p[0].id)
    if (c?.length) setFCoif(c[0].id)
    setLoading(false)
  }

  async function confirmer(rdv) {
    await supabase.from('rendez_vous').update({ statut: 'confirme', confirme_at: new Date().toISOString() }).eq('id', rdv.id)
    setRdvs(prev => prev.map(r => r.id === rdv.id ? { ...r, statut: 'confirme' } : r))
    const p = rdv.prestations?.nom || ''
    const msg = wa.confirmationRdv(salon.langue, rdv.client_nom, salon.nom, rdv.heure, p)
    window.open(waLink(rdv.client_tel, msg), '_blank')
    setModalConfirm(null)
    showToast(`✓ ${rdv.client_nom} confirmée`, 'ok')
  }

  async function marquerFait(rdv) {
    await supabase.from('rendez_vous').update({ statut: 'fait', fait_at: new Date().toISOString() }).eq('id', rdv.id)
    setRdvs(prev => prev.map(r => r.id === rdv.id ? { ...r, statut: 'fait' } : r))
    showToast('RDV terminé ✓', 'ok')
  }

  async function creerRdv() {
    if (!fNom.trim() || !fTel.trim()) { showToast('Nom et téléphone requis', 'err'); return }
    setSaving(true)
    const pInfo = presta.find(p => p.id === fPresta)
    const { error } = await supabase.from('rendez_vous').insert({
      salon_id: salon.id, prestation_id: fPresta || null,
      coiffeuse_id: fCoif || null,
      client_nom: fNom.trim(), client_tel: fTel.trim(),
      date: today(), heure: fHeure,
      statut: 'en_attente',
      montant: pInfo?.prix || 0,
    })
    setSaving(false)
    if (error) { showToast('Erreur : ' + error.message, 'err'); return }
    showToast(`✓ RDV créé pour ${fNom}`, 'ok')
    setModalNew(false); setFNom(''); setFTel('')
    load()
  }

  const HEURES_OPT = ['08h00','08h30','09h00','09h30','10h00','10h30','11h00','11h30','12h00','13h00','14h00','14h30','15h00','15h30','16h00','16h30','17h00','17h30','18h00','18h30'].map(h=>({value:h,label:h}))

  const encaisses = rdvs.filter(r => r.statut === 'fait').reduce((s, r) => s + (r.montant || 0), 0)
  const enAttente = rdvs.filter(r => r.statut === 'en_attente').length
  const confirmes = rdvs.filter(r => r.statut === 'confirme' || r.statut === 'en_cours').length

  if (loading) return <Spinner />

  return (
    <div className="page">
      {/* ATTENTE BANNER */}
      {(enAttente > 0 || confirmes > 0) && (
        <div style={{margin:'14px 16px 10px',background:'linear-gradient(135deg,#FDF6E7,#fef9ee)',border:'1.5px solid var(--or-l)',borderRadius:16,padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
          <div style={{fontSize:28}}>⏱️</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:800,color:'var(--or)'}}>File d'attente</div>
            <div style={{fontSize:12,color:'var(--gris)',marginTop:2}}>{confirmes} en cours · {enAttente} en attente</div>
          </div>
          <Btn variant="or" sm onClick={() => onGoTo('attente')}>Gérer</Btn>
        </div>
      )}

      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-lbl">RDV aujourd'hui</div>
          <div className="kpi-val">{rdvs.length}</div>
          <div className="kpi-sub">{confirmes} confirmés · {enAttente} en attente</div>
        </div>
        <div className="kpi gold">
          <div className="kpi-lbl">Recettes</div>
          <div className="kpi-val">{encaisses > 0 ? encaisses.toLocaleString('fr') : '–'}</div>
          <div className="kpi-sub">FCFA encaissés</div>
        </div>
      </div>

      {/* LISTE RDV */}
      <div className="stitle">Rendez-vous du jour</div>

      {rdvs.length === 0 ? (
        <Empty icon="📅" title="Aucun RDV aujourd'hui" sub="Ajoutez un rendez-vous ou attendez les réservations de vos clientes." action="+ Ajouter un RDV" onAction={() => setModalNew(true)} />
      ) : (
        rdvs.map(rdv => (
          <div key={rdv.id} className={`rdv-item ${STATUTS[rdv.statut]?.cls || 'wait'}`}>
            <div className="rdv-av">👩🏿</div>
            <div className="rdv-body">
              <div className="rdv-nom">{rdv.client_nom}</div>
              <div className="rdv-svc">{rdv.prestations?.nom || 'Prestation'}</div>
              <div className="rdv-meta">
                <span className="rdv-time">{rdv.heure}</span>
                {rdv.coiffeuses && <span className="rdv-staff">✂️ {rdv.coiffeuses.nom}</span>}
                <Badge statut={rdv.statut} />
              </div>
            </div>
            <div style={{display:'flex',gap:5,flexShrink:0,alignItems:'center'}}>
              {rdv.statut === 'en_attente' && (
                <Btn sm variant="bx" onClick={() => setModalConfirm(rdv)}>✓</Btn>
              )}
              {rdv.statut === 'confirme' && (
                <>
                  <Btn sm variant="wa" onClick={() => window.open(waLink(rdv.client_tel, wa.cestBientotVotreTour(salon.langue, rdv.client_nom, salon.nom)), '_blank')}>💬</Btn>
                  <Btn sm variant="ghost" onClick={() => marquerFait(rdv)}>✓ Fait</Btn>
                </>
              )}
              {rdv.statut === 'fait' && (
                <span style={{fontSize:12,fontWeight:700,color:'var(--gris)',whiteSpace:'nowrap'}}>{formatPrix(rdv.montant)}</span>
              )}
            </div>
          </div>
        ))
      )}

      {/* RDV À VENIR */}
      {rdvsAvenir.length > 0 && (
        <>
          <div className="stitle" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span>À venir · {rdvsAvenir.length} RDV</span>
            <button onClick={() => onGoTo('planning')} style={{background:'none',border:'none',color:'var(--bx)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Voir planning →</button>
          </div>
          {rdvsAvenir.map(rdv => {
            const d = new Date(rdv.date + 'T12:00:00')
            const istomorrow = rdv.date === new Date(new Date().setDate(new Date().getDate()+1)).toISOString().split('T')[0]
            const dateLabel = istomorrow ? 'Demain' : d.toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})
            return (
              <div key={rdv.id} className={`rdv-item ${STATUTS[rdv.statut]?.cls||'wait'}`}>
                <div className="rdv-av">👩🏿</div>
                <div className="rdv-body">
                  <div className="rdv-nom">{rdv.client_nom}</div>
                  <div className="rdv-svc">{rdv.prestations?.nom||'Prestation'}</div>
                  <div className="rdv-meta">
                    <span style={{fontSize:12,fontWeight:700,color:'var(--bx)',background:'var(--bx-p)',padding:'2px 8px',borderRadius:20}}>{dateLabel}</span>
                    <span className="rdv-time">{rdv.heure}</span>
                    {rdv.coiffeuses && <span className="rdv-staff">✂️ {rdv.coiffeuses.nom}</span>}
                    <Badge statut={rdv.statut}/>
                  </div>
                </div>
                <div style={{display:'flex',gap:5,flexShrink:0}}>
                  {rdv.statut === 'en_attente' && (
                    <Btn sm variant="wa" onClick={async () => {
                      const dateF = d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})
                      const msg = wa.confirmationRdvDate(salon.langue, rdv.client_nom, salon.nom, dateF, rdv.heure, rdv.prestations?.nom)
                      await supabase.from('rendez_vous').update({ statut:'confirme', confirme_at: new Date().toISOString() }).eq('id', rdv.id)
                      window.open(waLink(rdv.client_tel, msg), '_blank')
                      showToast(`✓ ${rdv.client_nom} confirmée`, 'ok')
                      load()
                    }}>Confirmer 💬</Btn>
                  )}
                </div>
              </div>
            )
          })}
        </>
      )}

      <div style={{margin:'16px 16px 0'}}>
        <Btn variant="bx" full onClick={() => setModalNew(true)}>+ Ajouter un rendez-vous</Btn>
      </div>

      {/* MODAL NOUVEAU RDV */}
      <Modal open={modalNew} onClose={() => setModalNew(false)} title="Nouveau rendez-vous" sub="Ajoutez manuellement un RDV">
        <Input label="Nom de la cliente *" value={fNom} onChange={setFNom} placeholder="Ex : Fatima Ngando" />
        <PhoneInputCM label="Téléphone WhatsApp *" value={fTel} onChange={setFTel} required />
        {presta.length > 0 && (
          <Select label="Prestation" value={fPresta} onChange={setFPresta}
            options={presta.map(p => ({ value: p.id, label: `${p.nom} — ${formatPrix(p.prix)}` }))} />
        )}
        <Select label="Heure" value={fHeure} onChange={setFHeure} options={HEURES_OPT} />
        {coifs.length > 0 && (
          <Select label="Praticienne" value={fCoif} onChange={setFCoif}
            options={coifs.map(c => ({ value: c.id, label: '✂️ ' + c.nom }))} />
        )}
        <Btn variant="bx" full disabled={saving} onClick={creerRdv} style={{marginBottom:8}}>
          {saving ? 'Création…' : 'Créer le rendez-vous'}
        </Btn>
        <Btn variant="ghost" full onClick={() => setModalNew(false)}>Annuler</Btn>
      </Modal>

      {/* MODAL CONFIRMATION */}
      <Modal open={!!modalConfirm} onClose={() => setModalConfirm(null)}
        title={`Confirmer · ${modalConfirm?.client_nom}`}
        sub={`${modalConfirm?.heure} — ${modalConfirm?.prestations?.nom || 'RDV'}`}>
        {modalConfirm && (
          <>
            <div style={{background:'var(--bx-p)',borderRadius:14,padding:14,marginBottom:20,borderLeft:'3px solid var(--bx)'}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--gris)',textTransform:'uppercase',marginBottom:6}}>Message WhatsApp</div>
              <div style={{fontSize:14,lineHeight:1.6}}>
                Bonjour <strong>{modalConfirm.client_nom}</strong>, votre rendez-vous au <strong>{salon.nom}</strong> est confirmé pour aujourd'hui à <strong>{modalConfirm.heure}</strong>{modalConfirm.prestations?.nom ? ` — ${modalConfirm.prestations.nom}` : ''}. À tout à l'heure ! ✂️
              </div>
            </div>
            <Btn variant="wa" full onClick={() => confirmer(modalConfirm)} style={{marginBottom:8}}>💬 Confirmer + WhatsApp</Btn>
            <Btn variant="ghost" full onClick={() => setModalConfirm(null)}>Plus tard</Btn>
          </>
        )}
      </Modal>

      <div className={`toast${toast.show?' show':''} ${toast.type}`}>{toast.msg}</div>
    </div>
  )
}
