import type { NextAuthConfig } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    galponId?: string | null
  }
  interface Session {
    user: {
      id: string
      role?: string
      name?: string | null
      email?: string | null
    }
  }
}

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
  providers: [],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role ?? "admin"
        token.galponId = user.galponId ?? undefined
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
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

      const role = (auth?.user as any)?.role as string | undefined

      if (role === "admin") return true

      const allowed = rolRoutes[role ?? ""]
      if (!allowed) return false

      return allowed.some((prefix) => path === prefix || path.startsWith(prefix + "/"))
    },
  },
}

export default config
