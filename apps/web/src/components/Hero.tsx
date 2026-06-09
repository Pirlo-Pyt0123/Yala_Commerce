"use client";

import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const [ready, setReady] = useState(false);
  const modelWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      if (!modelWrapRef.current) return;
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.55), 1);
      modelWrapRef.current.style.opacity = String(1 - progress);
      modelWrapRef.current.style.transform = `translateX(${progress * 40}vw)`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const s = document.createElement("script");
      s.type = "module";
      s.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
      s.onload = () => setReady(true);
      document.head.appendChild(s);
    } else {
      setReady(true);
    }
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden -mt-14 md:-mt-20"
      style={{ background: "#050a05" }}
    >

{/* Texto de fondo — detrás del modelo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0" style={{ paddingTop: "10vh" }}>
        <span
          style={{
            fontSize: "clamp(7rem, 22vw, 20rem)",
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: "rgba(255,255,255,0.35)",
            fontFamily: "var(--font-geist-sans), sans-serif",
          }}
        >
          YALA
        </span>
        <span
          style={{
            fontSize: "clamp(1.5rem, 4.5vw, 5rem)",
            fontWeight: 700,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(0,255,68,0.18)",
            textShadow: "0 0 20px rgba(0,255,68,0.25), 0 0 60px rgba(170,255,0,0.1)",
            fontFamily: "var(--font-geist-sans), sans-serif",
          }}
        >
          Licorería
        </span>
      </div>

      {/* Modelo 3D centrado */}
      <div
        ref={modelWrapRef}
        className="relative z-10 flex justify-start items-center pt-20 md:pt-24"
        style={{ willChange: "transform, opacity", height: "80vh", width: "70%", marginLeft: "-20%" }}
      >
{ready && (
          // @ts-ignore
          <model-viewer
            src="/monster_energy_drink.glb"
            alt="Monster Energy Drink"
            auto-rotate
            shadow-intensity="1"
            exposure="1.2"
            rotation-per-second="20deg"
            auto-rotate-delay="0"
            style={{ width: "100%", height: "100%", background: "transparent" }}
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, #09090b, transparent)" }}
      />
    </section>
  );
}
