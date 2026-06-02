export const dynamic = "force-dynamic";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";

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

const categoryColor: Record<string, { border: string; bg: string; accent: string }> = {
  whisky:  { border: "border-amber-500/40",  bg: "bg-amber-950/40",  accent: "text-amber-400"  },
  vino:    { border: "border-rose-500/40",   bg: "bg-rose-950/40",   accent: "text-rose-400"   },
  cerveza: { border: "border-yellow-500/40", bg: "bg-yellow-950/40", accent: "text-yellow-400" },
  ron:     { border: "border-orange-500/40", bg: "bg-orange-950/40", accent: "text-orange-400" },
  pisco:   { border: "border-purple-500/40", bg: "bg-purple-950/40", accent: "text-purple-400" },
  vodka:   { border: "border-sky-500/40",    bg: "bg-sky-950/40",    accent: "text-sky-400"    },
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

      <HeroCarousel />

      {/* Categorías */}
      {categories.length > 0 && (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 mb-6">
            <h2 className="text-white text-2xl font-bold">Categorías</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-3 max-w-6xl mx-auto scrollbar-hide snap-x snap-mandatory">
            {categories.map((cat) => {
              const style = categoryColor[cat.slug] ?? { border: "border-zinc-700", bg: "bg-zinc-800/50", accent: "text-zinc-400" };
              return (
                <Link
                  key={cat.id}
                  href={`/productos?category=${cat.slug}`}
                  className={`snap-start shrink-0 flex flex-col justify-between w-36 h-36 rounded-2xl p-4 border ${style.border} ${style.bg} hover:brightness-110 transition-all`}
                >
                  <span className={`text-4xl font-black ${style.accent}`}>
                    {cat.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-white font-semibold text-sm">{cat.name}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{cat._count.products} productos</p>
                  </div>
                </Link>
              );
            })}
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
              className="border border-amber-500/40 hover:border-amber-500 text-amber-400 hover:text-amber-300 text-sm font-medium px-4 py-2 rounded-full transition-colors"
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
