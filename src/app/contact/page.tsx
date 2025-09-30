"use client";
import ContactSection from "@/components/sections/BookingSection";
import Section from "@/components/ui/Section";
import Link from "next/link";

export default function ContactPage() {
    return (
        <main className="mt-10">
            {/* Hero minimal y ligero */}
            <Section bleed bg="none" maxW="7xl" py="xl">
                <header className="text-center">
                    <p className="text-sm text-white/50">Estamos para ayudarte</p>
                    <h1
                        className="font-display text-[34px] sm:text-[44px] leading-tight mt-2"
                        style={{ color: "var(--gold-soft)" }}
                    >
                        Contacto
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto mt-3">
                        Resolvemos consultas, coordinamos agendas y te asesoramos según tus objetivos.
                    </p>

                    {/* chips de info rápida */}
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                        <span className="rounded-full px-3 py-1 text-sm ring-1 ring-white/10 bg-white/5 text-white/80">
                            Respuesta &lt; 24h
                        </span>
                        <span className="rounded-full px-3 py-1 text-sm ring-1 ring-white/10 bg-white/5 text-white/80">
                            WhatsApp y llamada
                        </span>
                        <span className="rounded-full px-3 py-1 text-sm ring-1 ring-white/10 bg-white/5 text-white/80">
                            Horario: Lun–Dom 7:30AM–8:00pm
                        </span>
                    </div>
                </header>
            </Section>

            {/* Formulario + acciones (mailto, wa.me, tel) */}
            <ContactSection
                toEmail="hola@magispa.com"
                whatsappPhone="+34600000000"
                callPhone="+34600000000"
                className="mt-2"
            />

            {/* FAQ ligera (opcional) */}
            <Section bleed bg="none" maxW="7xl" py="lg">
                <div className="grid gap-6 md:grid-cols-2">
                    <FaqItem q="¿Puedo pagar en efectivo o tarjeta?" a="Sí, aceptamos ambos métodos." />
                    <FaqItem q="¿Atienden a domicilio?" a="Sí, llevamos camilla y todo el material necesario." />
                    <FaqItem q="¿Con cuánta antelación reservo?" a="Idealmente 24–48h. Para hoy, escríbenos por WhatsApp." />
                    <FaqItem q="¿Qué servicios recomiendan para dolor cervical?" a="Suele funcionar masaje terapéutico de 60–90min. Te guiamos por WhatsApp." />
                </div>
            </Section>
        </main>
    );
}

function FaqItem({ q, a }: { q: string; a: string }) {
    return (
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.02] p-5">
            <h3 className="text-white/90 font-medium">{q}</h3>
            <p className="text-white/70 mt-2">{a}</p>
        </div>
    );
}
