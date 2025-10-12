"use client";

import React from "react";
import Section from "../ui/Section";
import clsx from "clsx";
import HeroImageSlot from "./HeroImageSlot";
import TrustBadges from "./TrustBadges";

export default function Hero() {
    return (
        <div className="px-5 -mt-5 md:-mt-15">
            <div className="grid gap-2 lg:gap-10 lg:grid-cols-12 lg:grid-rows-[auto_auto] items-center">
                {/* Title + subtitle — left on desktop */}
                <div className="px-4 mt-[15px] md:ml-10 md:mt-36 order-1 pt-8 sm:pt-10 lg:pt-0 lg:col-span-5 lg:col-start-1 lg:row-start-1 flex flex-col justify-center">
                    <h1
                        className={clsx(
                            "font-display tracking-wide leading-[1.05]",
                            "text-[38px] sm:text-[42px] lg:text-[56px]"
                        )}
                        style={{ color: "var(--gold-soft)" }}
                    >
                        Professional in-home massage <br className="hidden sm:block" />
                        in Tampa
                    </h1>

                    <p className="mt-4 text-white/70 max-w-prose">
                        We bring the spa to your home. Clinical and sensory techniques to
                        relieve pain, release stress, and sleep better. You just breathe; we
                        handle everything: table, sheets, and aromatherapy.
                    </p>

                    {/* CTAs (desktop) */}
                    <div className="hidden mt-6 md:flex flex-col sm:flex-row gap-3">
                        <a
                            href={`https://wa.me/18133776678?text=${encodeURIComponent(
                                "Hi 👋 I’d like to book an in-home massage."
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium
               bg-[color:var(--accent2-500)] hover:bg-[color:var(--accent2-600)]
               text-black/90 transition
               ring-1 ring-[color:var(--accent2-400)]/45
               shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--accent2)_45%,transparent)]"
                        >
                            Book appointment
                        </a>
                    </div>
                </div>

                {/* Badges desktop */}
                <div className="hidden relative md:block lg:col-span-8 order-4 mt-0 md:-ml-6">
                    <TrustBadges className="px-4 absolute bottom-10" />
                </div>

                {/* Image — right on desktop */}
                <figure className="order-2 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
                    <div className="mx-auto max-w-[min(92vw,560px)] lg:max-w-none md:-mr-5 md:mt-4">
                        <HeroImageSlot />
                    </div>
                </figure>

                {/* CTA — bottom on mobile */}
                <div className="px-6 block relative md:hidden order-3 lg:col-span-5 lg:col-start-1 lg:row-start-2 mt-4 mb-8 z-[999]">
                    <div className="flex items-start sm:flex-row sm:items-center gap-3">
                        <a
                            href={`https://wa.me/18133776678?text=${encodeURIComponent(
                                "Hi 👋 I’d like to book an in-home massage."
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium
               bg-[color:var(--accent2-500)] hover:bg-[color:var(--accent2-600)]
               text-black/90 transition
               ring-1 ring-[color:var(--accent2-400)]/45
               shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--accent2)_45%,transparent)]"
                        >
                            Book appointment
                        </a>
                    </div>
                </div>
            </div>

            {/* Badges mobile */}
            <TrustBadges className="block md:hidden" />
        </div>
    );
}
