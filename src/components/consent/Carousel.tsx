'use client';
import React, { useRef, useState } from 'react';

type Props = {
    slides: React.ReactNode[];              // contenido de cada página
    index: number;                          // índice controlado (0..n-1)
    onIndexChange: (i: number) => void;     // setter
    className?: string;
};

export default function Carousel({ slides, index, onIndexChange, className }: Props) {
    const total = slides.length;

    // swipe
    const startX = useRef<number | null>(null);
    const startY = useRef<number | null>(null);
    const dragging = useRef(false);
    const [offset, setOffset] = useState(0);

    const clamp = (n: number, a: number, b: number) => Math.min(Math.max(n, a), b);
    const goTo = (i: number) => onIndexChange(clamp(i, 0, total - 1));
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
            e.preventDefault();     // bloquear scroll vertical si gesto es horizontal
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

    const slidePct = 100 / total;
    const trackStyle: React.CSSProperties = {
        width: `${total * 100}%`,
        transform: `translateX(calc(${-(index * slidePct)}% + ${offset}px))`,
        transition: dragging.current ? 'none' : 'transform 280ms cubic-bezier(.22,.61,.36,1)',
        touchAction: 'pan-y',
        willChange: 'transform',
    };

    return (
        <div
            className={['min-h-0 overflow-hidden', className].filter(Boolean).join(' ')}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            aria-roledescription="carousel"
        >
            <div className="flex h-full overflow-x-hidden" style={trackStyle}>
                {slides.map((node, i) => (
                    <div key={i} className="h-full flex-none basis-full">
                        {/* Wrapper + “papel” con tu estilo fijo */}
                        <div className="h-full w-full box-border px-4 py-4">
                            <div className="h-full w-full overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/10">
                                {node}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
