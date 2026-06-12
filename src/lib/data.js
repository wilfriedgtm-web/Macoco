// ── PHOTOS AFRICAINES RÉALISTES ──
// Sources : Unsplash, photos de vraies coiffures africaines

export const PHOTOS = {
  salon: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85',
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=85',
    'https://images.unsplash.com/photo-1634896941598-b6b500a502a7?w=800&q=85',
  ],
  braids: [
    'https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?w=800&q=85',
    'https://images.unsplash.com/photo-1634896941598-b6b500a502a7?w=800&q=85',
    'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=85',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85',
  ],
  coupe: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=85',
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=85',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85',
  ],
  manu: [
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85&sat=20',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85&bri=10',
  ],
  defrisage: [
    'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=85',
    'https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?w=800&q=85',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85',
  ],
  cils: [
    'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800&q=85',
    'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800&q=85&sat=15',
    'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800&q=85&bri=5',
  ],
}

// ── PRESTATIONS ──
export const PRESTATIONS = [
  {
    id: 'braids',
    nom: 'Tresse Box Braids',
    prix: 5000,
    duree: '~3h',
    icon: '🪢',
    coiffeuse: 'Grâce',
    note: 4.9,
    nbAvis: 48,
    description: 'Tresses africaines longue durée qui protègent et subliment vos cheveux. Finitions soignées, style moderne adapté à toutes les longueurs.',
    photos: PHOTOS.braids,
    cover: PHOTOS.braids[0],
  },
  {
    id: 'coupe',
    nom: 'Coupe + Brushing',
    prix: 3500,
    duree: '~1h',
    icon: '✂️',
    coiffeuse: 'Sandrine',
    note: 4.8,
    nbAvis: 35,
    description: 'Coupe personnalisée selon votre morphologie, suivie d\'un brushing lisse ou bouclé. Résultat professionnel garanti.',
    photos: PHOTOS.coupe,
    cover: PHOTOS.coupe[0],
  },
  {
    id: 'manu',
    nom: 'Manucure complète',
    prix: 2500,
    duree: '~45min',
    icon: '💅',
    coiffeuse: 'Sandrine',
    note: 5.0,
    nbAvis: 62,
    description: 'Soin complet des ongles : lime, cuticules, base coat, vernis longue tenue. Large choix de couleurs OPI et Essie disponibles.',
    photos: PHOTOS.manu,
    cover: PHOTOS.manu[0],
  },
  {
    id: 'defrisage',
    nom: 'Soin Défrisage',
    prix: 8000,
    duree: '~2h',
    icon: '🧴',
    coiffeuse: 'Grâce',
    note: 4.9,
    nbAvis: 29,
    description: 'Défrisage doux avec produits premium respectueux du cheveu. Soin nutritif inclus. Résultat lisse, brillant et durable.',
    photos: PHOTOS.defrisage,
    cover: PHOTOS.defrisage[0],
  },
  {
    id: 'cils',
    nom: 'Pose de cils',
    prix: 6000,
    duree: '~1h30',
    icon: '👁️',
    coiffeuse: 'Sandrine',
    note: 4.7,
    nbAvis: 21,
    description: 'Pose de cils volume naturel ou dramatique selon votre souhait. Résultat qui dure 3 à 4 semaines. Retouche disponible.',
    photos: PHOTOS.cils,
    cover: PHOTOS.cils[0],
  },
]

// ── RDV DU JOUR ──
export const RDV_JOUR = [
  { id: 'rdv1', nom: 'Aminata Fouda',    emoji: '👩🏿', svc: 'Tresse Box Braids', heure: '09h00', coiffeuse: 'Grâce',    statut: 'ok',   prix: 5000, tel: '237677112233' },
  { id: 'rdv2', nom: 'Sandrine Mballa',  emoji: '👩🏽', svc: 'Coupe + Brushing',  heure: '11h30', coiffeuse: 'Sandrine', statut: 'wait', prix: 3500, tel: '237699445566' },
  { id: 'rdv3', nom: 'Marie-Claire Ngo', emoji: '👩🏾', svc: 'Soin Défrisage',    heure: '14h00', coiffeuse: 'Grâce',    statut: 'wait', prix: 8000, tel: '237655778899' },
  { id: 'rdv4', nom: 'Cécile Biya',      emoji: '👩🏿', svc: 'Manucure complète', heure: '08h00', coiffeuse: 'Sandrine', statut: 'done', prix: 2500, tel: '237677001122' },
]

// ── AVIS CLIENTS ──
export const AVIS = [
  {
    nom: 'Patience Ekambi',
    emoji: '👩🏿',
    bg: '#F9F0F2',
    prestation: 'Tresse box braids',
    date: 'Il y a 3 jours',
    note: 5,
    texte: '"Grâce est vraiment talentueuse ! J\'avais réservé via WhatsApp, elle m\'a répondu en 2 minutes. Je suis venue à l\'heure pile, zéro attente. Résultat magnifique 🙌"',
  },
  {
    nom: 'Diane Moukoko',
    emoji: '👩🏽',
    bg: '#FDF6E7',
    prestation: 'Coupe + Brushing',
    date: 'Il y a 1 semaine',
    note: 5,
    texte: '"Avant j\'attendais toujours 1h30 minimum. Maintenant elles me préviennent sur WhatsApp quand c\'est bientôt mon tour. Je viens juste à l\'heure, c\'est parfait 😍"',
  },
  {
    nom: 'Solange Bello',
    emoji: '👩🏾',
    bg: '#f0fdf4',
    prestation: 'Manucure complète',
    date: 'Il y a 2 semaines',
    note: 5,
    texte: '"Sandrine fait les meilleurs ongles de tout Douala Akwa ! J\'ai réservé depuis chez moi, c\'est tellement pratique. Je recommande à toutes mes amies ✨"',
  },
  {
    nom: 'Christelle Mvondo',
    emoji: '👩🏿',
    bg: '#eff6ff',
    prestation: 'Soin Défrisage',
    date: 'Il y a 3 semaines',
    note: 5,
    texte: '"Le défrisage le plus doux que j\'aie jamais fait. Mes cheveux brillent encore après 3 semaines. Et le salon est propre, l\'accueil est chaleureux 💆🏿‍♀️"',
  },
]

export const SALON = {
  nom: 'Salon Grâce',
  slug: 'salon-grace',
  ville: 'Douala Akwa',
  adresse: 'Rue Joss 14, Douala Akwa',
  tel: '237677112233',
  heures: '8h – 19h · Lun–Sam',
  note: 4.9,
  nbAvis: 127,
  cover: PHOTOS.salon[0],
  description: 'Le salon de référence de Douala Akwa pour toutes vos coiffures. Équipe professionnelle, produits de qualité, zéro attente grâce à notre système de réservation.',
}
