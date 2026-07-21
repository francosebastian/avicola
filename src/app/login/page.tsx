"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [mode, setMode] = useState<"email" | "pin">("email")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const pin = formData.get("pin") as string

    try {
      const csrfResp = await fetch("/api/auth/csrf")
      const { csrfToken } = await csrfResp.json()

      const params = new URLSearchParams()
      params.set("csrfToken", csrfToken)
      params.set("callbackUrl", callbackUrl)
      if (mode === "email") {
        params.set("email", email)
        params.set("password", password)
      } else {
        params.set("pin", pin ?? "")
      }

      const resp = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
        redirect: "follow",
      })

      if (resp.ok || resp.redirected) {
        window.location.href = callbackUrl
      } else {
        setError("Credenciales inválidas")
      }
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <img src="/logo.png" alt="Logo" className="h-12 mx-auto mb-2" />
        <CardTitle>Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "email" ? (
            <>
              <div>
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" name="email" type="email" required className="mt-1" />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
                <Input id="password" name="password" type="password" required className="mt-1" />
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="pin" className="text-sm font-medium">PIN</label>
              <Input id="pin" name="pin" type="text" inputMode="numeric" maxLength={6} className="mt-1 text-2xl text-center tracking-widest" placeholder="• • • •" />
              <p className="text-xs text-muted-foreground mt-1">Ingrese su PIN de 4-6 dígitos</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("email")}
              className={`flex-1 py-2 text-sm rounded-md font-medium ${
                mode === "email" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setMode("pin")}
              className={`flex-1 py-2 text-sm rounded-md font-medium ${
                mode === "pin" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              PIN
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={<div className="text-center">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
