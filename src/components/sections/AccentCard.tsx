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
    primaryLabel: string;     // se ignora el valor y se muestra "Contactar"
    secondaryHref?: string;   // ya no se usa
    secondaryLabel?: string;  // ya no se usa
    className?: string;
};

export default function AccentCard({
    image,
    imageAlt = "",
    title,
    description,
    primaryHref,
    primaryLabel,      // <-- mantenido por compatibilidad
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
                    "aspect-[4/4] sm:aspect-[16/9]",
                    "bg-[linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.15))]"
                )}
            >
                <Image
                    src={image}
                    alt={imageAlt || title}
                    fill
                    className="object-contain sm:object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 400px"
                    priority={false}
                />
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
                    {/* Primario — ACENTO TURQUESA (WhatsApp) */}
                    <Link
                        href={`https://wa.me/+18133776678?text=${encodeURIComponent(
                            "Hola 👋 Me gustaría reservar un masaje a domicilio."
                        )}`}
                        className={clsx(
                            "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium",
                            "bg-[color:var(--accent2-500)] hover:bg-[color:var(--accent2-600)] text-black/90 transition",
                            "ring-1 ring-[color:var(--accent2-400)]/45",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent2-400)]/70"
                        )}
                        aria-label={`Contactar — ${title}`}
                    >
                        reservar
                        {/* Icono WhatsApp inline (mantiene estilos) */}
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            className="ml-2 h-4 w-4"
                            fill="currentColor"
                        >
                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                        </svg>

                    </Link>
                </div>
            </div>
        </article>
    );
}
