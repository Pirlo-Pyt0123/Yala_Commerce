import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora nuestro catálogo de whiskys, vinos, cervezas, rones, piscos y vodkas con entrega a domicilio en Bolivia.",
};

export default function ProductosLayout({ children }: { children: React.ReactNode }) {
  return children;
}