"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

type CardProps = {
    image: string;
    imageAlt?: string;
    title: string;
    description: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref?: string;
    secondaryLabel?: string;
    className?: string;
};

export default function AccentCard({
    image,
    imageAlt = "",
    title,
    description,
    primaryHref,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
    className,
}: CardProps) {
    return (
        <article
            className={clsx(
                "group overflow-hidden rounded-3xl",
                "ring-1 ring-white/10 bg-white/[0.02] backdrop-blur-sm",
                "shadow-[0_40px_120px_-30px_rgba(0,0,0,.55)]",
                "transition hover:ring-white/20 p-4",
                className
            )}
        >
            {/* Imagen (arriba) */}
            <div
                className={clsx(
                    "relative w-full p-5",
                    // En móvil, vertical; en sm+, apaisado
                    "aspect-[4/4] sm:aspect-[16/9]",
                    // Fondo sutil para cuando object-contain deje espacio
                    "bg-[linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.15))]"
                )}
            >
                <Image
                    src={image}
                    alt={imageAlt || title}
                    fill
                    // En móvil: que quepa completa; en desktop: que cubra
                    className="object-contain sm:object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 400px"
                    priority={false}
                />
                {/* sutil overlay al hover (solo desktop) */}
                <div className="absolute inset-0 opacity-0 sm:group-hover:opacity-100 transition bg-black/10" />
            </div>

            {/* Contenido */}
            <div className="p-5 sm:p-6">
                <h3 className="text-white/90 text-lg sm:text-xl font-semibold leading-tight">
                    {title}
                </h3>
                <p className="mt-2 text-white/70">{description}</p>

                {/* Acciones */}
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    {/* Primario — ACENTO TURQUESA */}
                    <Link
                        href={primaryHref}
                        className={clsx(
                            "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium",
                            "bg-[color:var(--accent2-500)] hover:bg-[color:var(--accent2-600)] text-black/90 transition",
                            "ring-1 ring-[color:var(--accent2-400)]/45",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent2-400)]/70"
                        )}
                        aria-label={`${primaryLabel} — ${title}`}
                    >
                        {primaryLabel}
                        <span aria-hidden className="ml-2">➜</span>
                    </Link>

                    {/* Secundario — Dorado (opcional) */}
                    {secondaryHref && secondaryLabel ? (
                        <Link
                            href={secondaryHref}
                            className={clsx(
                                "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition",
                                "ring-1 ring-[color:var(--gold-strong)]/35 text-[color:var(--gold-strong)]",
                                "bg-[color:var(--gold-strong)]/12 hover:bg-[color:var(--gold-strong)]/20",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold-strong)]/60"
                            )}
                            aria-label={`${secondaryLabel} — ${title}`}
                        >
                            {secondaryLabel}
                        </Link>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
