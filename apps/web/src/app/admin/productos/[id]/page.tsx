"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ProductForm from "../_form";

export default function EditarProductoPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/productos" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
          ← Volver a productos
        </Link>
        <h1 className="text-white text-2xl font-bold mt-2">Editar producto</h1>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <ProductForm productId={Number(id)} />
      </div>
    </div>
  );
}
