"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload.email);
        setRole(payload.role);
      } catch {
        setUser(null);
        setRole(null);
      }
      fetchCartCount(token);
    } else {
      setUser(null);
      setRole(null);
      setCartCount(0);
    }
  }, [pathname]);

  async function fetchCartCount(token: string) {
    try {
      const res = await fetch(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCartCount(data.totalItems ?? 0);
      }
    } catch {
      setCartCount(0);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("remember");
    document.cookie = "token=; path=/; max-age=0";
    setUser(null);
    setRole(null);
    setCartCount(0);
    router.push("/login");
  }

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/productos", label: "Catálogo" },
    ...(user ? [{ href: "/pedidos", label: "Mis pedidos" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/60">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center">
          <Image
            src="/yalaSPPG.png"
            alt="Yala"
            width={90}
            height={36}
            style={{ width: "auto", height: "36px" }}
            priority
          />
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === l.href
                  ? "text-white bg-zinc-800 font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Acciones desktop */}
        <div className="hidden md:flex items-center gap-3">

          {/* Admin */}
          {role === "admin" && (
            <Link
              href="/admin"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 border border-amber-400/30 hover:border-amber-400/60 px-3 py-1.5 rounded-lg transition-colors"
            >
              Admin
            </Link>
          )}

          {/* Carrito */}
          {user && (
            <Link href="/carrito" className="relative text-zinc-400 hover:text-white transition-colors p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3 border-l border-zinc-800 pl-3">
              <span className="text-zinc-500 text-xs truncate max-w-[120px]">{user}</span>
              <button
                onClick={logout}
                className="text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-zinc-800 pl-3">
              <Link
                href="/login"
                className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="text-sm bg-amber-500 hover:bg-amber-400 text-white font-medium px-4 py-1.5 rounded-full transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: carrito + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <Link href="/carrito" className="relative text-zinc-400 hover:text-white transition-colors p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}
          <button
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-800/60 bg-zinc-950 px-4 py-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === l.href
                  ? "text-white bg-zinc-800 font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              {l.label}
            </Link>
          ))}

          {role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-amber-400 hover:bg-zinc-900 transition-colors"
            >
              Panel Admin
            </Link>
          )}

          <div className="pt-3 border-t border-zinc-800 space-y-1">
            {user ? (
              <>
                <p className="px-3 py-1 text-xs text-zinc-600 truncate">{user}</p>
                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-amber-400 hover:text-amber-300 hover:bg-zinc-900 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
