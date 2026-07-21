import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

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

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r))
  if (isPublic) return NextResponse.next()

  if (!session?.user) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = (session.user as any)?.role as string | undefined

  if (role === "admin") {
    return NextResponse.next()
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
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
}
