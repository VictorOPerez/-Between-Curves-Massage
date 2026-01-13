// components/Review.tsx  (SERVER COMPONENT)
import ReviewClient from "./ReviewClient";
import { gbpListAccounts } from "@/app/api/admin/actions";

type GbpReview = {
    reviewId: string;
    reviewer?: { displayName?: string; profilePhotoUrl?: string };
    starRating?: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
    comment?: string;
    createTime?: string;
};

type GbpReviewsResponse = {
    reviews?: GbpReview[];
    averageRating?: number;
    totalReviewCount?: number;
};

function starToNumber(star?: GbpReview["starRating"]) {
    switch (star) {
        case "ONE": return 1;
        case "TWO": return 2;
        case "THREE": return 3;
        case "FOUR": return 4;
        case "FIVE": return 5;
        default: return 5;
    }
}

function stripAutoTranslate(text: string) {
    // Opcional: si no quieres mostrar el bloque "(Translated by Google)..."
    const idx = text.indexOf("\n\n(Translated by Google)\n");
    return idx >= 0 ? text.slice(0, idx).trim() : text.trim();
}

export default async function Review() {
    let data: GbpReviewsResponse | null = null;

    try {
        data = (await gbpListAccounts()) as GbpReviewsResponse;
    } catch {
        data = null;
    }

    const reviews = data?.reviews ?? [];

    const items = reviews
        .filter((r) => r.reviewer?.displayName || r.comment)
        .map((r) => {
            const stars = starToNumber(r.starRating);
            const name = r.reviewer?.displayName ?? "Google User";
            const quote = r.comment ? stripAutoTranslate(r.comment) : "★★★★★";
            const avatar = r.reviewer?.profilePhotoUrl ?? "/images/review/default.jpg";

            return {
                quote,
                name,
                title: `${stars}.0 · Google Review`,
                avatar,
            };
        });

    return (
        <ReviewClient
            items={items.length ? items : undefined}
            averageRating={data?.averageRating ?? 5}
            totalReviewCount={data?.totalReviewCount ?? 0}
        />
    );
}
