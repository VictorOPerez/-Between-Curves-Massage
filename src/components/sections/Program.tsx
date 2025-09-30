"use client";

import Image from "next/image";
import Section from "../ui/Section";

type Step = {
    id: number;
    iconSrc: string;
    label: string;       // texto bajo el círculo de la línea
    title: string;       // título del bloque
    desc: string;
};

const STEPS: Step[] = [
    {
        id: 1,
        iconSrc: "/images/programa/1.png",
        label: "Rehidrata y come ligero",
        title: "Rehidrata y come ligero",
        desc:
            "Agua y frutas/verduras hidratan el tejido y ayudan a eliminar residuos metabólicos.",
    },
    {
        id: 2,
        iconSrc: "/images/programa/2.png",
        label: "Calor local 10–15 min",
        title: "Calor local 10–15 min",
        desc:
            "Compresa tibia en zona tensa para prolongar el efecto del masaje. Evita calor si hay inflamación aguda.",
    },
    {
        id: 3,
        iconSrc: "/images/programa/3.png",
        label: "Estiramientos suaves",
        title: "Estiramientos suaves",
        desc:
            "Movimientos lentos, sin rebotes. 2–3 repeticiones por zona con respiración profunda.",
    },
    {
        id: 4,
        iconSrc: "/images/programa/4.png",
        label: "Señales a vigilar",
        title: "Señales a vigilar",
        desc:
            "Cada cuerpo responde de forma única. Date tiempo para descansar y notar los efectos positivos a lo largo del día.",
    },
];

export default function Program() {
    return (
        <div className="px-4 md:px-20 pb-20 ">
            {/* Título */}
            <h2
                className="font-display text-center text-[28px] sm:text-[32px] tracking-[0.08em]"
                style={{ color: "var(--gold-soft)" }}
            >
                Cuidado post-masaje
            </h2>

            {/* Timeline con círculos */}
            <div className="relative mt-8">
                <div className="absolute left-0 right-0 top-10 h-px bg-white/10" />
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {STEPS.map((s) => (
                        <li key={s.id} className="flex flex-col items-center text-center">
                            <div className="relative h-40 w-40 sm:h-24 sm:w-24 rounded-full overflow-hidden ring-1 ring-white/15 bg-white/5 backdrop-blur-sm">
                                <Image src={s.iconSrc} alt="" fill className="object-cover" sizes="96px" />
                                {/* badge numérico */}
                                <span
                                    className="absolute -top-2 -right-2 h-7 w-7 grid place-items-center rounded-full text-[12px] font-semibold 
                             ring-1 ring-[color:var(--gold-strong)]/40"
                                    style={{
                                        color: "var(--gold-strong)",
                                        backgroundColor: "color-mix(in oklab, var(--gold-strong) 18%, transparent)",
                                    }}
                                >
                                    {s.id}
                                </span>
                            </div>
                            <p className="mt-3 text-[13px] leading-5 text-white/80">{s.label}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Detalles de pasos (2 columnas) */}
            <div className="mt-10 grid gap-8 md:grid-cols-2">
                {STEPS.map((s) => (
                    <article key={`card-${s.id}`} className="relative">
                        {/* número fantasma */}
                        <span
                            className="pointer-events-none absolute -top-6 -left-2 select-none font-display font-semibold
                         text-[120px] sm:text-[140px] leading-none"
                            style={{ color: "rgba(201,168,106,0.10)" }} // dorado muy tenue
                            aria-hidden="true"
                        >
                            {s.id}
                        </span>

                        <div className="relative rounded-2xl p-5 sm:p-6 bg-white/[0.02] ">
                            <h3
                                className="font-semibold text-white/95"
                                style={{ color: "var(--gold-soft)" }}
                            >
                                {s.title}
                            </h3>
                            <p className="mt-3 text-white/80">{s.desc}</p>
                        </div>
                    </article>
                ))}
            </div>


        </div>
    );
}
