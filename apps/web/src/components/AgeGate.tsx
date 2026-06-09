"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function AgeGate() {
  const [visible, setVisible] = useState(false);
  const [rejected, setRejected] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("age_verified")) setVisible(true);
  }, []);

  function confirm() {
    sessionStorage.setItem("age_verified", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/fondo-home2.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-zinc-950/75" />

      <div className="relative w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-2xl shadow-black/40">

        <div className="flex justify-center mb-8">
          <Image
            src="/logoLico.webp"
            alt="Yala"
            width={100}
            height={40}
            style={{ width: "auto", height: "44px" }}
            priority
          />
        </div>

        {rejected ? (
          <div className="space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold">Acceso restringido</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Debes ser mayor de 18 años para acceder a este sitio.
            </p>
            <a
              href="https://www.google.com"
              className="inline-block w-full mt-2 bg-white/10 hover:bg-white/15 border border-white/10 text-zinc-300 font-medium py-3 rounded-xl text-sm transition-colors"
            >
              Abandonar el sitio
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-3">Verificación de edad</p>
              <h2 className="text-white text-2xl font-bold leading-snug">
                ¿Eres mayor<br />de 18 años?
              </h2>
              <p className="text-zinc-500 text-sm mt-2">
                Este sitio contiene contenido sobre bebidas alcohólicas.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirm}
                className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-4 rounded-xl text-sm transition-colors"
              >
                Sí, tengo 18 o más
              </button>
              <button
                onClick={() => setRejected(true)}
                className="w-full bg-white/8 hover:bg-white/12 border border-white/10 text-zinc-400 hover:text-white font-medium py-4 rounded-xl text-sm transition-colors"
              >
                No, soy menor de 18
              </button>
            </div>

            <p className="text-zinc-700 text-xs">
              Yala promueve el consumo responsable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
