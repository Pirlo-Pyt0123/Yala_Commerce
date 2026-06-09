export const dynamic = "force-dynamic";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";

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

      <Hero />

      {/* Categorías */}
      {categories.length > 0 && (
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full" style={{ background: "#aaff00", boxShadow: "0 0 8px #aaff00, 0 0 20px rgba(170,255,0,0.4)" }} />
              <h2 className="text-white text-2xl font-bold">Categorías</h2>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 pb-4 max-w-6xl mx-auto scrollbar-hide snap-x snap-mandatory">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?category=${cat.slug}`}
                className="group snap-start shrink-0 flex flex-col justify-between w-40 h-44 rounded-2xl p-5 border border-zinc-800 bg-zinc-900 hover:border-[#aaff00]/50 hover:bg-[#aaff00]/5 transition-all duration-300"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
              >
                <span
                  className="text-5xl font-black transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(170,255,0,0.8)]"
                  style={{ color: "#aaff00" }}
                >
                  {cat.name.charAt(0)}
                </span>
                <div>
                  <p className="text-white font-semibold text-sm group-hover:text-[#aaff00] transition-colors duration-300">{cat.name}</p>
                  <p className="text-zinc-500 text-xs mt-1">{cat._count.products} productos</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Productos destacados */}
      {products.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-24">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full" style={{ background: "#aaff00", boxShadow: "0 0 8px #aaff00, 0 0 20px rgba(170,255,0,0.4)" }} />
              <h2 className="text-white text-2xl font-bold">Productos destacados</h2>
            </div>
            <Link
              href="/productos"
              className="border border-[#aaff00]/30 hover:border-[#aaff00]/70 text-[#aaff00] text-sm font-medium px-4 py-2 rounded-full transition-all hover:bg-[#aaff00]/10 hover:shadow-[0_0_12px_rgba(170,255,0,0.2)]"
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
