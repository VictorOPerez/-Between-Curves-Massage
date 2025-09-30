"use client";

import { useState } from "react";
import Section from "../ui/Section";
import clsx from "clsx";

type ContactSectionProps = {
    /** Email de destino para mailto */
    toEmail?: string;            // p.ej. "hola@magispa.com"
    /** Número con prefijo internacional para WhatsApp y llamada */
    whatsappPhone?: string;      // p.ej. "+34600000000"
    callPhone?: string;          // p.ej. "+34600000000"
    className?: string;
};

export default function ContactSection({
    toEmail = "hola@magispa.com",
    whatsappPhone = "+34600000000",
    callPhone = "+34600000000",
    className,
}: ContactSectionProps) {
    // estado del formulario
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

    // Enviar por correo usando mailto (abre Gmail si es handler del sistema)
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Consulta desde la web — ${name || "Cliente"}`);
        const bodyLines = [
            `Nombre: ${name}`,
            `Email: ${email}`,
            phone ? `Teléfono: ${phone}` : null,
            "",
            "Mensaje:",
            message,
        ].filter(Boolean);
        const body = encodeURIComponent(bodyLines.join("\n"));
        window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
    };

    // Abrir WhatsApp con mensaje pre llenado
    const openWhatsApp = () => {
        const text = encodeURIComponent(
            [
                "Hola, me gustaría más información.",
                `Nombre: ${name || "—"}`,
                email ? `Email: ${email}` : null,
                phone ? `Teléfono: ${phone}` : null,
                message ? `Mensaje: ${message}` : null,
            ].filter(Boolean).join("\n")
        );
        // usa wa.me (web/desktop/móvil)
        window.open(`https://wa.me/${whatsappPhone.replace(/\D/g, "")}?text=${text}`, "_blank");
    };

    return (
        <Section
            bleed
            bg="none"
            maxW="7xl"
            py="xl"
            className={clsx("ring-1 ring-white/5 p-8 sm:p-10 rounded-[28px]", className)}
        >
            <h2
                className="font-display text-[26px] sm:text-[32px] tracking-wide mb-2 text-center"
                style={{ color: "var(--gold-soft)" }}
            >
                CONTÁCTANOS
            </h2>
            <p className="text-center text-white/70 mb-8">
                Resolvemos dudas y coordinamos tu sesión por el canal que prefieras.
            </p>

            <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-12">
                {/* Inputs */}
                <div className="lg:col-span-6 space-y-5 px-2 sm:px-4">
                    <Field label="Nombre">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Tu nombre"
                            className="w-full bg-transparent outline-none border-b border-white/10 focus:border-[color:var(--accent2-400)] py-3 text-white/90"
                        />
                    </Field>

                    <Field label="Email">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="tu@correo.com"
                            className="w-full bg-transparent outline-none border-b border-white/10 focus:border-[color:var(--accent2-400)] py-3 text-white/90"
                        />
                    </Field>

                    <Field label="Teléfono (opcional)">
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+34 600 000 000"
                            className="w-full bg-transparent outline-none border-b border-white/10 focus:border-[color:var(--accent2-400)] py-3 text-white/90"
                        />
                    </Field>
                </div>

                {/* Mensaje + acciones */}
                <div className="lg:col-span-6 space-y-6 px-2 sm:px-4">
                    <Field label="Mensaje">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Cuéntanos qué necesitas…"
                            rows={6}
                            className="w-full resize-none bg-transparent outline-none border-b border-white/10 focus:border-[color:var(--accent2-400)] py-3 text-white/90"
                        />
                    </Field>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        {/* Enviar por email (mailto) */}
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-full px-6 py-3
                         bg-[color:var(--accent2-500)] hover:bg-[color:var(--accent2-600)]
                         text-black/90 transition
                         ring-1 ring-[color:var(--accent2-400)]/45
                         shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--accent2)_45%,transparent)]"
                        >
                            Enviar por email
                            <span className="ml-2" aria-hidden>✉️</span>
                        </button>

                        {/* WhatsApp */}
                        <button
                            type="button"
                            onClick={openWhatsApp}
                            className="inline-flex items-center justify-center rounded-full px-6 py-3
                         bg-white/5 hover:bg-white/10 transition
                         ring-1 ring-white/12 text-white"
                        >
                            Contactar por WhatsApp
                            <span className="ml-2" aria-hidden>💬</span>
                        </button>

                        {/* Llamar */}
                        <a
                            href={`tel:${callPhone}`}
                            className="inline-flex items-center justify-center rounded-full px-6 py-3
                         ring-1 ring-[color:var(--gold-strong)]/35
                         bg-[color:var(--gold-strong)]/12 hover:bg-[color:var(--gold-strong)]/20
                         text-[color:var(--gold-strong)] transition"
                        >
                            Llamar por teléfono
                            <span className="ml-2" aria-hidden>📞</span>
                        </a>
                    </div>

                    {/* Info de respuesta */}
                    <p className="text-white/55 text-sm">
                        Respondemos normalmente en menos de 24&nbsp;h. También puedes escribirnos a{" "}
                        <a
                            href={`mailto:${toEmail}`}
                            className="underline decoration-[color:var(--accent2-400)]/60 underline-offset-4 hover:text-[color:var(--accent2-400)]"
                        >
                            {toEmail}
                        </a>.
                    </p>
                </div>
            </form>
        </Section>
    );
}

/* -------------------- subcomponente -------------------- */
function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="block text-sm text-white/60 mb-1">{label}</span>
            {children}
        </label>
    );
}
