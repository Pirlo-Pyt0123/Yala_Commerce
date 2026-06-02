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
      className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-colors text-left w-full"
    >
      {/* Imagen */}
      <div className="relative h-52 bg-zinc-800 overflow-hidden w-full">
        <span className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
          Bs. {Number(price).toFixed(2)}
        </span>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.309 48.309 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-4 flex-1">
        <span className="text-xs text-zinc-500 uppercase tracking-wider">
          {category.name}
        </span>
        <h3 className="text-white text-sm font-medium leading-snug line-clamp-2 flex-1">
          {name}
        </h3>
        <div className="mt-3">
          <span className="inline-block w-full text-center bg-zinc-800 group-hover:bg-amber-500 text-zinc-400 group-hover:text-white text-xs font-medium py-2 rounded-lg transition-colors">
            Ver detalle
          </span>
        </div>
      </div>
    </button>
  );
}
