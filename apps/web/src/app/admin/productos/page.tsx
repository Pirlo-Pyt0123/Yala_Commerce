"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  category: { id: number; name: string };
};

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [toggling, setToggling] = useState<number | null>(null);

  const fetchProducts = useCallback(async (p = 1, q = "") => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "15" });
      if (q) params.set("search", q);
      const res = await fetch(`${API}/products/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data);
        setMeta(data.meta);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(page, search); }, [fetchProducts, page, search]);

  async function toggleActive(product: Product) {
    const token = localStorage.getItem("token");
    if (!token) return;
    setToggling(product.id);
    try {
      const res = await fetch(`${API}/products/admin/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p))
        );
      }
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Productos</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{meta.total} en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
        >
          + Nuevo producto
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
      />

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4,5].map((i) => <div key={i} className="h-14 bg-zinc-800 rounded-xl animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <p className="text-zinc-500 text-sm p-6">No se encontraron productos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Producto</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Categoría</th>
                  <th className="text-right px-4 py-3">Precio</th>
                  <th className="text-right px-4 py-3 hidden md:table-cell">Stock</th>
                  <th className="text-center px-4 py-3">Estado</th>
                  <th className="text-right px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden relative shrink-0">
                          {p.imageUrl ? (
                            <Image src={p.imageUrl} alt={p.name} fill className="object-contain p-1" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">?</div>
                          )}
                        </div>
                        <span className="text-white text-sm font-medium line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-zinc-400 text-sm">{p.category.name}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-amber-400 text-sm font-medium">Bs. {Number(p.price).toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className={`text-sm ${p.stock === 0 ? "text-red-400" : p.stock < 5 ? "text-yellow-400" : "text-zinc-400"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(p)}
                        disabled={toggling === p.id}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          p.isActive
                            ? "text-amber-400 bg-amber-400/10 border-amber-400/30 hover:bg-amber-400/20"
                            : "text-zinc-500 bg-zinc-500/10 border-zinc-500/30 hover:bg-zinc-500/20"
                        }`}
                      >
                        {toggling === p.id ? "..." : p.isActive ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="text-zinc-400 hover:text-white text-sm transition-colors"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-40 text-sm transition-colors"
          >
            Anterior
          </button>
          <span className="text-zinc-500 text-sm">{page} / {meta.totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
            className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-40 text-sm transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
