"use client";

import { useState } from "react";
import Section from "../ui/Section";
import clsx from "clsx";
import UniversalEmailJSForm from "./UniversalEmailJSForm";

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
            <UniversalEmailJSForm
                locale="en"
                serviceOptions={["60-min massage", "90-min massage", "Couples", "In-home", "In-studio"]}
                composeSubject={({ service, location }) =>
                    `Booking request${service ? `: ${service}` : ""}${location ? ` — ${location}` : ""}`
                }

                /* 🎨 Inputs: fondo transparente + borde claro + focus dorado */
                inputCls="
    w-full rounded-xl
    bg-transparent text-white/90
    placeholder-white/55
    border border-white/20 ring-1 ring-white/10
    px-3 py-3
    shadow-none
    focus:outline-none focus:ring-2 focus:ring-[#c9a86a]/45 focus:border-[#c9a86a]/50
  "

                /* Botón dorado (igual que antes) */
                gradient="linear-gradient(180deg,#c9a86a,#a8864a)"
            />


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
