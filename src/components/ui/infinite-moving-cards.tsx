"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Start from "./Start";

type Card = {
    quote: string;
    name: string;
    title: string;
};

export function InfiniteMovingCards({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
}: {
    items: Card[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLUListElement>(null);
    const [started, setStarted] = useState(false);
    const didClone = useRef(false);

    // Duplica contenido una sola vez y fija --gap para un scroll sin saltos
    useEffect(() => {
        if (!containerRef.current || !scrollerRef.current || didClone.current) return;

        const children = Array.from(scrollerRef.current.children);
        children.forEach((child) => scrollerRef.current!.appendChild(child.cloneNode(true)));
        didClone.current = true;

        // lee el gap real que aplica Tailwind en el <ul>
        const cs = getComputedStyle(scrollerRef.current);
        const gap = (cs.columnGap || cs.gap || "1rem").toString();
        containerRef.current.style.setProperty("--gap", gap);

        setStarted(true);
    }, []);

    // Actualiza dirección y velocidad cuando cambien props
    useEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.style.setProperty(
            "--animation-direction",
            direction === "left" ? "forwards" : "reverse"
        );

        const dur =
            speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
        containerRef.current.style.setProperty("--animation-duration", dur);
    }, [direction, speed]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative z-20 max-w-7xl overflow-hidden",
                // máscara de desvanecido en bordes
                "[mask-image:linear-gradient(to_right,transparent,white_18%,white_82%,transparent)]",
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
                    started && "animate-scroll",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {items.map((item, idx) => (
                    <li
                        key={`${item.name}-${idx}`}
                        className="relative h-[290px] w-[350px] flex-shrink-0 rounded-2xl border border-b-0 border-slate-700 px-8 py-6 md:w-[450px]"
                        style={{
                            background:
                                "linear-gradient(180deg, var(--slate-800), var(--slate-900))",
                        }}
                    >
                        <blockquote className="flex flex-col gap-5">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -left-0.5 -top-0.5 z-[-1] h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                            />
                            <div className="flex gap-5">
                                <div className="relative z-20 h-[80px] w-[80px] rounded-full bg-black">
                                    <Image
                                        src="/mujer.avif"
                                        alt=""
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <div className="relative z-20 mt-6 flex flex-row items-center gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-normal leading-[1.6] text-gray-400">
                                            {item.name}
                                        </span>
                                        <Start num={5} size="sm" />
                                    </div>
                                </div>
                            </div>

                            <p className="relative z-20 line-clamp-4 text-sm font-normal leading-[1.6] text-gray-100">
                                {item.quote}
                            </p>

                            <div className="absolute bottom-3 flex gap-10">
                                <Image src="/images/icons/google.png" alt="" width={25} height={25} />
                                <div className="flex gap-2">
                                    <a
                                        href="#"
                                        className="text-sm font-normal leading-[1.6] text-gray-400"
                                    >
                                        Read full review
                                    </a>
                                    <Image
                                        src="/images/icons/right-arrow (1).png"
                                        alt=""
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            </div>
                        </blockquote>
                    </li>
                ))}
            </ul>
        </div>
    );
}
