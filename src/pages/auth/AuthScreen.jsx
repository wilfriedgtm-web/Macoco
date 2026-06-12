import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Btn, Input } from '../../components/UI'

export default function AuthScreen() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode]       = useState('login') // login | signup
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handle = async () => {
    if (!email || !password) { setError('Email et mot de passe requis'); return }
    setLoading(true); setError('')
    const { error: err } = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password)
    if (err) { setError(err.message); setLoading(false) }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div style={{fontSize:36,fontWeight:900,color:'var(--bx)',letterSpacing:-1,marginBottom:4}}>
          Ma'<span style={{color:'var(--or)'}}>coco</span>
        </div>
        <div style={{fontSize:13,color:'var(--gris)',marginBottom:24,lineHeight:1.5}}>
          {mode === 'login' ? 'Connectez-vous à votre salon' : 'Créez votre compte salon gratuitement'}
        </div>

        <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="grace@salon.cm" required />
        <Input label="Mot de passe" value={password} onChange={setPassword} type="password" placeholder="••••••••" required />

        {error && (
          <div style={{background:'var(--rougep)',color:'var(--rouge)',padding:'10px 14px',borderRadius:10,fontSize:13,marginBottom:14,fontWeight:600}}>
            {error}
          </div>
        )}

        <Btn variant="bx" full disabled={loading} onClick={handle} style={{marginBottom:12}}>
          {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter →' : 'Créer mon compte →'}
        </Btn>

        <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
          style={{background:'none',border:'none',color:'var(--bx)',fontSize:13,fontWeight:700,cursor:'pointer',width:'100%',textAlign:'center'}}>
          {mode === 'login' ? 'Pas encore de compte ? Créer un salon' : 'Déjà un compte ? Se connecter'}
        </button>
      </div>

      <div style={{marginTop:20,fontSize:12,color:'rgba(255,255,255,.5)',textAlign:'center'}}>
        Plus de clientes, moins d'attente. ✂️
      </div>
    </div>
  )
}
