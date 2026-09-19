"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import SignatureCanvas from 'react-signature-canvas';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Download, FileCheck2, HeartPulse, Leaf, ShieldCheck, Sparkles, SunMedium, UserRound } from 'lucide-react';
import { AestheticsPdfTemplate } from '@/components/AestheticsPdfTemplate';
import type { AestheticsFormData, YesNo } from '@/app/aestheticsTypes';
import type { Language } from '@/app/types';
import {
    AESTHETICS_CONSENT_VERSION, healthConditionLabels, homeProducts, maleSymptoms, microneedlingConfirmations,
    microneedlingContraindications, peelConfirmations, peelContraindications,
    procedureLabels, reactionTypes, skinGoals, skinMedications, skinSymptoms, skinTypes, sunReactions, womenOptions,
} from '@/lib/aestheticsConsent';
import styles from './consent.module.css';
import { translateAesthetics } from '@/lib/aestheticsI18n';
import { useAestheticsConsentStore } from '@/store/aestheticsConsentStore';

const TranslationContext = createContext<(value: string) => string>(value => value);
const useTranslation = () => useContext(TranslationContext);

const services = [
    { id: 'facial', title: 'Facial personalizado', note: 'Consulta y tratamiento estético general' },
    { id: 'microneedling', title: 'Microneedling', note: 'Incluye consentimiento específico' },
    { id: 'peel', title: 'Peeling químico', note: 'Incluye consentimiento específico' },
];

const plannedProcedureOptions = ["Botox", "Fillers", "Láser / IPL", "Depilación láser facial", "Peeling", "Microneedling", "Cirugía facial/estética", "Ninguno"];

function SectionTitle({ eyebrow, title, description, icon }: { eyebrow: string; title: string; description: string; icon: React.ReactNode }) {
    const t = useTranslation();
    return <div className="mb-7 flex items-start gap-4 border-b border-[#e8e1d5] pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#173e38] text-[#dfc287]">{icon}</div>
        <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#a67f43]">{t(eyebrow)}</p><h2 className="font-display text-2xl font-semibold text-[#173e38] sm:text-3xl">{t(title)}</h2><p className="mt-2 max-w-2xl text-sm text-[#6e746f]">{t(description)}</p></div>
    </div>;
}

function MultiChoice({ options, value, onChange, columns = 3 }: { options: string[]; value: string[]; onChange: (value: string[]) => void; columns?: number }) {
    const t = useTranslation();
    const grid = columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';
    return <div className={`grid grid-cols-1 gap-2 ${grid}`}>{options.map(option => {
        const selected = value.includes(option);
        return <button type="button" key={option} onClick={() => onChange(selected ? value.filter(item => item !== option) : [...value, option])} className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${selected ? 'border-[#b9995f] bg-[#f8f1e3] text-[#173e38]' : 'border-[#e5ded1] bg-[#fcfbf8] text-[#58635f] hover:border-[#c9b991]'}`}><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selected ? 'border-[#173e38] bg-[#173e38] text-white' : 'border-[#bdb5a7]'}`}>{selected && <Check size={13} />}</span>{t(option)}</button>;
    })}</div>;
}

