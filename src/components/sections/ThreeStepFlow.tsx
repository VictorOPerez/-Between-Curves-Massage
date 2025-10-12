"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Step = {
    title: string;
    subtitle?: string;
    body: string;
    icon: "calendar" | "bag" | "sparkles";
    image: string; // /images/steps/1.jpg...
};

const STEPS = [
    {
        title: "Book in 2 minutes",
        body: "Choose your service and time. Instant confirmation—no calls.",
        icon: "calendar",
        image: "/images/steps/1.png",
    },
    {
        title: "We arrive fully prepared",
        body: "Table, disposable linens, aromatherapy, and music. You just breathe.",
        icon: "bag",
        image: "/images/steps/2.png",
    },
    {
        title: "Renew body and mind",
        body: "Measurable results: less tension, better sleep, steady energy.",
        icon: "sparkles",
        image: "/images/steps/3.png",
    },
];

export default function ThreeStepFlow() {
    return (
        <section className="mx-[calc(-50vw+50%)] px-4 sm:px-6 lg:px-8">
            <div
                className={cn(
                    "mx-auto w-full max-w-[1280px] rounded-[28px]",
                    "bg-white/[0.02] ring-1 ring-white/10 backdrop-blur-sm",
                    "shadow-[0_40px_120px_-30px_rgba(0,0,0,.6)] flex",
                    "p-6 sm:p-10"
                )}
            >
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Línea de tiempo */}
                    <ol className="lg:col-span-6 relative">
                        <header className="mb-8">
                            <h2
                                className="font-display text-[30px] sm:text-[48px] tracking-wide"
                                style={{ color: "var(--gold-soft)" }}
                            >
                                Your 3-Step Ritual
                            </h2>
                            <p className="mt-2 text-white/75">
                                Simple, convenient, and up to MagiSpa standards.
                            </p>
                        </header>

                        <div className="space-y-7">
                            {STEPS.map((s, i) => (
                                <li key={i} className="relative pl-16">
                                    {/* medallón numerado — AZUL PASTEL */}
                                    <span
                                        className="absolute left-0 top-0 grid place-items-center
                    h-12 w-12 rounded-full
                    ring-1 ring-[#AECBFF]/55
                    bg-[#D7E7FF]/18
                    text-[#AECBFF] z-20"
                                    >
                                        {i + 1}
                                    </span>

                                    <h3 className="text-lg font-semibold text-white/90">
                                        {s.title}
                                    </h3>
                                    <p className="mt-1 text-white/70">{s.body}</p>
                                </li>
                            ))}
                        </div>

                        {/* CTA opcional */}
                        <div className="mt-8 flex gap-3">
                            {/* Botón primario — ACENTO TURQUESA */}
                            <a
                                href={`https://wa.me/18135551234?text=${encodeURIComponent(
                                    "Hola 👋 Me gustaría reservar un masaje a domicilio."
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full px-5 py-3
                           bg-[color:var(--accent2-500)] hover:bg-[color:var(--accent2-600)]
                           text-black/90 transition
                           ring-1 ring-[color:var(--accent2-400)]/45
                           shadow-[0_10px_26px_-12px_color-mix(in_srgb,var(--accent2)_45%,transparent)]"
                            >
                                Contact via WhatsApp
                            </a>
                        </div>
                    </ol>

                    {/* Mosaico de imágenes */}
                    <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                        {STEPS.map((s, i) => (
                            <div
                                key={`img-${i}`}
                                className={cn(
                                    "relative overflow-hidden rounded-3xl ring-1 ring-white/10",
                                    i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                                )}
                            >
                                <Image
                                    src={s.image}
                                    alt={s.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width:1024px) 100vw, 40vw"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
