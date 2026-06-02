import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/yalaSPPG.png"
                alt="Yala"
                width={80}
                height={32}
                style={{ width: "auto", height: "32px" }}
              />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Tu tienda de licores y bebidas premium con entrega a domicilio en Bolivia.
            </p>
            {/* Redes sociales */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.facebook.com/share/g/18smJ7rVfo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12Z" />
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Tienda */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold">Tienda</h4>
            <ul className="space-y-2">
              {[
                { href: "/productos", label: "Catálogo" },
                { href: "/productos?category=whisky", label: "Whisky" },
                { href: "/productos?category=vino", label: "Vinos" },
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
              <li>Bolivia</li>
              <li>
                <a href="tel:+59167652401" className="hover:text-zinc-300 transition-colors">
                  +591 67 652 401
                </a>
              </li>
              <li>
                <a href="mailto:contacto@yala.com.bo" className="hover:text-zinc-300 transition-colors">
                  contacto@yala.com.bo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-600 text-xs">
            © {year} Yala — Todos los derechos reservados
          </p>
          <p className="text-zinc-700 text-xs">
            Venta exclusiva para mayores de 18 años
          </p>
        </div>
      </div>
    </footer>
  );
}
