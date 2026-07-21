# 🐔 Avícola — Sistema de Gestión Avícola para Postura

Sistema de gestión operativa para una avícola de gallinas de postura. Controla el ciclo productivo completo: desde la recepción de pollitas BB hasta el despacho de huevos clasificados, pasando por producción diaria, alimentación, sanidad, packing, inventarios y análisis económico.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 + App Router + TypeScript |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Gráficos | Recharts |
| Backend | Next.js API Routes + Server Actions |
| Base de Datos | Neon (PostgreSQL serverless) + Prisma ORM v7 |
| Autenticación | NextAuth.js v5 (Auth.js) |
| Formularios | react-hook-form + Zod |
| Despliegue | Vercel + Docker (local dev) |

---

## Credenciales de Prueba (local)

Contraseña general: `avicola2026`

| Email | Rol | PIN |
|-------|-----|-----|
| `admin@avicola.cl` | Admin — acceso total | `1234` |
| `supervisor@avicola.cl` | Supervisor — gestión de lotes y producción | — |
| `galponero@avicola.cl` | Galponero — registro diario de su sección | — |
| `vet@avicola.cl` | Veterinario — sanidad y bioseguridad | — |
| `bodega@avicola.cl` | Bodeguero — inventarios y packing | — |

> **Login vía PIN**: solo el admin tiene PIN. Los demás usuarios usan email + contraseña.

---

## Inicio Rápido (local con Docker)

```bash
# 1. Clonar e instalar
git clone git@github.com:francosebastian/avicola.git
cd avicola
npm install

# 2. Levantar base de datos local
docker compose up -d postgres

# 3. Generar cliente Prisma y migrar
npx prisma generate
npx prisma migrate dev --name init

# 4. Sembrar datos de prueba
npx tsx prisma/seed.ts

# 5. Iniciar servidor de desarrollo
npm run dev
# Abrir http://localhost:3000
```

---

## Jerarquía de la Granja

```
Granja (única)
  └── Galpón (edificio / nave)
        └── Sección (ala, fila, batería, nivel)
              └── Lote (aves de misma edad y línea genética)
```

---

## Módulos del Sistema

| # | Módulo | Descripción |
|---|--------|-------------|
| 1 | **Gestión de Lotes** | Ciclo de vida completo: recepción → cría → recría → postura → descarte |
| 2 | **Registro Diario** | Producción por sección: aves, huevos, consumo, temperatura |
| 3 | **Consumo de Agua** | Monitoreo con alerta temprana de salud (caída >20%) |
| 4 | **Programa de Iluminación** | Fotoperíodo planificado vs real con alertas de desviación |
| 5 | **Control Ambiental** | Temperatura, humedad, amoníaco, CO₂ por sección |
| 6 | **Alimentación** | Fórmulas, consumo diario, fabricación de alimento |
| 7 | **Fábrica de Alimento** | Recepción de insumos, stock, fabricación con descuento automático |
| 8 | **Sanidad** | Vacunación, tratamientos con período de retiro, necropsias |
| 9 | **Bioseguridad** | Control de visitas, cuarentena, checklist diario por galpón |
| 10 | **Calidad de Huevo** | Clasificación por calibre, unidad Haugh, trazabilidad farm-to-table |
| 11 | **Packing** | Registro por cajas (180/100 uds), inventario acumulado |
| 12 | **Despacho** | Salidas con descuento automático de stock, balance diario |
| 13 | **Inventarios** | Multi-almacén, movimientos auditados, alertas de stock mínimo |
| 14 | **Mantenimiento** | Equipos, preventivo/correctivo, calendario de mantenciones |
| 15 | **Residuos** | Gallinaza, aves muertas, subproducto con datos de transporte |
| 16 | **Alertas** | 11 reglas de negocio con notificaciones in-app/email/WhatsApp |
| 17 | **Presupuestos** | Presupuestos por lote y simulador de escenarios |
| 18 | **Análisis Económico** | ROI, punto de equilibrio, costo por huevo, comparativa entre lotes |

---

## Plan de Implementación (29 Features)

Cada feature se desarrolla en su propia branch y requiere aprobación explícita antes de mergear.

| Feature | Estado |
|---------|--------|
| F1 — Autenticación y Roles | ✅ Completado |
| F2 — Base de datos + Schema (Prisma) | ✅ Schema listo, migración aplicada |
| F3 — API Routes con validación Zod | ⏳ Pendiente |
| F4 — Layout global, loading y error states | ⏳ Pendiente |
| F5 — Tipos TypeScript compartidos | ⏳ Pendiente |
| F6 — Formularios funcionales | ⏳ Pendiente |
| F7 — Dashboard con datos reales | ⏳ Pendiente |
| F8 a F29 — Módulos restantes | ⏳ Pendiente |

Detalle completo en [`.github/FEATURES.md`](.github/FEATURES.md) y especificación técnica en [`docs/avicola.md`](docs/avicola.md).

---

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run db:generate` | Generar cliente Prisma |
| `npm run db:migrate` | Migración de desarrollo |
| `npm run db:push` | Push schema sin migración |
| `npm run db:studio` | Interfaz gráfica de base de datos |
| `npm run db:seed` | Ejecutar seed |
| `npm run docker:up` | Levantar Docker (postgres + adminer + app) |
| `npm run docker:down` | Detener Docker |

---

## Esqueleto de Base de Datos (41 tablas)

```
Configuración:  usuarios, galpones, secciones, curvas_estandar, configuracion_alertas
Lotes:          lotes, eventos_lote
Producción:     registro_diario, muestreo_peso
Agua:           consumo_agua
Iluminación:    programa_iluminacion, registro_iluminacion_diario
Ambiental:      registros_ambientales
Alimentación:   formulas_alimento, consumo_alimento_diario, recepcion_insumos,
                stock_insumos, fabricacion_alimento, detalle_fabricacion
Sanidad:        registro_vacunacion, registro_tratamientos, necropsias,
                registro_visitas, checklist_bioseguridad
Calidad:        control_calidad_huevo, trazabilidad
Packing:        registro_packing, formato_cajas, inventario_packing
Despacho:       despachos, detalle_despacho
Inventario:     almacenes, inventario_productos, movimientos_inventario,
                inventario_huevos
Mantenimiento:  equipos, mantenimiento
Finanzas:       costos_lote, resumen_lote, presupuestos
Residuos:       residuos
```

---

## Documentación

- [`docs/avicola.md`](docs/avicola.md) — Especificación técnica completa (16 módulos, 41 tablas, API, reglas de negocio)
- [`.github/FEATURES.md`](.github/FEATURES.md) — Plan de implementación con 29 features
- [`prisma/schema.prisma`](prisma/schema.prisma) — Schema completo de base de datos
