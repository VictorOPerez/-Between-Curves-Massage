"use client";
import React, { useMemo, useRef, useState } from "react";
import type { ConsentState, Lang } from "../consent/types";
import { M } from "../consent/i18n";
import Page01_Consent from "../consent/page/Page01_Consent";
import Page02_ClientInfo from "../consent/page/Page02_ClientInfo";
import Page03_MedicalA from "../consent/page/Page03_MedicalA";
import Page04_MedicalB from "../consent/page/Page04_MedicalB";
import Page05_MassageYesNo from "../consent/page/Page05_MassageYesNo";

type Props = {
    brandName?: string;
    brand?: {
        dark?: string;
        gold?: string;
        gradFrom?: string;
        gradTo?: string;
    };
};

const INITIAL_STATE: ConsentState = {
    // ajusta a tu shape real de ConsentState
    provider: "",
    printedName: "",
    dateStr: "",
    // P2
    name: "", dob: "", age: "", gender: "",
    address: "", city: "", state: "", zip: "",
    email: "", phone: "", emergency: "",
    join: "na", referral: "",
    medicalChecked: {},
    // P3
    otherIssues: "na", otherDesc: "",
    surgeries: "na", surgeriesDesc: "",
    pregnant: "na",
    meds: "na", medsDesc: "",
    typeChecked: {}, areaChecked: {}, goalChecked: {},
    freq: "",
};

