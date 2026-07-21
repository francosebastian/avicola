"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: "▦" },
  { href: "/lotes", label: "Lotes", icon: "🐔" },
  { href: "/produccion", label: "Producción", icon: "🥚" },
  { href: "/alimentacion", label: "Alimentación", icon: "🌾" },
  { href: "/agua", label: "Consumo de Agua", icon: "💧" },
  { href: "/iluminacion", label: "Iluminación", icon: "💡" },
  { href: "/ambiental", label: "Control Ambiental", icon: "🌡️" },
  { href: "/sanidad", label: "Sanidad", icon: "💊" },
  { href: "/bioseguridad", label: "Bioseguridad", icon: "🛡️" },
  { href: "/calidad", label: "Calidad de Huevo", icon: "🔬" },
  { href: "/packing", label: "Packing", icon: "📦" },
  { href: "/despacho", label: "Despachos", icon: "🚚" },
  { href: "/fabrica-alimento", label: "Fábrica Alimento", icon: "🏭" },
  { href: "/inventario", label: "Inventarios", icon: "📊" },
  { href: "/graficos", label: "Gráficos", icon: "📊" },
  { href: "/residuos", label: "Residuos", icon: "♻️" },
  { href: "/alertas", label: "Alertas", icon: "🔔" },
  { href: "/configuracion", label: "Configuración", icon: "⚙️" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="p-4 border-b border-sidebar-muted flex items-center gap-3">
        <img src="/logo.png" alt="Logo Avícola" className="h-10 w-auto" />
        <div>
          <h1 className="text-base font-bold leading-tight">Avícola</h1>
          <p className="text-xs text-sidebar-foreground/60">Sistema de Gestión</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-sidebar-muted text-sidebar-foreground/80"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {session?.user && (
        <div className="p-3 border-t border-sidebar-muted">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              {(session.user.name ?? "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{session.user.role}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground py-1.5 rounded hover:bg-sidebar-muted transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </aside>
  )
}
