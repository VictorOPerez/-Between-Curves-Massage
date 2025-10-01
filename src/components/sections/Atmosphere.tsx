"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Section from "../ui/Section";
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import GalleryWithThumbs from "./CarouselApi";


type Item = { src: string; alt: string; caption?: string };

const DEFAULT_ITEMS: Item[] = [
    { src: "/images/gallery/1.jpg", alt: "Baño termal", caption: "Baño termal" },
    { src: "/images/gallery/2.jpg", alt: "Sala de relajación" },
    { src: "/images/gallery/3.jpg", alt: "Detalles de madera" },
    { src: "/images/gallery/4.jpg", alt: "Suite con jacuzzi" },
    { src: "/images/gallery/5.jpg", alt: "Área de descanso" },
    { src: "/images/gallery/6.jpg", alt: "Piscina interior" },
    { src: "/images/gallery/7.jpg", alt: "Salón principal" },
];


export default function Atmosphere({ items = DEFAULT_ITEMS }: { items?: Item[] }) {
    const [idx, setIdx] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const total = items.length;
    const current = items[idx];

    const next = () => setIdx((i) => (i + 1) % total);
    const prev = () => setIdx((i) => (i - 1 + total) % total);
    const select = (i: number) => { setIdx(i); setLoaded(false); };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [total]);

    return (

        <section id="servicios" className=" md:px-13 pb-20 px-5">

            <header className=" flex justify-center flex-col items-center mb-10 " >
                <h2
                    className="font-display text-[32px] text-center sm:text-[34px] tracking-wide"
                    style={{ color: "var(--gold-soft)" }}
                >
                    Elige tu masaje
                </h2>
                <p className="mt-2 text-white/75 text-[22px] text-center max-w-prose block py-3">
                    60/90 min · Llegamos con todo · Resultados reales.
                </p>
            </header>
            <GalleryWithThumbs />
            {/* Franja inferior duración / costo */}
            <div className="mt-10">
                <div className="rounded-full px-5 sm:px-6 py-4 sm:py-5 bg-white/[0.03] ring-1 ring-white/10 flex items-center gap-5 flex-wrap">
                    <div className="flex items-center gap-3">
                        <span className="text-white/70">Duración</span>
                        <strong className="text-white/90">60 min</strong>
                    </div>

                    {/* separador decorativo tipo slider */}
                    <div className="flex-1 h-px bg-white/10 relative hidden sm:block">
                        <span
                            className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full"
                            style={{ backgroundColor: "var(--gold-strong)" }}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-white/70">Costo</span>
                        <strong className="text-white/90">$90</strong>
                    </div>
                </div>
            </div>
        </section>
    );
}
