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
                src="/logoLico.webp"
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
                href="https://www.tiktok.com/@yalalicoreria"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z" />
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
                <a href="mailto:elmerve77@gmail.com" className="hover:text-zinc-300 transition-colors">
                  elmerve77@gmail.com
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
