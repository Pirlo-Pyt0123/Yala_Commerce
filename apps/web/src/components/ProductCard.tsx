"use client";

import Image from "next/image";
import { useDrawer } from "@/context/DrawerContext";

type Props = {
  slug: string;
  name: string;
  price: number | string;
  imageUrl: string | null;
  category: { name: string; slug: string };
};

export default function ProductCard({ slug, name, price, imageUrl, category }: Props) {
  const { openDrawer } = useDrawer();

  return (
    <button
      onClick={() => openDrawer(slug)}
      className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden text-left w-full transition-all duration-300 hover:border-[#aaff00]/40 hover:-translate-y-0.5"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(170,255,0,0.08), inset 0 1px 0 rgba(255,255,255,0.04)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.04)";
      }}
    >
      {/* Imagen */}
      <div className="relative h-52 bg-zinc-800/60 overflow-hidden w-full">
        {/* Badge precio */}
        <span
          className="absolute top-2.5 right-2.5 z-10 text-xs font-bold px-2.5 py-1"
          style={{
            background: "linear-gradient(135deg, #aaff00, #00ff44)",
            borderRadius: "6px",
            color: "#000",
            boxShadow: "0 0 12px rgba(170,255,0,0.5)",
          }}
        >
          Bs. {Number(price).toFixed(2)}
        </span>

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.309 48.309 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-4 flex-1">
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "rgba(170,255,0,0.6)" }}>
          {category.name}
        </span>
        <h3 className="text-white text-sm font-medium leading-snug line-clamp-2 flex-1 mt-0.5">
          {name}
        </h3>
        <div className="mt-3">
          <span
            className="inline-block w-full text-center text-xs font-semibold py-2 rounded-lg transition-all duration-300"
            style={{
              background: "rgba(170,255,0,0.06)",
              border: "1px solid rgba(170,255,0,0.15)",
              color: "rgba(170,255,0,0.7)",
            }}
          >
            Ver detalle
          </span>
        </div>
      </div>
    </button>
  );
}
