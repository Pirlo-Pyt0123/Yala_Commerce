import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="text-white font-bold text-xl tracking-tight">
              Licorería
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Tu tienda de licores y bebidas premium con entrega a domicilio.
            </p>
          </div>

          {/* Tienda */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold">Tienda</h4>
            <ul className="space-y-2">
              {[
                { href: "/productos", label: "Catálogo" },
                { href: "/productos?category=whisky", label: "Whisky" },
                { href: "/productos?category=vinos", label: "Vinos" },
                { href: "/productos?category=ron", label: "Ron" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mi cuenta */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold">Mi cuenta</h4>
            <ul className="space-y-2">
              {[
                { href: "/login", label: "Iniciar sesión" },
                { href: "/register", label: "Registrarse" },
                { href: "/carrito", label: "Mi carrito" },
                { href: "/pedidos", label: "Mis pedidos" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold">Contacto</h4>
            <ul className="space-y-2 text-zinc-500 text-sm">
              <li>Lima, Perú</li>
              <li>
                <a href="tel:+51999999999" className="hover:text-zinc-300 transition-colors">
                  +51 999 999 999
                </a>
              </li>
              <li>
                <a href="mailto:contacto@licoreria.com" className="hover:text-zinc-300 transition-colors">
                  contacto@licoreria.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-600 text-xs">
            © {year} Licorería — Todos los derechos reservados
          </p>
          <p className="text-zinc-700 text-xs">
            Venta exclusiva para mayores de 18 años
          </p>
        </div>
      </div>
    </footer>
  );
}
