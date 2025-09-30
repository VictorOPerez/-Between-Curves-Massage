"use client";

type Item = {
    icon: "shield" | "medal" | "shield-check";
    text: string;
};

const DEFAULT_ITEMS: Item[] = [
    { icon: "shield", text: "Totalmente asegurado para tu tranquilidad" },
    { icon: "medal", text: "4+ años de experiencia clínica" },
    { icon: "shield-check", text: "Protocolos de higiene estrictos" },
];

export default function TrustBadges({
    items = DEFAULT_ITEMS,
    className,
}: {
    items?: Item[];
    /** clases extra para el contenedor raíz */
    className?: string;
}) {
    return (
        <div className={`w-full ${className ?? ""}`}>
            <ul
                className="px-0 grid grid-cols-2 md:grid-cols-3 gap-5 auto-rows-fr text-sm font-medium"
            >
                {items.map((item, i) => (
                    <li key={`${item.text}-${i}`} className={`${i === 2 ? "" : ""}` + "flex items-start gap-2"}>
                        <span
                            className="
                inline-flex shrink-0 items-center justify-center
                h-13 w-13 rounded-full
                ring-1 ring-[color:var(--gold-strong)]/35
                bg-[color:var(--gold-strong)]/12
                shadow-[0_0_0_4px_rgba(201,168,106,0.06)]
                text-[color:var(--gold-strong)]
              "
                        >
                            <Icon name={item.icon} className="h-10 w-10" />
                        </span>

                        <p className="text-base leading-6 text-white/85 max-w-[24ch]">
                            {item.text}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ================= Icons (stroke=currentColor) ================= */
function Icon({
    name,
    className = "",
}: {
    name: Item["icon"];
    className?: string;
}) {
    if (name === "shield" || name === "shield-check") {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M12 3 5 6v5c0 5.2 4.1 9 7 10.5 2.9-1.5 7-5.3 7-10.5V6l-7-3z" />
                {name === "shield-check" ? <path d="M9 12.5l2.2 2.2L15.5 10" /> : null}
            </svg>
        );
    }
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="10" r="5" />
            <path d="M9.7 10.2l1.6 1.6 3-3" />
            <path d="M9 14l-2 6 5-3 5 3-2-6" />
        </svg>
    );
}
