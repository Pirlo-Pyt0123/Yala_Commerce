import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por WhatsApp o encuéntranos en Facebook y TikTok. Yala, tu licorería en Bolivia.",
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "#aaff00" }}
        >
          Contacto
        </p>
        <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3">
          ¿Tienes alguna consulta?
        </h1>
        <p className="text-zinc-400 mb-12 max-w-xl mx-auto">
          Escríbenos por WhatsApp y te respondemos a la brevedad. También puedes
          encontrarnos en nuestras redes sociales.
        </p>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/59167652401"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-7 py-4 rounded-full font-semibold text-sm transition-all"
          style={{ background: "linear-gradient(135deg, #aaff00, #00ff44)", color: "#000" }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          Escribir por WhatsApp
        </a>

        {/* Info grid */}
        <div className="grid sm:grid-cols-3 gap-4 mt-16">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-1">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">Teléfono</p>
            <a href="tel:+59167652401" className="text-white text-sm hover:text-[#aaff00] transition-colors">
              +591 67 652 401
            </a>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-1">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">Correo</p>
            <a href="mailto:elmerve77@gmail.com" className="text-white text-sm hover:text-[#aaff00] transition-colors">
              elmerve77@gmail.com
            </a>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-1">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">Ubicación</p>
            <p className="text-white text-sm">Bolivia</p>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="mt-12">
          <p className="text-zinc-500 text-xs uppercase tracking-wide mb-4">Síguenos</p>
          <div className="flex items-center justify-center gap-5">
            <a
              href="https://www.facebook.com/share/g/18smJ7rVfo/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-zinc-400 hover:text-[#aaff00] transition-colors"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12Z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@yalalicoreria"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-zinc-400 hover:text-[#aaff00] transition-colors"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}