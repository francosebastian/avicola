import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import authConfig from "@/lib/auth.config"

const APP_PASSWORD = process.env.APP_PASSWORD || "avicola2026"

const fullConfig = {
  ...authConfig,
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
}

export const { handlers, auth, signIn, signOut } = NextAuth(fullConfig)
