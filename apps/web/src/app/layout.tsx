import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AgeGate from "@/components/AgeGate";
import { DrawerProvider } from "@/context/DrawerContext";
import ProductDrawer from "@/components/ProductDrawer";

const GA_ID = "G-9BLLFJ5VS7";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://yala-commerce.vercel.app";
const SITE_DESCRIPTION =
  "Compra whiskys, vinos, cervezas, rones, piscos y vodkas en Bolivia con entrega a domicilio. Pago con QR, PayPal o contra entrega.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yala | Tu tienda de licores en Bolivia",
    template: "%s | Yala",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "licorería Bolivia",
    "comprar licor online",
    "whisky Bolivia",
    "vinos Bolivia",
    "delivery de licores",
    "Yala licorería",
  ],
  icons: {
    icon: "/logoLico.webp",
    apple: "/logoLico.webp",
  },
  openGraph: {
    type: "website",
    locale: "es_BO",
    url: SITE_URL,
    siteName: "Yala",
    title: "Yala | Tu tienda de licores en Bolivia",
    description: SITE_DESCRIPTION,
    images: [{ url: "/logoLico.webp" }],
  },
  twitter: {
    card: "summary",
    title: "Yala | Tu tienda de licores en Bolivia",
    description: SITE_DESCRIPTION,
    images: ["/logoLico.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
<Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <Script id="tawk-to" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6a30e1f66ad5c61d5925f76c/1jr7f5aok';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <DrawerProvider>
          <AgeGate />
          {children}
          <ProductDrawer />
        </DrawerProvider>
      </body>
    </html>
  );
}
