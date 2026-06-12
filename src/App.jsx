import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { Spinner } from './components/UI'
import AuthScreen       from './pages/auth/AuthScreen'
import OnboardingScreen from './pages/auth/OnboardingScreen'
import Dashboard        from './pages/dashboard/Dashboard'
import Attente          from './pages/attente/Attente'
import Planning         from './pages/planning/Planning'
import Catalogue        from './pages/catalogue/Catalogue'
import Parametres       from './pages/parametres/Parametres'
import Vitrine          from './pages/vitrine/Vitrine'
import Home             from './pages/home/Home'
import Rejoindre        from './pages/rejoindre/Rejoindre'
import Salons          from './pages/rejoindre/Rejoindre'
import './styles/global.css'

const TABS = [
  { id: 'dashboard',  label: 'Accueil',  icon: '🏠' },
  { id: 'attente',    label: 'Attente',  icon: '⏱️' },
  { id: 'planning',   label: 'Planning', icon: '📅' },
  { id: 'catalogue',  label: 'Services', icon: '💄' },
  { id: 'parametres', label: 'Réglages', icon: '⚙️' },
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

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':  return <Dashboard onGoTo={setActiveTab} />
      case 'attente':    return <Attente />
      case 'planning':   return <Planning />
      case 'catalogue':  return <Catalogue />
      case 'parametres': return <Parametres />
      default: return null
    }
  }

  return (
    <div>
      <div className="hdr">
        <div>
          <div className="hdr-logo">Ma'<span>coco</span></div>
          <div className="hdr-sub">✂️ {salon.nom} · {salon.ville}</div>
        </div>
        <div className="hdr-actions">
          <button className="icon-btn" onClick={() => window.open(`/book/${salon.slug}`, '_blank')}>🌐</button>
        </div>
      </div>

      {renderPage()}

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

function AppWrapper() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PAGES PUBLIQUES */}
        <Route path="/"           element={<Home />} />
        <Route path="/rejoindre"  element={<Rejoindre />} />
        <Route path="/salons"     element={<Rejoindre />} />
        <Route path="/book/:slug" element={<Vitrine />} />

        {/* APP GÉRANT */}
        <Route path="/app/*" element={<AppWrapper />} />

        {/* REDIRECT ancienne route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
