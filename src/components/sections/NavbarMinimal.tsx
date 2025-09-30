// components/NavbarMinimal.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type Props = {
    logoSrc?: string;
    logoAlt?: string;
    contactHref?: string;   // ej: "#contacto" o WhatsApp: "https://wa.me/1XXXXXXXXXX"
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
                <div className="h-14 flex items-center justify-between gap-3">
                    {/* Logo (izquierda) */}
                    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Inicio">
                        <div className="relative h-8 w-28 ">
                            {/* <Image
                                src={logoSrc}
                                alt={logoAlt}
                                fill
                                className="object-contain"
                                sizes="(max-width:768px) 120px, 160px"
                                priority
                            /> */}
                            <p className={clsx(
                                "font-display tracking-wide leading-[1.05]",
                                "text-[38px] sm:text-[42px] lg:text-[56px]"
                            )} style={{ color: "var(--gold-soft)" }}>
                                BCM
                            </p>
                        </div>
                    </Link>

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
