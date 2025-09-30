"use client";

import Image from "next/image";
import Section from "../ui/Section";
import ImageWithBubbleLens from "./ImageWithBubbleLens";

type Props = {
    mainSrc?: string;
    circleSrc?: string;
    title?: string;
    date?: string;
    intro?: string;
    body?: string;
};

export default function PromoMeditation({
    mainSrc = "/images/aseo.png",
    circleSrc = "/images/promo/circle.jpg",
    title = "Higiene y seguridad",
    date = "8–14 marzo",
    intro = "Trabajamos con higiene hospitalaria: manos y equipo desinfectados, sábanas limpias por sesión, aceites en envases individuales, mascarilla si el cliente lo prefiere. No atendemos si hay fiebre, infección de piel, COVID reciente u otras contraindicaciones.",

}: Props) {
    return (

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-12 items-center py-24 px-8">
            {/* Imagen izquierda */}
            <figure className="order-1 lg:order-none lg:col-span-5 relative">
                {/* Circular superpuesta */}

                <ImageWithBubbleLens
                    src="/images/aseo.png"
                    alt="Kit de higiene premium"
                    aspect="aspect-[4/3]"     // o "aspect-[16/9]" según tu card
                    lensSize={160}            // 120–200 según el tamaño del card
                    zoom={1.25}               // cuanto “aumenta” el lente
                    speed={0.02}              // 0.015–0.03 para burbuja lenta
                    className="border border-white/10"
                />

            </figure>

            {/* Texto derecha */}
            <div className="order-2 lg:col-span-7">
                <h2
                    className="font-display text-[30px] sm:text-[36px] lg:text-[44px] leading-tight tracking-wide text-center"
                    style={{ color: "var(--gold-soft)" }}
                >
                    {title}
                </h2>


                <p className="mt-5 text-white/80 max-w-prose text-center">
                    {intro}
                </p>
            </div>
        </div>
    );
}
