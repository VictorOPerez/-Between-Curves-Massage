"use client";

import Link from "next/link";

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
                {/* brillo suave */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-40"
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

                    {/* Redes sociales (relleno) */}
                    <div className="mt-6 flex justify-center gap-5 text-white/70">
                        <a
                            href="https://wa.me/18133776678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white/95 transition"
                            aria-label="WhatsApp"
                            title="WhatsApp"
                        >
                            <WhatsAppIcon className="h-5 w-5" />
                        </a>
                        <a
                            href="https://instagram.com/betweencurvesmassage"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white/95 transition"
                            aria-label="Instagram"
                            title="Instagram"
                        >
                            <InstagramIcon className="h-5 w-5" />
                        </a>
                        <a
                            href="mailto:hello@betweencurvesmassage.com"
                            className="hover:text-white/95 transition"
                            aria-label="Email"
                            title="Email"
                        >
                            <MailIcon className="h-5 w-5" />
                        </a>
                        <a
                            href="https://maps.google.com/?q=Tampa,FL"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white/95 transition"
                            aria-label="Ubicación"
                            title="Ubicación"
                        >
                            <PinIcon className="h-5 w-5" />
                        </a>
                    </div>

                    {/* Datos de contacto y ubicación */}
                    <div className="mt-5 flex flex-col items-center gap-2 text-sm text-white/60">
                        <p>
                            WhatsApp:{" "}
                            <a
                                href="https://wa.me/18133776678"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold"
                                style={{ color: "var(--gold-strong)" }}
                            >
                                +1 (813) 377-6678
                            </a>
                        </p>
                        <p>
                            Email:{" "}
                            <a
                                href="mailto:hello@betweencurvesmassage.com"
                                className="font-semibold"
                                style={{ color: "var(--gold-strong)" }}
                            >
                                hello@betweencurvesmassage.com
                            </a>
                        </p>
                        <p>
                            Instagram:{" "}
                            <a
                                href="https://instagram.com/betweencurvesmassage"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold"
                                style={{ color: "var(--gold-strong)" }}
                            >
                                @betweencurvesmassage
                            </a>
                        </p>

                        <p className="mt-2 text-center">
                            Con base en <span className="text-white/80 font-medium">Tampa, FL</span>.{" "}
                            Servicio a domicilio en Tampa, St. Petersburg, Clearwater y alrededores.
                        </p>
                        <p>Horario: Lun–Dom 9:00–20:00 (con cita previa)</p>
                    </div>

                    {/* línea inferior + copyright */}
                    <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-white/45">
                        © {new Date().getFullYear()} Between Curves Massage. Todos los derechos
                        reservados.
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
            aria-label="Between Curves Massage"
        >
            {children}
        </div>
    );
}

/* ============ Iconos inline (para no agregar dependencias) ============ */
function WhatsAppIcon({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
            <path d="M13.6 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102A7.933 7.933 0 0 0 7.99 15.86h.004c4.368 0 7.926-3.558 7.93-7.93a7.898 7.898 0 0 0-2.323-5.604ZM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 1 1 5.58 3.094Zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34h-.38a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232Z" />
        </svg>
    );
}
function InstagramIcon({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5zM18 6.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z" />
        </svg>
    );
}
function MailIcon({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2v.01L12 13 4 6.01V6h16ZM4 18V8.236l7.386 6.398a1 1 0 0 0 1.228 0L20 8.236V18H4Z" />
        </svg>
    );
}
function PinIcon({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5.001 2.5 2.5 0 0 1 0 5Z" />
        </svg>
    );
}
