export type ServiceData = {
    id: string
    title: string
    description: string
    fullPrice: number
    durationMin: number
    image: string
    features: string[]
}

export const SERVICES_DB: Record<string, ServiceData> = {
    // =========================
    // MENÚ EXPRESS - 30 MIN
    // =========================
    'masaje-espalda-30': {
        id: 'masaje-espalda-30',
        title: 'Masaje de Espalda (30 min)',
        description:
            'Sesión enfocada en liberar tensión en el cuello, hombros y espalda.',
        fullPrice: 55,
        durationMin: 30,
        image: '/book/masaje-relajante.png', // puedes repetir imagen
        features: ['Cuello', 'Hombros', 'Espalda', 'Alivio de tensión'],
    },

    'reflexologia-30': {
        id: 'reflexologia-30',
        title: 'Reflexología (30 min)',
        description:
            'Enfoque en pantorrillas y pies para liberar tensión y dar sensación de ligereza.',
        fullPrice: 49,
        durationMin: 30,
        image: '/book/reflexologia.png',
        features: ['Pies', 'Pantorrillas', 'Relajación rápida'],
    },

    // =========================
    // MENÚ PREMIUM - 60 MIN
    // =========================
    'reflexologia-60': {
        id: 'reflexologia-60',
        title: 'Reflexología (60 min)',
        description:
            'Estimulación de puntos reflejos y liberación de tensión en pantorrillas.',
        fullPrice: 69,
        durationMin: 60,
        image: '/book/reflexologia.png',
        features: ['Puntos reflejos', 'Pantorrillas', 'Relajación profunda'],
    },

    'masaje-relajante-60': {
        id: 'masaje-relajante-60',
        title: 'Masaje Relajante (60 min)',
        description:
            'Relajación de cuerpo completo para soltar tensión física y mental.',
        fullPrice: 79,
        durationMin: 60,
        image: '/book/masaje-relajante.png',
        features: ['Cuerpo completo', 'Estrés', 'Presión suave a media'],
    },

    'combo-con-espalda-60': {
        id: 'combo-con-espalda-60',
        title: 'Combo con Espalda (60 min)',
        description:
            'Sesión combinada con enfoque en pies, pantorrillas, cabeza, manos y espalda.',
        fullPrice: 79,
        durationMin: 60,
        image: '/book/masaje-relajante.png', // puedes repetir
        features: ['Feet', 'Calves', 'Head', 'Hands', 'Back'],
    },

    'masaje-terapeutico-60': {
        id: 'masaje-terapeutico-60',
        title: 'Masaje Terapéutico (60 min)',
        description:
            'Enfoque clínico en dolor con apoyo de equipos terapéuticos.',
        fullPrice: 89,
        durationMin: 60,
        image: '/book/deep-tissue.png', // puedes repetir
        features: ['Dolor', 'Enfoque clínico', 'Soporte terapéutico'],
    },

    'tejido-profundo-60': {
        id: 'tejido-profundo-60',
        title: 'Tejido Profundo (60 min)',
        description:
            'Masaje profundo para liberar nudos crónicos.',
        fullPrice: 89,
        durationMin: 60,
        image: '/book/deep-tissue.png',
        features: ['Presión firme', 'Nudos crónicos', 'Recuperación muscular'],
    },

    // =========================
    // MENÚ DELUXE - 90 MIN
    // =========================
    'reflexologia-90': {
        id: 'reflexologia-90',
        title: 'Reflexología (90 min)',
        description:
            'Estimulación de puntos reflejos y liberación de tensión en pantorrillas.',
        fullPrice: 99,
        durationMin: 90,
        image: '/book/reflexologia.png',
        features: ['Puntos reflejos', 'Pantorrillas', 'Sesión extendida'],
    },

    'masaje-relajante-90': {
        id: 'masaje-relajante-90',
        title: 'Masaje Relajante (90 min)',
        description:
            'Relajación de cuerpo completo para liberar tensión física y mental.',
        fullPrice: 119,
        durationMin: 90,
        image: '/book/masaje-relajante.png',
        features: ['Cuerpo completo', 'Relajación profunda', 'Estrés acumulado'],
    },

    'combo-con-espalda-90': {
        id: 'combo-con-espalda-90',
        title: 'Combo con Espalda (90 min)',
        description:
            'Sesión combinada con enfoque en pies, pantorrillas, cabeza y manos.',
        fullPrice: 119,
        durationMin: 90,
        image: '/book/masaje-relajante.png', // puedes repetir
        features: ['Feet', 'Calves', 'Head', 'Hands'],
    },

    'masaje-terapeutico-90': {
        id: 'masaje-terapeutico-90',
        title: 'Masaje Terapéutico (90 min)',
        description:
            'Enfoque clínico en dolor con apoyo de equipos terapéuticos.',
        fullPrice: 129,
        durationMin: 90,
        image: '/book/deep-tissue.png', // puedes repetir
        features: ['Dolor', 'Enfoque clínico', 'Trabajo por zonas'],
    },

    'tejido-profundo-90': {
        id: 'tejido-profundo-90',
        title: 'Tejido Profundo (90 min)',
        description:
            'Masaje intenso para liberar nudos crónicos internos.',
        fullPrice: 129,
        durationMin: 90,
        image: '/book/deep-tissue.png',
        features: ['Presión firme', 'Nudos internos', 'Alivio duradero'],
    },

    // =========================
    // (Opcional) ALIAS por si ya tenías slugs viejos en URLs
    // Si NO los necesitas, bórralos.
    // =========================
    'deep-tissue-60': {
        id: 'deep-tissue-60',
        title: 'Tejido Profundo (60 min)',
        description: 'Masaje profundo para liberar nudos crónicos.',
        fullPrice: 89,
        durationMin: 60,
        image: '/book/deep-tissue.png',
        features: ['Presión firme', 'Nudos crónicos', 'Recuperación muscular'],
    },
    'deep-tissue-90': {
        id: 'deep-tissue-90',
        title: 'Tejido Profundo (90 min)',
        description: 'Masaje intenso para liberar nudos crónicos internos.',
        fullPrice: 129,
        durationMin: 90,
        image: '/book/deep-tissue.png',
        features: ['Presión firme', 'Nudos internos', 'Alivio duradero'],
    },
    'full-reflexologia-detox-90': {
        id: 'full-reflexologia-detox-90',
        title: 'Reflexología (90 min)',
        description:
            'Estimulación de puntos reflejos y liberación de tensión en pantorrillas.',
        fullPrice: 99,
        durationMin: 90,
        image: '/book/reflexologia.png',
        features: ['Puntos reflejos', 'Pantorrillas', 'Sesión extendida'],
    },
}

// ✅ getService limpio (sin doble if)
export function getService(slug: string | null) {
    if (!slug) return SERVICES_DB['masaje-relajante-60'] // default
    return SERVICES_DB[slug] ?? null
}
