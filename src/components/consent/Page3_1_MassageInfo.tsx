'use client';
import React from 'react';
import { ConsentState } from './types';
import { SlideShell } from './SlideShell';
import { ENUMS, t } from './i18n';
import { Checkbox, Radio, SectionHeader, UnderlineInput } from './atoms';


export const Page3_1_MassageInfo: React.FC<{
    lang: 'en' | 'es'; state: ConsentState; setState: (p: Partial<ConsentState>) => void; brandName?: string;
}> = ({ lang, state, setState, brandName }) => {
    const T = t(lang);
    const toggle = (key: 'typeChecked' | 'areaChecked' | 'goalChecked', k: string) => {
        const base = key === 'typeChecked' ? state.typeChecked : key === 'areaChecked' ? state.areaChecked : state.goalChecked;
        setState({ [key]: { ...base, [k]: !base[k] } } as any);
    };
    return (
        <SlideShell title={T.header} subtitle={T.sub} brandName={brandName}>
            {/* <div className="grid grid-cols-1 gap-3 text-[15px]">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-3">
                    <div>{T.otherIssues}</div>
                    <div className="flex gap-4"><Radio label={T.yes} checked={state.otherIssues === 'yes'} onChange={() => setState({ otherIssues: 'yes' })} /><Radio label={T.no} checked={state.otherIssues === 'no'} onChange={() => setState({ otherIssues: 'no' })} /></div>
                </div>
                {state.otherIssues === 'yes' && <UnderlineInput value={state.otherDesc} onChange={(v) => setState({ otherDesc: v })} placeholder={T.ifYes} />}


                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-3">
                    <div>{T.surgeries}</div>
                    <div className="flex gap-4"><Radio label={T.yes} checked={state.surgeries === 'yes'} onChange={() => setState({ surgeries: 'yes' })} /><Radio label={T.no} checked={state.surgeries === 'no'} onChange={() => setState({ surgeries: 'no' })} /></div>
                </div>
                {state.surgeries === 'yes' && <UnderlineInput value={state.surgeriesDesc} onChange={(v) => setState({ surgeriesDesc: v })} placeholder={T.ifYes} />}


                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-3">
                    <div>{T.pregnant}</div>
                    <div className="flex gap-4"><Radio label={T.yes} checked={state.pregnant === 'yes'} onChange={() => setState({ pregnant: 'yes' })} /><Radio label={T.no} checked={state.pregnant === 'no'} onChange={() => setState({ pregnant: 'no' })} /></div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-3">
                    <div>{T.meds}</div>
                    <div className="flex gap-4"><Radio label={T.yes} checked={state.meds === 'yes'} onChange={() => setState({ meds: 'yes' })} /><Radio label={T.no} checked={state.meds === 'no'} onChange={() => setState({ meds: 'no' })} /></div>
                </div>
                {state.meds === 'yes' && <UnderlineInput value={state.medsDesc} onChange={(v) => setState({ medsDesc: v })} placeholder={T.ifYes} />}
            </div> */}


            <SectionHeader>{T.massageInfo}</SectionHeader>
            <div className="mt-2 text-[15px]">{T.typeQ}</div>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                {ENUMS.types.map(m => (
                    <Checkbox key={m} label={m} checked={!!state.typeChecked[m]} onChange={() => toggle('typeChecked', m)} />
                ))}
            </div>


            <div className="mt-4 text-[15px]">{T.areasQ}</div>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                {ENUMS.areas.map(m => (
                    <Checkbox key={m} label={m} checked={!!state.areaChecked[m]} onChange={() => toggle('areaChecked', m)} />
                ))}
            </div>


            <div className="mt-4 text-[15px]">{T.goalsQ}</div>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                {ENUMS.goals.map(m => (
                    <Checkbox key={m} label={m} checked={!!state.goalChecked[m]} onChange={() => toggle('goalChecked', m)} />
                ))}
            </div>


            <div className="mt-4 grid grid-cols-1 gap-2 text-[15px]">
                <div>{T.frequencyQ}</div>
                <div className="flex flex-wrap gap-4">
                    {ENUMS.freq.map(f => (
                        <Radio key={f} label={f} checked={state.freq === f} onChange={() => setState({ freq: f })} />
                    ))}
                </div>
            </div>
        </SlideShell>
    );
};