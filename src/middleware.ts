import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/login", "/api/auth"]

const rolRoutes: Record<string, string[]> = {
  admin: ["/", "/lotes", "/produccion", "/packing", "/despacho",
    "/alimentacion", "/agua", "/ambiental", "/iluminacion", "/sanidad",
    "/bioseguridad", "/calidad", "/inventario", "/mantenimiento", "/residuos",
    "/graficos", "/alertas", "/configuracion", "/fabrica-alimento",
    "/finanzas", "/presupuestos"],
  supervisor: ["/", "/lotes", "/produccion", "/packing", "/despacho",
    "/alimentacion", "/agua", "/ambiental", "/iluminacion", "/sanidad",
    "/bioseguridad", "/calidad", "/inventario", "/graficos", "/alertas"],
  galponero: ["/", "/produccion", "/agua", "/ambiental", "/iluminacion"],
  veterinario: ["/sanidad", "/bioseguridad", "/lotes", "/graficos"],
  bodeguero: ["/packing", "/despacho", "/inventario", "/fabrica-alimento"],
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const isPublic = publicRoutes.some((r) => path.startsWith(r))
  if (isPublic) return NextResponse.next()

  const token = await getToken({ req, secret: process.env.AUTH_SECRET })

  if (!token) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(loginUrl)
  }

  const rol = token.rol as string
  const allowed = rolRoutes[rol]
  if (!allowed) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const canAccess = allowed.some((prefix) => path === prefix || path.startsWith(prefix + "/"))
  if (!canAccess) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
}
