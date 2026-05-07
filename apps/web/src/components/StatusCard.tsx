"use client";

import { useEffect, useState } from "react";

type Props = {
  label: string;
  url: string;
  status: "ok" | "checking" | "error";
  detail: string;
};

export default function StatusCard({ label, url, status: initialStatus, detail }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (initialStatus !== "checking") return;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setStatus("ok");
        if (data.counts) {
          const { users, products, categories } = data.counts;
          setInfo(`${users} users · ${products} productos · ${categories} categorías`);
        }
      })
      .catch(() => setStatus("error"));
  }, [url, initialStatus]);

  const dot: Record<typeof status, string> = {
    ok:       "bg-emerald-500",
    checking: "bg-yellow-400 animate-pulse",
    error:    "bg-red-500",
  };

  const label2: Record<typeof status, string> = {
    ok:       "online",
    checking: "conectando...",
    error:    "sin conexión",
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
      <div className="space-y-0.5">
        <p className="text-white font-medium text-sm">{label}</p>
        <p className="text-zinc-500 text-xs">{info ?? detail}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 text-xs">{label2[status]}</span>
        <span className={`w-2.5 h-2.5 rounded-full ${dot[status]}`} />
      </div>
    </div>
  );
}