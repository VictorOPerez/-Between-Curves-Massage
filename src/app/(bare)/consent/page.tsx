// app/page.tsx
"use client";

import React, { useEffect, useState, useRef, CanvasHTMLAttributes } from 'react';
import Image from 'next/image';
import SignatureCanvas from 'react-signature-canvas';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ArrowLeft, Camera, CheckCircle2, Download, FileSignature, HeartPulse, LockKeyhole, Sparkles, UserRound } from 'lucide-react';

import { PdfTemplate } from '../../../components/PdfTemplate';
import { IntakeFormData } from '../../types';
import { conditionNamesMaps, translations } from '../../locales';
import LogoBCM from '@/components/layout/LogoBCM';
import { CONSENT_VERSION } from '@/lib/consentConstants';
import styles from './consent.module.css';
import AestheticsConsent from './AestheticsConsent';
import { useMassageConsentStore } from '@/store/massageConsentStore';

const sectionCardClass = "bg-[#f2ece1] p-5 shadow-none sm:rounded-[1.75rem] sm:border sm:border-[#ded7c9] sm:bg-white sm:p-8 sm:shadow-[0_18px_55px_rgba(23,62,56,0.07)]";

function SectionHeading({ step, title, description, icon }: { step: string; title: string; description: string; icon: React.ReactNode }) {
    return (
        <div className="mb-7 flex items-start gap-4 border-b border-[#e8e1d5] pb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#173e38] text-[#dfc287] shadow-sm">
                {icon}
            </div>
            <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67f43]">{step}</p>
                <h3 className="font-display text-2xl font-semibold leading-none text-[#173e38] sm:text-[1.75rem]">{title}</h3>
                <p className="mt-2 max-w-2xl text-sm text-[#6e746f]">{description}</p>
            </div>
        </div>
    );
}

