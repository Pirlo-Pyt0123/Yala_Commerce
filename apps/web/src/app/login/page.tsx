"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Credenciales inválidas");
        return;
      }

      localStorage.setItem("token", data.token);
      if (remember) localStorage.setItem("remember", "true");

      const maxAge = remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
      document.cookie = `token=${data.token}; path=/; max-age=${maxAge}; SameSite=Lax`;

      router.push(from);
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/fondo_login.webp')" }}
    >
      <div className="w-full max-w-sm px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md border border-white/25 rounded-3xl p-8 space-y-5 shadow-2xl"
        >
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-white text-3xl font-bold tracking-tight">Login</h1>
            <p className="text-white/65 text-sm">
              Bienvenido de nuevo.
            </p>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Nombre de usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/15 border border-white/25 rounded-xl px-4 py-3 pr-11 text-white placeholder-white/50 text-sm outline-none focus:border-white/60 transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </span>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/15 border border-white/25 rounded-xl px-4 py-3 pr-11 text-white placeholder-white/50 text-sm outline-none focus:border-white/60 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <div
              onClick={() => setRemember(!remember)}
              className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                remember ? "bg-amber-500 border-amber-500" : "border-white/40 bg-white/10"
              }`}
            >
              {remember && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-white/70 text-sm select-none">Recuerdame</span>
          </label>

          {/* Error */}
          {error && (
            <p className="text-red-300 text-sm text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors text-sm"
          >
            {loading ? "Ingresando..." : "Login"}
          </button>

          {/* Sign up link */}
          <p className="text-center text-white/60 text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-white font-semibold hover:underline">
              Registrate
            </Link>
          </p>

          {/* Volver al inicio */}
          <Link
            href="/"
            className="block text-center text-white/40 hover:text-white/70 text-xs transition-colors"
          >
            ← Volver al inicio
          </Link>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}