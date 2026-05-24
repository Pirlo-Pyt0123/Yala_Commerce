"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API = process.env.NEXT_PUBLIC_API_URL;

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pendiente",  color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  CONFIRMED: { label: "Confirmado", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  SHIPPED:   { label: "En camino",  color: "text-purple-400 bg-purple-400/10 border-purple-400/30" },
  DELIVERED: { label: "Entregado",  color: "text-green-400 bg-green-400/10 border-green-400/30" },
  CANCELLED: { label: "Cancelado",  color: "text-red-400 bg-red-400/10 border-red-400/30" },
};

type Order = {
  id: number;
  status: string;
  paymentMethod: string;
  total: string;
  items: { quantity: number }[];
  createdAt: string;
};

export default function PedidosPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login?from=/pedidos"); return; }

    fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-zinc-900 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-white text-3xl font-bold mb-8">Mis pedidos</h1>

        {orders.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-zinc-500 text-lg">Aún no tienes pedidos</p>
            <Link
              href="/productos"
              className="inline-block bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/30" };
              const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
              const date = new Date(order.createdAt).toLocaleDateString("es-PE", {
                year: "numeric", month: "short", day: "numeric",
              });

              return (
                <Link
                  key={order.id}
                  href={`/pedidos/${order.id}`}
                  className="flex items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-colors group"
                >
                  <div className="space-y-1">
                    <p className="text-white font-medium text-sm group-hover:text-green-400 transition-colors">
                      Pedido #{order.id}
                    </p>
                    <p className="text-zinc-500 text-xs">
                      {date} · {totalItems} {totalItems === 1 ? "producto" : "productos"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className="text-white font-semibold text-sm">S/ {order.total}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-600 text-sm mt-10">
        © {new Date().getFullYear()} Licorería — Todos los derechos reservados
      </footer>
    </div>
  );
}
