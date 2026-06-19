import type { MetadataRoute } from "next";

const SITE_URL = "https://yala-commerce.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/carrito", "/checkout", "/pedidos"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}