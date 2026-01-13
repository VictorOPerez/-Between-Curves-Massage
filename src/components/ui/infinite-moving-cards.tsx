"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Start from "./Start";

type Card = {
    quote: string;
    name: string;
    title: string;
    avatar: string;           // 👉 NUEVO: ruta del avatar (ej. /images/review/mujer1.jpg)
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

    useEffect(() => {
        if (!containerRef.current || !scrollerRef.current || didClone.current) return;

        const children = Array.from(scrollerRef.current.children);
        children.forEach((child) => scrollerRef.current!.appendChild(child.cloneNode(true)));
        didClone.current = true;

        const cs = getComputedStyle(scrollerRef.current);
        const gap = (cs.columnGap || cs.gap || "1rem").toString();
        containerRef.current.style.setProperty("--gap", gap);

        setStarted(true);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.style.setProperty(
            "--animation-direction",
            direction === "left" ? "forwards" : "reverse"
        );
        const dur = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
        containerRef.current.style.setProperty("--animation-duration", dur);
    }, [direction, speed]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative z-20 max-w-7xl overflow-hidden",
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
                        className="
              relative h-[290px] w-[350px] md:w-[450px] flex-shrink-0
              rounded-2xl
              ring-1 ring-white/10
              bg-white/[0.03] backdrop-blur-sm
              shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_100px_-40px_rgba(0,0,0,.65)]
              px-8 py-6
            "
                        style={{
                            background:
                                "linear-gradient(180deg, color-mix(in oklab, var(--bg-deep-2) 88%, black), color-mix(in oklab, var(--bg-deep-0) 92%, black))",
                        }}
                    >
                        <blockquote className="flex flex-col gap-5">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -left-0.5 -top-0.5 z-[-1] h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                            />
                            <div className="flex gap-5">
                                <div className="relative z-20 h-[80px] w-[80px] rounded-full bg-black overflow-hidden">
                                    <Image
                                        src={item.avatar}        // 👉 usamos el avatar del item
                                        alt={item.name}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <div className="relative z-20 mt-6 flex flex-row items-center gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-normal leading-[1.6] text-gray-300">
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
                                        href="https://share.google/FebmCpzBhgBcuiBfq"
                                        className="text-sm font-normal leading-[1.6] text-gray-300 hover:text-white/90 transition"
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
