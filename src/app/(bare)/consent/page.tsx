// app/page.tsx
"use client";

import React, { useState, useRef, CanvasHTMLAttributes } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import clsx from 'clsx'; // Necesitarás instalar: npm install clsx

import { PdfTemplate } from '../../../components/PdfTemplate';
import { IntakeFormData, Language } from '../../types';
import { translations } from '../../locales';
import LogoBCM from '@/components/layout/LogoBCM';

// Estado Inicial Gigante (para limpiar el formulario)
const initialFormState: IntakeFormData = {
    name: '', dob: '', age: '', gender: '', address: '', city: '', state: '', zip: '', phone: '', email: '', emergencyContact: '', howDidYouHear: '',
    addedToEmailList: null,
    conditions: {
        acne: false, active_infection: false, asthma: false, autoimmune_disease: false, bleeding_disorder: false, breathing_problems: false, diabetes: false, easily_bruised: false, eczema: false, epilepsy: false, heart_disease: false, herpes: false, hepatitis: false, hirsutism: false, hiv_aids: false, hyperpigmentation: false, hypopigmentation: false, hysterectomy: false, irregular_periods: false, keloid_scarring: false, low_blood_pressure: false, high_blood_pressure: false, lupus: false, menopause: false, polycystic_ovaries: false, psoriasis: false, pregnant_breastfeeding: false, shingles: false, skin_diseases: false, thyroid_imbalance: false, vitiligo: false, warts: false, other_conditions: ''
    },
    otherMedicalIssues: '', recentProcedures: '', currentlyPregnant: null, currentMedications: '',
    massageTypeOfInterest: { relaxation: false, swedish: false, therapeutic: false, hot_stone: false, deep_tissue: false, reflexology: false, other_type: '' },
    areasOfTension: { neck: false, shoulders: false, back: false, hips: false, legs: false, feet: false, other_area: '' },
    massageGoals: { relaxation: false, stress_reduction: false, pain_relief: false, injury_recovery: false, increased_flexibility: false, other_goal: '' },
    massageFrequency: ''
};


