"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  productId: number;
  slug: string;
  inStock: boolean;
};

export default function AddToCartButton({ productId, slug, inStock }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleClick() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/login?from=/productos/${slug}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (res.ok) {
        setAdded(true);
        window.dispatchEvent(new Event("cart-updated"));
        setTimeout(() => setAdded(false), 2000);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  if (!inStock) {
    return (
      <button disabled className="w-full bg-zinc-700 opacity-50 cursor-not-allowed text-white font-semibold py-3 rounded-full text-sm">
        Sin stock
      </button>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors text-sm"
      >
        {loading ? "Agregando..." : added ? "Agregado al carrito" : "Agregar al carrito"}
      </button>
      {added && (
        <button
          onClick={() => router.push("/carrito")}
          className="px-4 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-full transition-colors text-sm"
        >
          Ver carrito
        </button>
      )}
    </div>
  );
}
