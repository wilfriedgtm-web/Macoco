import { useState, useEffect } from 'react'

export function Toast({ msg, type, show }) {
  return <div className={`toast${show ? ' show' : ''}${type ? ' ' + type : ''}`}>{msg}</div>
}

export function Modal({ open, onClose, title, sub, children }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className={`modal-ov${open ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose?.() }}>
      <div className="modal-sh">
        <div className="modal-handle"/>
        {title && <div className="modal-title">{title}</div>}
        {sub && <div className="modal-sub">{sub}</div>}
        {children}
      </div>
    </div>
  )
}

export function Gallery({ open, photos = [], startIdx = 0, label = '', onClose }) {
  const [idx, setIdx] = useState(startIdx)
  useEffect(() => { if (open) setIdx(startIdx) }, [open, startIdx])
  if (!open || !photos.length) return null
  return (
    <div className="gal-ov open">
      <button className="gal-close" onClick={onClose}>✕</button>
      <img className="gal-img" src={photos[idx]} alt=""/>
      <div className="gal-thumbs">
        {photos.map((src, i) => (
          <img key={i} src={src} className={`gal-thumb${i === idx ? ' on' : ''}`} onClick={() => setIdx(i)} alt=""/>
        ))}
      </div>
      <div style={{color:'rgba(255,255,255,.5)',fontSize:12,marginTop:12}}>{label} · {idx+1}/{photos.length}</div>
    </div>
  )
}

export function Badge({ statut }) {
  const map = {en_attente:['wait','En attente'],confirme:['ok','Confirmé'],en_cours:['cours','En cours'],fait:['done','Terminé'],annule:['annul','Annulé']}
  const [cls,label] = map[statut] || ['wait', statut]
  return <span className={`badge ${cls}`}>{label}</span>
}

export function Btn({ children, variant='bx', full, sm, onClick, disabled, style, type='button' }) {
  return (
    <button type={type} disabled={disabled} style={style}
      className={`btn btn-md${sm?' btn-sm':''} btn-${variant}${full?' btn-full':''}`}
      onClick={onClick}>
      {children}
    </button>
  )
}

export function Input({ label, value, onChange, type='text', placeholder, required }) {
  return (
    <div className="fg">
      {label && <label className="lbl">{label}{required&&' *'}</label>}
      <input className="inp" type={type} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required}/>
    </div>
  )
}

export function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div className="fg">
      {label && <label className="lbl">{label}</label>}
      <textarea className="inp" value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
    </div>
  )
}

export function Select({ label, value, onChange, options=[] }) {
  return (
    <div className="fg">
      {label && <label className="lbl">{label}</label>}
      <select className="inp" value={value||''} onChange={e=>onChange(e.target.value)}>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function Spinner({ full }) {
  if (full) return <div style={{minHeight:'100dvh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bx)'}}><div className="spin"/></div>
  return <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:48}}><div className="spin" style={{borderTopColor:'var(--bx)',borderColor:'var(--gl)'}}/></div>
}

export function Empty({ icon='📋', title, sub, action, onAction }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {sub && <div className="empty-sub">{sub}</div>}
      {action && <Btn onClick={onAction} style={{marginTop:16}}>{action}</Btn>}
    </div>
  )
}
