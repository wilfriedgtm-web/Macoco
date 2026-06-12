import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, PHOTOS_DEFAUT } from '../../lib/supabase'

export default function Home() {
  const [salons, setSalons] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [ville, setVille] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('salons')
      .select('id, nom, slug, ville, adresse, cover_url, heures, description')
      .eq('vitrine_active', true)
      .order('created_at', { ascending: false })
    setSalons(data || [])
    setLoading(false)
  }

  const villes = [...new Set(salons.map(s => s.ville).filter(Boolean))]
  const filtered = salons.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.nom.toLowerCase().includes(q) || s.ville?.toLowerCase().includes(q)
    const matchVille = !ville || s.ville === ville
    return matchSearch && matchVille
  })

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', maxWidth: 430, margin: '0 auto' }}>

      {/* HEADER */}
      <div style={{ background: 'var(--bx)', padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>
              Ma'<span style={{ color: 'var(--or-l)' }}>coco</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>Trouvez votre salon ✂️</div>
          </div>
          <Link to="/app" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Mon salon →
          </Link>
        </div>

        {/* SEARCH BAR */}
        <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', padding: '16px 16px 0' }}>
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un salon..."
              style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontFamily: 'inherit', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* FILTRES VILLE */}
          {villes.length > 0 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
              <button onClick={() => setVille('')}
                style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: 'none', background: !ville ? 'var(--bx)' : 'var(--gl)', color: !ville ? '#fff' : 'var(--gris)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Tous
              </button>
              {villes.map(v => (
                <button key={v} onClick={() => setVille(ville === v ? '' : v)}
                  style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: 'none', background: ville === v ? 'var(--bx)' : 'var(--gl)', color: ville === v ? '#fff' : 'var(--gris)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LISTE */}
      <div style={{ padding: '0 16px 100px', background: 'var(--gl)' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
            <div className="spin" style={{ borderTopColor: 'var(--bx)', borderColor: 'var(--gl)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--gris)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✂️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--noir)', marginBottom: 6 }}>
              {salons.length === 0 ? "Aucun salon pour le moment" : "Aucun résultat"}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              {salons.length === 0 ? "Soyez le premier salon sur Ma'coco !" : "Essayez une autre recherche"}
            </div>
            {salons.length === 0 && (
              <Link to="/rejoindre" style={{ display: 'inline-block', marginTop: 16, background: 'var(--bx)', color: '#fff', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                Inscrire mon salon →
              </Link>
            )}
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gris)', textTransform: 'uppercase', letterSpacing: .6, margin: '16px 0 10px' }}>
              {filtered.length} salon{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
            </div>
            {filtered.map(s => (
              <Link key={s.id} to={`/book/${s.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}>
                <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
                  <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                    <img src={(s.cover_url || PHOTOS_DEFAUT.salon) + '?t=' + s.id} alt={s.nom}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.5))' }} />
                    <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>{s.nom}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', marginTop: 2 }}>📍 {s.ville}</div>
                      </div>
                      <div style={{ background: 'var(--vm)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20 }}>🟢 Ouvert</div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    {s.description && <div style={{ fontSize: 13, color: 'var(--gris)', lineHeight: 1.5, marginBottom: 10 }}>{s.description.slice(0, 80)}{s.description.length > 80 ? '…' : ''}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'var(--or-l)', fontSize: 12 }}>★★★★★</span>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>4.9</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gris)' }}>{s.heures || '8h–19h'}</div>
                      <div style={{ background: 'var(--bx)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 10 }}>
                        Réserver →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>

      {/* BOTTOM CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#fff', borderTop: '1px solid #e2e8f0', padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}>
        <Link to="/rejoindre" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--bx)', color: '#fff', padding: '13px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          ✂️ Inscrire mon salon gratuitement
        </Link>
      </div>
    </div>
  )
}
