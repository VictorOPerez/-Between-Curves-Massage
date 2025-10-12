"use client";

import { useState } from "react";
import Section from "../ui/Section";
import clsx from "clsx";

type ContactSectionProps = {
    /** Destination email for mailto */
    toEmail?: string;            // e.g. "hola@magispa.com"
    /** International number for WhatsApp and call */
    whatsappPhone?: string;      // e.g. "+34600000000"
    callPhone?: string;          // e.g. "+34600000000"
    className?: string;
};

export default function ContactSection({
    toEmail = "hola@magispa.com",
    whatsappPhone = "+34600000000",
    callPhone = "+34600000000",
    className,
}: ContactSectionProps) {
    // form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

    // Send via email using mailto (opens Gmail if it's the system handler)
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Website inquiry — ${name || "Client"}`);
        const bodyLines = [
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Phone: ${phone}` : null,
            "",
            "Message:",
            message,
        ].filter(Boolean);
        const body = encodeURIComponent(bodyLines.join("\n"));
        window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
    };

    // Open WhatsApp with prefilled message
    const openWhatsApp = () => {
        const text = encodeURIComponent(
            [
                "Hi, I'd like more information.",
                `Name: ${name || "—"}`,
                email ? `Email: ${email}` : null,
                phone ? `Phone: ${phone}` : null,
                message ? `Message: ${message}` : null,
            ]
                .filter(Boolean)
                .join("\n")
        );
        // use wa.me (web/desktop/mobile)
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
                CONTACT US
            </h2>
            <p className="text-center text-white/70 mb-8">
                We answer questions and coordinate your session through the channel you prefer.
            </p>

            <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-12">
                {/* Inputs */}
                <div className="lg:col-span-6 space-y-5 px-2 sm:px-4">
                    <Field label="Name">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Your name"
                            className="w-full bg-transparent outline-none border-b border-white/10 focus:border-[color:var(--accent2-400)] py-3 text-white/90"
                        />
                    </Field>

                    <Field label="Email">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="contact@betweencurvesmassage.com"
                            className="w-full bg-transparent outline-none border-b border-white/10 focus:border-[color:var(--accent2-400)] py-3 text-white/90"
                        />
                    </Field>

                    <Field label="Phone (optional)">
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (813) 377-6678"
                            className="w-full bg-transparent outline-none border-b border-white/10 focus:border-[color:var(--accent2-400)] py-3 text-white/90"
                        />
                    </Field>
                </div>

                {/* Message + actions */}
                <div className="lg:col-span-6 space-y-6 px-2 sm:px-4">
                    <Field label="Message">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us what you need…"
                            rows={6}
                            className="w-full resize-none bg-transparent outline-none border-b border-white/10 focus:border-[color:var(--accent2-400)] py-3 text-white/90"
                        />
                    </Field>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        {/* Send by email (mailto) */}
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-full px-6 py-3
                         bg-[color:var(--accent2-500)] hover:bg-[color:var(--accent2-600)]
                         text-black/90 transition
                         ring-1 ring-[color:var(--accent2-400)]/45
                         shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--accent2)_45%,transparent)]"
                        >
                            Send by email
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
                            Contact via WhatsApp
                            <span className="ml-2" aria-hidden>💬</span>
                        </button>

                        {/* Call */}
                        <a
                            href={`tel:${callPhone}`}
                            className="inline-flex items-center justify-center rounded-full px-6 py-3
                         ring-1 ring-[color:var(--gold-strong)]/35
                         bg-[color:var(--gold-strong)]/12 hover:bg-[color:var(--gold-strong)]/20
                         text-[color:var(--gold-strong)] transition"
                        >
                            Call by phone
                            <span className="ml-2" aria-hidden>📞</span>
                        </a>
                    </div>

                    {/* Reply info */}
                    <p className="text-white/55 text-sm">
                        We usually reply in under 24&nbsp;hours. You can also write to{" "}
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

/* -------------------- subcomponent -------------------- */
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
