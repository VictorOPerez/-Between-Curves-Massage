"use client";

import Link from "next/link";

type Nav = { href: string; label: string };

const NAV_LINKS: Nav[] = [
    { href: "#", label: "Inicio" },
    { href: "#servicios", label: "Servicios" },
    { href: "#precios", label: "Precios" },
    { href: "#promos", label: "Promos" },
    { href: "#equipo", label: "Equipo" },
    { href: "#galeria", label: "Galería" },
    { href: "#contacto", label: "Contacto" },
];

export default function Footer() {
    return (
        <footer className="mt-20">
            {/* Card contenedor del footer */}
            <div
                className="
          mx-auto max-w-7xl rounded-[28px] ring-1 ring-white/10
          bg-white/[0.02] relative overflow-hidden
        "
            >
                {/* brillo suave para simular el panel del mock */}
                <div className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        background:
                            "radial-gradient(1200px 600px at 50% -20%, rgba(201,168,106,.06), transparent 50%)",
                    }}
                />

                {/* línea superior */}
                <div className="border-t border-white/10" />

                {/* bloque central */}
                <div className="relative px-6 py-8 sm:px-8 lg:px-12">
                    {/* logo centrado */}
                    <div className="flex justify-center">
                        <LogoWordmark>Between Curves Massage</LogoWordmark>
                    </div>

                    {/* navegación */}
                    <nav className="
              mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3
              text-[15px] text-white/70
            ">
                        {NAV_LINKS.map((n) => (
                            <Link
                                key={n.label}
                                href={n.href}
                                className="hover:text-white/95 transition-colors"
                            >
                                {n.label}
                            </Link>
                        ))}
                    </nav>

                    {/* contacto */}
                    <div className="
              mt-5 flex flex-col items-center gap-2
              sm:flex-row sm:justify-center sm:gap-8
              text-sm
            ">
                        <p className="text-white/60">
                            Viber, Telegram{" "}
                            <a
                                href="tel:+375293454455"
                                className="font-semibold"
                                style={{ color: "var(--gold-strong)" }}
                            >
                                +375 29 345-44-55
                            </a>
                        </p>
                        <p className="text-white/60">
                            Instagram{" "}
                            <a
                                href="https://instagram.com/MagiSpa"
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold"
                                style={{ color: "var(--gold-strong)" }}
                            >
                                Between Curves Massage
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ============ Wordmark simple (texto con dorado) ============ */
function LogoWordmark({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="font-display text-2xl sm:text-[26px] tracking-wide"
            style={{ color: "var(--gold-soft)" }}
            aria-label="MagiSpa"
        >
            {children}
        </div>
    );
}
