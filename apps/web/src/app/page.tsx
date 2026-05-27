export const dynamic = "force-dynamic";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL;

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
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

const categoryColor: Record<string, string> = {
  whisky:  "bg-amber-900/40 text-amber-400",
  vino:    "bg-rose-900/40 text-rose-400",
  cerveza: "bg-yellow-900/40 text-yellow-400",
  ron:     "bg-orange-900/40 text-orange-400",
  pisco:   "bg-purple-900/40 text-purple-400",
  vodka:   "bg-sky-900/40 text-sky-400",
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/products?limit=8`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 py-24 px-4">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #22c55e 0%, transparent 50%), radial-gradient(circle at 80% 20%, #16a34a 0%, transparent 40%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <p className="text-green-400 text-sm font-medium tracking-widest uppercase">
            Bienvenido a
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Licorería
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            La mejor selección de whiskys, vinos, cervezas, rones, piscos y vodkas con entrega a domicilio.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/productos"
              className="bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Ver catálogo
            </Link>
            <Link
              href="/register"
              className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-white text-2xl font-bold mb-8">Categorías</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-5 transition-colors"
              >
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${categoryColor[cat.slug] ?? "bg-zinc-800 text-zinc-400"}`}>
                  {cat.name}
                </span>
                <span className="text-white text-sm font-medium">{cat.name}</span>
                <span className="text-zinc-500 text-xs">{cat._count.products} productos</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Productos destacados */}
      {products.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white text-2xl font-bold">Productos destacados</h2>
            <Link
              href="/productos"
              className="text-green-400 hover:text-green-300 text-sm transition-colors"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
