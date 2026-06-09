"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const API = process.env.NEXT_PUBLIC_API_URL;
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

type CartProduct = { id: number; name: string; price: string; imageUrl: string | null; stock: number };
type CartItem = { id: number; productId: number; quantity: number; product: CartProduct };
type Cart = { id: number; items: CartItem[]; totalItems: number; subtotal: string };

type PaymentMethod = "COD" | "PAYPAL" | "CARD" | "QR";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; description: string; icon: React.ReactNode; available: boolean }[] = [
  {
    value: "COD",
    label: "Pago contra entrega",
    description: "Paga en efectivo cuando recibas tu pedido",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
    available: true,
  },
  {
    value: "PAYPAL",
    label: "PayPal",
    description: "Paga de forma segura con tu cuenta PayPal",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.99l-.318 2.032h2.553c.46 0 .85-.334.922-.788l.038-.196.729-4.617.047-.254a.923.923 0 0 1 .912-.788h.574c3.723 0 6.636-1.512 7.485-5.886.356-1.827.18-3.354-.633-4.423z"/>
      </svg>
    ),
    available: true,
  },
  {
    value: "QR",
    label: "Pago por QR",
    description: "Escanea el QR con tu app bancaria y paga al instante",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5ZM6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 18.75h.75v.75h-.75v-.75ZM18.75 13.5h.75v.75h-.75v-.75ZM18.75 18.75h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
      </svg>
    ),
    available: true,
  },
];

type ShippingForm = {
  fullName: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  notes: string;
};

