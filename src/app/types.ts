// app/types.ts

// Interfaz principal de los datos del formulario
export interface IntakeFormData {
    // Personal Information
    name: string;
    dob: string;
    age: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    emergencyContact: string;
    addedToEmailList: boolean | null; // radio yes/no
    howDidYouHear: string;

    // Medical History (Lista completa de las imágenes)
    conditions: {
        acne: boolean;
        active_infection: boolean;
        asthma: boolean;
        autoimmune_disease: boolean;
        bleeding_disorder: boolean;
        breathing_problems: boolean;
        diabetes: boolean;
        easily_bruised: boolean;
        eczema: boolean;
        epilepsy: boolean;
        heart_disease: boolean;
        herpes: boolean;
        hepatitis: boolean;
        hirsutism: boolean;
        hiv_aids: boolean;
        hyperpigmentation: boolean;
        hypopigmentation: boolean;
        hysterectomy: boolean;
        irregular_periods: boolean;
        keloid_scarring: boolean;
        low_blood_pressure: boolean;
        high_blood_pressure: boolean;
        lupus: boolean;
        menopause: boolean;
        polycystic_ovaries: boolean;
        psoriasis: boolean;
        pregnant_breastfeeding: boolean;
        shingles: boolean;
        skin_diseases: boolean;
        thyroid_imbalance: boolean;
        vitiligo: boolean;
        warts: boolean;
        other_conditions: string;
    };

    // Additional Medical Questions
    otherMedicalIssues: string; // Si "Yes", especifica aquí
    recentProcedures: string; // Si "Yes", especifica aquí
    currentlyPregnant: boolean | null;
    currentMedications: string; // Si "Yes", especifica aquí

    // Massage Information
    massageTypeOfInterest: {
        relaxation: boolean;
        swedish: boolean;
        therapeutic: boolean;
        hot_stone: boolean;
        deep_tissue: boolean;
        reflexology: boolean;
        other_type: string;
    };
    areasOfTension: {
        neck: boolean;
        shoulders: boolean;
        back: boolean;
        hips: boolean;
        legs: boolean;
        feet: boolean;
        other_area: string;
    };
    massageGoals: {
        relaxation: boolean;
        stress_reduction: boolean;
        pain_relief: boolean;
        injury_recovery: boolean;
        increased_flexibility: boolean;
        other_goal: string;
    };
    massageFrequency: 'first_time' | 'occasionally' | 'regularly' | 'rarely' | '';

    // Signature Section (Solo para el PDF, no se guarda en estado)
    signatureDate?: string;
}

// Respuesta de la API
export interface ApiResponseBody {
    success?: boolean;
    fileId?: string;
    error?: string;
}

// Tipos para el multiidioma
export type Language = 'en' | 'es';
export type TranslationStructure = Record<string, string | Record<string, string>>;