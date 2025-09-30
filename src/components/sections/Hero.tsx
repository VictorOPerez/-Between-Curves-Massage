"use client";

import Section from "../ui/Section";
import clsx from "clsx";
import HeroImageSlot from "./HeroImageSlot";
import TrustBadges from "./TrustBadges";

export default function Hero() {
    return (
        <div className=" px-5 -mt-5 md:-mt-15">
            <div className="grid gap-2 lg:gap-10 lg:grid-cols-12 lg:grid-rows-[auto_auto] items-center">
                {/* Título + subtítulo — izq en desktop */}
                <div className="px-4 mt-[15px] md:ml-10 md:mt-36 order-1 pt-8 sm:pt-10 lg:pt-0 lg:col-span-5 lg:col-start-1 lg:row-start-1 flex flex-col justify-center">
                    <h1
                        className={clsx(
                            "font-display tracking-wide leading-[1.05]",
                            "text-[38px] sm:text-[42px] lg:text-[56px]"
                        )}
                        style={{ color: "var(--gold-soft)" }}
                    >
                        Masaje profesional <br className="hidden sm:block" />
                        a domicilio en Tampa
                    </h1>

                    <p className="mt-4 text-white/70 max-w-prose">
                        Llevamos el spa a tu casa. Técnicas clínicas y sensoriales para aliviar dolor, soltar estrés y dormir mejor. Tú solo respiras; nosotros nos ocupamos de todo: camilla, sábanas y aromaterapia
                    </p>

                    {/* CTAs (desktop) */}
                    <div className="hidden mt-6 md:flex flex-col sm:flex-row gap-3">
                        {/* Secundario — dorado */}
                        <a
                            href="#servicios"
                            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium
                         ring-1 ring-[color:var(--gold-strong)]/30
                         bg-[color:var(--gold-strong)]/15 hover:bg-[color:var(--gold-strong)]/25 transition"
                            style={{ color: "var(--gold-strong)" }}
                        >
                            Ver servicios <span className="ml-2 inline-block">➜</span>
                        </a>

                        {/* Primario — ACENTO TURQUESA */}
                        <a
                            href="#reserva"
                            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium
                         bg-[color:var(--accent2-500)] hover:bg-[color:var(--accent2-600)]
                         text-black/90 transition
                         ring-1 ring-[color:var(--accent2-400)]/45
                         shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--accent2)_45%,transparent)]"
                        >
                            Reservar cita
                        </a>
                    </div>
                </div>

                {/* Badges desktop: fila completa debajo (dentro de la grid) */}
                <div className="hidden relative md:block lg:col-span-8 order-4 mt-0 md:-ml-6">
                    <TrustBadges className="px-4 absolute bottom-10" />
                </div>

                {/* Imagen — derecha en desktop */}
                <figure className="order-2 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
                    <div className="mx-auto max-w-[min(92vw,560px)] lg:max-w-none md:-mr-5 md:mt-4">
                        <HeroImageSlot />
                    </div>
                </figure>

                {/* CTA — abajo en móvil */}
                <div className="px-6 block md:hidden order-3 lg:col-span-5 lg:col-start-1 lg:row-start-2 mt-4 mb-8">
                    <div className="flex items-start sm:flex-row sm:items-center gap-3">
                        {/* Secundario — dorado */}
                        <a
                            href="#servicios"
                            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium
                         ring-1 ring-[color:var(--gold-strong)]/30
                         bg-[color:var(--gold-strong)]/15 hover:bg-[color:var(--gold-strong)]/25 transition"
                            style={{ color: "var(--gold-strong)" }}
                        >
                            Ver servicios <span className="ml-2 inline-block">➜</span>
                        </a>

                        {/* Primario — ACENTO TURQUESA */}
                        <a
                            href="#reserva"
                            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium
                         bg-[color:var(--accent2-500)] hover:bg-[color:var(--accent2-600)]
                         text-black/90 transition
                         ring-1 ring-[color:var(--accent2-400)]/45
                         shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--accent2)_45%,transparent)]"
                        >
                            Reservar cita
                        </a>
                    </div>
                </div>
            </div>

            {/* Badges móviles */}
            <TrustBadges className="block md:hidden" />
        </div>
    );
}
