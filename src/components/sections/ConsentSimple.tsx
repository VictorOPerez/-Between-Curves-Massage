// 'use client';
// import * as React from 'react';

// type YesNo = 'yes' | 'no' | 'na';

// type ConsentState = {
//     // Encabezado / firma
//     provider: string;
//     printedName: string;
//     dateStr: string;

//     // Cliente
//     name: string; dob: string; age: string; gender: string;
//     address: string; city: string; state: string; zip: string;
//     email: string; phone: string; emergency: string;
//     join: YesNo; referral: string;

//     // Historial médico
//     medicalChecked: Record<string, boolean>;

//     // Sí/No + descripciones
//     otherIssues: YesNo; otherDesc: string;
//     surgeries: YesNo; surgeriesDesc: string;
//     pregnant: YesNo;
//     meds: YesNo; medsDesc: string;

//     // Preferencias masaje
//     typeChecked: Record<string, boolean>;
//     areaChecked: Record<string, boolean>;
//     goalChecked: Record<string, boolean>;
//     freq: string;
// };

// const MEDICAL_LIST = [
//     'Acne', 'Active infection', 'Asthma', 'Autoimmune disease', 'Bleeding disorder', 'Breathing problems', 'Diabetes', 'Easily bruised', 'Eczema', 'Epilepsy', 'Heart disease',
//     'Herpes', 'Hepatitis', 'Hirsutism', 'HIV/AIDS', 'Hyperpigmentation', 'Hypopigmentation', 'Hysterectomy', 'Irregular periods', 'Keloid scarring', 'Low blood pressure', 'High blood pressure',
//     'Lupus', 'Menopause', 'Polycystic ovaries', 'Psoriasis', 'Pregnant/breastfeeding', 'Shingles', 'Skin diseases', 'Thyroid imbalance', 'Vitiligo', 'Warts'
// ];

// const MASSAGE_TYPES = ['Relaxation', 'Therapeutic', 'Deep tissue', 'Reflexology', 'Swedish', 'Hot stone', 'Other'];
// const AREAS = ['Neck', 'Shoulders', 'Back', 'Hips', 'Legs', 'Feet', 'Other'];
// const GOALS = ['Relaxation', 'Pain relief', 'Increased flexibility', 'Stress reduction', 'Injury recovery', 'Other'];
// const FREQS = ['This is my first time', 'Occasionally', 'Regularly', 'Rarely'];

// const INITIAL_STATE: ConsentState = {
//     provider: '', printedName: '', dateStr: '',
//     name: '', dob: '', age: '', gender: '',
//     address: '', city: '', state: '', zip: '',
//     email: '', phone: '', emergency: '',
//     join: 'na', referral: '',
//     medicalChecked: {},
//     otherIssues: 'na', otherDesc: '',
//     surgeries: 'na', surgeriesDesc: '',
//     pregnant: 'na',
//     meds: 'na', medsDesc: '',
//     typeChecked: {}, areaChecked: {}, goalChecked: {},
//     freq: '',
// };

// function LineInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
//     const { className = '', ...rest } = props;
//     return (
//         <input
//             {...rest}
//             className={
//                 'w-full border-0 border-b border-neutral-400/70 bg-transparent px-0 py-2 outline-none placeholder:opacity-60 ' +
//                 className
//             }
//         />
//     );
// }

// function CheckRow({
//     label, checked, onChange,
// }: { label: string; checked: boolean; onChange: () => void }) {
//     return (
//         <label className="flex select-none items-center gap-2">
//             <input type="checkbox" className="h-4 w-4" checked={checked} onChange={onChange} />
//             <span>{label}</span>
//         </label>
//     );
// }

// function RadioRow({
//     name, label, checked, onChange,
// }: { name: string; label: string; checked: boolean; onChange: () => void }) {
//     return (
//         <label className="flex select-none items-center gap-2">
//             <input type="radio" name={name} className="h-4 w-4" checked={checked} onChange={onChange} />
//             <span>{label}</span>
//         </label>
//     );
// }

// export default function ConsentSimple({
//     brandName = 'HERBAL THERAPIES AND MASSAGE',
//     onSubmit,
// }: {
//     brandName?: string;
//     onSubmit?: (payload: { state: ConsentState; signaturePng?: string }) => void | Promise<void>;
// }) {
//     const [state, setState] = React.useState<ConsentState>(INITIAL_STATE);

