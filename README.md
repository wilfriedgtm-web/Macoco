# Ma'coco 💄

> Plus de clientes, moins d'attente.

App de gestion pour salons de coiffure en Afrique francophone.

## Stack
- React 18 + Vite
- Supabase (Auth + DB + Storage)
- React Router v6
- Vercel

## Setup rapide

### 1. Supabase
1. Créer un projet sur https://app.supabase.com
2. Exécuter `schema.sql` dans l'éditeur SQL
3. Créer 3 buckets Storage **publics** : `presta-photos`, `salon-covers`, `salon-logos`

### 2. Variables d'environnement
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Dev local
```bash
npm install
cp .env.example .env  # remplir les variables
npm run dev
```

### 4. Déploiement Vercel
1. Push sur GitHub
2. Connecter le repo sur Vercel
3. Ajouter les 3 variables d'environnement dans Settings > Environment Variables
4. Deploy

## URLs
- `/` → App gérant (login/dashboard)
- `/book/:slug` → Vitrine publique cliente
  Ex: `/book/salon-grace-x4k2`

## Fonctionnalités
- ✅ Auth (email/password)
- ✅ Onboarding salon en 2 étapes
- ✅ Dashboard RDV du jour
- ✅ File d'attente + notifications WhatsApp
- ✅ Planning hebdomadaire
- ✅ Catalogue de prestations avec photos
- ✅ Vitrine publique avec réservation en ligne
- ✅ Partage vitrine (WhatsApp, Instagram, Telegram, QR)
- ✅ Paramètres salon + gestion coiffeuses
