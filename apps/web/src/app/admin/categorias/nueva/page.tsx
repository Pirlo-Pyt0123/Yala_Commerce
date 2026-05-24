import Link from "next/link";
import CategoryForm from "../_form";

export default function NuevaCategoriaPage() {
  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div>
        <Link href="/admin/categorias" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
          ← Volver a categorías
        </Link>
        <h1 className="text-white text-2xl font-bold mt-2">Nueva categoría</h1>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <CategoryForm />
      </div>
    </div>
  );
}
