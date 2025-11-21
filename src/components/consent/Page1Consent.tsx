'use client';

import { UnderlineInput } from "./atoms";
import { t } from "./i18n";
import { SlideShell } from "./SlideShell";
import { ConsentState } from "./types";



export const Page1Consent: React.FC<{
    lang: 'en' | 'es'; state: ConsentState; setState: (p: Partial<ConsentState>) => void; brandName?: string;
}> = ({ lang, state, setState, brandName }) => {
    const T = t(lang);
    return (
        <SlideShell title={T.header} subtitle={T.sub} brandName={brandName}>
            <div className="mb-4 grid grid-cols-1 gap-3 text-[15px] leading-7">
                <UnderlineInput value={state.provider} onChange={(v) => setState({ provider: v })} placeholder={lang === 'en' ? 'Provider / Studio Name' : 'Nombre del establecimiento/terapeuta'} className="max-w-md" />
                <p className="text-[15px]">{/* Aquí puedes insertar los párrafos legales que ya tenías */}
                    {/* Mantengo vacío para brevity; los insertaremos en la siguiente iteración */}
                </p>
            </div>
            <div className="grid grid-cols-3 items-end gap-6 pt-8">
                <div>
                    <UnderlineInput value={state.printedName} onChange={(v) => setState({ printedName: v })} placeholder={T.printedName} />
                    <div className="mt-1 text-sm text-neutral-700">{T.printedName}</div>
                </div>
                <div>
                    <div className="rounded border border-neutral-400/70 h-[60px] flex items-center justify-center text-neutral-400">
                        {/* Signature pad se agrega en otra iteración */}
                        SIGN
                    </div>
                    <div className="mt-1 text-sm text-neutral-700">{T.clientSignature}</div>
                </div>
                <div>
                    <UnderlineInput value={state.dateStr} onChange={(v) => setState({ dateStr: v })} />
                    <div className="mt-1 text-sm text-neutral-700">{T.date}</div>
                </div>
            </div>
        </SlideShell>
    );
};