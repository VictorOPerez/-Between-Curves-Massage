// components/NavbarMinimal.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LogoBCM from "../layout/LogoBCM";

type Props = {
    logoSrc?: string;
    logoAlt?: string;
    contactHref?: string;
};

export default function NavbarMinimal({
    logoSrc = "/images/logo.png",
    logoAlt = "MagiSpa",
    contactHref = "/contact",
}: Props) {
    const pathname = usePathname();

    return (
        <header className="sticky top-3 z-50">
            <nav
                className="
          mx-auto max-w-6xl px-3
          rounded-2xl
          bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/30
          ring-1 ring-white/10
        "
                aria-label="Main"
            >
                <div className="h-16 flex items-center justify-between gap-3">
                    {/* Logo + nombre integrado */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <LogoBCM variant="wordmark" color="gold" size="lg" className="shrink-0" />
                        <span
                            className={clsx(
                                "font-logo tracking-[0.04em] leading-none",
                                "text-[18px] sm:text-[20px] md:text-[22px]",
                                // mismo degradado dorado que el logo
                                "bg-clip-text text-transparent",
                                "bg-gradient-to-br from-[#E9D8A6] via-[#D4B26A] to-[#A6812A]",
                                // sutil sombra para legibilidad sobre fondos oscuros
                                "drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)]"
                            )}
                        >
                            Between Curves <span className="hidden sm:inline">Massage</span>
                        </span>
                    </div>

                    {/* Home centrado (solo icono) */}
                    <Link
                        href="/"
                        className={clsx(
                            "inline-flex items-center justify-center h-10 w-10 rounded-full",
                            "ring-1 ring-white/10 text-white/80 hover:text-white hover:ring-white/20 transition",
                            pathname === "/" && "bg-white/10 text-white ring-white/20"
                        )}
                        aria-label="Inicio"
                        aria-current={pathname === "/" ? "page" : undefined}
                        title="Inicio"
                    >
                        <Home className="h-5 w-5" />
                    </Link>

                    {/* Botón de contacto (derecha) */}
                    <Link
                        href={contactHref}
                        className="
              inline-flex items-center gap-2 h-10 px-4 rounded-full
              font-medium text-sm
              bg-[color:var(--accent2-500)] text-black/90
              hover:bg-[color:var(--accent2-600)]
              ring-1 ring-[color:var(--accent2-400)]/50
              transition
            "
                        aria-label="Contacto"
                        title="Contacto"
                    >
                        <Phone className="h-4 w-4" />
                        Contacto
                    </Link>
                </div>
            </nav>
        </header>
    );
}
