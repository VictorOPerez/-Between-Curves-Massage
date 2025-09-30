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
    { id: 1, iconSrc: "/images/deep tese.png", label: "Deep Tissue Massage", title: "Deep Tissue Massage", desc: "Alivio específico de nudos y rigidez profunda para cuello, hombros y zona lumbar. Ideal si pasas horas sentado o entrenas fuerte. Libera adherencias, mejora rango de movimiento, reduce dolor crónico." },
    { id: 2, iconSrc: "/images/Swedish Massage.png", label: "Swedish Massage", title: "Swedish Massage", desc: "Maniobras suaves y rítmicas para calmar el sistema nervioso. Sales ligera/o, con mente clara y cuerpo descansado. Baja el estrés, mejora circulación, favorece el descanso." },
    { id: 3, iconSrc: "/images/hot ston.png", label: "Hot Stone Massage", title: "Hot Stone Massage", desc: "El calor de piedras de basalto ablanda la musculatura y acelera la liberación de tensión, logrando alivio profundo en menos tiempo." },
    { id: 4, iconSrc: "/images/Cupping.png", label: "Cupping", title: "Cupping Therapy", desc: "Succión controlada que descomprime tejidos, libera adherencias y estimula la circulación para recuperar rango de movimiento y aliviar dolor localizado." },
    { id: 5, iconSrc: "/images/foot.png", label: "Masaje de pies", title: "Foot Massage", desc: "Estimulación de puntos reflejos y descarga de la fatiga en pies y piernas para devolver ligereza inmediata y equilibrio general al cuerpo." },
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

    // Oculta el hint después de 3s
    React.useEffect(() => {
        const t = setTimeout(() => setShowHint(false), 3000);
        return () => clearTimeout(t);
    }, []);

    const goTo = (i: number) => api?.scrollTo(i);

    return (
        <div className="w-full flex flex-col lg:flex-row items-start gap-6 lg:gap-20">
            {/* ===== Carrusel principal (con pistas) ===== */}
            <div className="relative w-full lg:w-[740px] xl:w-[720px] shrink-0 overh" >


                <Carousel setApi={setApi} className="w-full  h-[700px]">
                    {/* Peek en móvil: cada item ocupa <100% */}
                    <CarouselContent className="  h-[680px] md:h-[600] ">
                        {STEPS_FROM_SERVICES.map((it) => (
                            <CarouselItem
                                key={it.id}
                                className="pl-3 basis-full h-full"
                            >
                                <div className="relative w-full h-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-2xl ">
                                    <AccentCard
                                        image={it.iconSrc}
                                        title={it.title}
                                        description={it.desc}
                                        primaryHref="#reserva"
                                        primaryLabel="Reservar ahora"
                                        secondaryHref="#servicios"
                                        secondaryLabel="Ver detalles"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Flechas: dentro en móvil */}
                    <CarouselPrevious
                        className="absolute top-1/2 -translate-y-1/2 left-3 z-30 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-background/70 backdrop-blur border border-[color:var(--accent2-400)] text-black hover:bg-[color:var(--accent2-400)]/15"
                    />
                    <CarouselNext
                        className="absolute top-1/2 -translate-y-1/2 right-3 z-30 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-background/70 backdrop-blur border border-[color:var(--accent2-400)] text-black hover:bg-[color:var(--accent2-400)]/15"
                    />
                </Carousel>

                {/* Hint “Desliza →” (desaparece solo) */}
                {canNext && showHint && (
                    <div className="absolute bottom-2 right-3 z-30">
                        <div className="px-3 py-1.5 text-xs rounded-full bg-black/60 text-white/90 backdrop-blur transition-opacity duration-500">
                            Desliza →
                        </div>
                    </div>
                )}

                {/* Paginación por puntos */}
                <div className="mt-3 flex justify-center gap-2">
                    {STEPS_FROM_SERVICES.map((_, i) => (
                        <button
                            key={`dot-${i}`}
                            onClick={() => goTo(i)}
                            aria-label={`Ir al slide ${i + 1}`}
                            aria-current={i === current}
                            className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-[color:var(--accent2-400)]" : "w-3 bg-white/25"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* ===== Miniaturas (móvil: carrusel horizontal) ===== */}
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
                                        aria-label={`Ver ${it.title}`}
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

            {/* ===== Miniaturas (desktop: grid a la derecha) ===== */}
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
                                aria-label={`Ver ${it.title}`}
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
