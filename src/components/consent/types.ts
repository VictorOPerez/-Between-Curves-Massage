export type Lang = 'en' | 'es';


export type ConsentState = {
    provider: string;
    printedName: string;
    dateStr: string;
    // Page 2 — client info
    name: string;
    dob: string;
    age: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    phone: string;
    emergency: string;
    join: 'yes' | 'no' | 'na';
    referral: string;
    medicalChecked: Record<string, boolean>;
    // Page 3 — health & massage
    otherIssues: 'yes' | 'no' | 'na';
    otherDesc: string;
    surgeries: 'yes' | 'no' | 'na';
    surgeriesDesc: string;
    pregnant: 'yes' | 'no' | 'na';
    meds: 'yes' | 'no' | 'na';
    medsDesc: string;
    typeChecked: Record<string, boolean>;
    areaChecked: Record<string, boolean>;
    goalChecked: Record<string, boolean>;
    freq: string;
};


export const defaultState: ConsentState = {
    provider: '',
    printedName: '',
    dateStr: new Date().toISOString().slice(0, 10),
    name: '', dob: '', age: '', gender: '', address: '', city: '', state: '', zip: '',
    email: '', phone: '', emergency: '', join: 'na', referral: '', medicalChecked: {},
    otherIssues: 'na', otherDesc: '', surgeries: 'na', surgeriesDesc: '',
    pregnant: 'na', meds: 'na', medsDesc: '',
    typeChecked: {}, areaChecked: {}, goalChecked: {}, freq: ''
};

