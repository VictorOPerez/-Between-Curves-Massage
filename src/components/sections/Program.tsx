"use client";

import Image from "next/image";
import Section from "../ui/Section";

type Step = {
    id: number;
    iconSrc: string;
    label: string;       // text under the circle in the line
    title: string;       // block title
    desc: string;
};

const STEPS: Step[] = [
    {
        id: 1,
        iconSrc: "/images/programa/1.png",
        label: "Rehydrate and eat light",
        title: "Rehydrate and Eat Light",
        desc:
            "Water and fruits/vegetables hydrate tissues and help clear metabolic waste.",
    },
    {
        id: 2,
        iconSrc: "/images/programa/2.png",
        label: "Local heat 10–15 min",
        title: "Local Heat (10–15 min)",
        desc:
            "Warm compress on the tense area to prolong the massage effect. Avoid heat if there’s acute inflammation.",
    },
    {
        id: 3,
        iconSrc: "/images/programa/3.png",
        label: "Gentle stretches",
        title: "Gentle Stretches",
        desc:
            "Slow movements, no bouncing. 2–3 repetitions per area with deep breathing.",
    },
    {
        id: 4,
        iconSrc: "/images/programa/4.png",
        label: "Signs to watch",
        title: "Signs to Watch",
        desc:
            "Every body responds uniquely. Give yourself time to rest and notice the positive effects throughout the day.",
    },
];

export default function Program() {
    return (
        <div className="px-4 md:px-20 pb-20 ">
            {/* Title */}
            <h2
                className="font-display text-center text-[28px] sm:text-[32px] tracking-[0.08em]"
                style={{ color: "var(--gold-soft)" }}
            >
                Post-Massage Care
            </h2>

            {/* Timeline with circles */}
            <div className="relative mt-8">
                <div className="absolute left-0 right-0 top-10 h-px bg-white/10" />
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {STEPS.map((s) => (
                        <li key={s.id} className="flex flex-col items-center text-center">
                            <div className="relative h-40 w-40 sm:h-24 sm:w-24 rounded-full overflow-hidden ring-1 ring-white/15 bg-white/5 backdrop-blur-sm">
                                <Image src={s.iconSrc} alt="" fill className="object-cover" sizes="96px" />
                                {/* numeric badge (blue accent) */}
                                <span
                                    className="absolute -top-2 -right-2 h-7 w-7 grid place-items-center rounded-full text-[12px] font-semibold
                             ring-1 ring-[#AECBFF]/55"
                                    style={{
                                        color: "#AECBFF",
                                        backgroundColor: "color-mix(in oklab, #AECBFF 18%, transparent)",
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

            {/* Step details (2 columns) */}
            <div className="mt-10 grid gap-8 md:grid-cols-2">
                {STEPS.map((s) => (
                    <article key={`card-${s.id}`} className="relative">
                        {/* ghost number (blue accent) */}
                        <span
                            className="pointer-events-none absolute -top-6 -left-2 select-none font-display font-semibold
                         text-[120px] sm:text-[140px] leading-none"
                            style={{ color: "rgba(174,203,255,0.22)" }} // pastel blue, subtle
                            aria-hidden="true"
                        >
                            {s.id}
                        </span>

                        <div className="relative rounded-2xl p-5 sm:p-6 bg-white/[0.02] ring-1 ring-[#AECBFF]/55 shadow-[0_20px_80px_-40px_rgba(79,133,210,0.45)]">
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
