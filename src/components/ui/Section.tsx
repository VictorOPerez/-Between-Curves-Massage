import { ReactNode } from "react";
import clsx from "clsx";

type BgVariant = "none" | "panel" | "tint" | "vignette";
type MaxW = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "7xl";
type Radius = "md" | "lg" | "xl";
type GutterX = "none" | "sm" | "md" | "lg" | "xl";

const maxWClass: Record<MaxW, string> = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    "3xl": "max-w-[1760px]",
    "7xl": "max-w-[1280px]",
};

const radiusClass: Record<Radius, string> = {
    md: "rounded-2xl",
    lg: "rounded-[28px]",
    xl: "rounded-[36px]",
};

const bgClass: Record<BgVariant, string> = {
    none: "",
    panel:
        "bg-white/[0.02] backdrop-blur-sm ring-1 ring-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,.6)]",
    tint:
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.06))] ring-1 ring-white/10",
    vignette:
        "relative before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:shadow-[0_0_0_1px_rgba(255,255,255,.04)_inset,0_80px_160px_-80px_var(--ring-ambient)_inset]",
};

const gutterClass: Record<GutterX, string> = {
    none: "px-0",
    sm: "px-3 sm:px-4",
    md: "px-4 sm:px-6",
    lg: "px-6 lg:px-8",
    xl: "px-8 lg:px-12",
};

interface SectionProps {
    children?: ReactNode;
    className?: string;
    bg?: BgVariant;
    bleed?: boolean;
    maxW?: MaxW;
    py?: "none" | "sm" | "md" | "lg" | "xl";
    radius?: Radius;
    id?: string;
    /** Gutter lateral cuando bleed = true (separa el panel de la “línea” del fondo) */
    gutterX?: GutterX;
}

export default function Section({
    children,
    className,
    bg = "none",
    bleed = false,
    maxW = "7xl",
    py = "lg",
    radius = "lg",
    id,
    gutterX = "lg",
}: SectionProps) {
    const pyClass =
        py === "none"
            ? "py-0"
            : py === "sm"
                ? "py-6" : ""

    return (
        <section
            id={id}
            className={clsx(
                "relative",
                bleed && "mx-[calc(-50vw+50%)]" // solo expandimos
            )}
        >
            {/* Marco que aporta el gutter lateral (separa el panel de la viñeta del body) */}
            <div className={clsx(gutterClass[gutterX])}>
                {/* Panel real */}
                <div
                    className={clsx(
                        "relative mx-auto w-full",
                        maxWClass[maxW],
                        pyClass,
                        radiusClass[radius],
                        bgClass[bg],
                        className
                    )}
                >
                    {children}
                </div>
            </div>
        </section>
    );
}
