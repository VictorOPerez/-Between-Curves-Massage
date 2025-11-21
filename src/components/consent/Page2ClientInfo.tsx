'use client';
import React from 'react';
import { ConsentState } from './types';
import { SlideShell } from './SlideShell';
import { Checkbox, Radio, SectionHeader, UnderlineInput } from './atoms';
import { MEDICAL_LIST, t } from './i18n';



export const Page2ClientInfo: React.FC<{
    lang: 'en' | 'es'; state: ConsentState; setState: (p: Partial<ConsentState>) => void; brandName?: string;
}> = ({ lang, state, setState, brandName }) => {
    const T = t(lang);
    const toggleMed = (k: string) => setState({ medicalChecked: { ...state.medicalChecked, [k]: !state.medicalChecked[k] } });
    return (
        <SlideShell title={T.header} subtitle={T.sub} brandName={brandName}>
            <SectionHeader>{T.clientInfo}</SectionHeader>
            <div className="mt-2 grid grid-cols-1 gap-3 text-[15px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <UnderlineInput value={state.name} onChange={(v) => setState({ name: v })} placeholder={`${T.name}:`} />
                    <div className="grid grid-cols-3 gap-3">
                        <UnderlineInput value={state.dob} onChange={(v) => setState({ dob: v })} placeholder={`${T.dob}:`} />
                        <UnderlineInput value={state.age} onChange={(v) => setState({ age: v })} placeholder={`${T.age}:`} />
                        <UnderlineInput value={state.gender} onChange={(v) => setState({ gender: v })} placeholder={`${T.gender}:`} />
                    </div>
                </div>
                <UnderlineInput value={state.address} onChange={(v) => setState({ address: v })} placeholder={`${T.address}:`} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <UnderlineInput value={state.city} onChange={(v) => setState({ city: v })} placeholder={`${T.city}:`} />
                    <UnderlineInput value={state.state} onChange={(v) => setState({ state: v })} placeholder={`${T.state}:`} />
                    <UnderlineInput value={state.zip} onChange={(v) => setState({ zip: v })} placeholder={`${T.zip}:`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <UnderlineInput value={state.email} onChange={(v) => setState({ email: v })} placeholder={`${T.email}:`} />
                    <UnderlineInput value={state.phone} onChange={(v) => setState({ phone: v })} placeholder={`${T.phone}:`} />
                </div>
                <UnderlineInput value={state.emergency} onChange={(v) => setState({ emergency: v })} placeholder={`${T.emergency}:`} />
                <div className="flex flex-wrap items-center gap-4 pt-1 text-[15px]">
                    <span>{T.joinList}</span>
                    <Radio label={T.yes} checked={state.join === 'yes'} onChange={() => setState({ join: 'yes' })} />
                    <Radio label={T.no} checked={state.join === 'no'} onChange={() => setState({ join: 'no' })} />
                </div>
                <UnderlineInput value={state.referral} onChange={(v) => setState({ referral: v })} placeholder={`${T.referral}:`} />
            </div>

        </SlideShell>
    );
};