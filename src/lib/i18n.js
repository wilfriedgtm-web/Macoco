// ═══════════════════════════════════════════
// MA'COCO — i18n vitrine (FR / EN)
// ═══════════════════════════════════════════
// Langue par établissement : salon.langue ('fr' | 'en')

export const LANGUES = { fr: 'Français', en: 'English' }

export const LOCALE_MAP = { fr: 'fr-FR', en: 'en-US' }

// ── TEXTES STATIQUES DE LA VITRINE ──
const STRINGS = {
  fr: {
    retour: '← Retour',
    salonIntrouvable: 'Salon introuvable',
    salonIntrouvableDesc: "Ce salon n'existe pas ou n'est plus actif.",
    retourAccueil: "← Retour à l'accueil",
    ouvert: '🟢 Ouvert',
    prestationsLbl: 'Prestations',
    whatsapp: 'WhatsApp',
    reserverMaintenant: '📅 Réserver maintenant',
    nosPrestations: 'Nos prestations',
    reserverPresta: (nom) => `Réserver ${nom}`,
    avisClientes: 'Avis clientes ★★★★★',
    proposePar: 'Propulsé par',
    tagline: "La réservation beauté au Cameroun",
    choisirPresta: 'Choisissez une prestation',
    reserverAu: (nom) => `Réserver au ${nom}`,
    prestationLbl: 'Prestation',
    dateLbl: 'Date',
    heureLbl: 'Heure',
    verifDispo: 'Vérification des disponibilités...',
    verification: 'Vérification...',
    choisirCreneau: '⚠️ Veuillez choisir un créneau disponible',
    continuer: (prix) => `Continuer → ${prix}`,
    recapitulatif: 'Récapitulatif',
    vosCoordonnees: 'Vos coordonnées',
    votrePrenom: 'Votre prénom *',
    placeholderPrenom: 'Ex : Aminata',
    whatsappLabel: 'WhatsApp *',
    placeholderTel: '6XX XXX XXX',
    messageOpt: 'Message (optionnel)',
    placeholderMsg: 'Précisions sur votre demande...',
    envoi: 'Envoi…',
    confirmerResa: '📅 Confirmer ma réservation',
    reserverWa: '💬 Réserver via WhatsApp',
    modifier: '← Modifier',
    demandeEnvoyee: 'Demande envoyée !',
    demandeRecue: (nom, salon) => `${nom}, votre demande au ${salon} a été reçue.`,
    salonVaConfirmer: 'Le salon va confirmer votre RDV par WhatsApp. Gardez votre téléphone à portée.',
    confirmerWa: '💬 Confirmer sur WhatsApp',
    retourSalon: 'Retour au salon',
    complet: 'Complet',
    auj: 'auj.',
    aujourdhui: "Aujourd'hui",
  },
  en: {
    retour: '← Back',
    salonIntrouvable: 'Salon not found',
    salonIntrouvableDesc: "This salon doesn't exist or is no longer active.",
    retourAccueil: '← Back to home',
    ouvert: '🟢 Open',
    prestationsLbl: 'Services',
    whatsapp: 'WhatsApp',
    reserverMaintenant: '📅 Book now',
    nosPrestations: 'Our services',
    reserverPresta: (nom) => `Book ${nom}`,
    avisClientes: 'Client reviews ★★★★★',
    proposePar: 'Powered by',
    tagline: 'Beauty booking in Cameroon',
    choisirPresta: 'Choose a service',
    reserverAu: (nom) => `Book at ${nom}`,
    prestationLbl: 'Service',
    dateLbl: 'Date',
    heureLbl: 'Time',
    verifDispo: 'Checking availability...',
    verification: 'Checking...',
    choisirCreneau: '⚠️ Please choose an available time slot',
    continuer: (prix) => `Continue → ${prix}`,
    recapitulatif: 'Summary',
    vosCoordonnees: 'Your details',
    votrePrenom: 'Your first name *',
    placeholderPrenom: 'E.g. Aminata',
    whatsappLabel: 'WhatsApp *',
    placeholderTel: '6XX XXX XXX',
    messageOpt: 'Message (optional)',
    placeholderMsg: 'Details about your request...',
    envoi: 'Sending…',
    confirmerResa: '📅 Confirm my booking',
    reserverWa: '💬 Book via WhatsApp',
    modifier: '← Edit',
    demandeEnvoyee: 'Request sent!',
    demandeRecue: (nom, salon) => `${nom}, your request at ${salon} has been received.`,
    salonVaConfirmer: 'The salon will confirm your appointment on WhatsApp. Keep your phone nearby.',
    confirmerWa: '💬 Confirm on WhatsApp',
    retourSalon: 'Back to salon',
    complet: 'Full',
    auj: 'today',
    aujourdhui: 'Today',
  },
}

export function tt(langue, key, ...args) {
  const dict = STRINGS[langue] || STRINGS.fr
  const entry = dict[key] ?? STRINGS.fr[key]
  return typeof entry === 'function' ? entry(...args) : entry
}

