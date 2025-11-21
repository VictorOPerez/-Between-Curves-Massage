import type { Lang } from './types';

export const M = {
    en: {
        header: 'MASSAGE THERAPY',
        sub: 'Client Intake Form',
        langLabel: 'Language',
        clientInfo: 'CLIENT INFORMATION',
        name: 'Name', dob: 'Date of Birth', age: 'Age', gender: 'Gender',
        address: 'Address', city: 'City', state: 'State', zip: 'Zip Code',
        email: 'Email', phone: 'Phone', emergency: 'Emergency Contact',
        joinList: 'Would you like to be added to our email list for news and exclusive offers?',
        yes: 'Yes', no: 'No', referral: 'How did you hear about us?',
        medicalHistory: 'MEDICAL HISTORY',
        medHelp: 'Do you have any of the following conditions (check all that apply):',
        otherIssues: 'Do you have any other medical issues not mentioned in this form?',
        surgeries: 'Have you had any recent medical procedures or surgeries?',
        pregnant: 'Are you currently pregnant or breastfeeding? (If applicable)',
        meds: 'Are you currently taking any medications?',
        ifYes: 'If yes, please specify:',
        massageInfo: 'MASSAGE INFORMATION',
        typeQ: 'What type of massage are you interested in? (Select all that apply)',
        areasQ: 'Any specific areas of tension or pain to address? (Select all that apply)',
        goalsQ: 'What are your goals for this massage session? (Select all that apply)',
        frequencyQ: 'How often do you receive massages?',
        printedName: 'Client Printed Name', clientSignature: 'Client Signature', date: 'Date',
    },
    es: {
        header: 'MASSAGE THERAPY',
        sub: 'Client Intake Form',
        langLabel: 'Idioma',
        clientInfo: 'CLIENT INFORMATION',
        name: 'Nombre', dob: 'Fecha de Nacimiento', age: 'Edad', gender: 'Género',
        address: 'Dirección', city: 'Ciudad', state: 'Estado', zip: 'Código Postal',
        email: 'Email', phone: 'Teléfono', emergency: 'Contacto de Emergencia',
        joinList: '¿Te agregamos a la lista de correo para noticias y ofertas?',
        yes: 'Sí', no: 'No', referral: '¿Cómo nos conociste?',
        medicalHistory: 'HISTORIAL MÉDICO',
        medHelp: '¿Tienes alguna de las siguientes condiciones? (marca todas las que apliquen):',
        otherIssues: '¿Algún otro problema médico no mencionado en este formulario?',
        surgeries: '¿Has tenido cirugías o procedimientos recientes?',
        pregnant: '¿Actualmente estás embarazada o lactando? (Si aplica)',
        meds: '¿Actualmente tomas algún medicamento?',
        ifYes: 'Si la respuesta es sí, especifica:',
        massageInfo: 'INFORMACIÓN DE MASAJE',
        typeQ: '¿Qué tipo de masaje te interesa? (Selecciona los que apliquen)',
        areasQ: '¿Zonas específicas de dolor o tensión? (Selecciona los que apliquen)',
        goalsQ: '¿Objetivos para esta sesión? (Selecciona los que apliquen)',
        frequencyQ: '¿Con qué frecuencia recibes masajes?',
        printedName: 'Nombre (letra de molde)', clientSignature: 'Firma', date: 'Fecha',
    }
} as const;

export type Messages = (typeof M)[Lang];
export const t = (lang: Lang): Messages => M[lang];


// Shared enumerations (en)
export const ENUMS = {
    types: ['Relaxation', 'Therapeutic', 'Deep tissue', 'Reflexology', 'Swedish', 'Hot stone', 'Other'],
    areas: ['Neck', 'Shoulders', 'Back', 'Hips', 'Legs', 'Feet', 'Other'],
    goals: ['Relaxation', 'Pain relief', 'Increased flexibility', 'Stress reduction', 'Injury recovery', 'Other'],
    freq: ['This is my first time', 'Occasionally', 'Regularly', 'Rarely']
};


// Medical list
export const MEDICAL_LIST = [
    'Acne', 'Active infection', 'Asthma', 'Autoimmune disease', 'Bleeding disorder', 'Breathing problems', 'Diabetes', 'Easily bruised', 'Eczema', 'Epilepsy', 'Heart disease',
    'Herpes', 'Hepatitis', 'Hirsutism', 'HIV/AIDS', 'Hyperpigmentation', 'Hypopigmentation', 'Hysterectomy', 'Irregular periods', 'Keloid scarring', 'Low blood pressure', 'High blood pressure',
    'Lupus', 'Menopause', 'Polycystic ovaries', 'Psoriasis', 'Pregnant/breastfeeding', 'Shingles', 'Skin diseases', 'Thyroid imbalance', 'Vitiligo', 'Warts'
];