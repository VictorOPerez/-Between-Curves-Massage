import type { SetStateAction } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { IntakeFormData, Language } from '@/app/types';

export const initialMassageFormState: IntakeFormData = {
    name: '', dob: '', age: '', gender: '', address: '', city: '', state: '', zip: '', phone: '', email: '', emergencyContact: '', howDidYouHear: '',
    addedToEmailList: null,
    conditions: {
        acne: false, active_infection: false, asthma: false, autoimmune_disease: false, bleeding_disorder: false, breathing_problems: false, diabetes: false, easily_bruised: false, eczema: false, epilepsy: false, heart_disease: false, herpes: false, hepatitis: false, hirsutism: false, hiv_aids: false, hyperpigmentation: false, hypopigmentation: false, hysterectomy: false, irregular_periods: false, keloid_scarring: false, low_blood_pressure: false, high_blood_pressure: false, lupus: false, menopause: false, polycystic_ovaries: false, psoriasis: false, pregnant_breastfeeding: false, shingles: false, skin_diseases: false, thyroid_imbalance: false, vitiligo: false, warts: false, other_conditions: '',
    },
    otherMedicalIssues: '', recentProcedures: '', currentlyPregnant: null, currentMedications: '',
    massageTypeOfInterest: { relaxation: false, swedish: false, therapeutic: false, hot_stone: false, deep_tissue: false, reflexology: false, other_type: '' },
    areasOfTension: { neck: false, shoulders: false, back: false, hips: false, legs: false, feet: false, other_area: '' },
    massageGoals: { relaxation: false, stress_reduction: false, pain_relief: false, injury_recovery: false, increased_flexibility: false, other_goal: '' },
    massageFrequency: '', consentAccepted: false, photoConsent: null,
};

type ConsentKind = 'massage' | 'aesthetics' | null;

type MassageDraftStore = {
    formData: IntakeFormData;
    lang: Language;
    consentKind: ConsentKind;
    setFormData: (next: SetStateAction<IntakeFormData>) => void;
    setLang: (next: SetStateAction<Language>) => void;
    setConsentKind: (next: SetStateAction<ConsentKind>) => void;
    clearMassageDraft: () => void;
};

export const useMassageConsentStore = create<MassageDraftStore>()(
    persist(
        set => ({
            formData: initialMassageFormState,
            lang: 'en',
            consentKind: null,
            setFormData: next => set(state => ({ formData: typeof next === 'function' ? next(state.formData) : next })),
            setLang: next => set(state => ({ lang: typeof next === 'function' ? next(state.lang) : next })),
            setConsentKind: next => set(state => ({ consentKind: typeof next === 'function' ? next(state.consentKind) : next })),
            clearMassageDraft: () => set({ formData: initialMassageFormState }),
        }),
        {
            name: 'bcm-massage-consent-draft-v1',
            storage: createJSONStorage(() => localStorage),
            partialize: state => ({ formData: state.formData, lang: state.lang, consentKind: state.consentKind }),
            skipHydration: true,
        },
    ),
);
