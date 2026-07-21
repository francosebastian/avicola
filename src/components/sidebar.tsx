"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="p-4 border-b border-sidebar-muted">
        <h1 className="text-lg font-bold">🐔 Avícola</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Sistema de Gestión Avícola</p>
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
      <div className="p-4 border-t border-sidebar-muted text-xs text-sidebar-foreground/40">
        v2.0 — Prototipo
      </div>
    </aside>
  )
}
