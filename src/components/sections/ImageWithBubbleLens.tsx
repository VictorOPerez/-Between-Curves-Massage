// ImageWithBubbleLens.tsx
"use client";

import Image from "next/image";
import * as React from "react";

type Props = {
    src: string;
    alt?: string;
    // Ajustes opcionales
    aspect?: string;     // ej: "aspect-[4/3]" | "aspect-[16/9]"
    lensSize?: number;   // px
    zoom?: number;       // 1.15 = 15% de aumento
    speed?: number;      // 0.02 = lento, 0.06 = rápido
    className?: string;
};

export default function ImageWithBubbleLens({
    src,
    alt = "",
    aspect = "aspect-[16/9]",
    lensSize = 140,
    zoom = 1.22,
    speed = 0.02,
    className = "",
}: Props) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [w, setW] = React.useState(0);
    const [h, setH] = React.useState(0);
    const [pos, setPos] = React.useState({ x: lensSize * 0.9, y: lensSize * 0.9 });
    const targetRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    // Medir contenedor
    React.useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver((entries) => {
            const r = entries[0].contentRect;
            setW(r.width);
            setH(r.height);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Elegir un nuevo destino aleatorio dentro de márgenes
    function pickTarget() {
        const margin = lensSize * 0.6;
        const x = margin + Math.random() * Math.max(1, w - margin * 2);
        const y = margin + Math.random() * Math.max(1, h - margin * 2);
        targetRef.current = { x, y };
    }

    // Animación suave tipo “burbuja”
    React.useEffect(() => {
        if (!w || !h) return;
        pickTarget();
        let raf = 0;
        const loop = () => {
            setPos((p) => {
                const t = targetRef.current;
                const dx = t.x - p.x;
                const dy = t.y - p.y;
                const dist = Math.hypot(dx, dy);
                // paso pequeño => movimiento lento
                const step = Math.min(0.8, dist) * speed;
                const nx = p.x + dx * step;
                const ny = p.y + dy * step;
                if (dist < 3) pickTarget();
                return { x: nx, y: ny };
            });
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [w, h, speed, lensSize]);

    // Fondo del lente: misma imagen, escalada y re-posicionada
    // Para que el punto bajo el centro del lente coincida, usamos:
    // backgroundPosition = (-(pos * zoom) + lensSize/2)
    const bgSize = `${w * zoom}px ${h * zoom}px`;
    const bgPosX = -(pos.x * zoom - lensSize / 2);
    const bgPosY = -(pos.y * zoom - lensSize / 2);

    return (
        <div
            ref={containerRef}
            className={`relative w-full ${aspect} overflow-hidden rounded-3xl ${className}`}
        >
            {/* Imagen base */}
            <Image src={src} alt={alt} fill className="object-cover" priority={false} />

            {/* Lente-burbuja */}
            <div
                className="pointer-events-none absolute rounded-full overflow-hidden
                   ring-1 ring-white/25 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
                style={{
                    width: lensSize,
                    height: lensSize,
                    left: pos.x - lensSize / 2,
                    top: pos.y - lensSize / 2,
                }}
            >
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: bgSize,
                        backgroundPosition: `${bgPosX}px ${bgPosY}px`,
                        transform: `scale(1)`,
                        filter: "saturate(1.05) contrast(1.03)",
                    }}
                />
                {/* brillo/specular para look de burbuja */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_40%)]" />
                {/* borde suave interior */}
                <div className="absolute inset-0 rounded-full ring-1 ring-white/20" />
            </div>
        </div>
    );
}
