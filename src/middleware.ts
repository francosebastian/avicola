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
  const path = req.nextUrl.pathname
  const session = req.auth

  const isPublic = publicRoutes.some((r) => path.startsWith(r))
  if (isPublic) return NextResponse.next()

  if (!session?.user) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(loginUrl)
  }

  const allowed = rolRoutes[(session.user as any).rol as string]
  if (!allowed) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const canAccess = allowed.some((prefix) => path === prefix || path.startsWith(prefix + "/"))
  if (!canAccess) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
}
