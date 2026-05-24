"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  _count: { products: number };
};

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);

  async function fetchCategories() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API}/categories/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCategories(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCategories(); }, []);

  async function toggleActive(cat: Category) {
    const token = localStorage.getItem("token");
    if (!token) return;
    setToggling(cat.id);
    try {
      const res = await fetch(`${API}/categories/admin/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, isActive: !c.isActive } : c))
        );
      }
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Categorías</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{categories.length} en total</p>
        </div>
        <Link
          href="/admin/categorias/nueva"
          className="bg-green-500 hover:bg-green-400 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
        >
          + Nueva categoría
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map((i) => <div key={i} className="h-14 bg-zinc-800 rounded-xl animate-pulse" />)}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-zinc-500 text-sm p-6">No hay categorías.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3">Nombre</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Descripción</th>
                <th className="text-center px-5 py-3">Productos</th>
                <th className="text-center px-5 py-3">Estado</th>
                <th className="text-right px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-white text-sm font-medium">{cat.name}</p>
                    <p className="text-zinc-600 text-xs">{cat.slug}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <p className="text-zinc-400 text-sm line-clamp-1">{cat.description ?? "—"}</p>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="text-zinc-400 text-sm">{cat._count.products}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => toggleActive(cat)}
                      disabled={toggling === cat.id}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        cat.isActive
                          ? "text-green-400 bg-green-400/10 border-green-400/30 hover:bg-green-400/20"
                          : "text-zinc-500 bg-zinc-500/10 border-zinc-500/30 hover:bg-zinc-500/20"
                      }`}
                    >
                      {toggling === cat.id ? "..." : cat.isActive ? "Activa" : "Inactiva"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/categorias/${cat.id}`}
                      className="text-zinc-400 hover:text-white text-sm transition-colors"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
