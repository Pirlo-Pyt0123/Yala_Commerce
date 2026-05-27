import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/carrito", "/checkout", "/perfil", "/pedidos"];
const ADMIN_PREFIX = "/admin";

function decodeToken(token: string): { role?: string } | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    const payload = decodeToken(token);
    if (payload?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (PROTECTED.some((r) => pathname.startsWith(r)) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/carrito/:path*",
    "/checkout/:path*",
    "/perfil/:path*",
    "/pedidos/:path*",
    "/admin/:path*",
  ],
};
