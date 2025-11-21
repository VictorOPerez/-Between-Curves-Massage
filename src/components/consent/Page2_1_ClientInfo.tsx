'use client';
import React from 'react';
import { ConsentState } from './types';
import { SlideShell } from './SlideShell';
import { Checkbox, Radio, SectionHeader, UnderlineInput } from './atoms';
import { MEDICAL_LIST, t } from './i18n';



export const Page2_1_ClientInfo: React.FC<{
    lang: 'en' | 'es'; state: ConsentState; setState: (p: Partial<ConsentState>) => void; brandName?: string;
}> = ({ lang, state, setState, brandName }) => {
    const T = t(lang);
    const toggleMed = (k: string) => setState({ medicalChecked: { ...state.medicalChecked, [k]: !state.medicalChecked[k] } });
    return (
        <SlideShell title={T.header} subtitle={T.sub} brandName={brandName}>
            <SectionHeader>{T.clientInfo}</SectionHeader>
            <div className="mt-6 font-serif text-[15px] tracking-wide">{T.medicalHistory}</div>
            <div className="text-[15px]">{T.medHelp}</div>
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                {MEDICAL_LIST.map((m) => (
                    <Checkbox key={m} label={m} checked={!!state.medicalChecked[m]} onChange={() => toggleMed(m)} />
                ))}
            </div>
        </SlideShell>
    );
};