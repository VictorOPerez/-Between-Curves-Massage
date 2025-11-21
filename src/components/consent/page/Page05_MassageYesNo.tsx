// 'use client';
// import * as React from 'react';
// import { SlideShell } from '../SlideShell';
// import { Checkbox, Radio, SectionHeader, UnderlineInput } from '../atoms';
// import { ENUMS, t } from '../i18n';
// import type { ConsentState } from '../types';

// export default function Page05_MassageYesNo({
//     lang, state, setState, brandName,
// }: {
//     lang: 'en' | 'es'; state: ConsentState; setState: (p: Partial<ConsentState>) => void; brandName?: string;
// }) {
//     const T = t(lang);

//     const Row: React.FC<{
//         label: string;
//         k: 'otherIssues' | 'surgeries' | 'pregnant' | 'meds';
//         descKey?: 'otherDesc' | 'surgeriesDesc' | 'medsDesc';
//     }> = ({ label, k, descKey }) => (
//         <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto]">
//             <div className="text-[14px]">{label}</div>
//             <div className="flex gap-4 justify-self-end">
//                 <Radio label={T.yes} checked={state[k] === 'yes'} onChange={() => setState({ [k]: 'yes' } as any)} />
//                 <Radio label={T.no} checked={state[k] === 'no'} onChange={() => setState({ [k]: 'no' } as any)} />
//             </div>
//             {descKey && state[k] === 'yes' && (
//                 <div className="sm:col-span-2">
//                     <UnderlineInput
//                         value={(state as any)[descKey] || ''}
//                         onChange={(v) => setState({ [descKey]: v } as any)}
//                         placeholder={T.ifYes}
//                     />
//                 </div>
//             )}
//         </div>
//     );

//     const toggle = (key: 'typeChecked' | 'areaChecked' | 'goalChecked', k: string) => {
//         const base =
//             key === 'typeChecked' ? state.typeChecked : key === 'areaChecked' ? state.areaChecked : state.goalChecked;
//         setState({ [key]: { ...base, [k]: !base[k] } } as any);
//     };

//     // textos de aceptación (final del papel 3)
//     const ACCEPT = lang === 'en'
//         ? `By signing below, you agree to the following: I have carefully read and fully understand the questions above and have disclosed all relevant conditions that apply to me. I acknowledge that it is my responsibility to inform the technician of any changes in my medical history or health status, both now and in the future.`
//         : `Al firmar a continuación, aceptas lo siguiente: He leído y comprendo las preguntas anteriores y he informado todas las condiciones relevantes que me aplican. Reconozco que es mi responsabilidad informar al profesional sobre cualquier cambio en mi historial médico o estado de salud, ahora y en el futuro.`;

//     return (
//         <SlideShell title={T.header} subtitle={T.sub} brandName={brandName}>
//             {/* Sí/No médicos */}
//             <div className="grid grid-cols-1 gap-3">
//                 <Row label={T.otherIssues} k="otherIssues" descKey="otherDesc" />
//                 <Row label={T.surgeries} k="surgeries" descKey="surgeriesDesc" />
//                 <Row label={T.pregnant} k="pregnant" />
//                 <Row label={T.meds} k="meds" descKey="medsDesc" />
//             </div>

//             {/* Información de masaje */}
//             <SectionHeader >{T.massageInfo}</SectionHeader>

//             {/* Tipos */}
//             <div className="mt-2 text-[15px]">{T.typeQ}</div>
//             <div className="mt-2 grid grid-cols-2 gap-2">
//                 {ENUMS.types.map((m) => (
//                     <Checkbox key={m} label={m} checked={!!state.typeChecked[m]} onChange={() => toggle('typeChecked', m)} />
//                 ))}
//             </div>
//             <div className="mt-1">
//                 <UnderlineInput
//                     value={state.typeChecked['Other'] ? state.otherDesc : ''}
//                     onChange={(v) => setState({ otherDesc: v })}
//                     placeholder={lang === 'en' ? 'Other (type):' : 'Otro (tipo):'}
//                 />
//             </div>

//             {/* Áreas */}
//             <div className="mt-3 text-[15px]">{T.areasQ}</div>
//             <div className="mt-2 grid grid-cols-2 gap-2">
//                 {ENUMS.areas.map((m) => (
//                     <Checkbox key={m} label={m} checked={!!state.areaChecked[m]} onChange={() => toggle('areaChecked', m)} />
//                 ))}
//             </div>
//             <div className="mt-1">
//                 <UnderlineInput
//                     value={state.areaChecked['Other'] ? state.otherDesc : ''}
//                     onChange={(v) => setState({ otherDesc: v })}
//                     placeholder={lang === 'en' ? 'Other (area):' : 'Otra zona:'}
//                 />
//             </div>

//             {/* Objetivos */}
//             <div className="mt-3 text-[15px]">{T.goalsQ}</div>
//             <div className="mt-2 grid grid-cols-2 gap-2">
//                 {ENUMS.goals.map((m) => (
//                     <Checkbox key={m} label={m} checked={!!state.goalChecked[m]} onChange={() => toggle('goalChecked', m)} />
//                 ))}
//             </div>
//             <div className="mt-1">
//                 <UnderlineInput
//                     value={state.goalChecked['Other'] ? state.otherDesc : ''}
//                     onChange={(v) => setState({ otherDesc: v })}
//                     placeholder={lang === 'en' ? 'Other (goal):' : 'Otro objetivo:'}
//                 />
//             </div>

//             {/* Frecuencia */}
//             <div className="mt-3 grid grid-cols-1 gap-2 text-[15px]">
//                 <div>{T.frequencyQ}</div>
//                 <div className="flex flex-wrap gap-4">
//                     {ENUMS.freq.map((f) => (
//                         <Radio key={f} label={f} checked={state.freq === f} onChange={() => setState({ freq: f })} />
//                     ))}
//                 </div>
//             </div>

//             {/* Aceptación + Firma (re-usa mismos campos) */}
//             <p className="mt-4 text-[14px] opacity-80">{ACCEPT}</p>
//             <div className="mt-3 grid grid-cols-3 items-end gap-4">
//                 <div>
//                     <UnderlineInput
//                         value={state.printedName}
//                         onChange={(v) => setState({ printedName: v })}
//                         placeholder={T.printedName}
//                     />
//                 </div>
//                 <div className="flex h-[52px] items-center justify-center rounded border border-neutral-400/70 text-neutral-400">
//                     SIGN
//                 </div>
//                 <div>
//                     <UnderlineInput
//                         value={state.dateStr}
//                         onChange={(v) => setState({ dateStr: v })}
//                         placeholder={T.date}
//                     />
//                 </div>
//             </div>
//         </SlideShell>
//     );
// }
