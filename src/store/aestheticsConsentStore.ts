import type { SetStateAction } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AestheticsFormData } from '@/app/aestheticsTypes';
import type { Language } from '@/app/types';
import {
    healthConditionLabels,
    microneedlingConfirmations,
    peelConfirmations,
    procedureLabels,
} from '@/lib/aestheticsConsent';

export function createInitialAestheticsData(language: Language): AestheticsFormData {
    return {
        language,
        selectedServices: [], firstName: '', lastName: '', dob: '', phone: '', email: '', emergencyName: '', emergencyPhone: '', professionalName: '',
        skinGoals: [], otherSkinGoal: '', priorFacials: '', priorFacialsDetails: '', skinType: '', sunReaction: '', fitzpatrick: '', skinSymptoms: [], healingReaction: '',
        bruisesEasily: '', recurringLesions: '', recurringLesionsDetails: '', homeProducts: [], otherHomeProduct: '', routineReview: '', routineChanges: '',
        sunExposure: '', sunscreenUse: '', tanningBeds: '', tanningFrequency: '',
        pastProcedures: Object.fromEntries(Object.keys(procedureLabels).map(key => [key, { selected: false, details: '' }])),
        plannedProcedures: [], otherPlannedProcedure: '', plannedDate: '', dermatologistCare: '', dermatologistDetails: '', medications: '', skinMedications: [], skinMedicationDetails: '',
        healthConditions: Object.fromEntries(Object.keys(healthConditionLabels).map(key => [key, { answer: '', details: '' }])), bloodPressure: '',
        otherMedical: '', otherMedicalDetails: '', reactions: [], otherReaction: '', reactionDetails: '', fragrancePreference: '', fragranceDetails: '', ambientAromas: '',
        womenHealth: [], shavingMethod: '', otherShavingMethod: '', maleSkinSymptoms: [], stressLevel: '', sleepsWell: '', physicalActivity: '', hydration: '',
        foodAllergy: '', foodAllergyDetails: '', treatmentProgram: '', clinicalPhotos: '', marketingMedia: '', mediaVisibility: [], promotions: '', promotionChannels: [],
        generalConsentAccepted: false, clientSignature: '', signedAt: '', microInitials: Array(microneedlingConfirmations.length).fill(''), microContraindications: [],
        microContraindicationDetails: '', microPigmentationInitials: '', microScarringInitials: '', microAftercareInitials: '', microAccepted: false, microSignature: '',
        peelInitials: Array(peelConfirmations.length).fill(''), peelContraindications: [], peelContraindicationDetails: '', peelAllergyInitials: '', peelSunInitials: '',
        peelSunscreenInitials: '', peelAftercareInitials: '', peelReactionInitials: '', peelAccepted: false, peelSignature: '',
    };
}

type AestheticsDraftStore = {
    data: AestheticsFormData;
    stepIndex: number;
    setData: (next: SetStateAction<AestheticsFormData>) => void;
    setStepIndex: (next: SetStateAction<number>) => void;
    resetDraft: (language: Language) => void;
};

export const useAestheticsConsentStore = create<AestheticsDraftStore>()(
    persist(
        set => ({
            data: createInitialAestheticsData('es'),
            stepIndex: 0,
            setData: next => set(state => ({ data: typeof next === 'function' ? next(state.data) : next })),
            setStepIndex: next => set(state => ({ stepIndex: typeof next === 'function' ? next(state.stepIndex) : next })),
            resetDraft: language => set({ data: createInitialAestheticsData(language), stepIndex: 0 }),
        }),
        {
            name: 'bcm-aesthetics-consent-draft-v1',
            storage: createJSONStorage(() => localStorage),
            partialize: state => ({ data: state.data, stepIndex: state.stepIndex }),
            skipHydration: true,
        },
    ),
);
