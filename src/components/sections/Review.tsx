"use client";

import React from "react";
import Image from "next/image";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import Start from "../ui/Start";

const testimonials = [
    {
        quote:
            "Booked a 90-minute deep tissue and they arrived on time with the table and fresh linens. Neck and shoulder knots finally released—I slept like a baby.",
        name: "Emily R.",
        title: "Deep Tissue · Tampa",
        avatar: "/images/review/mujer1.jpg",
    },
    {
        quote:
            "Professional, sanitized setup at home: disposable textiles, aromatherapy, and relaxing music. My back pain eased within minutes.",
        name: "Carlos M.",
        title: "In-Home Swedish Massage",
        avatar: "/images/review/hombre1.jpg",
    },
    {
        quote:
            "Hot stones + gentle Swedish melted away a week of stress. The room felt like a spa and the therapist explained every step.",
        name: "Jasmine T.",
        title: "Hot Stone Combo",
        avatar: "/images/review/mujer2.jpg",
    },
    {
        quote:
            "Cupping released tight calves from running—better range of motion the next day. Super respectful and fully insured.",
        name: "Derrick S.",
        title: "Cupping Therapy",
        avatar: "/images/review/hombre4.jpg",
    },
    {
        quote:
            "Prenatal massage done safely with supportive pillows and side-lying positions. Lower-back tension reduced immediately.",
        name: "Alicia G.",
        title: "Prenatal · At Home",
        avatar: "/images/review/mujer1.jpg", // reutilizamos mujer1
    },
];

const Review = () => {
    return (
        <div
            className="
        mt-10 mb-20 h-[40rem] rounded-3xl flex flex-col gap-20 antialiased items-center justify-center relative overflow-hidden
        bg-[radial-gradient(120%_120%_at_80%_-20%,rgba(0,0,0,0.35),transparent_55%),linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.20))]
        ring-1 ring-white/10 backdrop-blur-sm p-6
      "
        >
            <div className="flex flex-col gap-5 px-5">
                <h3 className="text-4xl text-center font-semibold text-white">
                    What our clients are saying
                </h3>
                <div className="text-xl leading-[1.6] text-center text-gray-300 font-normal flex flex-col gap-2">
                    <span>
                        <strong>5.0</strong> BETWEEN CURVES MASSAGE
                    </span>
                    <div className="flex gap-2 justify-center">
                        <Image src="/images/icons/google.png" alt="Google" width={30} height={30} />
                        <Start num={5} size="xl" />
                    </div>
                </div>
            </div>

            <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
        </div>
    );
};

export default Review;