export default function IntakePage() {
    const sigCanvas = useRef<SignatureCanvas | null>(null);
    const [loading, setLoading] = useState(false);
    const lang = useMassageConsentStore(state => state.lang);
    const setLang = useMassageConsentStore(state => state.setLang);
    const formData = useMassageConsentStore(state => state.formData);
    const setFormData = useMassageConsentStore(state => state.setFormData);
    const consentKind = useMassageConsentStore(state => state.consentKind);
    const setConsentKind = useMassageConsentStore(state => state.setConsentKind);
    const clearMassageDraft = useMassageConsentStore(state => state.clearMassageDraft);
    const [accessStatus, setAccessStatus] = useState<'checking' | 'locked' | 'authorized'>('checking');
    const [downloadableCopy, setDownloadableCopy] = useState<{ blob: Blob; fileName: string } | null>(null);

    const t = translations[lang]; // Obtener traducciones actuales

    useEffect(() => {
        void useMassageConsentStore.persist.rehydrate();
    }, []);

    useEffect(() => {
        let active = true;

        fetch('/api/consent/access', { cache: 'no-store' })
            .then(response => response.json())
            .then(data => {
                if (active) setAccessStatus(data.authorized ? 'authorized' : 'locked');
            })
            .catch(() => {
                if (active) setAccessStatus('locked');
            });

        return () => { active = false; };
    }, []);

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
        setDownloadableCopy(null);

        try {
            const signatureUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png') || "";
            const signedFormData = { ...formData, signatureDate: new Date().toISOString() };
            // Pasamos el idioma al PDF también
            const blob = await pdf(<PdfTemplate data={signedFormData} signatureUrl={signatureUrl} lang={lang} />).toBlob();
            const fileName = `BCM_Intake_${formData.name.replace(/\s/g, '_')}_${Date.now()}.pdf`;

            const uploadData = new FormData();
            uploadData.append('file', blob, fileName);
            uploadData.append('clientName', formData.name);
            uploadData.append('consentVersion', CONSENT_VERSION);
            uploadData.append('consentType', 'massage');
            uploadData.append('language', lang);

            const response = await fetch('/api/upload', { method: 'POST', body: uploadData });
            if (!response.ok) {
                // 1. Leemos la respuesta del servidor antes de lanzar el error
                const errorData = await response.json().catch(() => ({}));
                console.error("Detalles del error del servidor:", errorData);

                // 2. Usamos el mensaje real del servidor si existe
                if (response.status === 401) setAccessStatus('locked');
                throw new Error(errorData.error || 'Upload failed');
            }

            setDownloadableCopy({ blob, fileName });
            alert(lang === 'en' ? 'Success! Form saved.' : '¡Éxito! Formulario guardado.');
            clearMassageDraft();
            clearSignature();
            window.scrollTo(0, 0);

        } catch (error) {
            console.error(error);
            alert(t.save_error);
        } finally {
            setLoading(false);
        }
    };

    // Componente auxiliar para Radio Buttons de Sí/No
    const YesNoRadioGroup = ({ label, groupName, value, required = false }: { label: string, groupName: keyof IntakeFormData, value: boolean | null, required?: boolean }) => (
        <div className="mb-4">
            <p className="mb-3 text-sm font-medium text-[#37433f]">{label}</p>
            <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
                <label className={`flex cursor-pointer items-center rounded-xl border px-4 py-3 transition ${value === true ? 'border-[#1d4f47] bg-[#eef5f2]' : 'border-[#ded7c9] bg-[#fcfbf8]'}`}><input required={required} type="radio" name={groupName} checked={value === true} onChange={() => handleBooleanRadio(groupName, true)} /> <span className="ml-2 text-sm font-semibold text-[#273a35]">{t.yes}</span></label>
                <label className={`flex cursor-pointer items-center rounded-xl border px-4 py-3 transition ${value === false ? 'border-[#1d4f47] bg-[#eef5f2]' : 'border-[#ded7c9] bg-[#fcfbf8]'}`}><input type="radio" name={groupName} checked={value === false} onChange={() => handleBooleanRadio(groupName, false)} /> <span className="ml-2 text-sm font-semibold text-[#273a35]">{t.no}</span></label>
            </div>
        </div>
    );

    // Componente auxiliar para inputs de texto condicionales ("If yes, specify")
    const ConditionalTextInput = ({ name, value }: { label: string, name: keyof IntakeFormData, value: string, conditionValue: string | boolean | null }) => {
        // Solo mostrar si la condición asociada es "true" o "Yes" (dependiendo de cómo lo manejes)
        // En este caso, asumimos que si el campo principal tiene valor 'Yes' o true, mostramos este input.
        // Simplificación: Siempre mostramos el input de texto para "specify", el usuario decide si llenarlo.
        return (
            <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">{t.label_if_yes_specify}</label>
                <input type="text" name={name} value={value} onChange={handleInput} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm" />
            </div>
        )
    }

    if (accessStatus !== 'authorized') {
        return (
            <main className="min-h-screen bg-stone-100 px-4 py-12 font-sans">
                <div className="mx-auto max-w-md rounded-xl border border-stone-200 bg-white p-8 shadow-xl">
                    <div className="mb-6 text-center">
                        <LogoBCM variant="wordmark" color="gold" size="lg" className="mx-auto mb-4 h-14 w-14" />
                        <h1 className="font-serif text-2xl text-green-900">{t.access_title}</h1>
                        <p className="mt-2 text-sm text-gray-600">{accessStatus === 'checking' ? t.checking_access : t.access_description}</p>
                    </div>

                    <button type="button" onClick={toggleLanguage} className="mx-auto mt-6 block text-sm text-green-800 underline">
                        {t.switchLang}
                    </button>
                </div>
            </main>
        );
    }

    if (consentKind === 'aesthetics') {
        return <AestheticsConsent lang={lang} onLanguageChange={toggleLanguage} onBack={() => setConsentKind(null)} />;
    }

    if (!consentKind) {
        return (
            <main className={`${styles.page} min-h-screen px-0 py-0 font-sans sm:px-4 sm:py-12`}>
                <div className="mx-auto max-w-5xl overflow-hidden bg-[#f8f5ee] sm:rounded-[2rem] sm:border sm:border-white/60 sm:shadow-[0_32px_90px_rgba(13,49,43,.2)]">
                    <div className="bg-[#123a34] px-6 py-8 text-white sm:px-10">
                        <div className="flex items-center justify-between"><LogoBCM asLink={false} variant="wordmark" color="gold" size="sm" /><button type="button" onClick={toggleLanguage} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold">{lang === 'en' ? 'Español' : 'English'}</button></div>
                        <p className="mt-8 text-xs font-bold uppercase tracking-[.28em] text-[#dec08a]">Between Curves Massage and Facials</p>
                        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-none sm:text-6xl">{lang === 'en' ? 'How can we care for you today?' : '¿Cómo podemos cuidarte hoy?'}</h1>
                        <p className="mt-4 max-w-xl text-sm leading-6 text-[#dce7e4]">{lang === 'en' ? 'Choose your service to open the correct private intake and consent form.' : 'Selecciona tu servicio para abrir la ficha y el consentimiento privado correspondiente.'}</p>
                    </div>
                    <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-8">
                        <button type="button" onClick={() => setConsentKind('massage')} className="group relative min-h-[330px] overflow-hidden rounded-[1.5rem] border border-[#ded7c9] text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                            <Image src="/images/hero.png" alt="Masaje profesional" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#102f2b] via-[#173e38]/40 to-transparent"></div>
                            <div className="absolute inset-x-0 bottom-0 p-6 text-white"><span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#dec08a] text-[#173e38]"><HeartPulse size={19} /></span><h2 className="font-display text-3xl font-semibold">{lang === 'en' ? 'Massage therapy' : 'Terapia de masaje'}</h2><p className="mt-2 text-sm text-[#e2ebe8]">{lang === 'en' ? 'Health history, massage preferences and informed consent.' : 'Historial de salud, preferencias y consentimiento informado.'}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f0d9a8]">{lang === 'en' ? 'Open form' : 'Abrir formulario'} →</span></div>
                        </button>
                        <button type="button" onClick={() => setConsentKind('aesthetics')} className="group relative min-h-[330px] overflow-hidden rounded-[1.5rem] border border-[#ded7c9] text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                            <Image src="/images/aesthetics-consent-hero.png" alt="Consulta estética profesional" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover object-[66%_center]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#102f2b] via-[#173e38]/35 to-transparent"></div>
                            <div className="absolute inset-x-0 bottom-0 p-6 text-white"><span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#dec08a] text-[#173e38]"><Sparkles size={19} /></span><h2 className="font-display text-3xl font-semibold">{lang === 'en' ? 'Facials & aesthetics' : 'Faciales y estética'}</h2><p className="mt-2 text-sm text-[#e2ebe8]">{lang === 'en' ? 'Skin consultation, facial treatments, microneedling and chemical peels.' : 'Consulta de piel, faciales, microneedling y peeling químico.'}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f0d9a8]">{lang === 'en' ? 'Open form' : 'Abrir formulario'} →</span></div>
                        </button>
                    </div>
                </div>
            </main>
        );
    }


    return (
        <main className={`${styles.page} relative min-h-screen overflow-hidden px-0 py-0 font-sans sm:px-4 sm:py-12`}>
            <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full border border-[#c9a86a]/20"></div>
            <div className="pointer-events-none absolute -right-24 top-[42rem] h-64 w-64 rounded-full border border-[#1d4f47]/10"></div>

            <div className="relative mx-auto max-w-5xl overflow-hidden border-0 bg-[#f8f5ee] shadow-none sm:rounded-[2rem] sm:border sm:border-white/60 sm:shadow-[0_32px_90px_rgba(13,49,43,0.2)]">
                <header className="relative overflow-hidden bg-[#123a34] px-5 pb-9 pt-5 text-white sm:px-10 sm:pb-12 sm:pt-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgba(222,188,134,0.2),transparent_34%),linear-gradient(135deg,transparent,rgba(0,0,0,0.16))]"></div>
                    <div className="absolute -bottom-28 -right-16 h-72 w-72 rounded-full border border-[#dec08a]/15"></div>

                    <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6">
                        <div className="flex items-center gap-4">
                            <button type="button" onClick={() => setConsentKind(null)} className="rounded-full border border-white/15 bg-white/10 p-2 text-white hover:bg-white/15" aria-label="Cambiar formulario"><ArrowLeft size={15} /></button>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dec08a]/30 bg-black/10">
                                <LogoBCM asLink={false} variant="wordmark" color="gold" size="sm" withShadow={false} />
                            </div>
                            <div>
                                <p className="font-display text-xl font-semibold tracking-wide text-white">Between Curves Massage</p>
                                <p className="text-[10px] uppercase tracking-[0.24em] text-[#dec08a]">Wellness · Care · Intention</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={toggleLanguage}
                            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest text-white transition hover:bg-white/15"
                        >
                            {lang === 'en' ? 'Español' : 'English'}
                        </button>
                    </div>

                    <div className="relative z-10 max-w-3xl pt-9">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#dec08a]">{t.headerTitle}</p>
                        <h1 className="font-display text-4xl font-medium leading-[0.95] text-white sm:text-6xl">
                            {lang === 'en' ? 'Your care begins here.' : 'Su cuidado comienza aquí.'}
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm leading-6 text-[#dce7e4] sm:text-base">{t.form_intro}</p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-[#edf4f2]"><LockKeyhole size={13} /> {t.private_badge}</span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#dec08a]/20 bg-[#dec08a]/10 px-3 py-1.5 text-xs text-[#f4dfb5]"><Sparkles size={13} /> {t.time_badge}</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-4 border-b border-[#ded7c9] bg-white/70 px-2 py-3 sm:px-10 sm:py-4">
                    {[t.personalInfoTitle, t.medicalHistoryTitle, t.massageInfoTitle, t.consentTitle].map((label, index) => (
                        <div key={label} className="flex items-center gap-2 border-r border-[#e5ded1] px-2 last:border-0 sm:px-4">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e9dfcb] text-[10px] font-bold text-[#715c36]">{index + 1}</span>
                            <span className="hidden truncate text-[10px] font-bold uppercase tracking-wider text-[#65716d] md:block">{label}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className={`${styles.form} space-y-3 pb-5 sm:space-y-6 sm:p-8 lg:p-10`}>

                    {/* --- SECCIÓN 1: INFORMACIÓN PERSONAL --- */}
                    <section className={sectionCardClass}>
                        <SectionHeading step="01" title={t.personalInfoTitle} description={t.personal_description} icon={<UserRound size={20} />} />
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
                    <section className={sectionCardClass}>
                        <SectionHeading step="02" title={t.medicalHistoryTitle} description={t.medical_description} icon={<HeartPulse size={20} />} />
                        <p className="text-sm text-gray-600 mb-4 font-medium">{t.medical_prompt_conditions}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                            {Object.keys(formData.conditions).map((key) => {
                                if (key === 'other_conditions') return null;
                                return (
                                    <label key={key} className={`flex cursor-pointer items-center space-x-2 rounded-xl border p-3 transition ${formData.conditions[key as keyof typeof formData.conditions] ? 'border-[#bfa36e] bg-[#f8f2e5]' : 'border-[#e7e1d6] bg-[#fcfbf8] hover:border-[#cfc4af]'}`}>
                                        <input type="checkbox" checked={formData.conditions[key as keyof typeof formData.conditions] as boolean} onChange={handleNestedCheck('conditions', key)} className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300" />
                                        <span className="text-gray-700 text-sm">{conditionNamesMaps[lang][key] || key.replace(/_/g, ' ')}</span>
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
                    <section className={sectionCardClass}>
                        <SectionHeading step="03" title={t.massageInfoTitle} description={t.massage_description} icon={<Sparkles size={20} />} />

                        {/* Tipo de Masaje */}
                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">{t.massage_prompt_type}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {Object.keys(formData.massageTypeOfInterest).map(key => {
                                    if (key === 'other_type') return null;
                                    return (
                                        <label key={key} className="flex cursor-pointer items-center space-x-2 rounded-xl border border-[#e5ded1] bg-[#fcfbf8] p-3 transition hover:border-[#c9a86a]"><input type="checkbox" checked={formData.massageTypeOfInterest[key as keyof typeof formData.massageTypeOfInterest] as boolean} onChange={handleNestedCheck('massageTypeOfInterest', key)} /><span className="text-sm">{t[`option_${key}` as keyof typeof t]}</span></label>
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
                                        <label key={key} className="flex cursor-pointer items-center space-x-2 rounded-xl border border-[#e5ded1] bg-[#fcfbf8] p-3 transition hover:border-[#c9a86a]"><input type="checkbox" checked={formData.areasOfTension[key as keyof typeof formData.areasOfTension] as boolean} onChange={handleNestedCheck('areasOfTension', key)} /><span className="text-sm">{t[`option_${key}` as keyof typeof t]}</span></label>
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
                                        <label key={key} className="flex cursor-pointer items-center space-x-2 rounded-xl border border-[#e5ded1] bg-[#fcfbf8] p-3 transition hover:border-[#c9a86a]"><input type="checkbox" checked={formData.massageGoals[key as keyof typeof formData.massageGoals] as boolean} onChange={handleNestedCheck('massageGoals', key)} /><span className="text-sm">{t[`option_${key}` as keyof typeof t]}</span></label>
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
                                    <label key={option} className={`flex cursor-pointer items-center rounded-full border px-4 py-2.5 transition ${formData.massageFrequency === option ? 'border-[#1d4f47] bg-[#eef5f2]' : 'border-[#ded7c9] bg-[#fcfbf8]'}`}><input type="radio" name="massageFrequency" value={option} checked={formData.massageFrequency === option} onChange={handleInput} /> <span className="ml-2 text-sm">{t[`option_${option}` as keyof typeof t]}</span></label>
                                ))}
                            </div>
                        </div>

                    </section>

                    {/* --- SECCIÓN 4: CONSENTIMIENTO Y FIRMA --- */}
                    <section className={sectionCardClass}>
                        <SectionHeading step="04" title={t.consentTitle} description={t.consent_description} icon={<FileSignature size={20} />} />

                        {/* Texto Legal Completo con Scroll si es muy largo en móviles */}
                        <div className="thin-scroll mb-6 h-56 space-y-4 overflow-y-auto rounded-2xl border border-[#ded7c9] bg-[#f8f6f1] p-5 text-justify text-sm leading-6 text-[#59635f] shadow-inner">
                            <p>{t.legal_p1}</p>
                            <p>{t.legal_p2}</p>
                            <p>{t.legal_p3}</p>
                            <p>{t.legal_p4}</p>
                            <p className="font-bold text-gray-800">{t.legal_final_agreement}</p>
                        </div>

                        <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#a9c4ba] bg-[#eef6f2] p-5">
                            <input
                                required
                                type="checkbox"
                                checked={formData.consentAccepted}
                                onChange={event => setFormData(previous => ({ ...previous, consentAccepted: event.target.checked }))}
                                className="mt-0.5 h-4 w-4 text-green-700 focus:ring-green-600"
                            />
                            <span className="text-sm font-semibold text-gray-800">{t.consent_acceptance}</span>
                        </label>

                        <div className="mb-6 rounded-2xl border border-[#dfcda9] bg-[#fbf6eb] p-5 sm:p-6">
                            <div className="mb-2 flex items-center gap-3 text-[#173e38]"><Camera size={19} /><h4 className="font-display text-xl font-semibold">{t.photoConsentTitle}</h4></div>
                            <p className="my-3 text-sm text-gray-700">{t.photo_consent_description}</p>
                            <YesNoRadioGroup
                                required
                                label={t.photo_consent_prompt}
                                groupName="photoConsent"
                                value={formData.photoConsent}
                            />
                        </div>

                        <div className="mb-4 flex items-center justify-between text-xs text-[#7b817e]"><span>{t.consent_version}: {CONSENT_VERSION}</span><span className="inline-flex items-center gap-1.5"><LockKeyhole size={12} /> {t.private_badge}</span></div>

                        <div className="mb-2 rounded-2xl border border-[#ded7c9] bg-white p-4 sm:p-5">
                            <div className="mb-3 flex items-center justify-between gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-[#173e38]">{t.label_client_signature}</label>
                                    <p className="mt-1 text-xs text-[#7a827e]">{t.signature_hint}</p>
                                </div>
                                <FileSignature className="text-[#b18d50]" size={22} />
                            </div>
                            <div className={`${styles.signatureCanvas} touch-none overflow-hidden rounded-xl border-2 border-dashed border-[#c9b994] bg-[#fdfcf9]`}>
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor="#173e38"
                                    canvasProps={{
                                        className: "w-full h-44",
                                        style: { touchAction: 'none' },
                                    } as CanvasHTMLAttributes<HTMLCanvasElement> & { willReadFrequently?: boolean }}
                                />
                            </div>
                            <button type="button" onClick={clearSignature} className="mt-2 text-xs font-semibold text-[#9a623e] underline decoration-[#9a623e]/30 underline-offset-4 hover:text-[#77442a]">{t.clear_signature}</button>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mx-4 flex w-auto items-center justify-center gap-3 rounded-2xl py-4 text-base font-bold text-white shadow-[0_14px_30px_rgba(23,62,56,0.2)] transition-all sm:mx-0 sm:w-full ${loading ? 'cursor-not-allowed bg-gray-400' : 'bg-[#173e38] hover:-translate-y-0.5 hover:bg-[#0f302b]'}`}
                    >
                        {!loading && <CheckCircle2 size={19} />}
                        {loading ? t.submit_btn_loading : t.submit_btn}
                    </button>

                    {downloadableCopy && (
                        <div className="mx-4 rounded-2xl border border-[#a9c4ba] bg-[#eef6f2] p-5 text-center sm:mx-0">
                            <p className="mb-3 text-sm text-green-900">{t.copy_ready}</p>
                            <button
                                type="button"
                                onClick={() => saveAs(downloadableCopy.blob, downloadableCopy.fileName)}
                                className="mx-auto flex items-center gap-2 rounded-full border border-[#1d4f47] px-5 py-2.5 text-sm font-bold text-[#173e38] hover:bg-white"
                            >
                                <Download size={16} />
                                {t.download_copy}
                            </button>
                        </div>
                    )}

                </form>
            </div>
        </main>
    );
}
