"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function ProductosPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") ?? "";
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  function updateParams(updates: Record<string, string | number | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") params.delete(k);
      else params.set(k, String(v));
    });
    router.push(`/productos?${params.toString()}`);
  }

  // Cargar categorías una sola vez
  useEffect(() => {
    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Cargar productos cuando cambien los filtros
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

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold">Catálogo</h1>
          {meta && (
            <p className="text-zinc-500 text-sm mt-1">
              {meta.total} productos encontrados
            </p>
          )}
        </div>

        {/* Búsqueda */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar producto..."
            defaultValue={search}
            onChange={(e) => {
              const val = e.target.value;
              const timer = setTimeout(() => {
                updateParams({ search: val || null, page: null });
              }, 400);
              return () => clearTimeout(timer);
            }}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-4 py-3 pl-11 text-white placeholder-zinc-500 text-sm outline-none transition-colors"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>

        {/* Filtros de categoría */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => updateParams({ category: null, page: null })}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              !category
                ? "bg-green-500 text-white"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateParams({ category: cat.slug, page: null })}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                category === cat.slug
                  ? "bg-green-500 text-white"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-500 text-lg">No se encontraron productos</p>
            <button
              onClick={() => updateParams({ search: null, category: null, page: null })}
              className="mt-4 text-green-400 hover:text-green-300 text-sm"
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
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => updateParams({ page: page - 1 })}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Anterior
            </button>
            <span className="text-zinc-500 text-sm px-2">
              Página {page} de {meta.totalPages}
            </span>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => updateParams({ page: page + 1 })}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
