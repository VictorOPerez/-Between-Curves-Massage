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
    'masaje-sueco': {
        id: 'masaje-sueco',
        title: 'Masaje Sueco Relajante',
        description: 'La técnica clásica europea diseñada para relajar todo el cuerpo mediante el roce de los músculos con movimientos largos y deslizantes.',
        fullPrice: 100,
        durationMin: 60,
        image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop',
        features: ['Alivio del estrés', 'Mejora la circulación', 'Presión suave a media']
    },
    'deep-tissue': {
        id: 'deep-tissue',
        title: 'Deep Tissue Terapéutico',
        description: 'Enfoque en las capas más profundas del tejido muscular. Ideal para liberar tensiones crónicas y contracturas.',
        fullPrice: 120,
        durationMin: 60,
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
        features: ['Alivio de dolor crónico', 'Recuperación muscular', 'Presión firme']
    },
    'drenaje-linfatico': {
        id: 'drenaje-linfatico',
        title: 'Drenaje Linfático Manual',
        description: 'Técnica suave que estimula el sistema linfático para eliminar toxinas y reducir la retención de líquidos.',
        fullPrice: 130,
        durationMin: 75,
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1974&auto=format&fit=crop',
        features: ['Desinflamación', 'Post-operatorio', 'Desintoxicación']
    }
};

// Helper para obtener servicio por defecto si el slug no existe
export const getService = (slug: string | null) => {
    if (!slug || !SERVICES_DB[slug]) return SERVICES_DB['masaje-sueco'];
    return SERVICES_DB[slug];
};