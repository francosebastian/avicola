import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

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

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    galponId?: string
  }
}

const APP_PASSWORD = process.env.APP_PASSWORD || "avicola2026"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
        pin: { label: "PIN", type: "text" },
      },
      async authorize(credentials) {
        const { prisma } = await import("@/lib/prisma")

        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined
        const pin = credentials?.pin as string | undefined

        if (!email && !pin) return null

        if (pin) {
          const user = await prisma.usuario.findFirst({
            where: { pin, activo: true },
          })
          if (!user) return null
          return {
            id: user.id,
            email: user.email,
            name: user.nombre,
            role: user.rol,
            galponId: user.galponId,
          }
        }

        if (password !== APP_PASSWORD) return null

        const user = await prisma.usuario.findUnique({
          where: { email },
        })
        if (!user || !user.activo) return null

        return {
          id: user.id,
          email: user.email,
          name: user.nombre,
          role: user.rol,
          galponId: user.galponId,
        }
      },
    }),
  ],
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
  },
})
