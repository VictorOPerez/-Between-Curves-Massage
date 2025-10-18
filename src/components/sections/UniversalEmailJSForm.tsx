// src/components/forms/UniversalEmailJSForm.tsx
"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

/**
 * Formulario universal y minimal para EmailJS.
 * - Neutro (sin dependencias de UI externas).
 * - Reusable en cualquier web: solo importa y pasa los props que necesites.
 * - Por defecto usa las ENV públicas de Next: NEXT_PUBLIC_EMAILJS_PUBLIC_KEY / SERVICE_ID / TEMPLATE_ID
 */
type UniversalEmailJSFormProps = {
    /** Clases para inputs (si no pasas, hay un estilo neutral por defecto) */
    inputCls?: string;
    /** Estilo inline para el botón (ej. gradient). Si no pasas, usa un gris neutro. */
    gradient?: string;

    /** Idioma base para textos por defecto */
    locale?: "en" | "es";

    /** Sobrescribir textos (opcional) */
    labels?: Partial<{
        name: string;
        phone: string;
        email: string;
        location: string;
        service: string;
        message: string;
        send: string;
        sending: string;
        ok: string;
        error: string;
        locationPlaceholder: string;
        messagePlaceholder: string;
        vehicle: string; // si quieres usarlo en algún caso
    }>;

    /** Mostrar/ocultar campos (todos ON por defecto excepto service si no hay options) */
    show?: Partial<{
        name: boolean;
        phone: boolean;
        email: boolean;
        location: boolean;
        service: boolean; // se muestra automáticamente si serviceOptions existe, pero puedes forzarlo
        message: boolean;
    }>;

    /** Opciones del select "service"; si no pasas, el campo no aparece */
    serviceOptions?: string[];

    /**
     * Composición del asunto/subject para tu template (se envía en el hidden "title").
     * Si no pasas, se arma como:
     *  - EN: "Request: {service} — {location}"
     *  - ES: "Solicitud: {service} — {location}"
     */
    composeSubject?: (params: { service?: string; location?: string; locale: "en" | "es" }) => string;

    /** Overrides para EmailJS; si no pasas, toma NEXT_PUBLIC_* */
    emailJs?: Partial<{
        publicKey: string;
        serviceId: string;
        templateId: string;
    }>;

    /** Callback opcional al enviar OK */
    onSuccess?: () => void;
    /** Callback opcional al fallar */
    onError?: (err: unknown) => void;
};

