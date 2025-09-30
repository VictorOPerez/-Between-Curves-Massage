"use client";

import Image from "next/image";

const VIEWBOX_W = 648;
const VIEWBOX_H = 574;

// Forma exacta
const D =
    "M340 123C471 100 648 0 648 0V568C648 568 417.77 588.411 251 553C150 531.554 -25.0001 416 2.99992 266C31 116 209 146 340 123Z";

export default function HeroImageSlot({
    src = "/images/hero.png",
    alt = "Hero image",
    className = "",
    sizes = "(max-width:768px) 100vw, (max-width:1280px) 60vw, 900px",
}: {
    src?: string;
    alt?: string;
    className?: string;
    sizes?: string;
}) {
    // Una sola máscara (blanco visible, negro oculta)
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${VIEWBOX_W} ${VIEWBOX_H}' preserveAspectRatio='none'><rect width='100%' height='100%' fill='black'/><path d='${D}' fill='white'/></svg>`;
    const maskUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

    return (
        <div
            className={`relative w-full aspect-[648/574] overflow-hidden ${className}`}
            style={{
                WebkitMaskImage: maskUrl,
                maskImage: maskUrl,
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                maskMode: "luminance",
            }}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                sizes={sizes}
                quality={90}
                priority
            />

            {/* Borde sutil usando la MISMA máscara */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    WebkitMaskImage: maskUrl,
                    maskImage: maskUrl,
                    WebkitMaskSize: "100% 100%",
                    maskSize: "100% 100%",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,.10)",
                }}
            />
        </div>
    );
}
