import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/login", "/api/auth"]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r))
  if (isPublic) return NextResponse.next()

  const token = await getToken({ req, secret: process.env.AUTH_SECRET })

  if (!token) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = token.role as string | undefined

  if (role === "admin") {
    return NextResponse.next()
  }

  const rolRoutes: Record<string, string[]> = {
    supervisor: ["/", "/lotes", "/produccion", "/packing", "/despacho",
      "/alimentacion", "/agua", "/ambiental", "/iluminacion", "/sanidad",
      "/bioseguridad", "/calidad", "/inventario", "/graficos", "/alertas"],
    galponero: ["/", "/produccion", "/agua", "/ambiental", "/iluminacion"],
    veterinario: ["/sanidad", "/bioseguridad", "/lotes", "/graficos"],
    bodeguero: ["/packing", "/despacho", "/inventario", "/fabrica-alimento"],
  }

  const allowed = rolRoutes[role ?? ""]
  if (!allowed) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const canAccess = allowed.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"))
  if (!canAccess) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
}
