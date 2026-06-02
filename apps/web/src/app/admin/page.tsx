"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

type Stats = {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCategories: number;
  recentOrders: {
    id: number;
    status: string;
    total: string;
    user: { name: string; email: string };
    createdAt: string;
  }[];
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pendiente",  color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  CONFIRMED: { label: "Confirmado", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  SHIPPED:   { label: "En camino",  color: "text-purple-400 bg-purple-400/10 border-purple-400/30" },
  DELIVERED: { label: "Entregado",  color: "text-amber-400 bg-amber-400/10 border-amber-400/30" },
  CANCELLED: { label: "Cancelado",  color: "text-red-400 bg-red-400/10 border-red-400/30" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    Promise.all([
      fetch(`${API}/orders/admin/all?limit=5`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`${API}/products/admin/all?limit=1`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`${API}/categories/admin/all`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([ordersRes, productsRes, categories]) => {
        const orders = ordersRes.data ?? [];
        const pending = orders.filter((o: any) => o.status === "PENDING").length;
        setStats({
          totalOrders: ordersRes.meta?.total ?? 0,
          pendingOrders: pending,
          totalProducts: productsRes.meta?.total ?? 0,
          totalCategories: Array.isArray(categories) ? categories.length : 0,
          recentOrders: orders,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: "Total pedidos", value: stats.totalOrders, href: "/admin/pedidos", color: "text-blue-400" },
        { label: "Pedidos pendientes", value: stats.pendingOrders, href: "/admin/pedidos", color: "text-yellow-400" },
        { label: "Productos", value: stats.totalProducts, href: "/admin/productos", color: "text-amber-400" },
        { label: "Categorías", value: stats.totalCategories, href: "/admin/categorias", color: "text-purple-400" },
      ]
    : [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-white text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800" />
            ))
          : statCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
              >
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-zinc-500 text-sm mt-1">{card.label}</p>
              </Link>
            ))}
      </div>

      {/* Recent orders */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-white font-semibold">Pedidos recientes</h2>
          <Link href="/admin/pedidos" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
            Ver todos
          </Link>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-zinc-800 rounded-xl animate-pulse" />)}
          </div>
        ) : !stats?.recentOrders.length ? (
          <p className="text-zinc-500 text-sm p-5">No hay pedidos aún.</p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {stats.recentOrders.map((order) => {
              const s = STATUS_LABELS[order.status] ?? { label: order.status, color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/30" };
              const date = new Date(order.createdAt).toLocaleDateString("es-PE", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
              return (
                <Link
                  key={order.id}
                  href={`/admin/pedidos/${order.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/50 transition-colors"
                >
                  <div>
                    <span className="text-white text-sm font-medium">#{order.id}</span>
                    <span className="text-zinc-500 text-xs ml-2">{order.user?.name ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-xs hidden sm:block">{date}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${s.color}`}>{s.label}</span>
                    <span className="text-white text-sm font-medium">Bs. {order.total}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/productos/nuevo", label: "Agregar producto", color: "bg-amber-500 hover:bg-amber-400" },
          { href: "/admin/categorias/nueva", label: "Agregar categoría", color: "bg-zinc-700 hover:bg-zinc-600" },
          { href: "/", label: "Ver tienda", color: "bg-zinc-800 hover:bg-zinc-700" },
        ].map((btn) => (
          <Link
            key={btn.href}
            href={btn.href}
            className={`${btn.color} text-white text-sm font-medium py-3 rounded-full text-center transition-colors`}
          >
            {btn.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
