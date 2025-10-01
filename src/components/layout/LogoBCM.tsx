"use client";

import Link from "next/link";
import clsx from "clsx";

type LogoProps = {
    variant?: "wordmark" | "monogram";
    color?: "gold" | "jade" | "coral" | "sand";
    size?: "sm" | "md" | "lg";
    withShadow?: boolean;
    asLink?: boolean;
    href?: string;
    label?: string; // aria-label
    className?: string;
};

const sizeMap = {
    sm: { word: "text-[26px] sm:text-[28px]", mono: "h-8 w-8 text-[14px]" },
    md: { word: "text-[34px] sm:text-[40px] lg:text-[48px]", mono: "h-10 w-10 text-[16px]" },
    lg: { word: "text-[44px] sm:text-[52px] lg:text-[60px]", mono: "h-12 w-12 text-[18px]" },
};

const colorClasses = {
    gold: {
        text: "bg-gradient-to-br from-[#E9D8A6] via-[#D4B26A] to-[#A6812A]",
        ring: "ring-[#D8C27A]/40",
        pill: "bg-black/25",
    },
    jade: {
        text: "bg-gradient-to-br from-[#7AE1C3] via-[#2DD4BF] to-[#0EA5A4]",
        ring: "ring-[#2DD4BF]/40",
        pill: "bg-[#0B3B3B]/40",
    },
    coral: {
        text: "bg-gradient-to-br from-[#FFB3A6] via-[#FF7D6E] to-[#E24E5A]",
        ring: "ring-[#FF8A7A]/40",
        pill: "bg-[#3E1E20]/45",
    },
    sand: {
        text: "bg-gradient-to-br from-[#F5E9DA] via-[#E6D3B0] to-[#C5A97A]",
        ring: "ring-[#E6D3B0]/35",
        pill: "bg-[#2F2A22]/40",
    },
};

export default function LogoBCM({
    variant = "wordmark",
    color = "gold",
    size = "md",
    withShadow = true,
    asLink = true,
    href = "/",
    label = "BCM — Between Curves Massage",
    className,
}: LogoProps) {
    const palette = colorClasses[color];
    const sizes = sizeMap[size];

    const inner =
        variant === "wordmark" ? (
            <span
                className={clsx(
                    "font-logo font-serif tracking-wide leading-[1.02]",
                    sizes.word,
                    "bg-clip-text text-transparent",
                    palette.text,
                    withShadow && "drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
                )}
            >
                BCM
            </span>
        ) : (
            <span
                className={clsx(
                    "inline-flex items-center justify-center rounded-full",
                    sizes.mono,
                    palette.pill,
                    "ring-1",
                    palette.ring,
                    withShadow && "shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                )}
                title="BCM"
            >
                <span
                    className={clsx("font-logo font-serif", "bg-clip-text text-transparent", palette.text)}
                    style={{ fontSize: "1em", lineHeight: 1 }}
                >
                    B
                </span>
            </span>
        );

    if (asLink) {
        return (
            <Link
                href={href}
                aria-label={label}
                className={clsx("inline-flex items-center justify-center select-none", className)}
            >
                {inner}
            </Link>
        );
    }

    return (
        <div
            aria-label={label}
            className={clsx("inline-flex items-center justify-center select-none", className)}
        >
            {inner}
        </div>
    );
}
