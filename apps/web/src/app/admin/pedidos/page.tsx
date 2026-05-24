"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "PENDING",   label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "SHIPPED",   label: "En camino" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];

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
  total: string;
  paymentMethod: string;
  user: { name: string; email: string };
  items: { quantity: number }[];
  createdAt: string;
};

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchOrders = useCallback(async (p = 1) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/orders/admin/all?page=${p}&limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.data);
        setMeta(data.meta);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(page); }, [fetchOrders, page]);

  async function changeStatus(orderId: number, status: string) {
    const token = localStorage.getItem("token");
    if (!token) return;
    setUpdating(orderId);
    try {
      const res = await fetch(`${API}/orders/admin/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      }
    } finally {
      setUpdating(null);
    }
  }

  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Pedidos</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{meta.total} en total</p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === opt.value
                  ? "bg-green-500/15 text-green-400 border-green-500/30"
                  : "text-zinc-400 border-zinc-700 hover:border-zinc-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4].map((i) => <div key={i} className="h-14 bg-zinc-800 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-zinc-500 text-sm p-6">No hay pedidos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3">#</th>
                  <th className="text-left px-4 py-3">Cliente</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Fecha</th>
                  <th className="text-center px-4 py-3 hidden sm:table-cell">Items</th>
                  <th className="text-right px-4 py-3">Total</th>
                  <th className="text-center px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((order) => {
                  const s = STATUS_LABELS[order.status] ?? { label: order.status, color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/30" };
                  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
                  const date = new Date(order.createdAt).toLocaleDateString("es-PE", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                  return (
                    <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/pedidos/${order.id}`} className="text-white font-medium text-sm hover:text-green-400 transition-colors">
                          #{order.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-zinc-300 text-sm">{order.user?.name ?? "—"}</p>
                        <p className="text-zinc-600 text-xs">{order.user?.email ?? ""}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-zinc-500 text-sm">{date}</span>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className="text-zinc-400 text-sm">{totalItems}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-white font-semibold text-sm">S/ {order.total}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {updating === order.id ? (
                          <span className="text-zinc-500 text-xs">...</span>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => changeStatus(order.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full border bg-transparent cursor-pointer focus:outline-none transition-colors ${s.color}`}
                          >
                            {STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-40 text-sm transition-colors"
          >
            Anterior
          </button>
          <span className="text-zinc-500 text-sm">{page} / {meta.totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
            className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-40 text-sm transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
