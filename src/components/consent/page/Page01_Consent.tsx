'use client';
import * as React from 'react';
import { SlideShell } from '../SlideShell';
import { UnderlineInput } from '../atoms';
import { t } from '../i18n';
import type { ConsentState } from '../types';

export default function Page01_Consent({
    lang, state, setState, brandName,
}: {
    lang: 'en' | 'es'; state: ConsentState; setState: (p: Partial<ConsentState>) => void; brandName?: string;
}) {
    const T = t(lang);

    const P = lang === 'en'
        ? {
            p1: `I, the undersigned, hereby give my consent for [${state.provider || '________________'}] to perform massage therapy services for me. I understand these services may include a consultation prior to the appointment and a variety of massage techniques to achieve my desired outcomes.`,
            p2: `I acknowledge that massage therapy involves physical manipulation that may pose certain risks, including soreness, bruising, or allergic reactions to oils or lotions. I am responsible for informing the therapist of any medical conditions, allergies, or sensitivities I may have.`,
            p3: `By signing this consent form, I release [${state.provider || '________________'}] from any liability for accidents, injuries, or damages that may occur during the massage services provided. I understand that while every effort will be made to ensure a safe and satisfactory experience, unforeseen circumstances may arise.`,
            p4: `I recognize that if I need to cancel or reschedule my appointment, I must provide 24 hours' notice to avoid incurring a cancellation fee.`,
            p5: `Furthermore, I grant permission for [${state.provider || '________________'}] to take photographs for promotional use, including but not limited to social media and marketing materials. I understand my identity may be associated with these images unless I explicitly request otherwise.`,
            p6: `I confirm that I have read and fully understand this consent form. I agree to the terms outlined herein and acknowledge my willingness to proceed with the massage therapy services as described.`,
        }
        : {
            p1: `Yo, la persona firmante, otorgo mi consentimiento para que [${state.provider || '________________'}] realice servicios de terapia de masaje para mí. Entiendo que estos servicios pueden incluir una consulta previa y diversas técnicas de masaje para alcanzar los resultados deseados.`,
            p2: `Reconozco que la terapia de masaje implica manipulación física que puede conllevar ciertos riesgos, como dolor, moretones o reacciones alérgicas a aceites o lociones. Soy responsable de informar al terapeuta sobre cualquier condición médica, alergia o sensibilidad que tenga.`,
            p3: `Al firmar este consentimiento, libero a [${state.provider || '________________'}] de cualquier responsabilidad por accidentes, lesiones o daños que pudieran ocurrir durante los servicios de masaje. Entiendo que, aunque se hará todo lo posible para brindar una experiencia segura y satisfactoria, pueden surgir circunstancias imprevistas.`,
            p4: `Reconozco que, si necesito cancelar o reprogramar mi cita, debo avisar con 24 horas de antelación para evitar cargos por cancelación.`,
            p5: `Además, autorizo a [${state.provider || '________________'}] a tomar fotografías con fines promocionales, incluyendo redes sociales y material de marketing. Entiendo que mi identidad podría asociarse a dichas imágenes salvo que solicite lo contrario de forma explícita.`,
            p6: `Confirmo que he leído y comprendo este formulario. Acepto los términos aquí expuestos y manifiesto mi voluntad de proceder con los servicios de masaje descritos.`,
        };

    return (
        <SlideShell title={T.header} subtitle={T.sub} brandName={brandName}>
            <div className="grid grid-cols-1 gap-3 text-[15px] leading-7">
                <UnderlineInput
                    value={state.provider}
                    onChange={(v) => setState({ provider: v })}
                    placeholder={lang === 'en' ? 'Provider / Studio Name' : 'Nombre del establecimiento/terapeuta'}
                />
                <p>{P.p1}</p>
                <p>{P.p2}</p>
                <p>{P.p3}</p>
                <p>{P.p4}</p>
                <p>{P.p5}</p>
                <p>{P.p6}</p>
            </div>

            {/* Firma */}
            <div className="mt-4 grid grid-cols-3 items-end gap-4">
                <div>
                    <UnderlineInput
                        value={state.printedName}
                        onChange={(v) => setState({ printedName: v })}
                        placeholder={T.printedName}
                    />
                </div>
                <div className="flex h-[52px] items-center justify-center rounded border border-neutral-400/70 text-neutral-400">
                    SIGN
                </div>
                <div>
                    <UnderlineInput
                        value={state.dateStr}
                        onChange={(v) => setState({ dateStr: v })}
                        placeholder={T.date}
                    />
                </div>
            </div>
        </SlideShell>
    );
}
