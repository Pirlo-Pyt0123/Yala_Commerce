import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/carrito", "/checkout", "/perfil", "/pedidos"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (PROTECTED.some((r) => pathname.startsWith(r)) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/carrito/:path*", "/checkout/:path*", "/perfil/:path*", "/pedidos/:path*"],
};
