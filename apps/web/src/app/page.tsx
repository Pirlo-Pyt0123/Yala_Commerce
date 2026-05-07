import StatusCard from "@/components/StatusCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            🍷 Licorería
          </h1>
          <p className="text-zinc-400 text-sm">
            E-commerce — entorno de desarrollo
          </p>
        </div>

        {/* Status cards */}
        <div className="space-y-3">
          <StatusCard
            label="Frontend"
            url="http://localhost:3000"
            status="ok"
            detail="Next.js 16 · Turbopack · Puerto 3000"
          />
          <StatusCard
            label="Backend API"
            url={`${process.env.NEXT_PUBLIC_API_URL}/health`}
            status="checking"
            detail="NestJS 11 · Puerto 3001"
          />
        </div>

        {/* Stack */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            Stack
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm text-zinc-300">
            {[
              ["Frontend", "Next.js + Tailwind"],
              ["Backend", "NestJS + Prisma 7"],
              ["Base de datos", "PostgreSQL"],
              ["Monorepo", "pnpm workspaces"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="text-zinc-500 text-xs">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}