function SingleChoice({ options, value, onChange, columns = 2 }: { options: string[]; value: string; onChange: (value: string) => void; columns?: number }) {
    const t = useTranslation();
    return <div className={`grid grid-cols-1 gap-2 ${columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>{options.map(option => <button type="button" key={option} onClick={() => onChange(option)} className={`rounded-xl border p-3 text-left text-sm transition ${value === option ? 'border-[#1d4f47] bg-[#eef5f2] font-semibold text-[#173e38]' : 'border-[#e5ded1] bg-[#fcfbf8] text-[#58635f]'}`}>{t(option)}</button>)}</div>;
}

function YesNoChoice({ value, onChange }: { value: YesNo; onChange: (value: YesNo) => void }) {
    return <SingleChoice options={['Sí', 'No']} value={value === 'yes' ? 'Sí' : value === 'no' ? 'No' : ''} onChange={answer => onChange(answer === 'Sí' ? 'yes' : 'no')} />;
}

function Question({ number, children }: { number: number; children: React.ReactNode }) {
    const t = useTranslation();
    return <h3 className="mb-3 mt-7 text-sm font-semibold leading-6 text-[#263934]"><span className="mr-2 text-[#a67f43]">{number}.</span>{typeof children === 'string' ? t(children) : children}</h3>;
}

function SignatureField({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
    const t = useTranslation();
    const ref = useRef<SignatureCanvas | null>(null);
    if (value) return <div className="rounded-2xl border border-[#cfc5b2] bg-white p-4"><p className="mb-2 text-sm font-bold text-[#173e38]">{t(label)}</p><Image src={value} alt={t('Firma digital')} unoptimized width={900} height={220} className="h-32 w-full rounded-xl border border-dashed border-[#c9b991] object-contain" /><button type="button" onClick={() => onChange('')} className="mt-2 text-xs font-bold text-[#8b5d3b] underline">{t('Firmar nuevamente')}</button></div>;
    const saveSignature = () => {
        if (!ref.current || ref.current.isEmpty()) return alert(t('Dibuje su firma antes de guardarla.'));
        onChange(ref.current.getTrimmedCanvas().toDataURL('image/png'));
    };
    return <div className="rounded-2xl border border-[#cfc5b2] bg-white p-4"><p className="mb-1 text-sm font-bold text-[#173e38]">{t(label)}</p><p className="mb-3 text-xs text-[#77807c]">{t('Firma con el dedo o el puntero. Puedes realizar todos los trazos antes de guardarla.')}</p><div className={`${styles.signatureCanvas} overflow-hidden rounded-xl border-2 border-dashed border-[#c9b991] bg-[#fdfcf8]`}><SignatureCanvas ref={ref} penColor="#173e38" canvasProps={{ className: 'h-44 w-full', style: { touchAction: 'none' } }} /></div><div className="mt-3 flex gap-3"><button type="button" onClick={() => ref.current?.clear()} className="text-xs font-bold text-[#8b5d3b] underline">{t('Limpiar')}</button><button type="button" onClick={saveSignature} className="rounded-full bg-[#173e38] px-4 py-2 text-xs font-bold text-white">{t('Guardar firma')}</button></div></div>;
}

function InitialStatements({ statements, values, onChange }: { statements: string[]; values: string[]; onChange: (values: string[]) => void }) {
    const t = useTranslation();
    return <div className="space-y-3">{statements.map((statement, index) => <div key={statement} className="grid gap-3 rounded-xl border border-[#e4ddd0] bg-[#fbfaf7] p-4 sm:grid-cols-[90px_1fr]"><label className="text-xs font-bold uppercase tracking-wider text-[#8e7040]">{t('Iniciales')}<input value={values[index] || ''} maxLength={4} onChange={event => { const next = [...values]; next[index] = event.target.value; onChange(next); }} className="mt-2 text-center uppercase" /></label><p className="text-sm leading-6 text-[#4f5b57]">{t(statement)}</p></div>)}</div>;
}

export default function AestheticsConsent({ lang, onLanguageChange, onBack }: { lang: Language; onLanguageChange: () => void; onBack: () => void }) {
    const data = useAestheticsConsentStore(state => state.data);
    const setData = useAestheticsConsentStore(state => state.setData);
    const stepIndex = useAestheticsConsentStore(state => state.stepIndex);
    const setStepIndex = useAestheticsConsentStore(state => state.setStepIndex);
    const [loading, setLoading] = useState(false);
    const [savedCopy, setSavedCopy] = useState<{ blob: Blob; fileName: string } | null>(null);
    const [validationMessage, setValidationMessage] = useState('');
    const pageTopRef = useRef<HTMLDivElement | null>(null);
    const t = useMemo(() => (value: string) => translateAesthetics(lang, value), [lang]);
    const langRef = useRef(lang);
    langRef.current = lang;

    useEffect(() => {
        void Promise.resolve(useAestheticsConsentStore.persist.rehydrate()).then(() => {
            setData(previous => ({ ...previous, language: langRef.current }));
        });
    }, [setData]);

    useEffect(() => setData(previous => ({ ...previous, language: lang })), [lang, setData]);

    const setField = <K extends keyof AestheticsFormData>(key: K, value: AestheticsFormData[K]) => {
        setValidationMessage('');
        setData(previous => ({ ...previous, [key]: value }));
    };
    const hasMicro = data.selectedServices.includes('microneedling');
    const hasPeel = data.selectedServices.includes('peel');
    const steps = useMemo(() => [
        { id: 'service', label: 'Servicio' }, { id: 'skin', label: 'Tu piel' }, { id: 'routine', label: 'Rutina' }, { id: 'procedures', label: 'Tratamientos' },
        { id: 'health', label: 'Salud' }, { id: 'preferences', label: 'Preferencias' }, { id: 'general', label: 'Consentimiento' },
        ...(hasMicro ? [{ id: 'micro', label: 'Microneedling' }] : []), ...(hasPeel ? [{ id: 'peel', label: 'Peeling' }] : []),
    ], [hasMicro, hasPeel]);
    const step = steps[Math.min(stepIndex, steps.length - 1)];

    useEffect(() => {
        if (stepIndex >= steps.length) setStepIndex(steps.length - 1);
    }, [stepIndex, steps.length, setStepIndex]);

    const revealPage = () => {
        requestAnimationFrame(() => requestAnimationFrame(() => {
            pageTopRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
            pageTopRef.current?.focus({ preventScroll: true });
        }));
    };

    const previous = () => {
        if (stepIndex === 0) return onBack();
        setStepIndex(index => index - 1);
        setValidationMessage('');
        revealPage();
    };
    const next = () => {
        if (step.id === 'service' && data.selectedServices.length === 0) {
            setValidationMessage(lang === 'en' ? 'Select at least one service before continuing.' : 'Selecciona al menos un servicio antes de continuar.');
            return;
        }
        if (step.id === 'skin' && (!data.firstName || !data.lastName || !data.phone || !data.email)) {
            const missing = [
                !data.firstName && (lang === 'en' ? 'first name' : 'nombre'),
                !data.lastName && (lang === 'en' ? 'last name' : 'apellido'),
                !data.phone && (lang === 'en' ? 'phone' : 'teléfono'),
                !data.email && 'email',
            ].filter(Boolean).join(', ');
            setValidationMessage(lang === 'en' ? `Complete the following fields: ${missing}.` : `Completa los siguientes campos: ${missing}.`);
            return;
        }
        setValidationMessage('');
        setStepIndex(index => Math.min(index + 1, steps.length - 1));
        revealPage();
    };

    const submit = async () => {
        if (!data.generalConsentAccepted || !data.clientSignature) return alert(lang === 'en' ? 'You must accept and sign the general consent.' : 'Debe aceptar y firmar el consentimiento general.');
        const microInitials = [...data.microInitials, data.microPigmentationInitials, data.microScarringInitials, data.microAftercareInitials];
        if (hasMicro && microInitials.some(value => !value.trim())) return alert(lang === 'en' ? 'Complete all initials in the microneedling consent.' : 'Complete todas las iniciales del consentimiento de microneedling.');
        if (hasMicro && (!data.microAccepted || !data.microSignature)) return alert(lang === 'en' ? 'You must accept and sign the microneedling consent.' : 'Debe aceptar y firmar el consentimiento de microneedling.');
        const peelInitials = [...data.peelInitials, data.peelAllergyInitials, data.peelSunInitials, data.peelSunscreenInitials, data.peelAftercareInitials, data.peelReactionInitials];
        if (hasPeel && peelInitials.some(value => !value.trim())) return alert(lang === 'en' ? 'Complete all initials in the chemical peel consent.' : 'Complete todas las iniciales del consentimiento de peeling químico.');
        if (hasPeel && (!data.peelAccepted || !data.peelSignature)) return alert(lang === 'en' ? 'You must accept and sign the chemical peel consent.' : 'Debe aceptar y firmar el consentimiento de peeling químico.');
        setLoading(true);
        try {
            const completed = { ...data, signedAt: new Date().toISOString() };
            const blob = await pdf(<AestheticsPdfTemplate data={completed} />).toBlob();
            const fileName = `BCM_Estetica_${data.firstName}_${data.lastName}_${Date.now()}.pdf`;
            const body = new FormData();
            body.append('file', blob, fileName); body.append('clientName', `${data.firstName} ${data.lastName}`); body.append('consentType', 'aesthetics'); body.append('language', lang);
            const response = await fetch('/api/upload', { method: 'POST', body });
            if (!response.ok) throw new Error('Upload failed');
            setSavedCopy({ blob, fileName });
            setData(completed);
            useAestheticsConsentStore.persist.clearStorage();
            alert(lang === 'en' ? 'Aesthetic consent saved successfully.' : 'Consentimiento estético guardado correctamente.');
        } catch (error) {
            console.error(error); alert(lang === 'en' ? 'The consent could not be saved. Please try again.' : 'No se pudo guardar el consentimiento. Inténtelo nuevamente.');
        } finally { setLoading(false); }
    };

    const isLast = stepIndex === steps.length - 1;
    const card = "bg-[#f2ece1] p-5 sm:rounded-[1.75rem] sm:border sm:border-[#ded7c9] sm:bg-white sm:p-8 sm:shadow-[0_18px_55px_rgba(23,62,56,0.07)]";

    return <TranslationContext.Provider value={t}><main className={`${styles.page} min-h-screen bg-[#f4f0e7] font-sans sm:px-4 sm:py-10`}>
        <div className="mx-auto max-w-5xl overflow-hidden bg-[#f8f5ee] sm:rounded-[2rem] sm:border sm:border-white sm:shadow-[0_30px_90px_rgba(13,49,43,.2)]">
            <header className="relative min-h-[360px] overflow-hidden bg-[#123a34] text-white sm:min-h-[430px]">
                <Image src="/images/aesthetics-consent-hero.png" alt="Consulta estética profesional" fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover object-[67%_center]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#102f2b] via-[#123a34]/90 to-[#123a34]/10"></div>
                <div className="relative z-10 flex min-h-[360px] max-w-xl flex-col justify-between p-6 sm:min-h-[430px] sm:p-10">
                    <div className="flex items-center justify-between gap-3"><button type="button" onClick={onBack} className="flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs font-bold backdrop-blur"><ArrowLeft size={14} /> {t('Cambiar tipo de consentimiento')}</button><button type="button" onClick={onLanguageChange} className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">{lang === 'en' ? 'Español' : 'English'}</button></div>
                    <div><p className="mb-3 text-xs font-bold uppercase tracking-[.28em] text-[#e0c58d]">Between Curves Massage and Facials</p><h1 className="font-display text-4xl font-semibold leading-none sm:text-6xl">{t('Consulta y consentimiento de estética')}</h1><p className="mt-4 max-w-md text-sm leading-6 text-[#e5eeeb]">{t('Una evaluación cuidadosa para personalizar tu tratamiento, proteger tu piel y acompañar tus objetivos.')}</p><div className="mt-5 flex gap-2"><span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs">{t('Privado')}</span><span className="rounded-full border border-[#dfc287]/25 bg-[#dfc287]/10 px-3 py-1.5 text-xs text-[#f0d7a5]">{lang === 'en' ? 'Version' : 'Versión'} {AESTHETICS_CONSENT_VERSION}</span></div></div>
                </div>
            </header>

            <div ref={pageTopRef} tabIndex={-1} className="scroll-mt-3 bg-[#e8dfd1] px-5 py-5 outline-none sm:border-b sm:border-[#ded7c9] sm:bg-white/95 sm:px-8" aria-live="polite">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-3 flex items-end justify-between gap-4">
                        <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#a67f43]">{t('Página')} {stepIndex + 1} {t('de')} {steps.length}</p><p className="mt-1 font-display text-xl font-semibold text-[#173e38]">{t(step.label)}</p></div>
                        <span className="shrink-0 text-sm font-bold text-[#67736f]">{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#ebe5da]" aria-label={`Progreso: página ${stepIndex + 1} de ${steps.length}`}><div className="h-full rounded-full bg-gradient-to-r from-[#173e38] to-[#c3a064] transition-all duration-500" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div>
                </div>
            </div>

            <form className={`${styles.form} space-y-3 pb-5 sm:p-8`} onSubmit={event => event.preventDefault()}>
                <div key={step.id} className={styles.stepTransition}>
                {step.id === 'service' && <section className={card}><SectionTitle eyebrow="Paso 01" title="Selecciona tu tratamiento" description="Mostraremos únicamente las preguntas y autorizaciones que correspondan a tu servicio." icon={<Sparkles size={20} />} /><div className="grid gap-3 sm:grid-cols-3">{services.map(service => { const selected = data.selectedServices.includes(service.id); return <button type="button" key={service.id} onClick={() => setField('selectedServices', selected ? data.selectedServices.filter(item => item !== service.id) : [...data.selectedServices, service.id])} className={`min-h-36 rounded-2xl border p-5 text-left transition ${selected ? 'border-[#b69255] bg-[#f8f1e2] shadow-md' : 'border-[#ded7c9] bg-[#fcfbf8]'}`}><span className={`mb-5 flex h-8 w-8 items-center justify-center rounded-full ${selected ? 'bg-[#173e38] text-white' : 'bg-[#eee8dd] text-[#8c806a]'}`}>{selected ? <Check size={17} /> : <Leaf size={17} />}</span><strong className="block font-display text-xl text-[#173e38]">{t(service.title)}</strong><span className="mt-2 block text-xs leading-5 text-[#6d7773]">{t(service.note)}</span></button>; })}</div></section>}

                {step.id === 'skin' && <section className={card}><SectionTitle eyebrow="Paso 02" title="Información y antecedentes de tu piel" description="Conocer tu piel y tus expectativas nos permite preparar una sesión más segura y personalizada." icon={<UserRound size={20} />} />
                    <div className="grid gap-4 sm:grid-cols-2"><label>{t('Nombre')}<input required value={data.firstName} onChange={e => setField('firstName', e.target.value)} /></label><label>{t('Apellido')}<input required value={data.lastName} onChange={e => setField('lastName', e.target.value)} /></label><label>{t('Fecha de nacimiento')}<input type="date" value={data.dob} onChange={e => setField('dob', e.target.value)} /></label><label>{t('Teléfono')}<input required type="tel" value={data.phone} onChange={e => setField('phone', e.target.value)} /></label><label>Email<input required type="email" value={data.email} onChange={e => setField('email', e.target.value)} /></label><label>{t('Contacto de emergencia')}<input value={data.emergencyName} onChange={e => setField('emergencyName', e.target.value)} /></label><label>{t('Teléfono de emergencia')}<input value={data.emergencyPhone} onChange={e => setField('emergencyPhone', e.target.value)} /></label><label>{t('Profesional del cuidado de la piel')}<input value={data.professionalName} onChange={e => setField('professionalName', e.target.value)} /></label></div>
                    <Question number={1}>¿Qué te gustaría mejorar de tu piel?</Question><MultiChoice options={skinGoals} value={data.skinGoals} onChange={value => setField('skinGoals', value)} /><label className="mt-3 block">{t('Otro objetivo')}<input value={data.otherSkinGoal} onChange={e => setField('otherSkinGoal', e.target.value)} /></label>
                    <Question number={2}>¿Te has realizado tratamientos faciales anteriormente?</Question><YesNoChoice value={data.priorFacials} onChange={value => setField('priorFacials', value)} />{data.priorFacials === 'yes' && <label className="mt-3 block">{t('¿Cuáles?')}<textarea value={data.priorFacialsDetails} onChange={e => setField('priorFacialsDetails', e.target.value)} /></label>}
                    <Question number={3}>¿Cómo describirías tu piel actualmente?</Question><SingleChoice options={skinTypes} value={data.skinType} onChange={value => setField('skinType', value)} />
                    <Question number={4}>Cuando te expones al sol sin protector, ¿cómo reacciona normalmente tu piel?</Question><SingleChoice options={sunReactions} value={data.sunReaction} onChange={value => setField('sunReaction', value)} /><div className="mt-4 rounded-2xl border border-[#dacba9] bg-[#faf5e9] p-4"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#8e7040]">{t('Para uso del profesional · Fototipo Fitzpatrick')}</p><SingleChoice options={['I', 'II', 'III', 'IV', 'V', 'VI']} value={data.fitzpatrick} onChange={value => setField('fitzpatrick', value)} columns={3} /></div>
                    <Question number={5}>¿Tu piel presenta frecuentemente alguno de estos síntomas?</Question><MultiChoice options={skinSymptoms} value={data.skinSymptoms} onChange={value => setField('skinSymptoms', value)} />
                    <Question number={6}>¿Cómo suele reaccionar tu piel después de un granito, irritación o lesión?</Question><SingleChoice options={['Cicatriza normalmente', 'Tiende a dejar manchas', 'Tiende a dejar cicatrices', 'No estoy seguro/a']} value={data.healingReaction} onChange={value => setField('healingReaction', value)} />
                    <Question number={7}>¿Te salen moretones fácilmente?</Question><YesNoChoice value={data.bruisesEasily} onChange={value => setField('bruisesEasily', value)} />
                    <Question number={8}>¿Has tenido herpes labial, herpes zóster/culebrilla u otras lesiones recurrentes?</Question><YesNoChoice value={data.recurringLesions} onChange={value => setField('recurringLesions', value)} /><label className="mt-3 block">{t('Explique')}<input value={data.recurringLesionsDetails} onChange={e => setField('recurringLesionsDetails', e.target.value)} /></label>
                </section>}

                {step.id === 'routine' && <section className={card}><SectionTitle eyebrow="Paso 03" title="Rutina y exposición solar" description="Los productos y la exposición reciente pueden cambiar la forma en que tu piel responde." icon={<SunMedium size={20} />} />
                    <Question number={9}>¿Qué utilizas actualmente en casa?</Question><MultiChoice options={homeProducts} value={data.homeProducts} onChange={value => setField('homeProducts', value)} /><label className="mt-3 block">{t('Otro producto')}<input value={data.otherHomeProduct} onChange={e => setField('otherHomeProduct', e.target.value)} /></label>
                    <Question number={10}>¿Te gustaría que evaluemos y organicemos tu rutina actual de skincare?</Question><YesNoChoice value={data.routineReview} onChange={value => setField('routineReview', value)} /><p className="mt-3 rounded-xl bg-[#f7f2e7] p-4 text-sm text-[#5d655f]">{lang === 'en' ? 'If yes, share the names or clear photographs of your products before your appointment.' : 'Si respondiste Sí, comparte antes de tu cita los nombres o fotografías claras de tus productos.'}</p>
                    <Question number={11}>¿Estarías dispuesto/a a realizar cambios en tu rutina si fueran recomendados?</Question><SingleChoice options={['Sí', 'Depende de las recomendaciones', 'No']} value={data.routineChanges} onChange={value => setField('routineChanges', value)} />
                    <Question number={12}>¿Te expones frecuentemente al sol?</Question><YesNoChoice value={data.sunExposure} onChange={value => setField('sunExposure', value)} />
                    <Question number={13}>¿Utilizas protector solar diariamente?</Question><SingleChoice options={['Sí', 'Algunas veces', 'No']} value={data.sunscreenUse} onChange={value => setField('sunscreenUse', value)} />
                    <Question number={14}>¿Utilizas camas de bronceado?</Question><YesNoChoice value={data.tanningBeds} onChange={value => setField('tanningBeds', value)} />{data.tanningBeds === 'yes' && <label className="mt-3 block">{lang === 'en' ? 'How often?' : '¿Con qué frecuencia?'}<input value={data.tanningFrequency} onChange={e => setField('tanningFrequency', e.target.value)} /></label>}
                </section>}

                {step.id === 'procedures' && <section className={card}><SectionTitle eyebrow="Paso 04" title="Procedimientos, medicamentos y tratamientos" description="Las fechas y activos recientes son importantes para espaciar correctamente los procedimientos." icon={<FileCheck2 size={20} />} />
                    <Question number={15}>¿Te has realizado alguno de los siguientes procedimientos?</Question><div className="space-y-2">{Object.entries(procedureLabels).map(([key, label]) => { const item = data.pastProcedures[key]; return <div key={key} className={`grid gap-3 rounded-xl border p-3 sm:grid-cols-[1fr_220px] ${item.selected ? 'border-[#b99a62] bg-[#faf3e6]' : 'border-[#e5ded1]'}`}><button type="button" onClick={() => setField('pastProcedures', { ...data.pastProcedures, [key]: { ...item, selected: !item.selected } })} className="flex items-center gap-3 text-left text-sm"><span className={`flex h-5 w-5 items-center justify-center rounded border ${item.selected ? 'bg-[#173e38] text-white' : ''}`}>{item.selected && <Check size={13} />}</span>{t(label)}</button>{item.selected && <input placeholder={lang === 'en' ? 'Type and most recent date' : 'Tipo y fecha más reciente'} value={item.details} onChange={e => setField('pastProcedures', { ...data.pastProcedures, [key]: { ...item, details: e.target.value } })} />}</div>; })}</div>
                    <Question number={16}>¿Tienes programado próximamente alguno de estos procedimientos?</Question><MultiChoice options={plannedProcedureOptions} value={data.plannedProcedures} onChange={value => setField('plannedProcedures', value)} /><div className="mt-3 grid gap-3 sm:grid-cols-2"><label>{lang === 'en' ? 'Other procedure' : 'Otro procedimiento'}<input value={data.otherPlannedProcedure} onChange={e => setField('otherPlannedProcedure', e.target.value)} /></label><label>{t('Fecha prevista')}<input value={data.plannedDate} onChange={e => setField('plannedDate', e.target.value)} /></label></div>
                    <Question number={17}>¿Actualmente estás bajo tratamiento de un dermatólogo o médico por alguna condición de la piel?</Question><YesNoChoice value={data.dermatologistCare} onChange={value => setField('dermatologistCare', value)} /><label className="mt-3 block">En caso afirmativo, explique<textarea value={data.dermatologistDetails} onChange={e => setField('dermatologistDetails', e.target.value)} /></label>
                    <Question number={18}>¿Qué medicamentos, vitaminas, suplementos o terapia hormonal utilizas actualmente?</Question><textarea value={data.medications} onChange={e => setField('medications', e.target.value)} />
                    <Question number={19}>¿Utilizas actualmente o has utilizado recientemente alguno de los siguientes?</Question><MultiChoice options={skinMedications} value={data.skinMedications} onChange={value => setField('skinMedications', value)} /><label className="mt-3 block">¿Cuál y cuándo fue la última vez que lo utilizaste?<textarea value={data.skinMedicationDetails} onChange={e => setField('skinMedicationDetails', e.target.value)} /></label>
                </section>}

                {step.id === 'health' && <section className={card}><SectionTitle eyebrow="Paso 05" title="Historial de salud" description="Esta información permite identificar precauciones y adaptar o posponer un tratamiento cuando corresponda." icon={<HeartPulse size={20} />} />
                    <Question number={20}>Indica si tienes actualmente o has tenido alguna de las siguientes condiciones:</Question><div className="space-y-2">{Object.entries(healthConditionLabels).map(([key, label]) => { const item = data.healthConditions[key]; return <div key={key} className="grid gap-3 rounded-xl border border-[#e5ded1] bg-[#fcfbf8] p-3 sm:grid-cols-[1fr_170px_1fr] sm:items-center"><span className="text-sm font-medium text-[#3c4844]">{t(label)}</span><div className="flex gap-2">{(['yes', 'no'] as YesNo[]).map(answer => <button type="button" key={answer} onClick={() => setField('healthConditions', { ...data.healthConditions, [key]: { ...item, answer } })} className={`rounded-full border px-3 py-1.5 text-xs font-bold ${item.answer === answer ? 'border-[#173e38] bg-[#173e38] text-white' : 'border-[#d4ccbe]'}`}>{answer === 'yes' ? t('Sí') : t('No')}</button>)}</div><input placeholder={t(key === 'metalImplants' ? 'Ubicación / información adicional' : 'Información adicional')} value={item.details} onChange={e => setField('healthConditions', { ...data.healthConditions, [key]: { ...item, details: e.target.value } })} /></div>; })}</div>
                    <h3 className="mb-3 mt-5 text-sm font-semibold">{t('Presión arterial')}</h3><SingleChoice options={['Alta', 'Baja', 'Normal', 'No sé']} value={data.bloodPressure} onChange={value => setField('bloodPressure', value)} />
                    <Question number={21}>¿Existe alguna otra condición médica, cirugía reciente o información de salud que debamos conocer?</Question><YesNoChoice value={data.otherMedical} onChange={value => setField('otherMedical', value)} /><label className="mt-3 block">Explique<textarea value={data.otherMedicalDetails} onChange={e => setField('otherMedicalDetails', e.target.value)} /></label>
                    <Question number={22}>¿Has presentado alguna reacción o sensibilidad a alguno de los siguientes?</Question><MultiChoice options={reactionTypes} value={data.reactions} onChange={value => setField('reactions', value)} /><div className="mt-3 grid gap-3 sm:grid-cols-2"><label>Otro tipo<input value={data.otherReaction} onChange={e => setField('otherReaction', e.target.value)} /></label><label>Explique<textarea value={data.reactionDetails} onChange={e => setField('reactionDetails', e.target.value)} /></label></div>
                </section>}

                {step.id === 'preferences' && <section className={card}><SectionTitle eyebrow="Paso 06" title="Preferencias, comodidad y objetivos" description="Queremos cuidar tanto tu piel como tu comodidad durante toda la experiencia." icon={<Leaf size={20} />} />
                    <Question number={23}>¿Tienes alergia, sensibilidad o molestia con algún aroma o producto perfumado?</Question><SingleChoice options={['No', 'Sí', 'Prefiero un ambiente sin fragancias']} value={data.fragrancePreference} onChange={value => setField('fragrancePreference', value)} /><label className="mt-3 block">Especifique<input value={data.fragranceDetails} onChange={e => setField('fragranceDetails', e.target.value)} /></label>
                    <Question number={24}>¿Te sientes cómodo/a con aromas ambientales como velas aromáticas o incienso?</Question><YesNoChoice value={data.ambientAromas} onChange={value => setField('ambientAromas', value)} />
                    <div className="mt-8 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-[#eadcc0] bg-[#fbf6eb] p-5"><h3 className="font-display text-xl font-semibold text-[#173e38]">{t('Para mujeres')}</h3><p className="mb-4 mt-1 text-xs text-[#777d79]">25. {t('Marca cualquiera que corresponda.')}</p><MultiChoice options={womenOptions} value={data.womenHealth} onChange={value => setField('womenHealth', value)} columns={2} /></div><div className="rounded-2xl border border-[#d9e5e0] bg-[#f1f6f4] p-5"><h3 className="font-display text-xl font-semibold text-[#173e38]">{t('Para hombres')}</h3><p className="mb-2 mt-1 text-xs text-[#777d79]">26. {t('¿Cómo te afeitas habitualmente?')}</p><SingleChoice options={['Cuchilla / maquinilla manual', 'Afeitadora eléctrica', 'Otro']} value={data.shavingMethod} onChange={value => setField('shavingMethod', value)} /><input placeholder={t('Otro método')} value={data.otherShavingMethod} onChange={e => setField('otherShavingMethod', e.target.value)} /><p className="mb-2 mt-4 text-xs text-[#777d79]">27. {t('¿Presentas habitualmente?')}</p><MultiChoice options={maleSymptoms} value={data.maleSkinSymptoms} onChange={value => setField('maleSkinSymptoms', value)} columns={2} /></div></div>
                    <Question number={28}>¿Cómo describirías tu nivel de estrés habitual?</Question><SingleChoice options={['Bajo', 'Moderado', 'Alto']} value={data.stressLevel} onChange={value => setField('stressLevel', value)} columns={3} />
                    <Question number={29}>¿Duermes bien habitualmente?</Question><SingleChoice options={['Sí', 'A veces', 'No']} value={data.sleepsWell} onChange={value => setField('sleepsWell', value)} columns={3} />
                    <Question number={30}>¿Realizas actividad física regularmente?</Question><YesNoChoice value={data.physicalActivity} onChange={value => setField('physicalActivity', value)} />
                    <Question number={31}>¿Consideras que te mantienes adecuadamente hidratado/a?</Question><SingleChoice options={['Sí', 'A veces', 'No']} value={data.hydration} onChange={value => setField('hydration', value)} columns={3} />
                    <Question number={32}>¿Tienes alguna alergia o intolerancia alimentaria?</Question><YesNoChoice value={data.foodAllergy} onChange={value => setField('foodAllergy', value)} /><label className="mt-3 block">¿Cuál?<input value={data.foodAllergyDetails} onChange={e => setField('foodAllergyDetails', e.target.value)} /></label>
                    <Question number={33}>Si recomendamos un plan, ¿estarías dispuesto/a a seguir varias sesiones y cuidados en casa?</Question><SingleChoice options={['Sí, estoy dispuesto/a a ser constante.', 'Tal vez; me gustaría conocer primero el plan y el costo.', 'Prefiero realizar tratamientos individuales.']} value={data.treatmentProgram} onChange={value => setField('treatmentProgram', value)} />
                    <Question number={34}>¿Autorizas fotografías para tu expediente y seguimiento de resultados?</Question><YesNoChoice value={data.clinicalPhotos} onChange={value => setField('clinicalPhotos', value)} />
                    <Question number={35}>¿Autorizas fotografías o videos para educación, marketing y redes sociales?</Question><YesNoChoice value={data.marketingMedia} onChange={value => setField('marketingMedia', value)} />{data.marketingMedia === 'yes' && <div className="mt-3"><MultiChoice options={['Puede mostrarse mi rostro', 'Solo contenido donde no pueda ser identificado/a', 'Fotografías de antes y después']} value={data.mediaVisibility} onChange={value => setField('mediaVisibility', value)} /></div>}<p className="mt-3 text-xs text-[#727a76]">{t('Tu decisión no afectará los servicios que recibas.')}</p>
                    <Question number={36}>¿Te gustaría recibir promociones, descuentos y novedades?</Question><YesNoChoice value={data.promotions} onChange={value => setField('promotions', value)} />{data.promotions === 'yes' && <div className="mt-3"><MultiChoice options={['Mensaje de texto / SMS', 'Email']} value={data.promotionChannels} onChange={value => setField('promotionChannels', value)} /></div>}
                </section>}

                {step.id === 'general' && <section className={card}><SectionTitle eyebrow="Consentimiento general" title="Información clara, decisión informada" description="Lee cuidadosamente este consentimiento antes de firmar." icon={<ShieldCheck size={20} />} /><div className="space-y-4 rounded-2xl border border-[#ded7c9] bg-[#f8f6f1] p-5 text-sm leading-7 text-[#52605b]"><p>{lang === 'en' ? 'I' : 'Yo'}, <strong>{`${data.firstName} ${data.lastName}`.trim() || (lang === 'en' ? 'client' : 'cliente')}</strong>, {lang === 'en' ? 'certify that the information provided is true, accurate, and complete to the best of my knowledge.' : 'certifico que la información proporcionada es verdadera, exacta y completa según mi conocimiento.'}</p><p>{t('Comprendo que los servicios prestados por Between Curves Massage and Facials tienen fines estéticos y de cuidado de la piel y no sustituyen el diagnóstico, tratamiento o atención de un profesional médico autorizado.')}</p><p>{lang === 'en' ? 'I confirm that I have disclosed medical conditions, allergies, sensitivities, medications, topical products, pregnancy or breastfeeding, and recent or scheduled procedures that may affect my treatment. I agree to report relevant changes before future sessions.' : 'Confirmo haber informado sobre condiciones médicas, alergias, sensibilidades, medicamentos, productos tópicos, embarazo o lactancia y procedimientos recientes o programados que puedan afectar mi tratamiento. Me comprometo a comunicar cambios relevantes antes de futuras sesiones.'}</p><p>{lang === 'en' ? 'I understand that results vary and may depend on skin condition, health, lifestyle, medications, home care, consistency, and individual response.' : 'Comprendo que los resultados varían y pueden depender del estado de la piel, salud, estilo de vida, medicamentos, cuidados en casa, constancia y respuesta individual.'}</p><p>{lang === 'en' ? 'I understand that some procedures may cause temporary redness, sensitivity, dryness, peeling, swelling, or irritation.' : 'Comprendo que determinados procedimientos pueden producir efectos temporales como enrojecimiento, sensibilidad, sequedad, descamación, inflamación o irritación.'}</p><p>{lang === 'en' ? 'I understand that the professional may modify, postpone, or decline a procedure and recommend medical evaluation when appropriate. I have had the opportunity to ask questions and voluntarily consent to the agreed aesthetic services.' : 'Entiendo que el profesional podrá modificar, posponer o no realizar un procedimiento y recomendar una evaluación médica cuando corresponda. He tenido la oportunidad de realizar preguntas y consiento voluntariamente recibir los servicios estéticos acordados.'}</p></div><label className="my-5 flex cursor-pointer gap-3 rounded-2xl border border-[#9fbdb2] bg-[#edf5f2] p-5"><input type="checkbox" checked={data.generalConsentAccepted} onChange={e => setField('generalConsentAccepted', e.target.checked)} /><span className="text-sm font-bold text-[#173e38]">{t('He leído, comprendo y acepto voluntariamente el consentimiento informado general.')}</span></label><SignatureField label="Firma digital del cliente" value={data.clientSignature} onChange={value => setField('clientSignature', value)} /><div className="mt-5 rounded-xl border border-dashed border-[#c9b991] p-4 text-sm text-[#68736f]"><strong>{lang === 'en' ? 'Professional signature:' : 'Firma del profesional:'}</strong> {lang === 'en' ? 'will be completed in the record at the time of service.' : 'se completará en el expediente al momento del servicio.'}</div><div className="mt-6 rounded-2xl bg-[#173e38] p-5 text-white"><h3 className="font-display text-xl">{t('Después de tu visita')}</h3><p className="mt-2 text-sm leading-6 text-[#dbe8e4]">{t('Tu experiencia nos importa. Después de tu sesión podrás compartirla mediante una reseña. Tus comentarios nos ayudan a seguir mejorando y ayudan a otros clientes a conocer nuestros servicios.')}</p></div></section>}

                {step.id === 'micro' && <section className={card}><SectionTitle eyebrow="Consentimiento específico" title="Microneedling" description="Beneficios, limitaciones, efectos esperados, riesgos y cuidados específicos del procedimiento." icon={<Sparkles size={20} />} /><div className="rounded-2xl bg-[#f7f2e8] p-5 text-sm leading-7 text-[#52605b]"><p>Entiendo que el microneedling utiliza microagujas para crear microcanales controlados en la piel, estimulando los procesos naturales de reparación y producción de colágeno. Puede ayudar con textura irregular, cicatrices de acné, líneas finas, poros y manchas.</p><p className="mt-3">Los resultados varían y pueden recomendarse varias sesiones. No se garantiza un resultado específico.</p></div><h3 className="mb-4 mt-7 font-display text-2xl text-[#173e38]">Confirmación</h3><InitialStatements statements={microneedlingConfirmations} values={data.microInitials} onChange={value => setField('microInitials', value)} /><h3 className="mb-3 mt-7 font-display text-2xl text-[#173e38]">Contraindicaciones y precauciones</h3><MultiChoice options={microneedlingContraindications} value={data.microContraindications} onChange={value => setField('microContraindications', value)} columns={2} /><label className="mt-3 block">Si seleccionaste alguna, explica cuál y cuándo<textarea value={data.microContraindicationDetails} onChange={e => setField('microContraindicationDetails', e.target.value)} /></label><p className="mt-4 rounded-xl border border-[#dfcda9] bg-[#fbf6eb] p-4 text-sm leading-6">Seleccionar una opción no determina automáticamente si el procedimiento puede realizarse. La información será evaluada y el tratamiento podrá modificarse, posponerse o requerir evaluación médica.</p><h3 className="mb-3 mt-7 font-display text-2xl text-[#173e38]">Pigmentación, cicatrización y cuidados</h3><InitialStatements statements={["Entiendo que pueden producirse cambios de pigmentación, incluyendo hiperpigmentación postinflamatoria, y que el riesgo varía según mi piel, antecedentes, exposición solar y cuidados posteriores.", "Entiendo que existe un riesgo poco frecuente de cicatrización anormal, incluyendo cicatrices hipertróficas o queloides.", "Me comprometo a seguir las instrucciones posteriores, usar protección solar, evitar los productos y procedimientos indicados y no manipular descamación o costras."]} values={[data.microPigmentationInitials, data.microScarringInitials, data.microAftercareInitials]} onChange={values => { setData(previous => ({ ...previous, microPigmentationInitials: values[0], microScarringInitials: values[1], microAftercareInitials: values[2] })); }} /><label className="my-5 flex gap-3 rounded-2xl border border-[#9fbdb2] bg-[#edf5f2] p-5"><input type="checkbox" checked={data.microAccepted} onChange={e => setField('microAccepted', e.target.checked)} /><span className="text-sm font-bold text-[#173e38]">He leído, comprendo y consiento voluntariamente recibir el procedimiento de microneedling.</span></label><SignatureField label="Firma digital — Microneedling" value={data.microSignature} onChange={value => setField('microSignature', value)} /></section>}

                {step.id === 'peel' && <section className={card}><SectionTitle eyebrow="Consentimiento específico" title="Peeling químico" description="Información específica sobre exfoliación química, precauciones, exposición solar y cuidados posteriores." icon={<Sparkles size={20} />} /><div className="rounded-2xl bg-[#f7f2e8] p-5 text-sm leading-7 text-[#52605b]"><p>Entiendo que un peeling químico consiste en la aplicación profesional y controlada de una solución química para producir una exfoliación de profundidad variable y favorecer la renovación cutánea.</p><p className="mt-3">El profesional evaluará mi piel y seleccionará el tipo de peeling y protocolo que considere más adecuado y seguro. El tratamiento puede variar entre sesiones según la evolución y respuesta de mi piel.</p></div><h3 className="mb-4 mt-7 font-display text-2xl text-[#173e38]">Confirmación del cliente</h3><InitialStatements statements={peelConfirmations} values={data.peelInitials} onChange={value => setField('peelInitials', value)} /><h3 className="mb-3 mt-7 font-display text-2xl text-[#173e38]">Contraindicaciones y precauciones</h3><MultiChoice options={peelContraindications} value={data.peelContraindications} onChange={value => setField('peelContraindications', value)} columns={2} /><label className="mt-3 block">Proporciona detalles y fecha aproximada<textarea value={data.peelContraindicationDetails} onChange={e => setField('peelContraindicationDetails', e.target.value)} /></label><p className="mt-4 rounded-xl border border-[#dfcda9] bg-[#fbf6eb] p-4 text-sm leading-6">El profesional determinará si corresponde realizar, modificar, sustituir o posponer el tratamiento.</p><h3 className="mb-4 mt-7 font-display text-2xl text-[#173e38]">Alergias, sol y cuidados posteriores</h3><InitialStatements statements={["Confirmo haber informado todas mis alergias y sensibilidades conocidas, incluyendo medicamentos o ingredientes como aspirina/salicilatos cuando corresponda.", "Entiendo que debo evitar exposición solar excesiva y camas de bronceado durante el período indicado antes y después del tratamiento.", "Entiendo la importancia de utilizar diariamente protector solar de amplio espectro y seguir las recomendaciones de reaplicación.", "Me comprometo a seguir las instrucciones posteriores específicas, evitar activos y procedimientos indicados y no retirar manualmente piel descamada o costras.", "Entiendo que debo comunicar cualquier reacción inesperada o preocupante y buscar atención médica cuando corresponda."]} values={[data.peelAllergyInitials, data.peelSunInitials, data.peelSunscreenInitials, data.peelAftercareInitials, data.peelReactionInitials]} onChange={values => setData(previous => ({ ...previous, peelAllergyInitials: values[0], peelSunInitials: values[1], peelSunscreenInitials: values[2], peelAftercareInitials: values[3], peelReactionInitials: values[4] }))} /><label className="my-5 flex gap-3 rounded-2xl border border-[#9fbdb2] bg-[#edf5f2] p-5"><input type="checkbox" checked={data.peelAccepted} onChange={e => setField('peelAccepted', e.target.checked)} /><span className="text-sm font-bold text-[#173e38]">He leído, comprendo y consiento voluntariamente recibir el peeling químico seleccionado para mi piel.</span></label><SignatureField label="Firma digital — Peeling químico" value={data.peelSignature} onChange={value => setField('peelSignature', value)} /></section>}

                </div>
                {validationMessage && <div role="alert" aria-live="assertive" className="mx-4 flex items-start gap-3 rounded-2xl border border-[#d7a76d] bg-[#fff7e8] p-4 text-sm font-semibold text-[#704b22] sm:mx-0"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#b77a36] text-xs text-white">!</span><span>{validationMessage}</span></div>}
                <div className="flex items-center justify-between gap-3 px-4 pt-3 sm:px-0"><button type="button" onClick={previous} className="flex items-center gap-2 rounded-full border border-[#bcb4a5] px-5 py-3 text-sm font-bold text-[#42504b]"><ChevronLeft size={17} /> {t('Atrás')}</button>{isLast ? <button type="button" disabled={loading} onClick={submit} className="flex items-center gap-2 rounded-full bg-[#173e38] px-6 py-3 text-sm font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"><ShieldCheck size={17} />{t(loading ? 'Guardando…' : 'Firmar y guardar')}</button> : <button type="button" onClick={next} className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition ${step.id === 'service' && data.selectedServices.length === 0 ? 'bg-[#8b968f] hover:bg-[#707d75]' : 'bg-[#173e38] hover:bg-[#22584f]'}`}><span className="max-w-[12rem] text-right sm:max-w-none">{step.id === 'service' && data.selectedServices.length === 0 ? t('Selecciona un servicio') : `${t('Continuar')}: ${t(steps[stepIndex + 1]?.label || '')}`}</span> <ArrowRight size={17} /></button>}</div>
                {savedCopy && <div className="mx-4 rounded-2xl border border-[#9fbdb2] bg-[#edf5f2] p-5 text-center sm:mx-0"><p className="mb-3 text-sm text-[#173e38]">{lang === 'en' ? 'The aesthetic record was saved successfully to Google Drive.' : 'El expediente estético se guardó correctamente en Google Drive.'}</p><button type="button" onClick={() => saveAs(savedCopy.blob, savedCopy.fileName)} className="mx-auto flex items-center gap-2 rounded-full border border-[#173e38] px-5 py-2.5 text-sm font-bold text-[#173e38]"><Download size={16} /> {lang === 'en' ? 'Download my copy' : 'Descargar mi copia'}</button></div>}
            </form>
        </div>
    </main></TranslationContext.Provider>;
}
