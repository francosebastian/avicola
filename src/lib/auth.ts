import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

declare module "next-auth" {
  interface User {
    rol: string
    galponId?: string | null
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      rol: string
      galponId?: string | null
    }
  }
}

const APP_PASSWORD = process.env.APP_PASSWORD || "avicola2026"

export const config = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
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
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
        pin: { label: "PIN", type: "text" },
      },
      async authorize(credentials) {
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
            rol: user.rol,
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
          rol: user.rol,
          galponId: user.galponId,
        }
      },
    }),
  ],
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
