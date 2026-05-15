// Internal booking-success page — preserved for the future, currently disabled.
// While Booksy is our active booking provider, this route redirects to the
// public Booksy listing. Original Stripe success UI lives untouched in
// `_page.disabled.tsx.bak` in this same folder.

import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/constants";

export default function BookSuccessRedirect() {
    redirect(BOOKING_URL);
}