//     // helpers
//     const patch = (p: Partial<ConsentState>) =>
//         setState(prev => ({
//             ...prev,
//             ...p,
//             medicalChecked: p.medicalChecked ? { ...prev.medicalChecked, ...p.medicalChecked } : prev.medicalChecked,
//             typeChecked: p.typeChecked ? { ...prev.typeChecked, ...p.typeChecked } : prev.typeChecked,
//             areaChecked: p.areaChecked ? { ...prev.areaChecked, ...p.areaChecked } : prev.areaChecked,
//             goalChecked: p.goalChecked ? { ...prev.goalChecked, ...p.goalChecked } : prev.goalChecked,
//         }));

//     const toggleKey = (obj: 'medicalChecked' | 'typeChecked' | 'areaChecked' | 'goalChecked', key: string) =>
//         patch({ [obj]: { [key]: !state[obj][key] } } as any);

//     // Firma (canvas sin librerías)
//     const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
//     const drawing = React.useRef(false);
//     const [hasSignature, setHasSignature] = React.useState(false);

//     const start = (x: number, y: number) => {
//         const c = canvasRef.current!;
//         const ctx = c.getContext('2d')!;
//         ctx.beginPath();
//         ctx.moveTo(x, y);
//         drawing.current = true;
//     };
//     const move = (x: number, y: number) => {
//         if (!drawing.current) return;
//         const c = canvasRef.current!;
//         const ctx = c.getContext('2d')!;
//         ctx.lineTo(x, y);
//         ctx.lineWidth = 2;
//         ctx.lineCap = 'round';
//         ctx.stroke();
//         setHasSignature(true);
//     };
//     const end = () => { drawing.current = false; };

//     const pointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
//         const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
//         if (e.type === 'pointerdown') start(x, y);
//         else if (e.type === 'pointermove') move(x, y);
//         else if (e.type === 'pointerup' || e.type === 'pointerleave') end();
//     };

//     const clearSignature = () => {
//         const c = canvasRef.current!;
//         const ctx = c.getContext('2d')!;
//         ctx.clearRect(0, 0, c.width, c.height);
//         setHasSignature(false);
//     };

//     const handleSubmit = async () => {
//         const signaturePng = hasSignature ? canvasRef.current?.toDataURL('image/png') : undefined;
//         await onSubmit?.({ state, signaturePng });
//         // opcional: resetear
//         // setState(INITIAL_STATE); clearSignature();
//     };

//     // ajustar canvas para HiDPI
//     React.useEffect(() => {
//         const c = canvasRef.current!;
//         const dpr = globalThis.window?.devicePixelRatio ?? 1;
//         const width = c.clientWidth;
//         const height = c.clientHeight;
//         c.width = Math.floor(width * dpr);
//         c.height = Math.floor(height * dpr);
//         const ctx = c.getContext('2d')!;
//         ctx.scale(dpr, dpr);
//     }, []);

//     return (
//         <section
//             className="grid min-h-dvh grid-rows-[auto_1fr_auto] bg-gradient-to-b from-[#0E3B2E] to-[#165a4e] text-neutral-900"
//         >
//             {/* Header */}
//             <div className="border-b border-white/15 px-4 py-3 text-white">
//                 <div className="mx-auto flex w-full max-w-screen-md items-end justify-between">
//                     <div>
//                         <div className="text-2xl tracking-[0.2em]">MASSAGE THERAPY</div>
//                         <div className="text-sm opacity-80">Client Intake Form</div>
//                     </div>
//                     <div className="text-xs opacity-80">{brandName}</div>
//                 </div>
//             </div>

//             {/* Content (scroll) */}
//             <div className="min-h-0 overflow-y-auto">
//                 <div className="mx-auto w-full max-w-screen-md px-3 py-4">
//                     <div className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-black/10">
//                         {/* CONSENTIMIENTO (texto compacto) */}
//                         <div className="space-y-3 text-[15px] leading-7">
//                             <LineInput
//                                 value={state.provider}
//                                 onChange={(e) => patch({ provider: e.target.value })}
//                                 placeholder="Provider / Studio Name"
//                             />
//                             <p>
//                                 I, the undersigned, hereby give my consent for [{state.provider || '________________'}] to perform massage
//                                 therapy services for me. I understand that these services may include a consultation prior to the appointment
//                                 and various massage techniques to achieve my desired outcomes.
//                             </p>
//                             <p>
//                                 I acknowledge that massage therapy involves physical manipulation that may pose certain risks, including soreness,
//                                 bruising, or allergic reactions to oils or lotions. I am responsible for informing the therapist of any medical
//                                 conditions, allergies, or sensitivities I may have.
//                             </p>
//                             <p>
//                                 By signing this consent form, I release [{state.provider || '________________'}] from any liability for accidents,
//                                 injuries, or damages that may occur during the massage services provided.
//                             </p>
//                             <p>
//                                 I recognize that if I need to cancel or reschedule my appointment, I must provide 24 hours notice to avoid
//                                 incurring a cancellation fee.
//                             </p>
//                             <p>
//                                 Furthermore, I grant permission for [{state.provider || '________________'}] to take photographs for promotional
//                                 use unless I explicitly request otherwise.
//                             </p>
//                         </div>

