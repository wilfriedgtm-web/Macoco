import { useState, useEffect } from 'react'
import { supabase, today, waLink } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Btn, Spinner, Empty } from '../../components/UI'
import { useToast } from '../../hooks/useToast'
import { wa } from '../../lib/i18n'

export default function Attente() {
  const { salon } = useAuth()
  const { toast, showToast } = useToast()
  const [file, setFile] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (salon) load() }, [salon])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('rendez_vous')
      .select('*, prestations(nom), coiffeuses(nom)')
      .eq('salon_id', salon.id).eq('date', today())
      .in('statut', ['en_attente','confirme','en_cours'])
      .order('heure')
    setFile(data || [])
    setLoading(false)
  }

  async function prevenir(rdv, min) {
    const msg = wa.prevenirFileAttente(salon.langue, rdv.client_nom, salon.nom, min)
    window.open(waLink(rdv.client_tel, msg), '_blank')
    await supabase.from('rendez_vous').update({ prevenu_at: new Date().toISOString() }).eq('id', rdv.id)
    showToast(`💬 Message envoyé à ${rdv.client_nom}`, 'wa')
    load()
  }

  async function passerEnCours(rdv) {
    await supabase.from('rendez_vous').update({ statut: 'en_cours' }).eq('id', rdv.id)
    showToast(`${rdv.client_nom} est maintenant en cours`, 'ok')
    load()
  }

  if (loading) return <Spinner />
  const enCours = file.filter(r => r.statut === 'en_cours')
  const attente = file.filter(r => r.statut !== 'en_cours')

  return (
    <div className="page">
      <div style={{margin:'14px 16px 0',background:'linear-gradient(135deg,var(--bx),#3D0A14)',borderRadius:18,padding:20,color:'#fff'}}>
        <div style={{fontSize:12,opacity:.7,fontWeight:700,textTransform:'uppercase',letterSpacing:.5}}>File d'attente</div>
        <div style={{fontSize:52,fontWeight:900,margin:'4px 0',lineHeight:1}}>{file.length}</div>
        <div style={{fontSize:13,opacity:.8}}>{new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</div>
        <div style={{marginTop:12,display:'flex',gap:10}}>
          <div style={{background:'rgba(255,255,255,.12)',borderRadius:10,padding:'8px 14px',textAlign:'center',flex:1}}>
            <div style={{fontSize:18,fontWeight:900}}>{enCours.length}</div>
            <div style={{fontSize:10,opacity:.7}}>En cours</div>
          </div>
          <div style={{background:'rgba(255,255,255,.12)',borderRadius:10,padding:'8px 14px',textAlign:'center',flex:1}}>
            <div style={{fontSize:18,fontWeight:900}}>{attente.length}</div>
            <div style={{fontSize:10,opacity:.7}}>En attente</div>
          </div>
        </div>
      </div>

      {file.length === 0 ? (
        <Empty icon="🎉" title="File vide !" sub="Toutes les clientes ont été prises en charge." />
      ) : (
        <>
          {enCours.length > 0 && (<><div className="stitle">En cours</div>{enCours.map((r,i)=>(
            <div key={r.id} className="q-item">
              <div className="q-num on">{i+1}</div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{r.client_nom}</div><div style={{fontSize:11,color:'var(--gris)'}}>{r.prestations?.nom} · {r.coiffeuses?.nom}</div></div>
              <div style={{textAlign:'right'}}><div style={{fontSize:11,color:'var(--vm)',fontWeight:700}}>En cours 🟢</div><div style={{fontSize:11,color:'var(--gris)'}}>{r.heure}</div></div>
            </div>
          ))}</>)}

          <div className="stitle">En attente</div>
          {attente.map((r,i)=>(
            <div key={r.id} className="q-item">
              <div className="q-num">{i+1}</div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{r.client_nom}</div><div style={{fontSize:11,color:'var(--gris)'}}>{r.prestations?.nom} · {r.coiffeuses?.nom}</div></div>
              <div style={{textAlign:'right'}}><div style={{fontSize:12,fontWeight:700,color:'var(--or)'}}>~{(i+1)*30} min</div><div style={{fontSize:11,color:'var(--gris)'}}>{r.heure}</div></div>
            </div>
          ))}

          <div className="divider"/>
          <div className="stitle">Prévenir une cliente</div>
          {attente.map((r,i)=>(
            <div key={r.id} style={{margin:'0 16px 8px'}}>
              <Btn variant="wa" full onClick={()=>prevenir(r,(i+1)*30)}>💬 Prévenir {r.client_nom} (~{(i+1)*30} min)</Btn>
            </div>
          ))}
          {attente.length>0&&(
            <div style={{margin:'0 16px 10px'}}>
              <Btn variant="bx" full onClick={()=>passerEnCours(attente[0])}>🟢 Appeler {attente[0]?.client_nom} — c'est son tour</Btn>
            </div>
          )}
        </>
      )}
      <div style={{margin:'16px 16px 0',background:'var(--bx-p)',borderRadius:14,padding:'14px 16px',fontSize:13,color:'var(--bx)',fontWeight:600,lineHeight:1.6}}>
        💡 Les clientes prévenues attendent <strong>chez elles</strong>. Elles reviennent et elles recommandent.
      </div>
      <div className={`toast${toast.show?' show':''} ${toast.type}`}>{toast.msg}</div>
    </div>
  )
}
