// Internal booking page — preserved for the future, currently disabled.
// While Booksy is our active booking provider, the route /book redirects there.
// The previous in-app booking flow lives untouched in `_page.disabled.tsx.bak`
// in this same folder. To re-enable it, restore that file as `page.tsx`.

import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/constants";

export default function BookRedirect() {
    redirect(BOOKING_URL);
}
