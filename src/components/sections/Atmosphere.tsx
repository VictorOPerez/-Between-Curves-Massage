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
    { src: "/images/gallery/1.jpg", alt: "Thermal bath", caption: "Thermal bath" },
    { src: "/images/gallery/2.jpg", alt: "Relaxation room" },
    { src: "/images/gallery/3.jpg", alt: "Wooden details" },
    { src: "/images/gallery/4.jpg", alt: "Suite with jacuzzi" },
    { src: "/images/gallery/5.jpg", alt: "Rest area" },
    { src: "/images/gallery/6.jpg", alt: "Indoor pool" },
    { src: "/images/gallery/7.jpg", alt: "Main lounge" },
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
            <header className=" flex justify-center flex-col items-center mb-10 ">
                <h2
                    className="font-display text-[32px] text-center sm:text-[34px] tracking-wide"
                    style={{ color: "var(--gold-soft)" }}
                >
                    Choose your massage
                </h2>
                <p className="mt-2 text-white/75 text-[22px] text-center max-w-prose block py-3">
                    60/90 min · We bring everything · Real results.
                </p>
            </header>

            <GalleryWithThumbs />

            {/* Bottom strip duration / price */}
            <div className="mt-10">
                <div className="rounded-full px-5 sm:px-6 py-4 sm:py-5
                        bg-[color:var(--gold-strong)]/5 ring-1 ring-[color:var(--gold-strong)]/25
                        shadow-[0_10px_30px_-18px_color-mix(in_srgb,var(--gold-strong)_45%,transparent)]
                        flex items-center gap-5 flex-wrap">
                    <div className="flex items-center gap-3">
                        <span className="text-white/70">Duration</span>
                        <strong className="text-white/90">60 min</strong>
                    </div>

                    {/* decorative slider-like separator */}
                    <div className="flex-1 h-px bg-white/10 relative hidden sm:block">
                        <span
                            className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full ring-1 ring-[color:var(--gold-strong)]/40"
                            style={{ backgroundColor: "var(--gold-strong)" }}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-white/70">Price</span>
                        <strong className="text-white/90">$90</strong>
                    </div>
                </div>
            </div>
        </section>
    );
}
