"use client";
import ContactSection from "@/components/sections/BookingSection";
import Section from "@/components/ui/Section";
import Link from "next/link";

export default function ContactPage() {
    return (
        <main className="mt-10">
            {/* Light, minimal hero */}
            <Section bleed bg="none" maxW="7xl" py="xl">
                <header className="text-center">
                    <p className="text-sm text-white/50">We’re here to help</p>
                    <h1
                        className="font-display text-[34px] sm:text-[44px] leading-tight mt-2"
                        style={{ color: "var(--gold-soft)" }}
                    >
                        Contact & Location
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto mt-3">
                        We answer questions, coordinate schedules, and advise you based on your goals.
                    </p>

                    {/* quick info chips */}
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                        <span className="rounded-full px-3 py-1 text-sm ring-1 ring-white/10 bg-white/5 text-white/80">
                            Reply &lt; 24h
                        </span>
                        <span className="rounded-full px-3 py-1 text-sm ring-1 ring-white/10 bg-white/5 text-white/80">
                            WhatsApp & phone call
                        </span>
                        <span className="rounded-full px-3 py-1 text-sm ring-1 ring-white/10 bg-white/5 text-white/80">
                            Hours: Mon–Sun 7:30 AM–8:00 PM
                        </span>
                    </div>

                    {/* address + directions (just text, before the form) */}
                    <p className="text-white/70 max-w-2xl mx-auto mt-4">
                        <span className="text-white/80 font-medium">Studio address:</span>{" "}
                        <a
                            href="https://maps.google.com/?q=4311%20W%20Waters%20Ave,%20Tampa,%20FL"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold"
                            style={{ color: "var(--gold-strong)" }}
                        >
                            4311 W Waters Ave, Tampa, FL
                        </a>{" "}
                        —{" "}
                        <a
                            href="https://maps.google.com/?q=4311%20W%20Waters%20Ave,%20Tampa,%20FL"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold underline-offset-2 hover:underline"
                            style={{ color: "var(--gold-strong)" }}
                        >
                            Get Directions / Cómo llegar
                        </a>
                    </p>
                </header>
            </Section>

            {/* Form + actions (mailto, wa.me, tel) */}
            <ContactSection
                toEmail="hola@magispa.com"
                whatsappPhone="+1 (813) 377-6678"   // ✅ tu número
                callPhone="+1 (813) 377-6678"       // ✅ tu número
                className="mt-2"
            />

            {/* Lightweight FAQ (optional) */}
            <Section bleed bg="none" maxW="7xl" py="lg">
                <div className="grid gap-6 md:grid-cols-2">
                    <FaqItem q="Can I pay in cash or by card?" a="Yes, we accept both methods." />
                    <FaqItem q="Do you offer in-home service?" a="Yes, we bring the table and all necessary materials." />
                    <FaqItem q="How far in advance should I book?" a="Ideally 24–48h. For same-day, message us on WhatsApp." />
                    <FaqItem q="What do you recommend for neck pain?" a="A 60–90 min therapeutic massage usually works well. We’ll guide you on WhatsApp." />
                </div>
            </Section>
        </main>
    );
}

function FaqItem({ q, a }: { q: string; a: string }) {
    return (
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.02] p-5">
            <h3 className="text-white/90 font-medium">{q}</h3>
            <p className="text-white/70 mt-2">{a}</p>
        </div>
    );
}
