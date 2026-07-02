import { useState } from 'react'
import { supabase, genSlug } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Btn, Input, PhoneInputCM } from '../../components/UI'

const VILLES = ['Douala','Yaoundé','Bafoussam','Garoua','Bamenda','Maroua','Ngaoundéré','Bertoua','Ebolowa','Kribi','Autre']

export default function OnboardingScreen() {
  const { session, setSalon } = useAuth()
  const [step, setStep]   = useState(1)
  const [nom, setNom]     = useState('')
  const [tel, setTel]     = useState('')
  const [ville, setVille] = useState('Douala')
  const [adresse, setAdresse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const create = async () => {
    if (!nom.trim()) { setError('Le nom du salon est requis'); return }
    setLoading(true); setError('')
    const slug = genSlug(nom)
    const { data, error: err } = await supabase.from('salons').insert({
      owner_id: session.user.id,
      nom: nom.trim(), slug,
      tel: tel.trim(), ville, adresse: adresse.trim(),
      vitrine_active: true,
    }).select().single()
    if (err) { setError(err.message); setLoading(false); return }

    // Ajouter 2 praticiennes par défaut
    await supabase.from('coiffeuses').insert([
      { salon_id: data.id, nom: 'Praticienne 1' },
      { salon_id: data.id, nom: 'Praticienne 2' },
    ])

    setSalon(data)
  }

  return (
    <div style={{minHeight:'100dvh',background:'var(--bx)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{background:'#fff',borderRadius:24,padding:'28px 24px',width:'100%',maxWidth:380}}>

        {/* PROGRESS */}
        <div style={{display:'flex',gap:6,marginBottom:24}}>
          {[1,2].map(i => (
            <div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=step?'var(--bx)':'var(--gl)'}}/>
          ))}
        </div>

        {step === 1 && (
          <>
            <div style={{fontSize:22,fontWeight:900,color:'var(--bx)',marginBottom:4}}>Votre salon ✂️</div>
            <div style={{fontSize:13,color:'var(--gris)',marginBottom:20}}>Comment s'appelle votre salon ?</div>
            <Input label="Nom du salon *" value={nom} onChange={setNom} placeholder="Ex : Salon Grâce" required />
            <PhoneInputCM label="Téléphone WhatsApp *" value={tel} onChange={setTel} required />
            <div className="fg">
              <label className="lbl">Ville</label>
              <select className="inp" value={ville} onChange={e=>setVille(e.target.value)}>
                {VILLES.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            {error && <div style={{color:'var(--rouge)',fontSize:13,marginBottom:12,fontWeight:600}}>{error}</div>}
            <Btn variant="bx" full disabled={!nom.trim()} onClick={() => setStep(2)}>Continuer →</Btn>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{fontSize:22,fontWeight:900,color:'var(--bx)',marginBottom:4}}>Dernière étape 🎉</div>
            <div style={{fontSize:13,color:'var(--gris)',marginBottom:20}}>Où se trouve votre salon ?</div>
            <Input label="Adresse" value={adresse} onChange={setAdresse} placeholder="Ex : Rue Joss 14, Akwa" />

            <div style={{background:'var(--bx-p)',borderRadius:14,padding:'14px 16px',marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:700,color:'var(--bx)',marginBottom:8}}>Votre vitrine sera accessible à :</div>
              <div style={{fontSize:14,fontWeight:900,color:'var(--bx)',wordBreak:'break-all'}}>
                macoco.cm/{genSlug(nom||'mon-salon')}
              </div>
              <div style={{fontSize:11,color:'var(--gris)',marginTop:4}}>Vos clientes réservent depuis ce lien</div>
            </div>

            {error && <div style={{color:'var(--rouge)',fontSize:13,marginBottom:12,fontWeight:600}}>{error}</div>}
            <Btn variant="bx" full disabled={loading} onClick={create} style={{marginBottom:10}}>
              {loading ? 'Création…' : 'Créer mon salon 🚀'}
            </Btn>
            <Btn variant="ghost" full onClick={() => setStep(1)}>← Retour</Btn>
          </>
        )}
      </div>
    </div>
  )
}
