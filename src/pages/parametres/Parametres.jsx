import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Btn, Input, Textarea, Modal } from '../../components/UI'
import { useToast } from '../../hooks/useToast'

export default function Parametres() {
  const { salon, setSalon, signOut } = useAuth()
  const { toast, showToast } = useToast()
  const [nom, setNom]           = useState(salon?.nom || '')
  const [tel, setTel]           = useState(salon?.tel || '')
  const [ville, setVille]       = useState(salon?.ville || '')
  const [adresse, setAdresse]   = useState(salon?.adresse || '')
  const [desc, setDesc]         = useState(salon?.description || '')
  const [heures, setHeures]     = useState(salon?.heures || '8h – 19h · Lun–Sam')
  const [insta, setInsta]       = useState(salon?.insta || '')
  const [vitrine, setVitrine]   = useState(salon?.vitrine_active ?? true)
  const [saving, setSaving]     = useState(false)
  const [modalShare, setModalShare] = useState(false)
  const [coifs, setCoifs]       = useState([])
  const [nomCoif, setNomCoif]   = useState('')
  const [telCoif, setTelCoif]   = useState('')

  useEffect(() => { if (salon) loadCoifs() }, [salon])

  async function loadCoifs() {
    const { data } = await supabase.from('coiffeuses').select('*').eq('salon_id', salon.id).eq('actif', true).order('created_at')
    setCoifs(data || [])
  }

  async function save() {
    setSaving(true)
    const { data, error } = await supabase.from('salons').update({
      nom, tel, ville, adresse, description: desc, heures, insta, vitrine_active: vitrine
    }).eq('id', salon.id).select().single()
    setSaving(false)
    if (error) { showToast('Erreur : ' + error.message, 'err'); return }
    setSalon(data)
    showToast('✓ Modifications enregistrées', 'ok')
  }

  async function addCoif() {
    if (!nomCoif.trim()) return
    await supabase.from('coiffeuses').insert({ salon_id: salon.id, nom: nomCoif.trim(), tel: telCoif.trim() })
    showToast(`✓ ${nomCoif} ajoutée`, 'ok')
    setNomCoif(''); setTelCoif(''); loadCoifs()
  }

  async function removeCoif(id) {
    await supabase.from('coiffeuses').update({ actif: false }).eq('id', id)
    showToast('Coiffeuse retirée', 'ok'); loadCoifs()
  }

  const vitrineUrl = `${window.location.origin}/book/${salon?.slug}`

  const copier = () => {
    navigator.clipboard?.writeText(vitrineUrl)
    showToast('✓ Lien copié !', 'ok')
  }

  return (
    <div className="page">
      {/* VITRINE CARD */}
      <div style={{ margin: '14px 16px 10px', background: 'linear-gradient(135deg,var(--bx),#3D0A14)', borderRadius: 18, padding: 20, color: '#fff' }}>
        <div style={{ fontSize: 13, opacity: .7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>Votre vitrine publique</div>
        <div style={{ fontSize: 15, fontWeight: 800, marginTop: 6, wordBreak: 'break-all' }}>{vitrineUrl}</div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <Btn variant="or" sm onClick={copier}>📋 Copier</Btn>
          <Btn variant="ghost" sm onClick={() => setModalShare(true)}>🔗 Partager</Btn>
          <Btn variant="ghost" sm onClick={() => window.open(vitrineUrl, '_blank')}>👁 Voir</Btn>
        </div>
      </div>

      {/* TOGGLE VITRINE */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Vitrine active</div>
          <div style={{ fontSize: 12, color: 'var(--gris)', marginTop: 2 }}>Vos clientes peuvent réserver en ligne</div>
        </div>
        <button onClick={() => setVitrine(!vitrine)}
          style={{ width: 48, height: 28, borderRadius: 14, background: vitrine ? 'var(--vm)' : '#e2e8f0', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
          <div style={{ position: 'absolute', top: 3, left: vitrine ? 23 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
        </button>
      </div>

      {/* INFOS SALON */}
      <div className="stitle">Informations du salon</div>
      <div className="card">
        <Input label="Nom du salon" value={nom} onChange={setNom} placeholder="Salon Grâce" />
        <Input label="Téléphone WhatsApp" value={tel} onChange={setTel} type="tel" placeholder="+237 6XX XXX XXX" />
        <Input label="Ville" value={ville} onChange={setVille} placeholder="Douala" />
        <Input label="Adresse" value={adresse} onChange={setAdresse} placeholder="Rue Joss 14, Akwa" />
        <Input label="Horaires" value={heures} onChange={setHeures} placeholder="8h – 19h · Lun–Sam" />
        <Input label="Instagram" value={insta} onChange={setInsta} placeholder="@salongrade_douala" />
        <Textarea label="Description" value={desc} onChange={setDesc} placeholder="Décrivez votre salon..." />
        <Btn variant="bx" full disabled={saving} onClick={save}>{saving ? 'Enregistrement…' : '✓ Enregistrer'}</Btn>
      </div>

      {/* COIFFEUSES */}
      <div className="stitle">Coiffeuses</div>
      <div className="card">
        {coifs.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--gl)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bx-p)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✂️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{c.nom}</div>
              {c.tel && <div style={{ fontSize: 11, color: 'var(--gris)' }}>{c.tel}</div>}
            </div>
            <button onClick={() => removeCoif(c.id)} style={{ background: 'var(--rougep)', color: 'var(--rouge)', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Retirer</button>
          </div>
        ))}
        <div style={{ marginTop: 14 }}>
          <Input label="Nom" value={nomCoif} onChange={setNomCoif} placeholder="Ex : Sandrine" />
          <Input label="Téléphone (optionnel)" value={telCoif} onChange={setTelCoif} type="tel" placeholder="+237 6XX XXX XXX" />
          <Btn variant="ghost" full onClick={addCoif} disabled={!nomCoif.trim()}>+ Ajouter une coiffeuse</Btn>
        </div>
      </div>

      {/* DÉCONNEXION */}
      <div style={{ margin: '16px 16px 0' }}>
        <Btn variant="red" full onClick={signOut}>Se déconnecter</Btn>
      </div>

      {/* MODAL PARTAGE */}
      <Modal open={modalShare} onClose={() => setModalShare(false)} title="📲 Partager votre vitrine" sub="Vos clientes réservent depuis ce lien">
        <div style={{ background: 'var(--bx-p)', borderRadius: 14, padding: '14px 16px', marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gris)', textTransform: 'uppercase', marginBottom: 6 }}>Votre lien</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--bx)', wordBreak: 'break-all' }}>{vitrineUrl}</div>
          <button onClick={copier} style={{ marginTop: 10, background: 'var(--bx)', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 20px', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>📋 Copier</button>
        </div>
        <div className="share-ch">
          <button className="share-btn" style={{ background: '#25D366', color: '#fff' }}
            onClick={() => { window.open(`https://wa.me/?text=${encodeURIComponent(`Réservez au ${salon?.nom} 💇🏿‍♀️\n${vitrineUrl}`)}`, '_blank') }}>
            💬 WhatsApp
          </button>
          <button className="share-btn" style={{ background: '#E1306C', color: '#fff' }} onClick={copier}>
            📸 Instagram
          </button>
          <button className="share-btn" style={{ background: '#0088cc', color: '#fff' }}
            onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(vitrineUrl)}`, '_blank')}>
            ✈️ Telegram
          </button>
          <button className="share-btn" style={{ background: 'var(--gl)', color: 'var(--noir)' }} onClick={copier}>
            📋 Copier
          </button>
        </div>
        <div style={{ marginTop: 16, background: 'var(--or-p)', borderRadius: 12, padding: '12px 14px', fontSize: 12, color: 'var(--or)', fontWeight: 600, lineHeight: 1.5 }}>
          💡 Mettez ce lien en bio Instagram et dans votre statut WhatsApp. Vos clientes réservent sans vous appeler.
        </div>
      </Modal>

      <div className={`toast${toast.show ? ' show' : ''} ${toast.type}`}>{toast.msg}</div>
    </div>
  )
}