export default function IntakePage() {
    const sigCanvas = useRef<SignatureCanvas | null>(null);
    const [loading, setLoading] = useState(false);
    const [lang, setLang] = useState<Language>('en'); // Estado del idioma
    const [formData, setFormData] = useState<IntakeFormData>(initialFormState);

    const t = translations[lang]; // Obtener traducciones actuales

    // --- Manejadores de Inputs ---

    // Inputs de texto simples (nombre, email, etc.)
    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Radio buttons booleanos (Yes/No)
    const handleBooleanRadio = (groupName: keyof IntakeFormData, value: boolean) => {
        setFormData(prev => ({ ...prev, [groupName]: value }));
    };

    // Checkboxes anidados (Conditions, Massage Types, Areas, Goals)
    const handleNestedCheck = (groupName: keyof IntakeFormData, fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [groupName]: {
                ...(prev[groupName] as object),
                [fieldName]: e.target.checked
            }
        }));
    };

    // Inputs de texto anidados (Other conditions, other type...)
    const handleNestedInput = (groupName: keyof IntakeFormData, fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [groupName]: {
                ...(prev[groupName] as object),
                [fieldName]: e.target.value
            }
        }));
    };

    const clearSignature = () => sigCanvas.current?.clear();
    const toggleLanguage = () => setLang(prev => prev === 'en' ? 'es' : 'en');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (sigCanvas.current?.isEmpty()) { alert(lang === 'en' ? "Please sign the document." : "Por favor firme el documento."); return; }
        setLoading(true);

        try {
            const signatureUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png') || "";
            // Pasamos el idioma al PDF también
            const blob = await pdf(<PdfTemplate data={formData} signatureUrl={signatureUrl} lang={lang} />).toBlob();
            const fileName = `BCM_Intake_${formData.name.replace(/\s/g, '_')}_${Date.now()}.pdf`;
            saveAs(blob, fileName);

            const uploadData = new FormData();
            uploadData.append('file', blob, fileName);

            const response = await fetch('/api/upload', { method: 'POST', body: uploadData });
            if (!response.ok) throw new Error('Upload failed');

            alert(lang === 'en' ? 'Success! Form saved.' : '¡Éxito! Formulario guardado.');
            setFormData(initialFormState);
            clearSignature();
            window.scrollTo(0, 0);

        } catch (error) {
            console.error(error);
            alert(lang === 'en' ? 'Error saving to cloud, local copy downloaded.' : 'Error guardando en la nube, copia local descargada.');
        } finally {
            setLoading(false);
        }
    };

    // Componente auxiliar para Radio Buttons de Sí/No
    const YesNoRadioGroup = ({ label, groupName, value }: { label: string, groupName: keyof IntakeFormData, value: boolean | null }) => (
        <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
            <div className="flex space-x-4">
                <label className="flex items-center"><input type="radio" name={groupName} checked={value === true} onChange={() => handleBooleanRadio(groupName, true)} className="text-green-600 focus:ring-green-500" /> <span className="ml-2 text-sm">{t.yes}</span></label>
                <label className="flex items-center"><input type="radio" name={groupName} checked={value === false} onChange={() => handleBooleanRadio(groupName, false)} className="text-green-600 focus:ring-green-500" /> <span className="ml-2 text-sm">{t.no}</span></label>
            </div>
        </div>
    );

    // Componente auxiliar para inputs de texto condicionales ("If yes, specify")
    const ConditionalTextInput = ({ label, name, value, conditionValue }: { label: string, name: keyof IntakeFormData, value: string, conditionValue: string | boolean | null }) => {
        // Solo mostrar si la condición asociada es "true" o "Yes" (dependiendo de cómo lo manejes)
        // En este caso, asumimos que si el campo principal tiene valor 'Yes' o true, mostramos este input.
        // Simplificación: Siempre mostramos el input de texto para "specify", el usuario decide si llenarlo.
        return (
            <div className="mb-4 ml-4">
                <label className="block text-sm text-gray-600 mb-1">{t.label_if_yes_specify}</label>
                <input type="text" name={name} value={value} onChange={handleInput} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm" />
            </div>
        )
    }


    return (
        <main className="min-h-screen bg-stone-100 py-8 px-4 font-sans relative">
            {/* Botón de Idioma Flotante */}
            <button onClick={toggleLanguage} className=" sticky top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md text-sm text-green-800 font-medium hover:bg-green-50 z-99">
                {t.switchLang}
            </button>

            <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden border border-stone-200">

                {/* Header Rediseñado: Estilo Spa / Lujo */}
                <div className="relative bg-green-900 py-10 px-6 overflow-hidden">

                    {/* 1. Fondo Decorativo (Sutil degradado y textura) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-950 to-green-800 z-0"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-700 rounded-full blur-3xl opacity-20 z-0"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-600 rounded-full blur-3xl opacity-10 z-0"></div>

                    {/* 2. Botón de Idioma (Integrado y elegante) */}
                    <button
                        onClick={toggleLanguage}
                        className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm transition-all group"
                    >
                        <span className="text-[10px] font-bold text-green-100 tracking-wider uppercase group-hover:text-white">
                            {lang === 'en' ? 'ES' : 'EN'}
                        </span>
                        {/* Icono pequeño de mundo o flechas */}
                        <svg className="w-3 h-3 text-green-200 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {/* 3. Contenido Central */}
                    <div className="relative z-10 flex flex-col items-center text-center">

                        {/* Logo y Nombre de Marca */}
                        <div className="mb-6 transform scale-110">
                            <div className="flex flex-col items-center gap-3">
                                {/* Círculo sutil detrás del logo */}
                                <div className="p-8 rounded-full bg-green-950/30 border border-green-800/50 shadow-inner">
                                    <LogoBCM variant="wordmark" color="gold" size="lg" className="w-12 h-12 drop-shadow-md" />
                                </div>

                                <div>
                                    <h1 className="font-serif text-3xl md:text-4xl text-white tracking-wide drop-shadow-sm">
                                        Between Curves <span className=" ">Massage</span>
                                    </h1>
                                    {/* Pequeña línea dorada decorativa */}
                                    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4B26A] to-transparent mx-auto mt-3 opacity-70"></div>
                                </div>
                            </div>
                        </div>

                        {/* Título del Formulario (Limpio y separado) */}
                        <div className="bg-green-950/40 px-6 py-2 rounded-lg border border-green-800/30 backdrop-blur-sm">
                            <h2 className="text-[#D4B26A] text-xs md:text-sm font-sans font-semibold tracking-[0.25em] uppercase shadow-sm">
                                {t.headerTitle}
                            </h2>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* --- SECCIÓN 1: INFORMACIÓN PERSONAL --- */}
                    <section>
                        <h3 className="text-xl font-serif text-green-800 border-b-2 border-green-100 pb-2 mb-6">{t.personalInfoTitle}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div className="md:col-span-4"><label className="text-sm font-medium text-gray-700">{t.label_name}</label><input required type="text" name="name" value={formData.name} onChange={handleInput} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-green-500 focus:border-green-500" /></div>
                            <div className="md:col-span-2"><label className="text-sm font-medium text-gray-700">{t.label_dob}</label><input type="date" name="dob" value={formData.dob} onChange={handleInput} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-green-500 focus:border-green-500" /></div>

                            <div className="md:col-span-2"><label className="text-sm font-medium text-gray-700">{t.label_age}</label><input type="text" name="age" value={formData.age} onChange={handleInput} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50" /></div>
                            <div className="md:col-span-4"><label className="text-sm font-medium text-gray-700">{t.label_gender}</label><input type="text" name="gender" value={formData.gender} onChange={handleInput} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50" /></div>

                            <div className="md:col-span-6"><label className="text-sm font-medium text-gray-700">{t.label_address}</label><input type="text" name="address" value={formData.address} onChange={handleInput} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50" /></div>

                            <div className="md:col-span-3"><label className="text-sm font-medium text-gray-700">{t.label_city}</label><input type="text" name="city" value={formData.city} onChange={handleInput} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50" /></div>
                            <div className="md:col-span-1"><label className="text-sm font-medium text-gray-700">{t.label_state}</label><input type="text" name="state" value={formData.state} onChange={handleInput} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50" /></div>
                            <div className="md:col-span-2"><label className="text-sm font-medium text-gray-700">{t.label_zip}</label><input type="text" name="zip" value={formData.zip} onChange={handleInput} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50" /></div>

                            <div className="md:col-span-3"><label className="text-sm font-medium text-gray-700">{t.label_phone}</label><input required type="tel" name="phone" value={formData.phone} onChange={handleInput} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50" /></div>
                            <div className="md:col-span-3"><label className="text-sm font-medium text-gray-700">{t.label_email}</label><input required type="email" name="email" value={formData.email} onChange={handleInput} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50" /></div>
                            <div className="md:col-span-6"><label className="text-sm font-medium text-gray-700">{t.label_emergency}</label><input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleInput} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50" /></div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <YesNoRadioGroup label={t.label_emailList} groupName="addedToEmailList" value={formData.addedToEmailList} />
                            <div className="mt-4"><label className="text-sm font-medium text-gray-700">{t.label_howHeard}</label><input type="text" name="howDidYouHear" value={formData.howDidYouHear} onChange={handleInput} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50" /></div>
                        </div>
                    </section>

                    {/* --- SECCIÓN 2: HISTORIAL MÉDICO --- */}
                    <section>
                        <h3 className="text-xl font-serif text-green-800 border-b-2 border-green-100 pb-2 mb-6">{t.medicalHistoryTitle}</h3>
                        <p className="text-sm text-gray-600 mb-4 font-medium">{t.medical_prompt_conditions}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                            {Object.keys(formData.conditions).map((key) => {
                                if (key === 'other_conditions') return null;
                                return (
                                    <label key={key} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-green-50 transition">
                                        <input type="checkbox" checked={formData.conditions[key as keyof typeof formData.conditions] as boolean} onChange={handleNestedCheck('conditions', key)} className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300" />
                                        <span className="text-gray-700 capitalize text-sm">{key.replace(/_/g, ' ')}</span>
                                    </label>
                                )
                            })}
                        </div>
                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-700">{t.label_other}</label>
                            <input type="text" value={formData.conditions.other_conditions} onChange={handleNestedInput('conditions', 'other_conditions')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50" />
                        </div>

                        {/* Preguntas Médicas Adicionales */}
                        <div className="space-y-4 border-t border-gray-100 pt-6">
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">{t.medical_prompt_other_issues}</p>
                                <ConditionalTextInput label={t.label_if_yes_specify} name="otherMedicalIssues" value={formData.otherMedicalIssues} conditionValue="Yes" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">{t.medical_prompt_procedures}</p>
                                <ConditionalTextInput label={t.label_if_yes_specify} name="recentProcedures" value={formData.recentProcedures} conditionValue="Yes" />
                            </div>
                            <YesNoRadioGroup label={t.medical_prompt_pregnant} groupName="currentlyPregnant" value={formData.currentlyPregnant} />
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">{t.medical_prompt_meds}</p>
                                <ConditionalTextInput label={t.label_if_yes_specify} name="currentMedications" value={formData.currentMedications} conditionValue="Yes" />
                            </div>
                        </div>
                    </section>

                    {/* --- SECCIÓN 3: INFORMACIÓN DEL MASAJE --- */}
                    <section>
                        <h3 className="text-xl font-serif text-green-800 border-b-2 border-green-100 pb-2 mb-6">{t.massageInfoTitle}</h3>

                        {/* Tipo de Masaje */}
                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">{t.massage_prompt_type}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {Object.keys(formData.massageTypeOfInterest).map(key => {
                                    if (key === 'other_type') return null;
                                    return (
                                        <label key={key} className="flex items-center space-x-2"><input type="checkbox" checked={formData.massageTypeOfInterest[key as keyof typeof formData.massageTypeOfInterest] as boolean} onChange={handleNestedCheck('massageTypeOfInterest', key)} className="text-green-600 focus:ring-green-500" /><span className="text-sm">{t[`option_${key}` as keyof typeof t]}</span></label>
                                    )
                                })}
                            </div>
                            <input type="text" placeholder={t.label_other} value={formData.massageTypeOfInterest.other_type} onChange={handleNestedInput('massageTypeOfInterest', 'other_type')} className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50" />
                        </div>

                        {/* Áreas de Tensión */}
                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">{t.massage_prompt_areas}</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {Object.keys(formData.areasOfTension).map(key => {
                                    if (key === 'other_area') return null;
                                    return (
                                        <label key={key} className="flex items-center space-x-2"><input type="checkbox" checked={formData.areasOfTension[key as keyof typeof formData.areasOfTension] as boolean} onChange={handleNestedCheck('areasOfTension', key)} className="text-green-600 focus:ring-green-500" /><span className="text-sm">{t[`option_${key}` as keyof typeof t]}</span></label>
                                    )
                                })}
                            </div>
                            <input type="text" placeholder={t.label_other} value={formData.areasOfTension.other_area} onChange={handleNestedInput('areasOfTension', 'other_area')} className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50" />
                        </div>

                        {/* Objetivos */}
                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">{t.massage_prompt_goals}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {Object.keys(formData.massageGoals).map(key => {
                                    if (key === 'other_goal') return null;
                                    return (
                                        <label key={key} className="flex items-center space-x-2"><input type="checkbox" checked={formData.massageGoals[key as keyof typeof formData.massageGoals] as boolean} onChange={handleNestedCheck('massageGoals', key)} className="text-green-600 focus:ring-green-500" /><span className="text-sm">{t[`option_${key}` as keyof typeof t]}</span></label>
                                    )
                                })}
                            </div>
                            <input type="text" placeholder={t.label_other} value={formData.massageGoals.other_goal} onChange={handleNestedInput('massageGoals', 'other_goal')} className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50" />
                        </div>

                        {/* Frecuencia */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-3">{t.massage_prompt_frequency}</p>
                            <div className="flex flex-wrap gap-4">
                                {['first_time', 'occasionally', 'regularly', 'rarely'].map(option => (
                                    <label key={option} className="flex items-center"><input type="radio" name="massageFrequency" value={option} checked={formData.massageFrequency === option} onChange={handleInput} className="text-green-600 focus:ring-green-500" /> <span className="ml-2 text-sm">{t[`option_${option}` as keyof typeof t]}</span></label>
                                ))}
                            </div>
                        </div>

                    </section>

                    {/* --- SECCIÓN 4: CONSENTIMIENTO Y FIRMA --- */}
                    <section className="pt-6 border-t-2 border-green-100">
                        <h3 className="text-xl font-serif text-green-800 mb-4">{t.consentTitle}</h3>

                        {/* Texto Legal Completo con Scroll si es muy largo en móviles */}
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-xs text-gray-600 text-justify h-48 overflow-y-auto mb-6 space-y-3">
                            <p>{t.legal_p1}</p>
                            <p>{t.legal_p2}</p>
                            <p>{t.legal_p3}</p>
                            <p>{t.legal_p4}</p>
                            <p>{t.legal_p5}</p>
                            <p className="font-bold text-gray-800">{t.legal_final_agreement}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">{t.label_client_signature}</label>
                            <div className="border-2 border-dashed border-gray-300 rounded bg-white touch-none">
                                <div className="border-2 border-dashed border-gray-300 rounded bg-white touch-none">
                                    <SignatureCanvas
                                        ref={sigCanvas}
                                        penColor="black"
                                        canvasProps={{
                                            className: "w-full h-40 rounded",
                                            style: { touchAction: 'none' },
                                            willReadFrequently: true
                                        } as CanvasHTMLAttributes<HTMLCanvasElement> & { willReadFrequently?: boolean }}
                                    />
                                </div>
                            </div>
                            <button type="button" onClick={clearSignature} className="text-xs text-red-500 underline mt-1 hover:text-red-700">{t.clear_signature}</button>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-md transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-700 to-green-900 hover:from-green-800 hover:to-green-950 transform hover:-translate-y-0.5'}`}
                    >
                        {loading ? t.submit_btn_loading : t.submit_btn}
                    </button>

                </form>
            </div>
        </main>
    );
}