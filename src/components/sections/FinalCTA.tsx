"use client";

import Link from "next/link";
import Section from "../ui/Section";
import clsx from "clsx";

type FinalCtaProps = {
    title?: string;
    subtitle?: string;
    featuresTitle?: string;
    minutes?: "60" | "90" | "60 o 90" | "60 or 90";
    priceFrom?: string;
    bullet?: string;
    buttonLabel?: string;
    buttonHref?: string;           // fallback if WhatsApp is not used
    note?: string;
    /** WhatsApp number (with or without +, spaces, or dashes) */
    whatsappPhone?: string;
    /** Pre-filled message */
    whatsappText?: string;
    className?: string;
};

function toWaLink(phoneRaw: string, text?: string) {
    // Keep only digits (and optional leading +)
    const phone = phoneRaw.trim().replace(/[^+\d]/g, "");
    const base = `https://wa.me/${phone.replace(/^\+/, "")}`;
    const query = text ? `?text=${encodeURIComponent(text)}` : "";
    return `${base}${query}`;
}

export default function FinalCTA({
    title = "Book in-studio or in-home",
    subtitle = "Choose the option that fits you best. Relief is one click away.",
    featuresTitle = "Our therapeutic sessions include",
    minutes = "60 or 90",
    priceFrom = "70",
    bullet = "Postural assessment, massage table and linens included, aromatherapy, and self-care recommendations.",
    buttonLabel = "Book now",
    buttonHref = "#booking",
    note = "Studio: 4311 W Waters Ave, Tampa, FL — Free parking (if available).",
    whatsappPhone = "+1 (813) 377-6678",
    whatsappText = "Hi! I’d like to book a session (studio or in-home).",
    className,
}: FinalCtaProps) {
    const useWhatsApp = Boolean(whatsappPhone);
    const href = useWhatsApp ? toWaLink(whatsappPhone!, whatsappText) : buttonHref;

    return (
        <Section bleed bg="none" maxW="7xl" py="xl" className={className}>
            <header className="text-center mb-8">
                <h2
                    className="font-display tracking-wide text-[30px] sm:text-[40px] leading-tight"
                    style={{ color: "var(--gold-soft)" }}
                >
                    {title}
                </h2>
                <p className="mt-3 text-white/75 max-w-2xl mx-auto">{subtitle}</p>
            </header>

            <div
                className={clsx(
                    "mx-auto max-w-4xl rounded-[28px] p-6 sm:p-8",
                    "bg-white/[0.02] backdrop-blur-sm ring-1 ring-white/10",
                    "shadow-[0_40px_120px_-30px_rgba(0,0,0,.6)]"
                )}
            >
                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                        <h3 className="text-white/90 text-lg sm:text-xl font-semibold">
                            {featuresTitle}
                        </h3>

                        <p className="mt-3 text-white/80">
                            <span className="text-white/90 font-medium">{minutes} minutes</span>
                            <span className="mx-2 text-white/30">·</span>
                            From{" "}
                            <span className="text-[color:var(--gold-strong)] font-semibold">
                                ${priceFrom}
                            </span>
                        </p>

                        <p className="mt-3 text-white/70">{bullet}</p>
                    </div>

                    {/* Primary button */}
                    <div className="md:text-right">
                        <Link
                            href={href}
                            target={useWhatsApp ? "_blank" : undefined}
                            rel={useWhatsApp ? "noopener noreferrer" : undefined}
                            className={clsx(
                                "inline-flex items-center justify-center rounded-full px-6 py-4",
                                "font-medium transition",
                                "bg-[color:var(--accent2-500)] hover:bg-[color:var(--accent2-600)] text-black/90",
                                "ring-1 ring-[color:var(--accent2-400)]/45",
                                "shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--accent2)_45%,transparent)]"
                            )}
                            aria-label={buttonLabel}
                            title={buttonLabel}
                        >
                            {buttonLabel}
                            <span aria-hidden className="ml-2 text-lg">➜</span>
                        </Link>
                    </div>
                </div>
            </div>
        </Section>
    );
}