function isFormValid(form: ShippingForm): string | null {
  if (!form.fullName.trim()) return "El nombre es requerido";
  if (!/^\d{7,15}$/.test(form.phone)) return "El teléfono debe tener entre 7 y 15 dígitos";
  if (form.address.trim().length < 5) return "La dirección debe tener al menos 5 caracteres";
  if (!form.district.trim()) return "El distrito es requerido";
  if (!form.city.trim()) return "La ciudad es requerida";
  return null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [showQrModal, setShowQrModal] = useState(false);

  const [form, setForm] = useState<ShippingForm>({
    fullName: "",
    phone: "",
    address: "",
    district: "",
    city: "Sucre",
    notes: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login?from=/checkout"); return; }

    fetch(`${API}/cart`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data || data.items.length === 0) {
          router.push("/carrito");
          return;
        }
        setCart(data);
      })
      .catch(() => router.push("/carrito"))
      .finally(() => setLoading(false));
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (paymentMethod === "PAYPAL") return;


    const validationError = isFormValid(form);
    if (validationError) { setError(validationError); return; }
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) { router.push("/login?from=/checkout"); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, paymentMethod }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? "Error al procesar el pedido. Intenta de nuevo.");
        return;
      }

      const order = await res.json();
      router.push(`/pedidos/${order.id}?nuevo=1`);
    } catch {
      setError("Error de conexión. Verifica tu internet e intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 bg-zinc-900 rounded-xl animate-pulse" />)}
          </div>
          <div className="h-64 bg-zinc-900 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!cart) return null;

  const subtotal = Number(cart.subtotal);
  const shipping: number = 0;
  const total = subtotal + shipping;

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD", intent: "capture" }}>
      <div className="min-h-screen bg-zinc-950">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 py-10">
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/carrito" className="hover:text-zinc-300 transition-colors">Carrito</Link>
            <span>/</span>
            <span className="text-zinc-300">Checkout</span>
          </nav>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left: form */}
              <div className="md:col-span-2 space-y-8">

                {/* Shipping section */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                  <h2 className="text-white font-semibold text-lg">Datos de entrega</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 text-sm">Nombre completo *</label>
                      <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Juan Pérez"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#aaff00]/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 text-sm">Teléfono *</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="987654321"
                        type="tel"
                        pattern="\d{7,15}"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#aaff00]/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-sm">Dirección *</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      minLength={5}
                      placeholder="Av. Example 123, Dpto. 4B"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#aaff00]/50 transition-colors"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 text-sm">Distrito *</label>
                      <input
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        required
                        placeholder="Chuquisaca"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#aaff00]/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 text-sm">Ciudad *</label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        placeholder="Sucre"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#aaff00]/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-sm">Notas adicionales (opcional)</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Indicaciones para la entrega, referencia, etc."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#aaff00]/50 transition-colors resize-none"
                    />
                  </div>
                </section>

                {/* Payment section */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                  <h2 className="text-white font-semibold text-lg">Método de pago</h2>

                  <div className="space-y-3">
                    {PAYMENT_OPTIONS.map((opt) => {
                      const selected = paymentMethod === opt.value && opt.available;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          disabled={!opt.available}
                          onClick={() => opt.available && setPaymentMethod(opt.value)}
                          className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                            !opt.available
                              ? "border-zinc-800 opacity-40 cursor-not-allowed"
                              : selected
                              ? "border-[#aaff00]/50 bg-[#aaff00]/5"
                              : "border-zinc-700 hover:border-zinc-600"
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                            selected ? "border-[#aaff00]/60" : "border-zinc-600"
                          }`}>
                            {selected && <div className="w-2 h-2 rounded-full bg-[#aaff00]" />}
                          </div>

                          <div className={`shrink-0 ${selected ? "text-[#aaff00]" : "text-zinc-500"}`}>
                            {opt.icon}
                          </div>

                          <div>
                            <p className={`text-sm font-medium ${selected ? "text-white" : "text-zinc-300"}`}>
                              {opt.label}
                            </p>
                            <p className="text-zinc-500 text-xs mt-0.5">{opt.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* PayPal note */}
                  {paymentMethod === "PAYPAL" && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-blue-300 text-xs">
                      El cobro se realizará en USD al tipo de cambio del día. Completa los datos de entrega y luego confirma con el botón de PayPal.
                    </div>
                  )}

                  {/* QR note */}
                  {paymentMethod === "QR" && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-300 text-xs">
                      Escanea el QR con tu app bancaria, realiza el pago y luego haz click en "Ya pagué". Confirmaremos tu pedido una vez verifiquemos el pago.
                    </div>
                  )}
                </section>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}
              </div>

              {/* Right: order summary */}
              <div className="space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 sticky top-20">
                  <h2 className="text-white font-semibold">Resumen del pedido</h2>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden relative shrink-0">
                          {item.product.imageUrl ? (
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">?</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-zinc-300 text-xs line-clamp-2">{item.product.name}</p>
                          <p className="text-zinc-500 text-xs">x{item.quantity}</p>
                        </div>
                        <p className="text-white text-xs font-medium shrink-0">
                          Bs. {(Number(item.product.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-zinc-800 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal</span>
                      <span>Bs. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Envío</span>
                      <span style={{ color: "#aaff00" }}>{shipping === 0 ? "Por confirmar" : `Bs. ${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-white font-semibold pt-1 border-t border-zinc-800">
                      <span>Total</span>
                      <span>Bs. {total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* COD button */}
                  {paymentMethod === "COD" && (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full disabled:opacity-60 disabled:cursor-not-allowed font-semibold py-3 rounded-full transition-all text-sm"
                      style={{ background: "linear-gradient(135deg, #aaff00, #00ff44)", color: "#000" }}
                    >
                      {submitting ? "Procesando..." : "Confirmar pedido"}
                    </button>
                  )}


                  {/* QR payment */}
                  {paymentMethod === "QR" && (
                    <div className="space-y-4">
                      <div className="bg-zinc-800 rounded-2xl p-4 flex flex-col items-center gap-3">
                        <p className="text-zinc-400 text-xs text-center">Escanea con tu app bancaria</p>
                        <button type="button" onClick={() => setShowQrModal(true)} className="bg-white rounded-xl p-2 hover:opacity-80 transition-opacity cursor-zoom-in">
                          <Image src="/QR-yala.jpeg" alt="QR de pago" width={180} height={180} className="rounded-lg" />
                        </button>
                        <p className="text-zinc-500 text-xs">Toca el QR para agrandarlo</p>
                        <p className="text-white font-bold text-lg">Bs. {total.toFixed(2)}</p>
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors text-sm"
                      >
                        {submitting ? "Procesando..." : "Ya pagué, confirmar pedido"}
                      </button>
                    </div>
                  )}

                  {/* PayPal buttons */}
                  {paymentMethod === "PAYPAL" && (
                    <div className="rounded-xl overflow-hidden">
                      <PayPalButtons
                        style={{ layout: "horizontal", color: "blue", shape: "rect", label: "pay", height: 45 }}
                        onClick={(_data, actions) => {
                          const validationError = isFormValid(form);
                          if (validationError) {
                            setError(validationError);
                            return actions.reject();
                          }
                          setError(null);
                          return actions.resolve();
                        }}
                        createOrder={async () => {
                          const token = localStorage.getItem("token");
                          const res = await fetch(`${API}/orders/paypal/create-payment`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(form),
                          });
                          if (!res.ok) {
                            const data = await res.json().catch(() => ({}));
                            throw new Error(data?.message ?? "Error creando el pago");
                          }
                          const data = await res.json();
                          return data.paypalOrderId;
                        }}
                        onApprove={async (data) => {
                          setSubmitting(true);
                          setError(null);
                          try {
                            const token = localStorage.getItem("token");
                            const res = await fetch(`${API}/orders/paypal/capture-payment`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ ...form, paypalOrderId: data.orderID }),
                            });
                            if (!res.ok) {
                              const errData = await res.json().catch(() => ({}));
                              setError(errData?.message ?? "Error confirmando el pago.");
                              return;
                            }
                            const order = await res.json();
                            router.push(`/pedidos/${order.id}?nuevo=1`);
                          } catch {
                            setError("Error de conexión al confirmar el pago.");
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                        onError={() => setError("Error procesando el pago con PayPal. Intenta de nuevo.")}
                      />
                    </div>
                  )}

                  <Link
                    href="/carrito"
                    className="block w-full text-center border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-medium py-3 rounded-full transition-colors text-sm"
                  >
                    Volver al carrito
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>

        <Footer />
      </div>

      {/* Modal QR */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-4 flex flex-col items-center gap-3 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-zinc-700 text-sm font-medium">Escanea para pagar</p>
            <Image src="/QR-yala.jpeg" alt="QR de pago" width={300} height={300} className="rounded-xl" />
            <p className="text-zinc-900 font-bold text-xl">Bs. {total.toFixed(2)}</p>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="text-zinc-500 text-sm hover:text-zinc-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </PayPalScriptProvider>
  );
}
