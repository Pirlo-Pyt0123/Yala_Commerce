export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";

const API = process.env.NEXT_PUBLIC_API_URL;

type Product = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  category: { name: string; slug: string };
};

async function getProduct(slug: string): Promise<Product | null | "error"> {
  try {
    const res = await fetch(`${API}/products/${slug}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) return "error";
    return res.json();
  } catch {
    return "error";
  }
}

export default async function ProductoDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (product === null) notFound();

  if (product === "error") {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-400 text-lg">No se pudo cargar el producto.</p>
        <p className="text-zinc-600 text-sm">El servidor está iniciando, intenta de nuevo en unos segundos.</p>
        <a href={`/productos/${slug}`} className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
          Reintentar
        </a>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-zinc-300 transition-colors">Catálogo</Link>
          <span>/</span>
          <Link
            href={`/productos?category=${product.category.slug}`}
            className="hover:text-zinc-300 transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-zinc-400 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Imagen */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center min-h-80">
            {product.imageUrl ? (
              <div className="relative w-full h-96">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  unoptimized
                />
              </div>
            ) : (
              <div className="text-zinc-700 flex flex-col items-center gap-3 py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.309 48.309 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
                <span className="text-sm">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            {/* Categoría */}
            <Link
              href={`/productos?category=${product.category.slug}`}
              className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors w-fit"
            >
              {product.category.name}
            </Link>

            {/* Nombre */}
            <h1 className="text-white text-3xl font-bold leading-snug">
              {product.name}
            </h1>

            {/* Precio */}
            <div className="flex items-baseline gap-2">
              <span className="text-amber-400 text-4xl font-bold">
                Bs. {Number(product.price).toFixed(2)}
              </span>
            </div>

            {/* Descripción */}
            {product.description && (
              <p className="text-zinc-400 text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${inStock ? "bg-amber-500" : "bg-red-500"}`} />
              <span className={`text-sm ${inStock ? "text-zinc-400" : "text-red-400"}`}>
                {inStock ? `${product.stock} unidades disponibles` : "Sin stock"}
              </span>
            </div>

            {/* Separador */}
            <div className="border-t border-zinc-800" />

            {/* Botón agregar al carrito */}
            <AddToCartButton productId={product.id} slug={product.slug} inStock={inStock} />

            {/* Volver */}
            <Link
              href="/productos"
              className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors w-fit"
            >
              ← Volver al catálogo
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