export function locale(langue) {
  return LOCALE_MAP[langue] || LOCALE_MAP.fr
}

// ── AVIS PAR DÉFAUT (si le salon n'a pas encore d'avis) ──
export const AVIS_DEFAUT = {
  fr: [
    { nom: 'Patience Ekambi', emoji: '👩🏿', bg: '#F9F0F2', presta: 'Tresse box braids', date: 'Il y a 3 jours', texte: '"Grâce est vraiment talentueuse ! Zéro attente, résultat magnifique 🙌"' },
    { nom: 'Diane Moukoko', emoji: '👩🏽', bg: '#FDF6E7', presta: 'Coupe + Brushing', date: 'Il y a 1 semaine', texte: '"Elles me préviennent quand c\'est mon tour. Je viens pile à l\'heure 😍"' },
    { nom: 'Solange Bello', emoji: '👩🏾', bg: '#f0fdf4', presta: 'Manucure', date: 'Il y a 2 semaines', texte: '"Les meilleurs ongles de Douala Akwa ! J\'ai réservé depuis chez moi ✨"' },
  ],
  en: [
    { nom: 'Patience Ekambi', emoji: '👩🏿', bg: '#F9F0F2', presta: 'Box braids', date: '3 days ago', texte: '"Grace is truly talented! Zero waiting, gorgeous result 🙌"' },
    { nom: 'Diane Moukoko', emoji: '👩🏽', bg: '#FDF6E7', presta: 'Cut + Blowout', date: '1 week ago', texte: '"They let me know when it\'s my turn. I show up right on time 😍"' },
    { nom: 'Solange Bello', emoji: '👩🏾', bg: '#f0fdf4', presta: 'Manicure', date: '2 weeks ago', texte: '"Best nails in Douala Akwa! I booked from home ✨"' },
  ],
}

// ── MESSAGES WHATSAPP (traduits selon la langue du salon) ──
export const wa = {
  // Cliente → salon : demande de réservation depuis la vitrine
  demandeResa: (langue, prestaNom, dateLabel, heure) => langue === 'en'
    ? `Hello, I'd like to book ${prestaNom || 'a service'} on ${dateLabel} at ${heure}. Thank you!`
    : `Bonjour, je voudrais réserver ${prestaNom || 'une prestation'} le ${dateLabel} à ${heure}. Merci !`,

  // Cliente → salon : demande envoyée, elle veut confirmer
  demandeConfirmation: (langue, prestaNom, heure) => langue === 'en'
    ? `Hello, I made a booking request for ${prestaNom} at ${heure}. Can you confirm?`
    : `Bonjour, j'ai fait une demande de RDV pour ${prestaNom} à ${heure}. Pouvez-vous confirmer ?`,

  // Cliente → salon : prise de RDV rapide depuis le bouton WhatsApp du header
  prendreRdv: (langue, salonNom) => langue === 'en'
    ? `Hello, I'd like to book an appointment at ${salonNom}.`
    : `Bonjour, je voudrais prendre un RDV au ${salonNom}.`,

  // Salon → cliente : confirmation d'un RDV (aujourd'hui)
  confirmationRdv: (langue, nom, salonNom, heure, prestaNom) => langue === 'en'
    ? `Hello ${nom}, your appointment at ${salonNom} is confirmed for today at ${heure}${prestaNom ? ' — ' + prestaNom : ''}. See you soon! ✂️`
    : `Bonjour ${nom}, votre rendez-vous au ${salonNom} est confirmé pour aujourd'hui à ${heure}${prestaNom ? ' — ' + prestaNom : ''}. À tout à l'heure ! ✂️`,

  // Salon → cliente : confirmation d'un RDV à venir (date précise)
  confirmationRdvDate: (langue, nom, salonNom, dateLabel, heure, prestaNom) => langue === 'en'
    ? `Hello ${nom}, your appointment at ${salonNom} is confirmed for ${dateLabel} at ${heure}${prestaNom ? ' — ' + prestaNom : ''}. See you soon! ✂️`
    : `Bonjour ${nom}, votre rendez-vous au ${salonNom} est confirmé pour le ${dateLabel} à ${heure}${prestaNom ? ' — ' + prestaNom : ''}. À bientôt ! ✂️`,

  // Salon → cliente : "c'est bientôt votre tour" (rappel rapide)
  cestBientotVotreTour: (langue, nom, salonNom) => langue === 'en'
    ? `Hello ${nom}, it's almost your turn at ${salonNom}! ✂️`
    : `Bonjour ${nom}, c'est bientôt votre tour au ${salonNom} ! ✂️`,

  // Salon → cliente : file d'attente, dans X minutes
  prevenirFileAttente: (langue, nom, salonNom, min) => langue === 'en'
    ? `Hello ${nom} 👋 It's almost your turn at ${salonNom} — in about ${min} minutes. You can come now! ✂️`
    : `Bonjour ${nom} 👋 C'est bientôt votre tour au ${salonNom} — dans environ ${min} minutes. Vous pouvez venir maintenant ! ✂️`,
}
