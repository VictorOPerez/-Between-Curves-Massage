"use client";

import * as React from "react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import AccentCard from "./AccentCard";

type Step = {
    id: number;
    iconSrc: string;
    label: string;
    title: string;
    desc: string;
};

export const STEPS_FROM_SERVICES: Step[] = [
    {
        id: 1,
        iconSrc: "/images/deep tese.png",
        label: "Deep Tissue Massage",
        title: "Deep Tissue Massage",
        desc:
            "Targeted relief for knots and deep stiffness in the neck, shoulders, and lower back. Ideal if you sit for long hours or train hard. Releases adhesions, improves range of motion, and reduces chronic pain.",
    },
    {
        id: 2,
        iconSrc: "/images/Swedish Massage.png",
        label: "Swedish Massage",
        title: "Swedish Massage",
        desc:
            "Smooth, rhythmic strokes to calm the nervous system. Leave feeling lighter, with a clear mind and a rested body. Lowers stress, improves circulation, and promotes restful sleep.",
    },
    {
        id: 3,
        iconSrc: "/images/hot ston.png",
        label: "Hot Stone Massage",
        title: "Hot Stone Massage",
        desc:
            "The heat of basalt stones softens muscles and speeds tension release, achieving deep relief in less time.",
    },
    {
        id: 4,
        iconSrc: "/images/Cupping.png",
        label: "Cupping",
        title: "Cupping Therapy",
        desc:
            "Controlled suction that decompresses tissues, frees adhesions, and stimulates circulation to restore range of motion and ease localized pain.",
    },
    {
        id: 5,
        iconSrc: "/images/foot.png",
        label: "Foot Massage",
        title: "Foot Massage",
        desc:
            "Reflex-point stimulation and fatigue release in feet and legs to bring instant lightness and overall balance to the body.",
    },
];

export default function GalleryWithThumbs() {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [canPrev, setCanPrev] = React.useState(false);
    const [canNext, setCanNext] = React.useState(false);
    const [showHint, setShowHint] = React.useState(true);

    React.useEffect(() => {
        if (!api) return;
        const update = () => {
            setCurrent(api.selectedScrollSnap());
            setCanPrev(api.canScrollPrev());
            setCanNext(api.canScrollNext());
        };
        update();
        api.on("select", update);
        api.on("reInit", update);
    }, [api]);

    // Hide hint after 3s
    React.useEffect(() => {
        const t = setTimeout(() => setShowHint(false), 3000);
        return () => clearTimeout(t);
    }, []);

    const goTo = (i: number) => api?.scrollTo(i);

    return (
        <div className="w-full flex flex-col lg:flex-row items-start gap-6 lg:gap-20">
            {/* ===== Main carousel ===== */}
            <div className="relative w-full lg:w-[740px] xl:w-[720px] shrink-0 overh">
                <Carousel setApi={setApi} className="w-full  h-[670px]">
                    {/* Peek on mobile */}
                    <CarouselContent className="  h-[650px] md:h-[600] ">
                        {STEPS_FROM_SERVICES.map((it) => (
                            <CarouselItem key={it.id} className="pl-3 basis-full h-full">
                                <div className="relative w-full h-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-2xl ">
                                    <AccentCard
                                        image={it.iconSrc}
                                        title={it.title}
                                        description={it.desc}
                                        primaryHref="+18133776678"
                                        primaryLabel="Book now"
                                        secondaryHref="#servicios"
                                        secondaryLabel="See details"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Arrows */}
                    <CarouselPrevious
                        className="absolute top-1/2 -translate-y-1/2 left-3 z-30 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-background/70 backdrop-blur border border-[color:var(--accent2-400)] text-black hover:bg-[color:var(--accent2-400)]/15 shadow-[0_6px_22px_-10px_color-mix(in_srgb,var(--accent2)_45%,transparent)]"
                    />
                    <CarouselNext
                        className="absolute top-1/2 -translate-y-1/2 right-3 z-30 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-background/70 backdrop-blur border border-[color:var(--accent2-400)] text-black hover:bg-[color:var(--accent2-400)]/15 shadow-[0_6px_22px_-10px_color-mix(in_srgb,var(--accent2)_45%,transparent)]"
                    />
                </Carousel>

                {/* Hint “Swipe →” */}
                {canNext && showHint && (
                    <div className="absolute bottom-2 right-3 z-30">
                        <div className="px-3 py-1.5 text-xs rounded-full bg-black/60 text-white/90 backdrop-blur transition-opacity duration-500 ring-1 ring-[color:var(--gold-strong)]/35">
                            Swipe →
                        </div>
                    </div>
                )}

                {/* Pagination dots */}
                <div className="flex justify-center gap-2">
                    {STEPS_FROM_SERVICES.map((_, i) => (
                        <button
                            key={`dot-${i}`}
                            onClick={() => goTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            aria-current={i === current}
                            className={`h-1.5 rounded-full transition-all ${i === current
                                ? "w-6 bg-[color:var(--accent2-400)]"
                                : "w-3 bg-white/25"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* ===== Thumbs (mobile) ===== */}
            <div className="lg:hidden w-full">
                <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent className="-ml-2">
                        {STEPS_FROM_SERVICES.map((it, i) => {
                            const active = i === current;
                            return (
                                <CarouselItem key={`thumb-m-${it.id}`} className="pl-2 basis-1/5">
                                    <button
                                        onClick={() => goTo(i)}
                                        aria-current={active}
                                        aria-label={`View ${it.title}`}
                                        title={it.label}
                                        className={`relative w-full aspect-square rounded-xl overflow-hidden transition ${active
                                            ? "ring-2 ring-[color:var(--accent2-400)] scale-[1.03] shadow-[0_10px_30px_rgba(45,212,191,0.22)] z-10"
                                            : "ring-1 ring-white/10 hover:ring-white/20 hover:scale-[1.02]"
                                            }`}
                                    >
                                        <Image src={it.iconSrc} alt={it.title} fill className="object-cover" />
                                    </button>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                </Carousel>
            </div>

            {/* ===== Thumbs (desktop) ===== */}
            <aside className="hidden lg:block lg:w-[320px] xl:w-[360px] flex-none">
                <div className="grid grid-cols-2 gap-3 max-h-[560px] overflow-auto px-2 py-2">
                    {STEPS_FROM_SERVICES.map((it, i) => {
                        const active = i === current;
                        return (
                            <button
                                key={`thumb-d-${it.id}`}
                                onClick={() => goTo(i)}
                                className={`relative w-full aspect-square rounded-xl overflow-hidden transition ${active
                                    ? "ring-2 ring-[color:var(--accent2-400)] scale-[1.03] shadow-[0_10px_30px_rgba(45,212,191,0.22)] z-10"
                                    : "ring-1 ring-white/10 hover:ring-white/20 hover:scale-[1.02]"
                                    }`}
                                aria-current={active}
                                aria-label={`View ${it.title}`}
                                title={it.label}
                            >
                                <Image src={it.iconSrc} alt={it.title} fill className="object-cover" />
                            </button>
                        );
                    })}
                </div>
            </aside>
        </div>
    );
}