//                         {/* CLIENT INFO */}
//                         <h3 className="mt-6 text-lg font-semibold tracking-wide">CLIENT INFORMATION</h3>
//                         <div className="mt-2 grid grid-cols-1 gap-3">
//                             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                                 <LineInput placeholder="Name:" value={state.name} onChange={e => patch({ name: e.target.value })} />
//                                 <div className="grid grid-cols-3 gap-3">
//                                     <LineInput placeholder="Date of Birth:" value={state.dob} onChange={e => patch({ dob: e.target.value })} />
//                                     <LineInput placeholder="Age:" value={state.age} onChange={e => patch({ age: e.target.value })} />
//                                     <LineInput placeholder="Gender:" value={state.gender} onChange={e => patch({ gender: e.target.value })} />
//                                 </div>
//                             </div>
//                             <LineInput placeholder="Address:" value={state.address} onChange={e => patch({ address: e.target.value })} />
//                             <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//                                 <LineInput placeholder="City:" value={state.city} onChange={e => patch({ city: e.target.value })} />
//                                 <LineInput placeholder="State:" value={state.state} onChange={e => patch({ state: e.target.value })} />
//                                 <LineInput placeholder="Zip Code:" value={state.zip} onChange={e => patch({ zip: e.target.value })} />
//                             </div>
//                             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                                 <LineInput placeholder="Email:" value={state.email} onChange={e => patch({ email: e.target.value })} />
//                                 <LineInput placeholder="Phone:" value={state.phone} onChange={e => patch({ phone: e.target.value })} />
//                             </div>
//                             <LineInput placeholder="Emergency Contact:" value={state.emergency} onChange={e => patch({ emergency: e.target.value })} />
//                             <div className="flex flex-wrap items-center gap-4 text-[15px]">
//                                 <span>Would you like to be added to our email list for news and exclusive offers?</span>
//                                 <div className="flex gap-5">
//                                     <RadioRow name="join" label="Yes" checked={state.join === 'yes'} onChange={() => patch({ join: 'yes' })} />
//                                     <RadioRow name="join" label="No" checked={state.join === 'no'} onChange={() => patch({ join: 'no' })} />
//                                 </div>
//                             </div>
//                             <LineInput placeholder="How did you hear about us?" value={state.referral} onChange={e => patch({ referral: e.target.value })} />
//                         </div>

//                         {/* MEDICAL HISTORY */}
//                         <h3 className="mt-6 text-lg font-semibold tracking-wide">MEDICAL HISTORY</h3>
//                         <p className="mt-1 text-[15px]">Do you have any of the following conditions (check all that apply):</p>
//                         <div className="mt-2 grid grid-cols-1 gap-y-2 gap-x-6 sm:grid-cols-2">
//                             {MEDICAL_LIST.map(m => (
//                                 <CheckRow key={m} label={m} checked={!!state.medicalChecked[m]} onChange={() => toggleKey('medicalChecked', m)} />
//                             ))}
//                         </div>

//                         {/* YES/NO */}
//                         <div className="mt-6 grid grid-cols-1 gap-3">
//                             <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto]">
//                                 <div>Do you have any other medical issues not mentioned in this form?</div>
//                                 <div className="flex justify-end gap-6">
//                                     <RadioRow name="other" label="Yes" checked={state.otherIssues === 'yes'} onChange={() => patch({ otherIssues: 'yes' })} />
//                                     <RadioRow name="other" label="No" checked={state.otherIssues === 'no'} onChange={() => patch({ otherIssues: 'no' })} />
//                                 </div>
//                                 {state.otherIssues === 'yes' && <LineInput placeholder="If yes, please specify:" value={state.otherDesc} onChange={e => patch({ otherDesc: e.target.value })} />}
//                             </div>

//                             <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto]">
//                                 <div>Have you had any recent medical procedures or surgeries?</div>
//                                 <div className="flex justify-end gap-6">
//                                     <RadioRow name="surg" label="Yes" checked={state.surgeries === 'yes'} onChange={() => patch({ surgeries: 'yes' })} />
//                                     <RadioRow name="surg" label="No" checked={state.surgeries === 'no'} onChange={() => patch({ surgeries: 'no' })} />
//                                 </div>
//                                 {state.surgeries === 'yes' && <LineInput placeholder="If yes, please specify:" value={state.surgeriesDesc} onChange={e => patch({ surgeriesDesc: e.target.value })} />}
//                             </div>

