"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    image: "/bebida-home1.png",
    tag: "Entrega a domicilio",
    title: "Tu bebida favorita,\ndonde estés",
    subtitle: "Los mejores whiskys y espirituosos premium al mejor precio.",
    cta: "Ver catálogo",
    href: "/productos",
  },
  {
    image: "/bebida-home2.png",
    tag: "Selección exclusiva",
    title: "Vinos para cada\nmomento",
    subtitle: "Tintos, blancos y rosados cuidadosamente seleccionados para ti.",
    cta: "Explorar vinos",
    href: "/productos?category=vino",
  },
  {
    image: "/bebida-home3.png",
    tag: "Siempre frío",
    title: "La cerveza perfecta\npara hoy",
    subtitle: "Nacionales e importadas. Pide ahora y recibe en minutos.",
    cta: "Ver cervezas",
    href: "/productos?category=cerveza",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const goTo = useCallback((index: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 300);
  }, [animating]);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/fondo-home.webp')" }}
    >
      <div className="absolute inset-0 bg-zinc-950/65" />

      {/* Contenido */}
      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-12 min-h-[560px]">

        {/* Texto */}
        <div
          className={`flex-1 text-center md:text-left transition-all duration-300 ${
            animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          <span className="inline-block text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3 border border-amber-400/30 px-3 py-1 rounded-full">
            {slide.tag}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mt-2 whitespace-pre-line">
            {slide.title}
          </h1>
          <p className="text-zinc-400 text-base md:text-lg mt-4 max-w-md mx-auto md:mx-0">
            {slide.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mt-8">
            <Link
              href={slide.href}
              className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
            >
              {slide.cta}
            </Link>
            {!loggedIn && (
              <Link
                href="/register"
                className="border border-zinc-600 hover:border-zinc-400 text-zinc-300 hover:text-white font-medium px-8 py-3.5 rounded-full transition-colors text-sm"
              >
                Crear cuenta
              </Link>
            )}
          </div>
        </div>

        {/* Imagen */}
        <div
          className={`flex-1 flex items-center justify-center transition-all duration-300 ${
            animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <div className="relative w-80 h-80 md:w-[440px] md:h-[440px]">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-contain drop-shadow-2xl"
              unoptimized
              priority
            />
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="relative flex justify-center gap-2 pb-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-6 h-2 bg-amber-500"
                : "w-2 h-2 bg-zinc-600 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
