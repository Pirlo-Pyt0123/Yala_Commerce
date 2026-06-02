"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pendiente",  color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  CONFIRMED: { label: "Confirmado", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  SHIPPED:   { label: "En camino",  color: "text-purple-400 bg-purple-400/10 border-purple-400/30" },
  DELIVERED: { label: "Entregado",  color: "text-amber-400 bg-amber-400/10 border-amber-400/30" },
  CANCELLED: { label: "Cancelado",  color: "text-red-400 bg-red-400/10 border-red-400/30" },
};
const STATUS_LABEL_MAP: Record<string, string> = {
  PENDING: "Pendiente", CONFIRMED: "Confirmado", SHIPPED: "En camino", DELIVERED: "Entregado", CANCELLED: "Cancelado",
};

type Order = {
  id: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: string;
  shipping: { fullName: string; phone: string; address: string; district: string; city: string; notes: string | null };
  items: { productId: number; quantity: number; price: string; subtotal: string; product: { name: string; slug: string; imageUrl: string | null } }[];
  user?: { id: number; name: string; email: string };
  createdAt: string;
};

export default function AdminPedidoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    // Fetch all orders and find this one (admin endpoint returns all)
    fetch(`${API}/orders/admin/all?limit=999`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        const found = data.data?.find((o: Order) => o.id === Number(id));
        if (!found) { router.push("/admin/pedidos"); return; }
        setOrder(found);
        setStatus(found.status);
      })
      .catch(() => router.push("/admin/pedidos"))
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handleStatusChange() {
    const token = localStorage.getItem("token");
    if (!token || !order || status === order.status) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/orders/admin/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) setOrder((prev) => prev ? { ...prev, status } : prev);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        {[1,2,3].map((i) => <div key={i} className="h-24 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800" />)}
      </div>
    );
  }
  if (!order) return null;

  const s = STATUS_LABELS[order.status] ?? { label: order.status, color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/30" };
  const date = new Date(order.createdAt).toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/admin/pedidos" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
          ← Volver a pedidos
        </Link>
        <div className="flex items-start justify-between mt-2 gap-4">
          <div>
            <h1 className="text-white text-2xl font-bold">Pedido #{order.id}</h1>
            <p className="text-zinc-500 text-sm">{date}</p>
          </div>
          <span className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${s.color}`}>
            {s.label}
          </span>
        </div>
      </div>

      {/* Status changer */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-white font-semibold text-sm">Cambiar estado</h2>
        <div className="flex gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{STATUS_LABEL_MAP[s]}</option>
            ))}
          </select>
          <button
            onClick={handleStatusChange}
            disabled={saving || status === order.status}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-colors"
          >
            {saving ? "..." : "Actualizar"}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Cliente */}
        {order.user && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <h2 className="text-white font-semibold text-sm">Cliente</h2>
            <p className="text-zinc-300 text-sm">{order.user.name}</p>
            <p className="text-zinc-500 text-sm">{order.user.email}</p>
          </div>
        )}

        {/* Envío */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2">
          <h2 className="text-white font-semibold text-sm">Entrega</h2>
          <p className="text-zinc-300 text-sm">{order.shipping.fullName}</p>
          <p className="text-zinc-500 text-sm">{order.shipping.phone}</p>
          <p className="text-zinc-400 text-sm">{order.shipping.address}</p>
          <p className="text-zinc-400 text-sm">{order.shipping.district}, {order.shipping.city}</p>
          {order.shipping.notes && <p className="text-zinc-500 text-xs italic">"{order.shipping.notes}"</p>}
        </div>
      </div>

      {/* Items */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm">Productos</h2>
        <div className="divide-y divide-zinc-800">
          {order.items.map((item) => (
            <div key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <div className="w-14 h-14 bg-zinc-800 rounded-xl overflow-hidden relative shrink-0">
                {item.product.imageUrl ? (
                  <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-contain p-1.5" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">?</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-zinc-300 text-sm line-clamp-2">{item.product.name}</p>
                <p className="text-zinc-500 text-xs mt-1">{item.quantity} x Bs. {item.price}</p>
              </div>
              <p className="text-white font-semibold text-sm shrink-0">Bs. {item.subtotal}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-800 pt-4 flex justify-between text-white font-bold">
          <span>Total</span>
          <span>Bs. {order.total}</span>
        </div>
      </div>
    </div>
  );
}
