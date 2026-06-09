"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDrawer } from "@/context/DrawerContext";

const API = process.env.NEXT_PUBLIC_API_URL;

type Product = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
  category: { name: string; slug: string };
};

export default function ProductDrawer() {
  const { slug, closeDrawer } = useDrawer();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setQty(1);
      setAdded(false);
      return;
    }
    setLoadingProduct(true);
    setAdded(false);
    setQty(1);
    fetch(`${API}/products/${slug}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoadingProduct(false));
  }, [slug]);

  async function addToCart() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/login?from=/productos/${slug}`);
      closeDrawer();
      return;
    }
    setAdding(true);
    try {
      const res = await fetch(`${API}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product!.id, quantity: qty }),
      });
      if (res.ok) { setAdded(true); window.dispatchEvent(new Event("cart-updated")); }
    } catch {}
    finally { setAdding(false); }
  }

  const isOpen = !!slug;
  const inStock = product ? product.stock > 0 : false;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-[95] h-full w-full sm:w-[420px] bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
          <span className="text-white font-semibold text-sm">Detalle del producto</span>
          <button
            onClick={closeDrawer}
            className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto">
          {loadingProduct && (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#aaff00 transparent transparent transparent" }} />
            </div>
          )}

          {!loadingProduct && product && (
            <>
              {/* Imagen */}
              <div className="relative h-64 bg-zinc-900 flex items-center justify-center shrink-0">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="420px"
                    className="object-contain p-8"
                  />
                ) : (
                  <svg className="w-20 h-20 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.309 48.309 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="px-5 py-5 space-y-4">
                <Link
                  href={`/productos?category=${product.category.slug}`}
                  onClick={closeDrawer}
                  className="inline-block text-xs font-semibold uppercase tracking-wider transition-colors"
                  style={{ color: "#aaff00" }}
                >
                  {product.category.name}
                </Link>

                <h2 className="text-white text-xl font-bold leading-snug">
                  {product.name}
                </h2>

                <p className="text-3xl font-bold" style={{ color: "#aaff00" }}>
                  Bs. {Number(product.price).toFixed(2)}
                </p>

                {product.description && (
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${inStock ? "" : "bg-red-500"}`}
                    style={inStock ? { background: "#aaff00", boxShadow: "0 0 6px #aaff00" } : {}}
                  />
                  <span className={`text-sm ${inStock ? "text-zinc-400" : "text-red-400"}`}>
                    {inStock ? `${product.stock} unidades disponibles` : "Sin stock"}
                  </span>
                </div>

                <div className="border-t border-zinc-800" />

                {/* Selector de cantidad */}
                {inStock && (
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400 text-sm">Cantidad</span>
                    <div className="flex items-center bg-zinc-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors text-lg"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-white text-sm font-semibold">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer con acciones */}
        {!loadingProduct && product && (
          <div className="px-5 py-4 border-t border-zinc-800 space-y-2 shrink-0">
            {inStock ? (
              <>
                <button
                  onClick={addToCart}
                  disabled={adding}
                  className="w-full disabled:opacity-60 font-semibold py-3.5 rounded-xl transition-all text-sm"
                  style={{ background: "linear-gradient(135deg, #aaff00, #00ff44)", color: "#000" }}
                >
                  {adding ? "Agregando..." : added ? "Agregar más" : "Agregar al carrito"}
                </button>
                {added && (
                  <Link
                    href="/carrito"
                    onClick={closeDrawer}
                    className="block w-full text-center font-medium py-3.5 rounded-xl transition-all text-sm"
                    style={{ border: "1px solid rgba(170,255,0,0.4)", color: "#aaff00" }}
                  >
                    Ver carrito →
                  </Link>
                )}
              </>
            ) : (
              <button
                disabled
                className="w-full bg-zinc-700 opacity-50 cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm"
              >
                Sin stock
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