export default function UniversalEmailJSForm({
    inputCls,
    gradient,
    locale = "en",
    labels,
    show,
    serviceOptions,
    composeSubject,
    emailJs,
    onSuccess,
    onError,
}: UniversalEmailJSFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

    // Defaults neutrales
    const defaultInputCls =
        inputCls ??
        "w-full rounded-lg border border-current/20 bg-transparent px-3 py-2 text-current placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-current/30";
    const buttonStyle = { background: gradient ?? "linear-gradient(180deg,#2f2f2f,#1f1f1f)" };

    // Textos por defecto (EN/ES)
    const copy = {
        en: {
            name: "Name",
            phone: "Phone",
            email: "Email",
            location: "Location",
            service: "Service",
            message: "Details (optional)",
            send: "Send request",
            sending: "Sending...",
            ok: "✓ Message sent. We’ll contact you shortly.",
            error: "There was an error sending your message. Please try again.",
            locationPlaceholder: "Address, cross street, or area",
            messagePlaceholder: "Tell us anything we should know…",
        },
        es: {
            name: "Nombre",
            phone: "Teléfono",
            email: "Correo",
            location: "Ubicación",
            service: "Servicio",
            message: "Detalles (opcional)",
            send: "Enviar solicitud",
            sending: "Enviando...",
            ok: "✓ Mensaje enviado. Te contactaremos en breve.",
            error: "Hubo un error al enviar. Intenta nuevamente.",
            locationPlaceholder: "Dirección, esquina o zona",
            messagePlaceholder: "Cuéntanos lo necesario…",
        },
    }[locale];

    const L = { ...copy, ...(labels ?? {}) };

    // Visibilidad de campos
    const showName = show?.name ?? true;
    const showPhone = show?.phone ?? true;
    const showEmail = show?.email ?? true;
    const showLocation = show?.location ?? true;
    const showService = show?.service ?? !!serviceOptions?.length;
    const showMessage = show?.message ?? true;

    // EmailJS envs con fallback a NEXT_PUBLIC_*
    const PUBLIC_KEY =
        emailJs?.publicKey ?? process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";
    const SERVICE_ID =
        emailJs?.serviceId ?? process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
    const TEMPLATE_ID =
        emailJs?.templateId ?? process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";

    const defaultCompose = ({ service, location, locale }: { service?: string; location?: string; locale: "en" | "es" }) => {
        const base = locale === "es" ? "Solicitud" : "Request";
        const s = service ? ` ${service}` : "";
        const loc = location ? ` — ${location}` : "";
        return `${base}:${s}${loc}`.trim();
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;

        const serviceSel = (formRef.current.elements.namedItem("service") as HTMLSelectElement | null)?.value;
        const locationInput = (formRef.current.elements.namedItem("location") as HTMLInputElement | null)?.value;

        // Set hidden "title" field for EmailJS template subject
        const titleInput = formRef.current.elements.namedItem("title") as HTMLInputElement | null;
        if (titleInput) {
            const subject = (composeSubject ?? defaultCompose)({
                service: serviceSel || undefined,
                location: locationInput || undefined,
                locale,
            });
            titleInput.value = subject;
        }

        try {
            setStatus("sending");
            emailjs.init({ publicKey: PUBLIC_KEY });
            await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current);
            setStatus("ok");
            formRef.current.reset();
            onSuccess?.();
        } catch (err) {
            console.error(err);
            setStatus("error");
            onError?.(err);
        }
    };

    return (
        <form ref={formRef} onSubmit={onSubmit} className="mt-5 grid grid-cols-1 gap-4">
            {/* Campo oculto para {{title}} en tu template */}
            <input type="hidden" name="title" value="" />

            {/* Name / Phone */}
            {(showName || showPhone) && (
                <div className="grid gap-4 sm:grid-cols-2">
                    {showName && (
                        <Field label={L.name} id="name">
                            <input id="name" name="name" type="text" required className={defaultInputCls} />
                        </Field>
                    )}
                    {showPhone && (
                        <Field label={L.phone} id="phone">
                            <input id="phone" name="phone" type="tel" inputMode="tel" required className={defaultInputCls} />
                        </Field>
                    )}
                </div>
            )}

            {/* Email / Location */}
            {(showEmail || showLocation) && (
                <div className="grid gap-4 sm:grid-cols-2">
                    {showEmail && (
                        <Field label={L.email} id="email">
                            <input id="email" name="email" type="email" required className={defaultInputCls} />
                        </Field>
                    )}
                    {showLocation && (
                        <Field label={L.location} id="location">
                            <input
                                id="location"
                                name="location"
                                type="text"
                                placeholder={L.locationPlaceholder}
                                className={defaultInputCls}
                            />
                        </Field>
                    )}
                </div>
            )}

            {/* Service (optional) */}
            {showService && serviceOptions?.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={L.service} id="service">
                        <select id="service" name="service" className={defaultInputCls}>
                            {serviceOptions.map((opt) => (
                                <option key={opt}>{opt}</option>
                            ))}
                        </select>
                    </Field>
                </div>
            ) : null}

            {/* Message */}
            {showMessage && (
                <Field label={L.message} id="message">
                    <textarea id="message" name="message" rows={4} placeholder={L.messagePlaceholder} className={defaultInputCls} />
                </Field>
            )}

            {/* Honeypot anti-spam */}
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

            {/* Submit */}
            <div className="mt-2 flex flex-wrap gap-3">
                <button
                    type="submit"
                    disabled={status === "sending"}
                    className="rounded-xl px-5 py-3 font-semibold text-white shadow-lg disabled:opacity-60"
                    style={buttonStyle}
                >
                    {status === "sending" ? L.sending : L.send}
                </button>
            </div>

            {/* Status */}
            <p className="mt-2 text-xs opacity-70">
                {status === "ok" && L.ok}
                {status === "error" && L.error}
            </p>
        </form>
    );
}

/* Subcomponente de etiqueta */
function Field({
    label,
    id,
    children,
}: {
    label: string;
    id: string;
    children: React.ReactNode;
}) {
    return (
        <label htmlFor={id} className="block">
            <span className="text-sm font-semibold opacity-90">{label}</span>
            <div className="mt-1">{children}</div>
        </label>
    );
}
