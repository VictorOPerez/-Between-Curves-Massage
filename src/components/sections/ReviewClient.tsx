"use client";

import React from "react";
import Image from "next/image";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import Start from "../ui/Start";

type CardItem = {
    quote: string;
    name: string;
    title: string;
    avatar: string;
};

const fallbackTestimonials: CardItem[] = [
    {
        quote:
            "Booked a 90-minute deep tissue and they arrived on time with the table and fresh linens. Neck and shoulder knots finally released—I slept like a baby.",
        name: "Emily R.",
        title: "Deep Tissue · Tampa",
        avatar: "/images/review/mujer1.jpg",
    },
];

export default function ReviewClient({
    items,
    averageRating,
    totalReviewCount,
}: {
    items?: CardItem[];
    averageRating: number;
    totalReviewCount: number;
}) {
    const list = items?.length ? items : fallbackTestimonials;
    const starsForUi = Math.round(averageRating);

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
                        <strong>{averageRating.toFixed(1)}</strong> BETWEEN CURVES MASSAGE
                        {totalReviewCount ? (
                            <span className="text-gray-400 text-sm ml-2">({totalReviewCount} reviews)</span>
                        ) : null}
                    </span>

                    <div className="flex gap-2 justify-center">
                        <Image src="/images/icons/google.png" alt="Google" width={30} height={30} />
                        <Start num={starsForUi} size="xl" />
                    </div>
                </div>
            </div>

            <InfiniteMovingCards items={list} direction="right" speed="slow" />
        </div>
    );
}
