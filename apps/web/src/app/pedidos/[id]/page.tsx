"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API = process.env.NEXT_PUBLIC_API_URL;

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pendiente",   color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  CONFIRMED: { label: "Confirmado",  color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  SHIPPED:   { label: "En camino",   color: "text-purple-400 bg-purple-400/10 border-purple-400/30" },
  DELIVERED: { label: "Entregado",   color: "text-[#aaff00] bg-[#aaff00]/10 border-[#aaff00]/30" },
  CANCELLED: { label: "Cancelado",   color: "text-red-400 bg-red-400/10 border-red-400/30" },
};

const PAYMENT_LABELS: Record<string, string> = {
  COD:    "Pago contra entrega",
  PAYPAL: "PayPal",
  CARD:   "Tarjeta",
};

type OrderItem = {
  productId: number;
  quantity: number;
  price: string;
  subtotal: string;
  product: { id: number; name: string; slug: string; imageUrl: string | null };
};

type Order = {
  id: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: string;
  shipping: {
    fullName: string;
    phone: string;
    address: string;
    district: string;
    city: string;
    notes: string | null;
  };
  items: OrderItem[];
  createdAt: string;
};

function PedidoContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isNew = searchParams.get("nuevo") === "1";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    fetch(`${API}/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) { router.push("/"); return; }
        setOrder(data);
      })
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-zinc-900 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/30" };
  const date = new Date(order.createdAt).toLocaleDateString("es-PE", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Success banner (solo cuando viene del checkout) */}
        {isNew && (
          <div className="rounded-2xl px-6 py-5 flex items-start gap-4" style={{ background: "rgba(170,255,0,0.07)", border: "1px solid rgba(170,255,0,0.25)" }}>
            <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(170,255,0,0.15)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" style={{ color: "#aaff00" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold" style={{ color: "#aaff00" }}>Pedido realizado con éxito</p>
              <p className="text-zinc-400 text-sm mt-1">
                Te contactaremos pronto para coordinar la entrega.
              </p>
            </div>
          </div>
        )}

        {/* Order header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-zinc-500 text-sm">Pedido #{order.id}</p>
              <p className="text-zinc-400 text-xs mt-1">{date}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Shipping info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-white font-semibold text-sm">Datos de entrega</h2>
            <div className="space-y-1.5 text-sm">
              <p className="text-zinc-300">{order.shipping.fullName}</p>
              <p className="text-zinc-500">{order.shipping.phone}</p>
              <p className="text-zinc-400">{order.shipping.address}</p>
              <p className="text-zinc-400">{order.shipping.district}, {order.shipping.city}</p>
              {order.shipping.notes && (
                <p className="text-zinc-500 italic mt-2">"{order.shipping.notes}"</p>
              )}
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-white font-semibold text-sm">Pago</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Método</span>
                <span className="text-zinc-300">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Estado</span>
                <span style={{ color: order.paymentStatus === "PAID" ? "#aaff00" : "#facc15" }}>
                  {order.paymentStatus === "PAID" ? "Pagado" : "Pendiente"}
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-2">
                <span className="text-zinc-400 font-medium">Total</span>
                <span className="text-white font-semibold">Bs. {order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-white font-semibold text-sm">Productos ({order.items.reduce((s, i) => s + i.quantity, 0)})</h2>

          <div className="divide-y divide-zinc-800">
            {order.items.map((item) => (
              <div key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <Link href={`/productos/${item.product.slug}`} className="shrink-0">
                  <div className="w-16 h-16 bg-zinc-800 rounded-xl overflow-hidden relative">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-contain p-1.5"

                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">?</div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/productos/${item.product.slug}`}>
                    <p className="text-zinc-300 text-sm hover:text-white transition-colors line-clamp-2">{item.product.name}</p>
                  </Link>
                  <p className="text-zinc-500 text-xs mt-1">
                    {item.quantity} x Bs. {item.price}
                  </p>
                </div>
                <p className="text-white text-sm font-semibold shrink-0">Bs. {item.subtotal}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-4 flex justify-between text-white font-semibold">
            <span>Total</span>
            <span>Bs. {order.total}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/pedidos"
            className="flex-1 text-center py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-full transition-colors text-sm"
          >
            Mis pedidos
          </Link>
          <Link
            href="/productos"
            className="flex-1 text-center font-semibold py-3 rounded-full transition-all text-sm"
            style={{ background: "linear-gradient(135deg, #aaff00, #00ff44)", color: "#000" }}
          >
            Seguir comprando
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function PedidoPage() {
  return (
    <Suspense>
      <PedidoContent />
    </Suspense>
  );
}
