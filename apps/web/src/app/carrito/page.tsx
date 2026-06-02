"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API = process.env.NEXT_PUBLIC_API_URL;

type CartProduct = {
  id: number;
  name: string;
  slug: string;
  price: string;
  imageUrl: string | null;
  stock: number;
};

type CartItem = {
  id: number;
  productId: number;
  quantity: number;
  product: CartProduct;
};

type Cart = {
  id: number;
  items: CartItem[];
  totalItems: number;
  subtotal: string;
};

export default function CarritoPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchCart = useCallback(async () => {
    if (!token) { router.push("/login?from=/carrito"); return; }
    try {
      const res = await fetch(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { router.push("/login?from=/carrito"); return; }
      setCart(await res.json());
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  async function updateQty(productId: number, quantity: number) {
    if (!token) return;
    setUpdating(productId);
    try {
      const res = await fetch(`${API}/cart/items/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) setCart(await res.json());
    } finally {
      setUpdating(null);
    }
  }

  async function removeItem(productId: number) {
    if (!token) return;
    setUpdating(productId);
    try {
      const res = await fetch(`${API}/cart/items/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCart(await res.json());
    } finally {
      setUpdating(null);
    }
  }

  async function clearCart() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/cart`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCart(await res.json());
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-zinc-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const empty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-3xl font-bold">Mi carrito</h1>
          {!empty && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-500/50 text-zinc-400 hover:text-red-400 text-sm font-medium px-4 py-2 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Vaciar carrito
            </button>
          )}
        </div>

        {empty ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-zinc-500 text-lg">Tu carrito está vacío</p>
            <Link
              href="/productos"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Items */}
            <div className="md:col-span-2 space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
                >
                  {/* Imagen */}
                  <Link href={`/productos/${item.product.slug}`} className="shrink-0">
                    <div className="w-20 h-20 bg-zinc-800 rounded-xl overflow-hidden relative">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                          Sin imagen
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/productos/${item.product.slug}`}>
                      <p className="text-white text-sm font-medium line-clamp-2 hover:text-amber-400 transition-colors">
                        {item.product.name}
                      </p>
                    </Link>
                    <p className="text-amber-400 font-semibold mt-1">
                      Bs. {Number(item.product.price).toFixed(2)}
                    </p>

                    {/* Cantidad */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        disabled={item.quantity <= 1 || updating === item.productId}
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-40 transition-colors text-sm"
                      >
                        -
                      </button>
                      <span className="text-white text-sm w-4 text-center">
                        {updating === item.productId ? "..." : item.quantity}
                      </span>
                      <button
                        disabled={item.quantity >= item.product.stock || updating === item.productId}
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-40 transition-colors text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        disabled={updating === item.productId}
                        className="ml-2 w-7 h-7 rounded-full flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-40 transition-colors"
                        aria-label="Eliminar producto"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Subtotal item */}
                  <div className="shrink-0 text-right">
                    <p className="text-white font-semibold text-sm">
                      Bs. {(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 sticky top-20">
                <h2 className="text-white font-semibold">Resumen</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Productos ({cart.totalItems})</span>
                    <span>Bs. {cart.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Envío</span>
                    <span className="text-amber-400">Por calcular</span>
                  </div>
                </div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between text-white font-semibold">
                  <span>Total</span>
                  <span>Bs. {cart.subtotal}</span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-3 rounded-full transition-colors text-sm text-center"
                >
                  Proceder al pago
                </Link>
                <Link
                  href="/productos"
                  className="block w-full text-center border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-medium py-3 rounded-full transition-colors text-sm"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