export default function MassageConsentCarousel({
    brandName,
    brand = {
        dark: "#0E3B2E",
        gold: "#D9B979",
        gradFrom: "#0E3B2E",
        gradTo: "#165a4e",
    },
}: Props) {
    const total = 4;
    const [index, setIndex] = useState(0);
    const [lang, setLang] = useState<Lang>("en");
    const [state, setStateRaw] = useState<ConsentState>(INITIAL_STATE);

    // patcher que fusiona objetos anidados (p.ej. medicalChecked)
    const setState = (patch: Partial<ConsentState>) =>
        setStateRaw((prev) => ({
            ...prev,
            ...patch,
            medicalChecked:
                patch.medicalChecked
                    ? { ...prev.medicalChecked, ...patch.medicalChecked }
                    : prev.medicalChecked,
            typeChecked:
                patch.typeChecked
                    ? { ...prev.typeChecked, ...patch.typeChecked }
                    : prev.typeChecked,
            areaChecked:
                patch.areaChecked
                    ? { ...prev.areaChecked, ...patch.areaChecked }
                    : prev.areaChecked,
            goalChecked:
                patch.goalChecked
                    ? { ...prev.goalChecked, ...patch.goalChecked }
                    : prev.goalChecked,
        }));

    // --- Swipe ---
    const startX = useRef<number | null>(null);
    const startY = useRef<number | null>(null);
    const dragging = useRef(false);
    const [offset, setOffset] = useState(0);

    const clamp = (n: number, a: number, b: number) => Math.min(Math.max(n, a), b);
    const goTo = (i: number) => setIndex(clamp(i, 0, total - 1));
    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    function onTouchStart(e: React.TouchEvent) {
        const t = e.touches[0];
        startX.current = t.clientX;
        startY.current = t.clientY;
        dragging.current = true;
        setOffset(0);
    }
    function onTouchMove(e: React.TouchEvent) {
        if (!dragging.current || startX.current == null || startY.current == null) return;
        const t = e.touches[0];
        const dx = t.clientX - startX.current;
        const dy = t.clientY - startY.current;
        if (Math.abs(dx) > Math.abs(dy) + 6) {
            e.preventDefault();
            setOffset(dx);
        }
    }
    function onTouchEnd() {
        if (!dragging.current) return;
        dragging.current = false;
        const threshold = 60;
        if (Math.abs(offset) > threshold) (offset < 0 ? next() : prev());
        setOffset(0);
    }
    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
    }

    const slidePct = 100 / total; // 33.333% con 3 slides
    const trackStyle: React.CSSProperties = {
        width: `${total * 100}%`,
        transform: `translateX(calc(${-(index * slidePct)}% + ${offset}px))`,
        transition: dragging.current ? "none" : "transform 280ms cubic-bezier(.22,.61,.36,1)",
        touchAction: "pan-y",
        willChange: "transform",
    };

    const btnBase =
        "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm transition focus:outline-none focus:ring-2";
    const btnGhost =
        `${btnBase} border-white/20 text-white/90 hover:bg-white/10 focus:ring-white/40`;
    const dot = "h-2.5 w-2.5 rounded-full transition";
    const dotActive = "scale-[1.15] bg-white";
    const dotIdle = "bg-white/40 hover:bg-white/60";

    // --- Páginas (modulares) ---
    const pages = React.useMemo(() => [
        <Page02_ClientInfo key="p2" lang={lang} state={state} setState={setState} brandName={brandName} />,
        <Page03_MedicalA key="p3" lang={lang} state={state} setState={setState} brandName={brandName} />,
        <Page05_MassageYesNo key="p5" lang={lang} state={state} setState={setState} brandName={brandName} />,
        <Page01_Consent key="p1" lang={lang} state={state} setState={setState} brandName={brandName} />,
    ], [lang, state, brandName]);
    // --- Slides con tu wrapper/paper y estilos EXACTOS que querías ---
    const slides = Array.from({ length: total }, (_, i) => (
        <div
            key={i}
            className="h-full flex-none"
            style={{ flex: `0 0 ${100 / total}%` }}       // <- cada slide ocupa 1/total del track
        >
            <div className="h-full w-full box-border px-4 py-4">
                <div className="h-full w-full overflow-y-auto overscroll-contain rounded-xl bg-white shadow-lg ring-1 ring-black/10">
                    {pages[i]}
                </div>
            </div>
        </div>
    ));

    return (
        <section
            className="w-full min-h-dvh text-white"
            style={{ background: `linear-gradient(180deg, ${brand.gradFrom}, ${brand.gradTo})` }}
            aria-roledescription="carousel"
            aria-label="Consent carousel"
            onKeyDown={onKeyDown}
            tabIndex={0}
        >
            {/* Top bar: selector de idioma */}
            <div className="flex items-center justify-end gap-2 px-3 py-2">
                <label className="text-xs opacity-80">{M[lang].langLabel}</label>
                <select
                    className="rounded-md border border-white/30 bg-transparent px-2 py-1 text-xs"
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Lang)}
                >
                    <option className="text-black" value="en">EN</option>
                    <option className="text-black" value="es">ES</option>
                </select>
            </div>

            {/* Carrusel */}
            <div
                className="overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="flex overflow-x-hidden" style={trackStyle}>
                    {slides}
                </div>
            </div>

            {/* Controles */}
            <div
                className="px-3 pb-[max(env(safe-area-inset-bottom),12px)]"
                style={{ background: "linear-gradient(180deg, rgba(0,0,0,.00), rgba(0,0,0,.28))" }}
            >
                <div className="mx-auto flex w-full max-w-screen-sm items-center justify-between gap-3">
                    <button onClick={prev} disabled={index === 0} aria-label="Anterior" className={`${btnGhost} disabled:opacity-40`}>←</button>
                    <div className="flex flex-col items-center gap-2 py-2">
                        <div className="flex items-center gap-2">
                            {Array.from({ length: total }, (_, i) => (
                                <button key={i} onClick={() => setIndex(i)} aria-label={`Go to ${i + 1}`} className={`${dot} ${i === index ? dotActive : dotIdle}`} />
                            ))}
                        </div>
                        <div className="rounded-full px-2 py-0.5 text-[11px]" style={{ background: "rgba(0,0,0,.25)" }}>
                            {index + 1}/{total}
                        </div>
                    </div>
                    <button onClick={next} disabled={index === total - 1} aria-label="Siguiente" className={`${btnGhost} disabled:opacity-40`}>→</button>
                </div>
                <div className="mt-2 h-[1px] w-full" style={{ background: brand.gold }} />
            </div>
        </section>
    );
}
