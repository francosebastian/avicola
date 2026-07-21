import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

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

const config: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id
        token.rol = user.rol
        token.galponId = user.galponId
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.rol = token.rol as string
        session.user.galponId = token.galponId as string | undefined
      }
      return session
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const path = nextUrl.pathname

      const publicRoutes = ["/login", "/api/auth"]
      const isPublic = publicRoutes.some((r) => path.startsWith(r))
      if (isPublic) return true

      if (!isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl.origin)
        loginUrl.searchParams.set("callbackUrl", path)
        return Response.redirect(loginUrl)
      }

      const rol = (auth?.user as any)?.rol as string
      const allowed = rolRoutes[rol]
      if (!allowed) return false

      return allowed.some((prefix) => path === prefix || path.startsWith(prefix + "/"))
    },
  },
  providers: [],
}

export const { auth } = NextAuth(config)
