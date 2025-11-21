'use client';
import * as React from 'react';
import { SlideShell } from '../SlideShell';
import { Checkbox, UnderlineInput } from '../atoms';
import { MEDICAL_LIST, t } from '../i18n';
import type { ConsentState } from '../types';

const HALF = Math.ceil(MEDICAL_LIST.length / 2);
const SECOND = MEDICAL_LIST.slice(HALF);

export default function Page04_MedicalB({
    lang, state, setState, brandName,
}: {
    lang: 'en' | 'es'; state: ConsentState; setState: (p: Partial<ConsentState>) => void; brandName?: string;
}) {
    const toggle = (k: string) =>
        setState({ medicalChecked: { ...state.medicalChecked, [k]: !state.medicalChecked[k] } });

    return (
        <SlideShell title={t(lang).header} subtitle={t(lang).sub} brandName={brandName}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {SECOND.map((item) => (
                    <Checkbox key={item} label={item} checked={!!state.medicalChecked[item]} onChange={() => toggle(item)} />
                ))}
            </div>

            {/* Other */}
            <div className="mt-3">
                <UnderlineInput
                    value={state.otherDesc}
                    onChange={(v) => setState({ otherDesc: v })}
                    placeholder={lang === 'en' ? 'Other:' : 'Otro:'}
                />
            </div>
        </SlideShell>
    );
}
