"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

type Props = { categoryId?: number };

type CatForm = { name: string; description: string; isActive: boolean };

const EMPTY: CatForm = { name: "", description: "", isActive: true };

export default function CategoryForm({ categoryId }: Props) {
  const router = useRouter();
  const isEdit = !!categoryId;

  const [form, setForm] = useState<CatForm>(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API}/categories/admin/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((cats: any[]) => {
        const cat = cats.find((c) => c.id === categoryId);
        if (cat) setForm({ name: cat.name, description: cat.description ?? "", isActive: cat.isActive });
      })
      .finally(() => setLoading(false));
  }, [isEdit, categoryId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) return;

    setSaving(true);
    try {
      const url = isEdit ? `${API}/categories/admin/${categoryId}` : `${API}/categories/admin`;
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, description: form.description || undefined, isActive: form.isActive }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(Array.isArray(data?.message) ? data.message.join(", ") : (data?.message ?? "Error al guardar"));
        return;
      }

      router.push("/admin/categorias");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="space-y-4">{[1,2].map((i) => <div key={i} className="h-14 bg-zinc-800 rounded-xl animate-pulse" />)}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-zinc-400 text-sm">Nombre *</label>
        <input
          name="name" value={form.name} onChange={handleChange} required
          placeholder="Ej: Whisky"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-zinc-400 text-sm">Descripción</label>
        <textarea
          name="description" value={form.description} onChange={handleChange} rows={3}
          placeholder="Descripción de la categoría..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox" name="isActive" checked={form.isActive}
          onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
          className="w-4 h-4 accent-amber-500"
        />
        <span className="text-zinc-400 text-sm">Categoría activa (visible en la tienda)</span>
      </label>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit" disabled={saving}
          className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-semibold py-3 rounded-full text-sm transition-colors"
        >
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear categoría"}
        </button>
        <button
          type="button" onClick={() => router.push("/admin/categorias")}
          className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white rounded-full text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
