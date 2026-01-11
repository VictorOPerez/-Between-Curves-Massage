export type ServiceData = {
    id: string;
    title: string;
    description: string;
    fullPrice: number;
    durationMin: number;
    image: string; // URL de la imagen
    features: string[];
}

export const SERVICES_DB: Record<string, ServiceData> = {
    // --- RELAJANTES ---
    'masaje-relajante-60': {
        id: 'masaje-relajante-60', // ID limpio
        title: 'Masaje Relajante (60 min)',
        description:
            'Un masaje suave a medio enfocado en liberar estrés, relajar músculos y mejorar el bienestar general en nuestra cabina de relajación.',
        fullPrice: 100,
        durationMin: 60,
        image: '/book/masaje-relajante.png',
        features: ['Alivio del estrés', 'Mejora la circulación', 'Presión suave a media'],
    },

    'masaje-relajante-90': {
        id: 'masaje-relajante-90', // ID limpio
        title: 'Masaje Relajante (90 min)',
        description:
            'Sesión extendida para una relajación más profunda: trabajo completo de cuerpo, respiración y descarga de tensión acumulada en un ambiente controlado.',
        fullPrice: 140,
        durationMin: 90,
        image: '/book/masaje-relajante.png',
        features: ['Relajación profunda', 'Descarga de tensión', 'Ideal para estrés crónico'],
    },

    'masaje-relajante-120': {
        id: 'masaje-relajante-120',
        title: 'Masaje Relajante (120 min)',
        description:
            'Ritual completo de relajación para desconectar del mundo exterior. Perfecto si llevas semanas con tensión acumulada.',
        fullPrice: 180,
        durationMin: 120,
        image: '/book/masaje-relajante.png',
        features: ['Máxima relajación', 'Sesión premium', 'Cuerpo completo'],
    },

    // --- DEEP TISSUE ---
    'deep-tissue-60': {
        id: 'deep-tissue-60', // ID limpio
        title: 'Deep Tissue Massage (60 min)',
        description:
            'Trabajo terapéutico de presión firme en capas profundas del músculo. Realizado por expertos para tratar contracturas y rigidez.',
        fullPrice: 120,
        durationMin: 60,
        image: '/book/deep-tissue.png',
        features: ['Presión firme', 'Libera contracturas', 'Recuperación muscular'],
    },

    'deep-tissue-90': {
        id: 'deep-tissue-90', // ID limpio
        title: 'Deep Tissue Massage (90 min)',
        description:
            'Sesión extendida para trabajar zonas específicas con más detalle (espalda, cuello, hombros, piernas) utilizando técnicas profundas.',
        fullPrice: 160,
        durationMin: 90,
        image: '/book/deep-tissue.png',
        features: ['Terapéutico profundo', 'Enfoque por zonas', 'Alivio duradero'],
    },

    // --- REDUCTOR / MOLDEADOR ---
    'masaje-reductor-moldeador': {
        id: 'masaje-reductor-moldeador',
        title: 'Masaje Reductor / Moldeador',
        description:
            'Técnica estética enfocada en moldear la figura, mejorar la apariencia de la piel y apoyar el drenaje linfático.',
        fullPrice: 95,
        durationMin: 60,
        image: '/book/masaje-reductor-moldeador.png',
        features: ['Moldear y definir', 'Mejora apariencia', 'Apoyo al drenaje'],
    },

    // --- PAQUETES ---
    'paquete-6-sesiones': {
        id: 'paquete-6-sesiones',
        title: 'Paquete de 6 Sesiones',
        description:
            'Paquete ideal para progreso consistente en nuestro spa. Recomendado para objetivos de moldeado y mantenimiento.',
        fullPrice: 515,
        durationMin: 60,
        image: '/book/paquete-6-sesiones.png',
        features: ['Ahorro por paquete', 'Plan consistente', 'Resultados acumulativos'],
    },

    'paquete-10-sesiones': {
        id: 'paquete-10-sesiones',
        title: 'Paquete de 10 Sesiones',
        description:
            'Paquete recomendado para objetivos más ambiciosos. Ideal para crear una rutina de bienestar en tus visitas.',
        fullPrice: 810,
        durationMin: 60,
        image: '/book/paquete-6-sesiones.png',
        features: ['Mejor valor', 'Ideal para metas', 'Seguimiento de progreso'],
    },

    'paquete-12-sesiones': {
        id: 'paquete-12-sesiones',
        title: 'Paquete de 12 Sesiones',
        description:
            'Paquete premium para máxima consistencia. Transforma tu cuerpo y mente con un plan completo.',
        fullPrice: 935,
        durationMin: 60,
        image: '/book/paquete-6-sesiones.png',
        features: ['Plan completo', 'Mejor consistencia', 'Resultados sostenidos'],
    },

    // --- REFLEXOLOGÍA ---
    'reflexologia-60': {
        id: 'reflexologia-60',
        title: 'Reflexología (60 min)',
        description:
            'Terapia relajante centrada en puntos reflejos del pie para aliviar tensión y estrés en un entorno tranquilo.',
        fullPrice: 75,
        durationMin: 60,
        image: '/book/reflexologia.png',
        features: ['Relajación profunda', 'Alivio de estrés', 'Equilibrio general'],
    },

    'full-reflexologia-detox-90': {
        id: 'full-reflexologia-detox-90',
        title: 'Full Reflexología Detox (90 min)',
        description:
            'Ritual integral enfocado en relajación, descarga y sensación de ligereza total.',
        fullPrice: 110,
        durationMin: 90,
        image: '/book/reflexologia.png',
        features: ['Ritual detox', 'Sesión extendida', 'Ligereza y bienestar'],
    },
};

// En lib/services.ts

export function getService(slug: string | null) {
    // 👇 Cambia esto por uno de tus nuevos IDs, por ejemplo el relajante de 60 min
    if (!slug) return SERVICES_DB['masaje-relajante-60'];

    // O mejor aún, hazlo dinámico para que nunca falle:
    // Si no hay slug, devuelve EL PRIMER servicio de la lista nueva
    if (!slug) {
        const keys = Object.keys(SERVICES_DB);
        return SERVICES_DB[keys[0]];
    }

    return SERVICES_DB[slug] || null;
}

