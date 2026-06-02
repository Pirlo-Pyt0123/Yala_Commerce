"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function AgeGate() {
  const [visible, setVisible] = useState(false);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [rejected, setRejected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("age_verified")) setVisible(true);
  }, []);

  function verify() {
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (
      !day || !month || !year ||
      isNaN(d) || isNaN(m) || isNaN(y) ||
      d < 1 || d > 31 || m < 1 || m > 12 || y < 1900
    ) {
      setError("Ingresa una fecha de nacimiento válida.");
      return;
    }

    const birth = new Date(y, m - 1, d);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const md = today.getMonth() - birth.getMonth();
    if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) age--;

    if (age >= 18) {
      sessionStorage.setItem("age_verified", "1");
      setVisible(false);
    } else {
      setRejected(true);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/fondo-home.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-zinc-950/70" />

      <div className="relative w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-2xl shadow-black/40">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/yalaSPPG.png"
            alt="Yala"
            width={100}
            height={40}
            style={{ width: "auto", height: "40px" }}
            priority
          />
        </div>

        {rejected ? (
          /* Estado: menor de edad */
          <div className="space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold">Acceso restringido</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Debes ser mayor de 18 años para acceder a este sitio. El consumo de alcohol no está permitido para menores de edad.
            </p>
            <a
              href="https://www.google.com"
              className="inline-block w-full mt-2 bg-white/10 hover:bg-white/15 border border-white/10 text-zinc-300 font-medium py-3 rounded-xl text-sm transition-colors"
            >
              Abandonar el sitio
            </a>
          </div>
        ) : (
          /* Estado: verificación */
          <div className="space-y-5">
            <div>
              <h2 className="text-white text-xl font-bold">Verifica tu edad</h2>
              <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
                Este sitio es exclusivo para mayores de 18 años. Ingresa tu fecha de nacimiento para continuar.
              </p>
            </div>

            {/* Inputs día / mes / año */}
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-zinc-500 text-xs text-left">Día</label>
                <input
                  type="number"
                  min={1} max={31}
                  placeholder="DD"
                  value={day}
                  onChange={(e) => { setDay(e.target.value); setError(""); }}
                  className="w-full bg-white/8 border border-white/10 focus:border-amber-500/70 text-white text-center rounded-xl py-3 text-sm outline-none transition-colors placeholder-zinc-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-zinc-500 text-xs text-left">Mes</label>
                <input
                  type="number"
                  min={1} max={12}
                  placeholder="MM"
                  value={month}
                  onChange={(e) => { setMonth(e.target.value); setError(""); }}
                  className="w-full bg-white/8 border border-white/10 focus:border-amber-500/70 text-white text-center rounded-xl py-3 text-sm outline-none transition-colors placeholder-zinc-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex-[1.6] flex flex-col gap-1">
                <label className="text-zinc-500 text-xs text-left">Año</label>
                <input
                  type="number"
                  min={1900} max={new Date().getFullYear()}
                  placeholder="AAAA"
                  value={year}
                  onChange={(e) => { setYear(e.target.value); setError(""); }}
                  className="w-full bg-white/8 border border-white/10 focus:border-amber-500/70 text-white text-center rounded-xl py-3 text-sm outline-none transition-colors placeholder-zinc-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <button
              onClick={verify}
              className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
            >
              Confirmar y entrar
            </button>

            <p className="text-zinc-600 text-xs leading-relaxed">
              Al ingresar confirmas que eres mayor de 18 años. Yala promueve el consumo responsable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
