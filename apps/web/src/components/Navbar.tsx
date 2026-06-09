"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const prevTokenRef = useRef<string | null>(null);

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
      if (token !== prevTokenRef.current) {
        prevTokenRef.current = token;
        fetchCartCount(token);
      }
    } else {
      prevTokenRef.current = null;
      setUser(null);
      setRole(null);
      setCartCount(0);
    }
  }, [pathname]);

  useEffect(() => {
    function onCartUpdated() {
      const token = localStorage.getItem("token");
      if (token) fetchCartCount(token);
    }
    window.addEventListener("cart-updated", onCartUpdated);
    return () => window.removeEventListener("cart-updated", onCartUpdated);
  }, []);

  async function fetchCartCount(token: string) {
    try {
      const res = await fetch(`${API}/cart`, { headers: { Authorization: `Bearer ${token}` } });
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

  const linkCls = (href: string, exact = false) => {
    const active = exact ? pathname === href : pathname === href;
    return `px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide uppercase transition-all whitespace-nowrap ${
      active
        ? "bg-[#aaff00]/10 text-[#aaff00] border border-[#aaff00]/30 shadow-[0_0_10px_rgba(170,255,0,0.2)]"
        : "text-zinc-400 hover:text-[#aaff00] hover:bg-[#aaff00]/10 border border-transparent hover:border-[#aaff00]/30 hover:shadow-[0_0_10px_rgba(170,255,0,0.2)]"
    }`;
  };

  return (
    <header className="sticky top-0 z-50">

      {/* ── Desktop ───────────────────────────────────────────── */}
      <div className="hidden md:block h-16 pointer-events-none">

        {/* Pill centrado con logo en el medio */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center bg-zinc-900/85 backdrop-blur-md border border-zinc-800/70 rounded-lg shadow-xl shadow-black/30 px-1.5 py-1.5">

          {/* Links izquierda */}
          <Link href="/" className={linkCls("/", true)}>Inicio</Link>
          <Link href="/productos" className={linkCls("/productos")}>Catálogo</Link>

          {/* Logo centrado */}
          <Link href="/" className="mx-3 flex items-center">
            <Image
              src="/logoLico.webp"
              alt="Yala"
              width={72}
              height={28}
              style={{ width: "auto", height: "26px" }}
              priority
            />
          </Link>

          {/* Links derecha */}
          {user && (
            <Link href="/pedidos" className={linkCls("/pedidos")}>Mis pedidos</Link>
          )}
          {role === "admin" && (
            <Link href="/admin" className="px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide uppercase text-[#aaff00] hover:text-[#aaff00] hover:bg-[#aaff00]/10 border border-transparent hover:border-[#aaff00]/30 hover:shadow-[0_0_10px_rgba(170,255,0,0.2)] transition-all">
              Admin
            </Link>
          )}
          {user && (
            <Link href="/carrito" className="relative ml-1 p-2 text-zinc-400 hover:text-[#aaff00] rounded-lg hover:bg-[#aaff00]/10 border border-transparent hover:border-[#aaff00]/30 hover:shadow-[0_0_10px_rgba(170,255,0,0.2)] transition-all">
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-lg flex items-center justify-center leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Auth — derecha */}
        <div className="absolute top-3 right-6 pointer-events-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="text-zinc-500 text-xs truncate max-w-[130px]">{user}</span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 bg-zinc-900/80 backdrop-blur-md transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg text-xs font-medium tracking-wide uppercase text-[#aaff00] border border-[#aaff00]/40 bg-[#aaff00]/10 backdrop-blur-md hover:bg-[#aaff00]/20 hover:border-[#aaff00]/60 hover:shadow-[0_0_18px_rgba(170,255,0,0.35)] transition-all shadow-[0_0_12px_rgba(170,255,0,0.2)]"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {/* ── Mobile ────────────────────────────────────────────── */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/60">
        <Link href="/" className="flex items-center">
          <Image
            src="/logoLico.webp"
            alt="Yala"
            width={72}
            height={28}
            style={{ width: "auto", height: "26px" }}
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <Link href="/carrito" className="relative text-zinc-400 hover:text-white transition-colors p-1.5">
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-lg flex items-center justify-center leading-none">
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
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-800/60 bg-zinc-950 px-4 py-4 space-y-1">
          {[
            { href: "/", label: "Inicio" },
            { href: "/productos", label: "Catálogo" },
            ...(user ? [{ href: "/pedidos", label: "Mis pedidos" }] : []),
          ].map((l) => (
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
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-amber-400 hover:bg-zinc-900 transition-colors">
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
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors">
                  Iniciar sesión
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-amber-400 hover:text-amber-300 hover:bg-zinc-900 transition-colors">
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
