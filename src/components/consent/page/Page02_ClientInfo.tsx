'use client';
import * as React from 'react';
import { SlideShell } from '../SlideShell';
import { SectionHeader, UnderlineInput, Radio } from '../atoms';
import { t } from '../i18n';
import type { ConsentState } from '../types';

export default function Page02_ClientInfo({
    lang, state, setState, brandName,
}: {
    lang: 'en' | 'es'; state: ConsentState; setState: (p: Partial<ConsentState>) => void; brandName?: string;
}) {
    const T = t(lang);

    return (
        <SlideShell title={T.header} subtitle={T.sub} brandName={brandName}>
            <SectionHeader>{T.clientInfo}</SectionHeader>

            <div className="mt-2 grid grid-cols-1 gap-2 text-[15px]">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <UnderlineInput value={state.name} onChange={(v) => setState({ name: v })} placeholder={T.name + ':'} />
                    <UnderlineInput value={state.dateStr} onChange={(v) => setState({ dateStr: v })} placeholder={T.date + ':'} />
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <UnderlineInput value={state.dob} onChange={(v) => setState({ dob: v })} placeholder={T.dob + ':'} />
                    <div className="grid grid-cols-2 gap-2">
                        <UnderlineInput value={state.age} onChange={(v) => setState({ age: v })} placeholder={T.age + ':'} />
                        <UnderlineInput value={state.gender} onChange={(v) => setState({ gender: v })} placeholder={T.gender + ':'} />
                    </div>
                </div>

                <UnderlineInput value={state.address} onChange={(v) => setState({ address: v })} placeholder={T.address + ':'} />

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <UnderlineInput value={state.city} onChange={(v) => setState({ city: v })} placeholder={T.city + ':'} />
                    <UnderlineInput value={state.state} onChange={(v) => setState({ state: v })} placeholder={T.state + ':'} />
                    <UnderlineInput value={state.zip} onChange={(v) => setState({ zip: v })} placeholder={T.zip + ':'} />
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <UnderlineInput value={state.email} onChange={(v) => setState({ email: v })} placeholder={T.email + ':'} />
                    <UnderlineInput value={state.phone} onChange={(v) => setState({ phone: v })} placeholder={T.phone + ':'} />
                </div>

                <UnderlineInput value={state.emergency} onChange={(v) => setState({ emergency: v })} placeholder={T.emergency + ':'} />

                <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="text-[14px]">{T.joinList}</span>
                    <div className="flex gap-4">
                        <Radio label={T.yes} checked={state.join === 'yes'} onChange={() => setState({ join: 'yes' })} />
                        <Radio label={T.no} checked={state.join === 'no'} onChange={() => setState({ join: 'no' })} />
                    </div>
                </div>

                <UnderlineInput value={state.referral} onChange={(v) => setState({ referral: v })} placeholder={T.referral + ':'} />
            </div>
        </SlideShell>
    );
}
