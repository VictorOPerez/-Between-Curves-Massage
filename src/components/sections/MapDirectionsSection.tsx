// src/components/sections/MapDirectionsSection.tsx
"use client";

import Section from "../ui/Section";

export default function MapDirectionsSection() {
    return (
        <Section bleed bg="none" maxW="7xl" py="xl" className=" pt-10">
            <header className="text-center mb-4">
                <h2
                    className="font-display tracking-wide text-[30px] sm:text-[40px] leading-tight"
                    style={{ color: "var(--gold-soft)" }}
                >
                    Map & Directions
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto mt-3">
                    <span className="text-white/80 font-medium">Studio:</span>{" "}
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

            <div className="mt-5">
                <iframe
                    title="Map - 4311 W Waters Ave, Tampa, FL"
                    src="https://www.google.com/maps?q=4311+W+Waters+Ave,+Tampa,+FL&output=embed"
                    width="100%"
                    height="420"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </Section>
    );
}
