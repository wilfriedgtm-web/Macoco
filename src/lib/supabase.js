import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ── CONSTANTES COULEURS ──
export const C = {
  bordeaux: '#6B1A2A',
  bordeauxLight: '#8B2A3E',
  bordeauxPale: '#F9F0F2',
  or: '#C9962A',
  orLight: '#E8B84B',
  orPale: '#FDF6E7',
  noir: '#1A0A0E',
  gris: '#64748b',
  grisLight: '#f1f5f9',
  blanc: '#ffffff',
  vert: '#166534',
  vertPale: '#f0fdf4',
  vertMid: '#22c55e',
}

// ── PHOTOS AFRICAINES RÉALISTES (Unsplash) ──
export const PHOTOS_DEFAUT = {
  braids:   'https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?w=800&q=85',
  coupe:    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=85',
  manu:     'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85',
  defri:    'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=85',
  cils:     'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800&q=85',
  salon:    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85',
  default:  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=85',
}

// ── SLUG GENERATOR ──
export function genSlug(nom) {
  return nom
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).slice(2, 6)
}

// ── HELPERS ──
export function formatPrix(n) {
  return n?.toLocaleString('fr') + ' F'
}

export function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function today() {
  return new Date().toISOString().split('T')[0]
}

export function waLink(tel, msg) {
  const clean = tel?.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`
}

// ── STATUTS ──
export const STATUTS = {
  en_attente: { label: 'En attente', cls: 'wait',  color: '#9a3412', bg: '#fff7ed' },
  confirme:   { label: 'Confirmé',   cls: 'ok',    color: '#166534', bg: '#f0fdf4' },
  en_cours:   { label: 'En cours',   cls: 'cours', color: '#1d4ed8', bg: '#eff6ff' },
  fait:       { label: 'Terminé',    cls: 'done',  color: '#64748b', bg: '#f1f5f9' },
  annule:     { label: 'Annulé',     cls: 'annul', color: '#991b1b', bg: '#fef2f2' },
}

export const HEURES = ['08h00','08h30','09h00','09h30','10h00','10h30','11h00','11h30',
  '12h00','12h30','13h00','13h30','14h00','14h30','15h00','15h30',
  '16h00','16h30','17h00','17h30','18h00','18h30','19h00']