//                             <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto]">
//                                 <div>Are you currently pregnant or breastfeeding? (If applicable)</div>
//                                 <div className="flex justify-end gap-6">
//                                     <RadioRow name="preg" label="Yes" checked={state.pregnant === 'yes'} onChange={() => patch({ pregnant: 'yes' })} />
//                                     <RadioRow name="preg" label="No" checked={state.pregnant === 'no'} onChange={() => patch({ pregnant: 'no' })} />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto]">
//                                 <div>Are you currently taking any medications?</div>
//                                 <div className="flex justify-end gap-6">
//                                     <RadioRow name="meds" label="Yes" checked={state.meds === 'yes'} onChange={() => patch({ meds: 'yes' })} />
//                                     <RadioRow name="meds" label="No" checked={state.meds === 'no'} onChange={() => patch({ meds: 'no' })} />
//                                 </div>
//                                 {state.meds === 'yes' && <LineInput placeholder="If yes, please specify:" value={state.medsDesc} onChange={e => patch({ medsDesc: e.target.value })} />}
//                             </div>
//                         </div>

//                         {/* MASSAGE INFO */}
//                         <h3 className="mt-6 text-lg font-semibold tracking-wide">MASSAGE INFORMATION</h3>
//                         <div className="mt-2 space-y-4">
//                             <div>
//                                 <div className="mb-2 text-[15px]">What type of massage are you interested in? (Select all that apply)</div>
//                                 <div className="grid grid-cols-1 gap-y-2 gap-x-6 sm:grid-cols-2">
//                                     {MASSAGE_TYPES.map(m => (
//                                         <CheckRow key={m} label={m} checked={!!state.typeChecked[m]} onChange={() => toggleKey('typeChecked', m)} />
//                                     ))}
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className="mb-2 text-[15px]">Any specific areas of tension or pain to address? (Select all that apply)</div>
//                                 <div className="grid grid-cols-1 gap-y-2 gap-x-6 sm:grid-cols-2">
//                                     {AREAS.map(m => (
//                                         <CheckRow key={m} label={m} checked={!!state.areaChecked[m]} onChange={() => toggleKey('areaChecked', m)} />
//                                     ))}
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className="mb-2 text-[15px]">What are your goals for this massage session? (Select all that apply)</div>
//                                 <div className="grid grid-cols-1 gap-y-2 gap-x-6 sm:grid-cols-2">
//                                     {GOALS.map(m => (
//                                         <CheckRow key={m} label={m} checked={!!state.goalChecked[m]} onChange={() => toggleKey('goalChecked', m)} />
//                                     ))}
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className="mb-2 text-[15px]">How often do you receive massages?</div>
//                                 <div className="flex flex-wrap gap-4">
//                                     {FREQS.map(f => (
//                                         <label key={f} className="flex items-center gap-2">
//                                             <input
//                                                 type="radio"
//                                                 name="freq"
//                                                 checked={state.freq === f}
//                                                 onChange={() => patch({ freq: f })}
//                                             />
//                                             <span>{f}</span>
//                                         </label>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* FIRMAS */}
//                         <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
//                             <div>
//                                 <LineInput placeholder="Client Printed Name" value={state.printedName} onChange={e => patch({ printedName: e.target.value })} />
//                             </div>
//                             <div className="rounded border border-neutral-400/70 p-0">
//                                 <canvas
//                                     ref={canvasRef}
//                                     onPointerDown={pointer}
//                                     onPointerMove={pointer}
//                                     onPointerUp={pointer}
//                                     onPointerLeave={pointer}
//                                     className="h-[64px] w-full touch-none"
//                                 />
//                             </div>
//                             <div>
//                                 <LineInput placeholder="Date" value={state.dateStr} onChange={e => patch({ dateStr: e.target.value })} />
//                             </div>
//                         </div>

//                         <div className="mt-2 text-right">
//                             <button type="button" onClick={clearSignature} className="text-sm text-neutral-600 underline">
//                                 Clear signature
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Footer fijo con acciones */}
//             <div className="sticky bottom-0 z-10 border-t border-white/15 bg-black/20 px-4 py-3 backdrop-blur">
//                 <div className="mx-auto flex w-full max-w-screen-md items-center justify-between">
//                     <div className="text-xs text-white/80">{brandName}</div>
//                     <button
//                         onClick={handleSubmit}
//                         className="rounded-full bg-white/95 px-5 py-2 text-sm font-medium text-[#0E3B2E] shadow hover:bg-white"
//                     >
//                         Submit consent
//                     </button>
//                 </div>
//             </div>
//         </section>
//     );
// }
