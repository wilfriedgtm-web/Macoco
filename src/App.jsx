import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { Spinner } from './components/UI'
import AuthScreen      from './pages/auth/AuthScreen'
import OnboardingScreen from './pages/auth/OnboardingScreen'
import Dashboard       from './pages/dashboard/Dashboard'
import Attente         from './pages/attente/Attente'
import Planning        from './pages/planning/Planning'
import Catalogue       from './pages/catalogue/Catalogue'
import Parametres      from './pages/parametres/Parametres'
import Vitrine         from './pages/vitrine/Vitrine'
import './styles/global.css'

const TABS = [
  { id: 'dashboard', label: 'Accueil',  icon: '🏠' },
  { id: 'attente',   label: 'Attente',  icon: '⏱️' },
  { id: 'planning',  label: 'Planning', icon: '📅' },
  { id: 'catalogue', label: 'Services', icon: '💄' },
  { id: 'parametres',label: 'Réglages', icon: '⚙️' },
]

function Splash() {
  return (
    <div className="splash">
      <div className="splash-logo">Ma'<span>coco</span></div>
      <div className="splash-tag">Plus de clientes, moins d'attente.</div>
      <div className="splash-dots">
        <div className="splash-dot"/><div className="splash-dot"/><div className="splash-dot"/>
      </div>
    </div>
  )
}

function AppInner() {
  const { session, salon, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (loading) return <Splash />
  if (!session) return <AuthScreen />
  if (session && !salon) return <OnboardingScreen />

  const goTo = (tab) => setActiveTab(tab)

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':  return <Dashboard onGoTo={goTo} />
      case 'attente':    return <Attente />
      case 'planning':   return <Planning />
      case 'catalogue':  return <Catalogue />
      case 'parametres': return <Parametres />
      default: return null
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="hdr">
        <div>
          <div className="hdr-logo">Ma'<span>coco</span></div>
          <div className="hdr-sub">✂️ {salon.nom} · {salon.ville}</div>
        </div>
        <div className="hdr-actions">
          <button className="icon-btn" onClick={() => window.open(`/book/${salon.slug}`, '_blank')}>🌐</button>
        </div>
      </div>

      {/* PAGE */}
      {renderPage()}

      {/* NAV */}
      <nav className="nav">
        {TABS.map(t => (
          <button key={t.id} className={`nav-btn${activeTab === t.id ? ' on' : ''}`} onClick={() => setActiveTab(t.id)}>
            <span className="ni">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/book/:slug" element={<Vitrine />} />
          <Route path="/*" element={<AppInner />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
