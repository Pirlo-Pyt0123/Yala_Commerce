"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL;

type Category = { id: number; name: string };

type ProductForm = {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
  isActive: boolean;
};

type Props = {
  productId?: number;
};

const EMPTY: ProductForm = { name: "", description: "", price: "", stock: "0", imageUrl: "", categoryId: "", isActive: true };

export default function ProductForm({ productId }: Props) {
  const router = useRouter();
  const isEdit = !!productId;

  const [form, setForm] = useState<ProductForm>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const tasks: Promise<any>[] = [
      fetch(`${API}/categories/admin/all`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ];
    if (isEdit) {
      tasks.push(
        fetch(`${API}/products/admin/${productId}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())
      );
    }

    Promise.all(tasks).then(([cats, product]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      if (product) {
        setForm({
          name: product.name ?? "",
          description: product.description ?? "",
          price: String(Number(product.price).toFixed(2)),
          stock: String(product.stock ?? 0),
          imageUrl: product.imageUrl ?? "",
          categoryId: String(product.category?.id ?? product.categoryId ?? ""),
          isActive: product.isActive ?? true,
        });
      }
    }).finally(() => setLoading(false));
  }, [isEdit, productId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
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
    const body = {
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl || undefined,
      categoryId: Number(form.categoryId),
      isActive: form.isActive,
    };

    try {
      const url = isEdit ? `${API}/products/admin/${productId}` : `${API}/products/admin`;
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(Array.isArray(data?.message) ? data.message.join(", ") : (data?.message ?? "Error al guardar"));
        return;
      }

      router.push("/admin/productos");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2,3,4].map((i) => <div key={i} className="h-14 bg-zinc-800 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-zinc-400 text-sm">Nombre *</label>
          <input
            name="name" value={form.name} onChange={handleChange} required
            placeholder="Ej: Johnnie Walker Black Label 750ml"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-zinc-400 text-sm">Categoría *</label>
          <select
            name="categoryId" value={form.categoryId} onChange={handleChange} required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-zinc-400 text-sm">Descripción</label>
        <textarea
          name="description" value={form.description} onChange={handleChange} rows={3}
          placeholder="Descripción del producto..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-zinc-400 text-sm">Precio (S/) *</label>
          <input
            name="price" value={form.price} onChange={handleChange} required
            type="number" min="0" step="0.01" placeholder="0.00"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-zinc-400 text-sm">Stock *</label>
          <input
            name="stock" value={form.stock} onChange={handleChange} required
            type="number" min="0" step="1" placeholder="0"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-zinc-400 text-sm">URL de imagen</label>
        <input
          name="imageUrl" value={form.imageUrl} onChange={handleChange}
          type="url" placeholder="https://..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
        />
        {form.imageUrl && (
          <div className="mt-2 w-20 h-20 bg-zinc-800 rounded-xl overflow-hidden relative border border-zinc-700">
            <Image src={form.imageUrl} alt="preview" fill className="object-contain p-2" unoptimized />
          </div>
        )}
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox" name="isActive"
          checked={form.isActive}
          onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
          className="w-4 h-4 accent-amber-500"
        />
        <span className="text-zinc-400 text-sm">Producto activo (visible en la tienda)</span>
      </label>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit" disabled={saving}
          className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-semibold py-3 rounded-full text-sm transition-colors"
        >
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/productos")}
          className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white rounded-full text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
