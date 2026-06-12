import { useState, useEffect } from 'react'
import { supabase, formatPrix } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Btn, Modal, Input, Select, Spinner } from '../../components/UI'
import { useToast } from '../../hooks/useToast'

function getWeekDates() {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i)
    return { iso: d.toISOString().split('T')[0], dn: d.toLocaleDateString('fr-FR',{weekday:'short'}).slice(0,3), dd: d.getDate().toString(), isToday: d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] }
  })
}
const CM = { en_attente:'or', confirme:'bx', en_cours:'bl', fait:'gr' }
const HH = ['08h00','08h30','09h00','09h30','10h00','10h30','11h00','11h30','12h00','13h00','14h00','14h30','15h00','15h30','16h00','16h30','17h00','17h30','18h00'].map(h=>({value:h,label:h}))

export default function Planning() {
  const { salon } = useAuth()
  const { toast, showToast } = useToast()
  const [dates] = useState(getWeekDates)
  const [active, setActive] = useState(() => { const t = getWeekDates(); return t.find(d=>d.isToday)?.iso || t[0]?.iso })
  const [rdvs, setRdvs] = useState([])
  const [presta, setPresta] = useState([])
  const [coifs, setCoifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [fNom,setFNom]=useState(''); const [fTel,setFTel]=useState(''); const [fP,setFP]=useState(''); const [fH,setFH]=useState('09h00'); const [fC,setFC]=useState(''); const [saving,setSaving]=useState(false)

  useEffect(()=>{ if(salon) loadMeta() },[salon])
  useEffect(()=>{ if(salon&&active) loadRdvs() },[salon,active])

  async function loadMeta() {
    const [{data:p},{data:c}] = await Promise.all([
      supabase.from('prestations').select('*').eq('salon_id',salon.id).eq('actif',true),
      supabase.from('coiffeuses').select('*').eq('salon_id',salon.id).eq('actif',true),
    ])
    setPresta(p||[]); setCoifs(c||[])
    if(p?.length) setFP(p[0].id); if(c?.length) setFC(c[0].id)
  }

  async function loadRdvs() {
    setLoading(true)
    const {data} = await supabase.from('rendez_vous').select('*,prestations(nom,prix),coiffeuses(nom)').eq('salon_id',salon.id).eq('date',active).order('heure')
    setRdvs(data||[]); setLoading(false)
  }

  async function create() {
    if(!fNom.trim()){showToast('Nom requis','err');return}
    setSaving(true)
    const pi = presta.find(p=>p.id===fP)
    await supabase.from('rendez_vous').insert({salon_id:salon.id,prestation_id:fP||null,coiffeuse_id:fC||null,client_nom:fNom.trim(),client_tel:fTel.trim(),date:active,heure:fH,statut:'en_attente',montant:pi?.prix||0})
    setSaving(false); showToast(`✓ RDV créé pour ${fNom}`,'ok'); setOpen(false); setFNom(''); setFTel(''); loadRdvs()
  }

  const dateLabel = active ? new Date(active).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'}) : ''

  return (
    <div className="page">
      <div className="date-strip">
        {dates.map(d=>(
          <button key={d.iso} className={`dpill${active===d.iso?' on':''}`} onClick={()=>setActive(d.iso)}>
            <span className="dn">{d.dn}</span><span className="dd">{d.dd}</span>
            {d.isToday&&<div className="dot"/>}
          </button>
        ))}
      </div>
      <div className="stitle">{dateLabel} · {rdvs.length} RDV</div>
      {loading?<Spinner/>:rdvs.length===0?(
        <div style={{textAlign:'center',padding:'32px 16px',color:'var(--gris)'}}>
          <div style={{fontSize:32,marginBottom:8}}>📅</div>
          <div style={{fontSize:14,fontWeight:600}}>Aucun RDV ce jour</div>
        </div>
      ):(
        <div style={{padding:'0 16px'}}>
          <div className="tl">
            {rdvs.map((r,i)=>(
              <div key={r.id} className="tl-slot" style={{marginTop:i>0?10:0}}>
                <div className="tl-hour">{r.heure}</div><div className="tl-line"/>
                <div className={`tl-block ${CM[r.statut]||'or'}`} onClick={()=>showToast(`${r.client_nom} · ${r.heure}`)}>
                  <div className="tl-nom">{r.client_nom}</div>
                  <div className="tl-svc">{r.prestations?.nom} · {formatPrix(r.montant)}</div>
                  <div className="tl-coif">✂️ {r.coiffeuses?.nom} · {r.statut==='en_cours'?'En cours 🟢':r.statut==='fait'?'Terminé ✓':'En attente'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{margin:'16px 16px 0'}}><Btn variant="bx" full onClick={()=>setOpen(true)}>+ Nouveau RDV</Btn></div>
      <Modal open={open} onClose={()=>setOpen(false)} title="Nouveau RDV" sub={dateLabel}>
        <Input label="Nom *" value={fNom} onChange={setFNom} placeholder="Ex : Fatima Ngando"/>
        <Input label="Téléphone" value={fTel} onChange={setFTel} type="tel" placeholder="+237 6XX XXX XXX"/>
        {presta.length>0&&<Select label="Prestation" value={fP} onChange={setFP} options={presta.map(p=>({value:p.id,label:`${p.nom} — ${formatPrix(p.prix)}`}))}/>}
        <Select label="Heure" value={fH} onChange={setFH} options={HH}/>
        {coifs.length>0&&<Select label="Coiffeuse" value={fC} onChange={setFC} options={coifs.map(c=>({value:c.id,label:'✂️ '+c.nom}))}/>}
        <Btn variant="bx" full disabled={saving} onClick={create} style={{marginBottom:8}}>{saving?'Création…':'Créer le RDV'}</Btn>
        <Btn variant="ghost" full onClick={()=>setOpen(false)}>Annuler</Btn>
      </Modal>
      <div className={`toast${toast.show?' show':''} ${toast.type}`}>{toast.msg}</div>
    </div>
  )
}
