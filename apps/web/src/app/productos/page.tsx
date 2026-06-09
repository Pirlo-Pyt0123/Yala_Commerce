"use client";

import { Suspense } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL;

type Category = {
  id: number;
  name: string;
  slug: string;
  _count: { products: number };
};

type Product = {
  id: number;
  slug: string;
  name: string;
  price: string;
  imageUrl: string | null;
  category: { name: string; slug: string };
};

type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function ProductosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") ?? "";
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParams = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") params.delete(k);
      else params.set(k, String(v));
    });
    router.push(`/productos?${params.toString()}`);
  }, [searchParams, router]);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      params.set("page", String(page));
      params.set("limit", "12");

      const res = await fetch(`${API}/products?${params}`);
      const data = await res.json();
      setProducts(data.data ?? []);
      setMeta(data.meta ?? null);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Header */}
      <div className="border-b border-zinc-900" style={{ background: "linear-gradient(to bottom, #0a0f0a, #09090b)" }}>
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-5 rounded-full" style={{ background: "#aaff00", boxShadow: "0 0 8px #aaff00, 0 0 20px rgba(170,255,0,0.4)" }} />
                <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#aaff00" }}>Catálogo</span>
              </div>
              <h1 className="text-white text-4xl font-black tracking-tight">Todos los productos</h1>
              {meta && (
                <p className="text-zinc-500 text-sm mt-1">{meta.total} productos encontrados</p>
              )}
            </div>

            {/* Buscador */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Buscar producto..."
                defaultValue={search}
                onChange={(e) => {
                  const val = e.target.value;
                  if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                  searchTimeoutRef.current = setTimeout(() => {
                    updateParams({ search: val || null, page: null });
                  }, 400);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-zinc-600 text-sm outline-none transition-all"
                style={{ caretColor: "#aaff00" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "rgba(170,255,0,0.5)"}
                onBlur={(e) => e.currentTarget.style.borderColor = ""}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
          </div>

          {/* Filtros de categoría */}
          <div className="flex gap-2 flex-wrap mt-6">
            <button
              onClick={() => updateParams({ category: null, page: null })}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={!category ? {
                background: "rgba(170,255,0,0.12)",
                border: "1px solid rgba(170,255,0,0.5)",
                color: "#aaff00",
                boxShadow: "0 0 12px rgba(170,255,0,0.15)",
              } : {
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#71717a",
              }}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => updateParams({ category: cat.slug, page: null })}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={category === cat.slug ? {
                  background: "rgba(170,255,0,0.12)",
                  border: "1px solid rgba(170,255,0,0.5)",
                  color: "#aaff00",
                  boxShadow: "0 0 12px rgba(170,255,0,0.15)",
                } : {
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#71717a",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800/50 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-28">
            <p className="text-zinc-600 text-lg mb-4">No se encontraron productos</p>
            <button
              onClick={() => updateParams({ search: null, category: null, page: null })}
              className="text-sm font-medium px-5 py-2 rounded-lg transition-all"
              style={{ border: "1px solid rgba(170,255,0,0.3)", color: "#aaff00" }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}

        {/* Paginación */}
        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button
              disabled={page <= 1}
              onClick={() => updateParams({ page: page - 1 })}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#a1a1aa" }}
            >
              ← Anterior
            </button>
            <span className="text-zinc-500 text-sm px-3">
              {page} / {meta.totalPages}
            </span>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => updateParams({ page: page + 1 })}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ border: "1px solid rgba(170,255,0,0.3)", color: "#aaff00" }}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense>
      <ProductosContent />
    </Suspense>
  );
}
