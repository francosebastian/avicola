# Feature Execution Plan — Avícola

Cada feature sigue este ciclo obligatorio:

```
[Planificar] → [Implementar] → [Build] → [Actualizar FEATURES.md] → [Revisión manual por el usuario] → [Aprobación explícita del usuario] → [Merge a main + push]
```

**Reglas estrictas:**

1. **No se pasa a la siguiente feature hasta que la actual recibe aprobación explícita del usuario.**
2. **No se mergea ni pushea automáticamente.** Solo cuando el usuario dice explícitamente "aprobado" o "mergea" se realiza el merge a main y push.
3. **FEATURES.md se actualiza en la feature branch** (no en main).
4. **El build debe pasar (`npm run build`) antes de solicitar revisión.**

---

## Estado de features

| Feature | Estado | Commit/PR |
|---|---|---|
| F1 — Autenticación y Roles | ✅ Completado (proxy omitido en dev) | `feature/F1-autenticacion` |
| F2 — API Routes con validación Zod | ✅ Completado | `feature/F2-api-routes` |
| F3 — API Routes con validación Zod | ⏳ Pendiente | — |
| F4 — Layout global, loading y error states | ✅ Completado | `feature/F3-loading-error` |
| F5 — Tipos TypeScript compartidos | ✅ Completado | `feature/F5-tipos-compartidos` |
| F6 — Formularios funcionales (react-hook-form + Zod) | ⏳ Pendiente | — |
| F7 — Dashboard con datos reales | ⏳ Pendiente | F4 |
| F8 — Gestión de Lotes (CRUD) | ⏳ Pendiente | F5 |
| F9 — Registro Diario de Producción | ⏳ Pendiente | F5 |
| F10 — Packing con cajas y formato configurable | ⏳ Pendiente | F5 |
| F11 — Despacho y salidas de inventario | ⏳ Pendiente | F5 |
| F12 — Monitoreo de Consumo de Agua | ⏳ Pendiente | — |
| F13 — Alimentación y Fábrica de Alimento | ⏳ Pendiente | F5 |
| F14 — Control Ambiental (IoT) | ⏳ Pendiente | — |
| F15 — Programa de Iluminación | ⏳ Pendiente | — |
| F16 — Módulo Sanitario y Bioseguridad | ⏳ Pendiente | F5 |
| F17 — Calidad de Huevo y Trazabilidad | ⏳ Pendiente | F5 |
| F18 — Inventarios Multi-Almacén | ⏳ Pendiente | F5 |
| F19 — Gestión de Residuos y Subproductos | ⏳ Pendiente | F5 |
| F20 — Gráficos y Dashboard de KPIs | ⏳ Pendiente | F4 |
| F21 — Alertas y Notificaciones Inteligentes | ⏳ Pendiente | — |
| F22 — Presupuestos y Escenarios | ⏳ Pendiente | F5 |
| F23 — Análisis Económico y Rentabilidad | ⏳ Pendiente | F5 |
| F24 — Mantenimiento de Equipos e Infraestructura | ⏳ Pendiente | F5 |
| F25 — Reportes PDF y Exportación | ⏳ Pendiente | — |
| F26 — PWA y sincronización offline | ⏳ Pendiente | — |
| F27 — Accesibilidad WCAG 2.2 AA | ⏳ Pendiente | — |
| F28 — Responsive design completo | ⏳ Pendiente | — |
| F29 — Auditoría y Seguridad | ⏳ Pendiente | — |

---

Cada feature nueva crea su propia branch desde `main` con el formato `feature/F{n}-{nombre}`. Una vez implementada, el agente muestra la branch para revisión manual. Solo cuando el usuario dice explícitamente "aprobado" o "mergea", se ejecuta:

```bash
git checkout main
git merge feature/F{n}-{nombre}
git push origin main
```

**No se mergea ni pushea ninguna feature sin aprobación manual explícita del usuario. No se acumulan features en una misma branch.**

---

## F1 — Autenticación y Roles

**Objetivo**: Implementar NextAuth.js v5 con los roles definidos en el spec.

**Dependencias**:
- `npm install next-auth@beta`

**Archivos a crear/modificar**:
- `src/lib/auth.ts` — configuración de NextAuth con credenciales + email/password
- `src/lib/auth.config.ts` — config de Auth.js con adaptador Prisma
- `src/app/api/auth/[...nextauth]/route.ts` — API route de autenticación
- `src/components/auth/session-provider.tsx` — SessionProvider wrapper
- `src/middleware.ts` — proteger rutas según rol
- `src/app/(dashboard)/layout.tsx` — layout protegido con sidebar
- `src/app/login/page.tsx` — página de login

**Roles del sistema**:

| Rol | Acceso |
|-----|--------|
| `admin` | Total |
| `supervisor` | Lotes, producción, sanidad, personal |
| `galponero` | Solo registro diario de su sección |
| `veterinario` | Sanidad, necropsias, bioseguridad |
| `bodeguero` | Inventarios, packing |

**Criterio de aprobación**:
- Build exitoso
- Login con email/contraseña redirige al dashboard
- Login con PIN redirige al registro diario
- Middleware redirige a `/login` si no hay sesión
- Middleware retorna 403 si rol no tiene permiso

**Pruebas de validación**:
```bash
npm run build 2>&1 | grep -i "error"; echo "Exit: $?"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/lotes  # debe redirigir
```

---

## F2 — Base de datos + Schema (Prisma)

**Objetivo**: Implementar el esquema completo de base de datos con Prisma ORM y Neon PostgreSQL.

**Estado**: Schema ya existe en `prisma/schema.prisma`. Falta migración inicial y seed.

**Archivos existentes** (ya creados):
- `prisma/schema.prisma` — 36 modelos
- `prisma.config.ts` — configuración con `DATABASE_URL_UNPOOLED`
- `src/lib/prisma.ts` — cliente con auto-detección Neon vs Local
- `prisma/seed.ts` — datos de prueba
- `scripts/entrypoint.sh` — migrate + seed-once
- `prisma/unlock.ts` — utilidad para Neon

**Pendiente**:
- Crear migración inicial: `npx prisma migrate dev --name init`
- Probar seed local con Docker
- Configurar Neon en producción (variables de entorno)

**Criterio de aprobación**:
- `npx prisma migrate dev` crea migraciones sin errores
- Seed inserta datos de prueba
- Conexión local con Docker funciona
- Variable `DATABASE_URL_UNPOOLED` documentada para Neon

**Pruebas de validación**:
```bash
docker compose up -d postgres
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npx prisma studio  # verificar datos
```

---

## F3 — API Routes con validación Zod

**Objetivo**: Crear endpoints REST para todos los módulos con validación Zod compartida.

**Archivos a crear**:
- `src/lib/validations/lotes.ts`
- `src/lib/validations/produccion.ts`
- `src/lib/validations/packing.ts`
- `src/lib/validations/despacho.ts`
- `src/lib/validations/alimentacion.ts`
- `src/lib/validations/sanidad.ts`
- `src/lib/validations/inventario.ts`
- `src/lib/validations/agua.ts`
- `src/lib/validations/ambiental.ts`
- `src/lib/validations/iluminacion.ts`
- `src/lib/validations/bioseguridad.ts`
- `src/lib/validations/calidad.ts`
- `src/lib/validations/mantenimiento.ts`
- `src/lib/validations/finanzas.ts`
- `src/lib/validations/residuos.ts`
- `src/lib/validations/alertas.ts`
- `src/lib/validations/graficos.ts`
- `src/app/api/lotes/route.ts` + `[id]/route.ts`
- `src/app/api/produccion/registro-diario/route.ts`
- `src/app/api/packing/registro/route.ts`
- `src/app/api/packing/inventario/route.ts`
- `src/app/api/despacho/registro/route.ts`
- `src/app/api/despacho/balance-diario/route.ts`
- `src/app/api/agua/consumo/route.ts`
- `src/app/api/ambientales/route.ts`
- `src/app/api/iluminacion/route.ts`
- `src/app/api/alimentacion/formulas/route.ts`
- `src/app/api/fabrica/recepcion/route.ts`
- `src/app/api/fabrica/fabricacion/route.ts`
- `src/app/api/fabrica/stock/route.ts`
- `src/app/api/sanidad/vacunacion/route.ts`
- `src/app/api/sanidad/tratamientos/route.ts`
- `src/app/api/sanidad/necropsias/route.ts`
- `src/app/api/bioseguridad/visitas/route.ts`
- `src/app/api/bioseguridad/checklist/route.ts`
- `src/app/api/calidad/control/route.ts`
- `src/app/api/calidad/trazabilidad/route.ts`
- `src/app/api/inventario/productos/route.ts`
- `src/app/api/inventario/movimientos/route.ts`
- `src/app/api/inventario/huevos/route.ts`
- `src/app/api/mantenimiento/equipos/route.ts`
- `src/app/api/mantenimiento/registro/route.ts`
- `src/app/api/residuos/route.ts`
- `src/app/api/finanzas/costos/route.ts`
- `src/app/api/finanzas/presupuestos/route.ts`
- `src/app/api/finanzas/resumen-lote/route.ts`
- `src/app/api/alertas/route.ts`
- `src/app/api/metricas/curva-postura/route.ts`
- `src/app/api/metricas/dashboard/route.ts`
- `src/app/api/metricas/mortalidad/route.ts`
- `src/app/api/metricas/eficiencia-alimenticia/route.ts`

**Criterio de aprobación**:
- Build exitoso
- POST con body válido crea registro en DB
- POST con body inválido retorna 400 con errores Zod
- GET retorna lista paginada
- Endpoints protegidos por rol según F1

**Pruebas de validación**:
```bash
curl -s -X POST http://localhost:3000/api/lotes \
  -H "Content-Type: application/json" \
  -d '{"codigo_lote":"TEST-001","seccion_id":"...","linea_genetica":"Hy-Line Brown","cantidad_inicial":5000,"fecha_recepcion":"2026-07-21"}'

curl -s -X POST http://localhost:3000/api/lotes \
  -H "Content-Type: application/json" \
  -d '{"codigo_lote":""}' | grep -c 'ZodError'
```

---

## F4 — Layout global, loading y error states

**Objetivo**: Agregar loading skeletons, error boundaries y estados vacíos en todas las páginas.

**Archivos a crear/modificar**:
- `src/app/loading.tsx` — loading global
- `src/app/error.tsx` — error boundary global
- `src/app/lotes/loading.tsx`
- `src/app/lotes/[id]/loading.tsx`
- `src/app/lotes/nuevo/loading.tsx`
- `src/app/produccion/loading.tsx`
- `src/app/packing/loading.tsx`
- `src/app/despacho/loading.tsx`
- `src/app/graficos/loading.tsx`
- `src/app/alimentacion/loading.tsx`
- `src/app/agua/loading.tsx`
- `src/app/ambiental/loading.tsx`
- `src/app/iluminacion/loading.tsx`
- `src/app/sanidad/loading.tsx`
- `src/app/bioseguridad/loading.tsx`
- `src/app/calidad/loading.tsx`
- `src/app/inventario/loading.tsx`
- `src/app/mantenimiento/loading.tsx`
- `src/app/residuos/loading.tsx`
- `src/app/alertas/loading.tsx`
- `src/app/configuracion/loading.tsx`
- `src/app/fabrica-alimento/loading.tsx`
- `src/components/ui/skeleton.tsx` — shadcn skeleton
- `src/components/empty-state.tsx` — componente "No hay registros"
- Todas las páginas: reemplazar `key={i}` por keys únicas
- Todas las páginas: agregar `scope="col"` en `<th>`
- Todas las páginas: agregar `overflow-x-auto` en tablas anchas

**Criterio de aprobación**:
- Build exitoso
- Cada página tiene su `loading.tsx`
- Error boundary global atrapa errores
- Tablas vacías muestran "No hay registros"
- Scroll horizontal en tablas con 6+ columnas

**Pruebas de validación**:
```bash
test -f src/app/lotes/loading.tsx && echo "OK"
test -f src/components/empty-state.tsx && echo "OK"
npm run build 2>&1 | grep -i "error"; echo "Exit: $?"
```

---

## F5 — Tipos TypeScript compartidos

**Objetivo**: Definir interfaces y tipos para todas las entidades del sistema, alineados con el schema de Prisma.

**Archivos a crear**:
- `src/types/index.ts` — barrel export
- `src/types/lotes.ts`
- `src/types/produccion.ts`
- `src/types/packing.ts`
- `src/types/despacho.ts`
- `src/types/alimentacion.ts`
- `src/types/fabrica.ts` — recepcion_insumos, stock_insumos, fabricacion, detalle
- `src/types/agua.ts`
- `src/types/ambiental.ts`
- `src/types/iluminacion.ts`
- `src/types/sanidad.ts`
- `src/types/bioseguridad.ts`
- `src/types/calidad.ts`
- `src/types/inventario.ts`
- `src/types/mantenimiento.ts`
- `src/types/finanzas.ts`
- `src/types/residuos.ts`
- `src/types/graficos.ts` — interfaces de chart data (CurvaPosturaData, MortalidadData, etc.)
- `src/types/alertas.ts`

**Criterio de aprobación**:
- Build exitoso
- Todos los tipos exportados desde `src/types/index.ts`
- Tipos alineados con schema de Prisma
- Interfaces de gráficos coinciden con el spec `docs/avicola.md`

**Pruebas de validación**:
```bash
for f in lotes produccion packing despacho alimentacion fabrica agua ambiental iluminacion sanidad bioseguridad calidad inventario mantenimiento finanzas residuos graficos alertas; do
  test -f "src/types/$f.ts" && echo "$f: OK" || echo "$f: FALTA"
done
npm run build 2>&1 | grep -i "error"; echo "Exit: $?"
```

---

## F6 — Formularios funcionales (react-hook-form + Zod)

**Objetivo**: Hacer que todos los formularios del prototipo envíen datos reales a la API.

**Dependencias**:
- `npm install react-hook-form @hookform/resolvers`

**Archivos a modificar**:
- `src/app/lotes/nuevo/page.tsx` — formulario funcional con POST a `/api/lotes`
- `src/app/produccion/page.tsx` — registro diario funcional
- `src/app/packing/page.tsx` — registro de packing funcional
- `src/app/despacho/page.tsx` — registro de despacho funcional
- `src/app/fabrica-alimento/page.tsx` — recepción y fabricación funcionales
- `src/app/agua/page.tsx` — registro de consumo funcional
- `src/app/ambiental/page.tsx` — registro de lecturas funcional
- `src/app/iluminacion/page.tsx` — registro de iluminación funcional
- `src/app/sanidad/page.tsx` — vacunación, tratamiento, necropsia
- `src/app/bioseguridad/page.tsx` — visitas y checklist persistente
- `src/app/calidad/page.tsx` — control de calidad
- `src/app/inventario/page.tsx` — movimientos de inventario
- `src/app/mantenimiento/page.tsx` — registro de mantenimiento
- `src/app/residuos/page.tsx` — salida de residuos

**Requerimientos**:
- Inputs con `value` + `onChange` controlados
- Validación Zod inline
- `<form>` con `onSubmit`
- Toast de éxito/error (Sonner)
- Loading state en botón de submit
- Errores inline por campo

**Criterio de aprobación**:
- Build exitoso
- Todos los formularios tienen `<form>` + `onSubmit`
- Datos persisten en DB vía API
- Errores de validación inline
- Toast al guardar

**Pruebas de validación**:
```bash
grep -l '<form' src/app/*/page.tsx src/app/*/nuevo/page.tsx
grep -r 'z\.object' src/lib/validations/ | wc -l
npm run build 2>&1 | grep -i "error"; echo "Exit: $?"
```

---

## F7 — Dashboard con datos reales

**Objetivo**: Reemplazar datos hardcodeados del dashboard con datos desde API/DB.

**Dependencias**: F2, F3

**Archivos a modificar**:
- `src/app/page.tsx` — migrar a Server Component que llama a servicios
- KPIs: postura_hoy, huevos_hoy, aves_vivas, mortalidad, conversión
- Curva de postura: `GET /api/metricas/curva-postura`
- Clasificación: `GET /api/packing/resumen-diario` o `GET /api/metricas/dashboard/{lote_id}`
- Alertas activas: `GET /api/alertas/activas`

**Server Component pattern**:
```tsx
export default async function DashboardPage() {
  const [dashboard, curvas, alertas] = await Promise.all([
    getDashboardData(),
    getCurvaPostura(),
    getAlertasActivas(),
  ])
  return <DashboardClient data={{ dashboard, curvas, alertas }} />
}
```

**Criterio de aprobación**:
- Build exitoso
- Dashboard muestra datos reales desde DB
- Alertas reflejan reglas de negocio del spec
- Loading skeleton mientras carga

---

## F8 — Gestión de Lotes (CRUD)

**Objetivo**: CRUD completo de lotes con ciclo de vida (cria → recria → postura → descarte → cerrado).

**Dependencias**: F2, F3, F5, F6

**Archivos a modificar**:
- `src/app/lotes/page.tsx` — listar lotes desde DB, filtros por estado, paginación
- `src/app/lotes/nuevo/page.tsx` — formulario funcional
- `src/app/lotes/[id]/page.tsx` — detalle con KPIs, curva postura, mortalidad, info, eventos
- `src/app/lotes/[id]/editar/page.tsx` — edición
- Tablas: `lotes`, `eventos_lote`, `muestreo_peso`
- API: `GET /api/lotes`, `POST /api/lotes`, `GET /api/lotes/:id`, `PUT /api/lotes/:id`, `PATCH /api/lotes/:id/estado`

**Reglas de negocio**:
- Código de lote único
- Al cambiar estado → registrar evento automático
- Al cerrar lote → generar `resumen_lote`
- Muestreo de peso semanal

**Criterio de aprobación**:
- Build exitoso
- Lista paginada con datos reales
- Crear lote redirige al detalle
- Editar actualiza datos
- Cambio de estado registra evento
- Loading/empty/error states

---

## F9 — Registro Diario de Producción

**Objetivo**: Formulario de registro diario funcional por sección, mobile-first.

**Dependencias**: F2, F3, F5, F6

**Archivos a modificar**:
- `src/app/produccion/page.tsx` — selector de sección, registro de aves/huevos/consumo/temperatura
- API: `POST /api/produccion/registro-diario`, `GET /api/produccion/registro-diario`

**Reglas de negocio**:
- `UNIQUE(seccion_id, fecha)` — no duplicar
- Al guardar: actualizar aves_vivas del lote
- Bajas ≤ aves vivas día anterior
- Clasificación de huevos debe sumar = `huevos_producidos`
- Mobile: teclado numérico, botones +/-, captura de voz

**Criterio de aprobación**:
- Build exitoso
- Registro se guarda en DB
- No permite duplicados misma sección/fecha
- Validación de consistencia funciona
- Interfaz mobile-first

---

## F10 — Packing con cajas y formato configurable

**Objetivo**: Registro de packing por cajas con formato (180/100 uds), inventario acumulado.

**Dependencias**: F2, F3, F5, F6

**Archivos a modificar**:
- `src/app/packing/page.tsx` — registro por cajas + inventario acumulado
- API: `POST /api/packing/registro`, `GET /api/packing/inventario`, `PUT /api/packing/formato-cajas`
- Tablas: `registro_packing`, `formato_cajas`, `inventario_packing`

**Reglas de negocio**:
- Al confirmar packing: sumar cajas y unidades a `inventario_packing`
- Formato configurable (tabla `formato_cajas`)
- Merma = total procesado - total clasificado
- Descuento automático del `registro_diario` de la sección

**Criterio de aprobación**:
- Build exitoso
- Ingresar cajas calcula unidades automáticamente
- Inventario se actualiza al confirmar
- Formato configurable
- Balance diario muestra entradas

---

## F11 — Despacho y salidas de inventario

**Objetivo**: Registrar despachos con descuento automático de stock.

**Dependencias**: F2, F3, F5, F6, F10

**Archivos a modificar**:
- `src/app/despacho/page.tsx` — formulario + historial + balance diario
- API: `POST /api/despacho/registro`, `GET /api/despacho/balance-diario`, `GET /api/despacho/registro`
- Tablas: `despachos`, `detalle_despacho`

**Reglas de negocio**:
- Descontar cajas de `inventario_packing` al confirmar
- No permitir stock negativo
- Balance diario: `stock_inicial + entradas - salidas = stock_final`
- Alerta si stock < mínimo

**Criterio de aprobación**:
- Build exitoso
- Despacho descuenta stock automáticamente
- No permite stock negativo
- Balance diario correcto
- Historial con detalle

---

## F12 — Monitoreo de Consumo de Agua

**Objetivo**: Registro y monitoreo de consumo de agua con alertas tempranas de salud.

**Dependencias**: F2, F3, F5

**Archivos a modificar**:
- `src/app/agua/page.tsx` — gráfico de tendencia + tabla de lecturas diarias
- API: `POST /api/agua/consumo`, `GET /api/agua/consumo`, `GET /api/agua/alertas`
- Tabla: `consumo_agua`

**Regla de negocio clave**:
- Caída >20% respecto a promedio de 3 días → **alerta crítica** (indicador temprano de enfermedad)
- Rango esperado: 200-300 ml/ave/día
- Ratio agua/alimento esperado: 1.8:1 a 2.2:1

**Criterio de aprobación**:
- Build exitoso
- Registro de consumo por sección
- Gráfico con tendencia y línea de alerta
- Alerta >20% de caída

---

## F13 — Alimentación y Fábrica de Alimento

**Objetivo**: Gestión de fórmulas, consumo diario, recepción de insumos y fabricación con descuento automático de stock.

**Dependencias**: F2, F3, F5, F6

**Archivos a crear/modificar**:
- `src/app/alimentacion/page.tsx` — fórmulas + consumo diario + stock insumos
- `src/app/fabrica-alimento/page.tsx` — recepción, fabricación, stock (ya existe como prototipo)
- API:
  - `GET/POST /api/alimentacion/formulas`
  - `GET/POST /api/alimentacion/consumo`
  - `GET/POST /api/fabrica/recepcion`
  - `GET/POST /api/fabrica/fabricacion`
  - `GET /api/fabrica/stock`
- Tablas: `formulas_alimento`, `consumo_alimento_diario`, `recepcion_insumos`, `stock_insumos`, `fabricacion_alimento`, `detalle_fabricacion`

**Reglas de negocio**:
- Al crear `fabricacion_alimento`: calcular insumos según fórmula y descontar de `stock_insumos`
- Alerta si stock de insumo < mínimo
- Trazabilidad completa: guía → lote insumo → lote fabricación → consumo por lote
- Consumo diario descuenta automáticamente del inventario

**Criterio de aprobación**:
- Build exitoso
- CRUD de fórmulas con ingredientes y porcentajes
- Recepción registra N° Lote y N° Guía obligatorios
- Fabricación descuenta insumos automáticamente
- Stock se actualiza en tiempo real
- Alerta si insumo bajo mínimo

**Pruebas de validación**:
```bash
# Crear fórmula
curl -s -X POST http://localhost:3000/api/alimentacion/formulas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Postura F1","tipo_alimento":"postura_1","ingredientes":[{"ingrediente":"Maiz","porcentaje":62.5}]}'

# Fabricar y verificar descuento
# 1. Ver stock antes
# 2. POST fabricacion
# 3. Ver stock después (debe haber bajado)
```

---

## F14 — Control Ambiental (IoT)

**Objetivo**: Monitoreo de temperatura, humedad, amoníaco y velocidad del aire por sección, con alertas.

**Dependencias**: F2, F3, F5

**Archivos a modificar**:
- `src/app/ambiental/page.tsx` — gráfico multi-line + tabla de lecturas
- API: `POST /api/ambientales/registro`, `GET /api/ambientales/registro`, `GET /api/ambientales/alertas`
- Tabla: `registros_ambientales`

**Variables monitoreadas**:
| Variable | Rango óptimo | Alerta |
|----------|-------------|--------|
| Temperatura | 18-24°C | >28°C o <16°C |
| Humedad | 50-70% | >80% o <30% |
| Amoníaco (NH₃) | <10 ppm | >15 ppm |
| CO₂ | <2000 ppm | >3000 ppm |
| Velocidad aire | 0.5-2.0 m/s | <0.3 m/s |

**Criterio de aprobación**:
- Build exitoso
- Registro de lecturas manual (y preparado para sensor IoT)
- Gráfico multi-line con thresholds visuales
- Alertas por variable fuera de rango

---

## F15 — Programa de Iluminación

**Objetivo**: Gestión del programa de luz por semana del lote con registro real vs planificado.

**Dependencias**: F2, F3, F5

**Archivos a modificar**:
- `src/app/iluminacion/page.tsx` — programa planificado + registro real
- API: `GET/POST /api/iluminacion/programa`, `GET/POST /api/iluminacion/registro-diario`
- Tablas: `programa_iluminacion`, `registro_iluminacion_diario`

**Reglas de negocio**:
- Fotoperíodo es crítico: alerta si desviación >30 min respecto al programa
- Semanas críticas 16-18: incremento gradual hasta 14-16h de luz
- Intensidad recomendada: 20-30 lux

**Criterio de aprobación**:
- Build exitoso
- Programa planificado por semana del lote
- Registro real vs planificado
- Alerta por desviación

---

## F16 — Módulo Sanitario y Bioseguridad

**Objetivo**: Gestión de vacunación, tratamientos con periodo de retiro, necropsias, visitas y checklist de bioseguridad.

**Dependencias**: F2, F3, F5, F6

**Archivos a modificar**:
- `src/app/sanidad/page.tsx` — vacunas, tratamientos, necropsias
- `src/app/bioseguridad/page.tsx` — visitas, checklist
- Tablas: `registro_vacunacion`, `registro_tratamientos`, `necropsias`, `registro_visitas`, `checklist_bioseguridad`

**Reglas de negocio**:
- **Periodo de retiro**: bloqueo automático de venta de huevos
- Contador regresivo visible en dashboard
- Cuarentena de visitas: alerta si <48h desde última visita a otra granja
- Checklist diario por galpón obligatorio

**Criterio de aprobación**:
- Build exitoso
- Registro de vacunación con tipo, vía, dosis
- Tratamiento con fecha de retiro calculada
- Bloqueo de venta durante retiro
- Registro de visitas con alerta de cuarentena
- Checklist de bioseguridad por galpón

---

## F17 — Calidad de Huevo y Trazabilidad

**Objetivo**: Control de calidad interna (unidad Haugh, color yema) y trazabilidad de envases farm-to-table.

**Dependencias**: F2, F3, F5, F6

**Archivos a modificar**:
- `src/app/calidad/page.tsx` — clasificación, control calidad, trazabilidad
- API: `GET/POST /api/calidad/control`, `GET /api/calidad/trazabilidad`
- Tablas: `control_calidad_huevo`, `trazabilidad`

**Categorías**:
| Categoría | Peso (g) |
|-----------|----------|
| Jumbo | ≥68 |
| Super | 65-67 |
| Extra | 61-64 |
| Primera | 55-60 |
| Segunda | 50-54 |
| Tercera | <50 |

**Criterio de aprobación**:
- Build exitoso
- Control de calidad con unidad Haugh, color yema, resistencia cáscara
- Búsqueda de envase por código
- Trazabilidad: envase → sección → lote → fecha → clasificación
- Exportación de certificado sanitario

---

## F18 — Inventarios Multi-Almacén

**Objetivo**: Gestión de inventarios por tipo de almacén con movimientos auditados y alertas de stock mínimo.

**Dependencias**: F2, F3, F5, F6

**Archivos a modificar**:
- `src/app/inventario/page.tsx` — productos, movimientos, alertas de stock
- API: `GET/POST /api/inventario/productos`, `GET/POST /api/inventario/movimientos`, `GET /api/inventario/stock-bajo`
- Tablas: `almacenes`, `inventario_productos`, `movimientos_inventario`, `inventario_huevos`

**Tipos de almacén**:
- Alimento (a granel, sacos)
- Insumos (vacunas, medicamentos, equipos)
- Producto terminado (huevos clasificados)
- Empaques (bandejas, cajas)

**Criterio de aprobación**:
- Build exitoso
- CRUD de productos por almacén
- Movimientos con saldo anterior/nuevo
- Trigger automático desde consumo diario y packing
- Alerta de stock bajo

---

## F19 — Gestión de Residuos y Subproductos

**Objetivo**: Registro de salida de gallinaza, aves muertas y huevo subproducto con datos de transporte.

**Dependencias**: F2, F3, F5, F6

**Archivos a modificar**:
- `src/app/residuos/page.tsx` — registro de salidas con datos de vehículo
- API: `GET/POST /api/residuos`
- Tabla: `residuos`

**Datos por tipo**:
| Tipo | Datos específicos |
|------|------------------|
| Gallinaza | Transportista, patente, destino, hora salida, ingreso |
| Aves muertas | Método disposición (compostaje/incineración/fosa), costo |
| Huevo subproducto | Destino (industria/quebrado/donación), ingreso |

**Criterio de aprobación**:
- Build exitoso
- Registro con transportista, patente y destino
- Hora de salida automática
- Cálculo de ingresos y costos

---

## F20 — Gráficos y Dashboard de KPIs

**Objetivo**: Implementar los 9 tipos de gráficos especificados con datos reales desde API.

**Dependencias**: F2, F3

**Archivos a modificar**:
- `src/app/graficos/page.tsx` — centro de gráficos con filtros
- API endpoints de métricas

**Gráficos del spec**:

| # | Gráfico | Tipo | Endpoint |
|---|---------|------|----------|
| CHART-001 | Curva de Postura Teórica vs Real | LineChart | `GET /api/metricas/curva-postura` |
| CHART-002 | Mortalidad Acumulada y Semanal | ComposedChart | `GET /api/metricas/mortalidad` |
| CHART-003 | Eficiencia Alimenticia | ComposedChart dual Y | `GET /api/metricas/eficiencia-alimenticia` |
| CHART-004 | Dashboard Producción Diaria | Panel widgets | `GET /api/metricas/dashboard` |
| CHART-005 | Peso Promedio del Huevo | BoxPlot + LineChart | `GET /api/metricas/peso-huevo` |
| CHART-006 | Proyección Producción y Flujo Caja | AreaChart | `GET /api/metricas/proyeccion` |
| CHART-007 | Consumo de Agua | LineChart | `GET /api/agua/consumo` |
| CHART-008 | Condiciones Ambientales | Multi-line | `GET /api/ambientales/registro` |
| CHART-009 | Productividad Personal | BarChart | (depende de módulo Personal) |

**Criterio de aprobación**:
- Build exitoso
- Los 8+ gráficos funcionales con datos reales
- Filtros por lote, fecha, galpón
- Exportación a PNG/PDF
- Informe ejecutivo compilado

---

## F21 — Alertas y Notificaciones Inteligentes

**Objetivo**: Sistema de alertas basado en reglas de negocio avícola con múltiples canales de notificación.

**Dependencias**: F2, F3, F5

**Archivos a crear/modificar**:
- `src/app/alertas/page.tsx` — listado de alertas activas + configuración
- API: `GET /api/alertas/activas`, `POST /api/alertas/configurar`, `GET /api/alertas/historial`
- Tabla: `configuracion_alertas`

**Reglas de alerta**:

| Alerta | Cálculo | Severidad |
|--------|---------|-----------|
| Caída de postura | >5% en 2 días consecutivos | Alta |
| Mortalidad diaria | >0.1% del lote | Alta |
| Consumo alimento | ±15% fuera de rango | Alta |
| Consumo agua | Caída >20% promedio 3 días | **Crítica** |
| Temperatura | >28°C o <16°C | Alta |
| Amoníaco | >15 ppm | Alta |
| Stock insumo/alimento | Bajo mínimo | Media |
| Vacunación | Fecha próxima | Media |
| Mantenimiento | Equipo vencido | Baja |
| Periodo de retiro | Activo | Crítica |
| Uniformidad | <75% en recría | Alta |

**Canales**: In-app, Email, WhatsApp Business API, SMS

**Criterio de aprobación**:
- Build exitoso
- Alertas se activan según reglas
- Configuración de umbrales por lote/global
- Notificaciones in-app con badge

---

## F22 — Presupuestos y Escenarios

**Objetivo**: Gestión de presupuestos por lote/galpón con simulador de escenarios.

**Dependencias**: F2, F3, F5, F6

**Archivos a modificar**:
- `src/app/presupuestos/page.tsx` — formulario de presupuesto + simulación
- API: `GET/POST /api/finanzas/presupuestos`
- Tabla: `presupuestos`

**Simulador**:
- "¿Qué pasa si el maíz sube 15%?" → recalcular costo por huevo
- "¿Si la postura cae 5%?" → impacto en margen
- "¿Si extiendo el lote 10 semanas?" → rentabilidad marginal

**Criterio de aprobación**:
- Build exitoso
- Presupuesto por lote/galpón/año
- Comparativa presupuesto vs real
- Simulador interactivo

---

## F23 — Análisis Económico y Rentabilidad

**Objetivo**: Dashboard financiero con KPIs de rentabilidad por lote y línea genética.

**Dependencias**: F2, F3, F5

**Archivos a modificar**:
- `src/app/finanzas/page.tsx` — dashboard financiero
- API: `GET /api/finanzas/resumen-lote/{id}`, `GET /api/finanzas/costo-por-huevo`, `GET /api/finanzas/estado-resultados`
- Tablas: `costos_lote`, `resumen_lote`

**KPIs**:
- Costo por huevo: `gasto_total / huevos_producidos`
- Costo por docena
- Margen bruto: `ingreso_huevos - costo_alimento`
- Punto de equilibrio: semana donde ingreso = costo total
- ROI del lote
- Huevos por ave alojada (HAA)
- Conversión alimenticia
- Viabilidad

**Criterio de aprobación**:
- Build exitoso
- KPIs calculados con datos reales
- Gráfico de punto de equilibrio
- Comparativa entre lotes
- Proyección de rentabilidad

---

## F24 — Mantenimiento de Equipos e Infraestructura

**Objetivo**: Gestión de equipos con mantenimiento preventivo y correctivo programado.

**Dependencias**: F2, F3, F5, F6

**Archivos a crear**:
- `src/app/mantenimiento/page.tsx` — listado de equipos + historial
- API: `GET/POST /api/mantenimiento/equipos`, `GET/POST /api/mantenimiento/registro`, `GET /api/mantenimiento/proximos`
- Tablas: `equipos`, `mantenimiento`

**Equipos**:
| Equipo | Frecuencia |
|--------|-----------|
| Comederos (cadena/plato) | Mensual |
| Bebederos (nipple/copa) | Semanal |
| Cortinas automáticas | Mensual |
| Extractores/ventiladores | Trimestral |
| Generador eléctrico | Mensual |
| Nebulización / cooling | Trimestral |
| Sistema de alarma | Semanal |
| Básculas | Semestral |
| Clasificadora de huevos | Según fabricante |

**Criterio de aprobación**:
- Build exitoso
- CRUD de equipos por galpón
- Mantenimiento preventivo con alerta 7 días antes
- Historial por equipo
- Costos de mantenimiento

---

## F25 — Reportes PDF y Exportación

**Objetivo**: Generación de reportes en PDF y exportación a Excel.

**Dependencias**:
- `npm install exceljs`
- `npm install @react-pdf/renderer` o usar `html2canvas` + `jspdf`

**Archivos a crear/modificar**:
- `src/lib/reportes/produccion-diaria.ts` — generación de PDF
- `src/lib/reportes/informe-semanal.ts`
- `src/lib/reportes/informe-mensual.ts`
- `src/lib/reportes/resumen-economico.ts`
- `src/lib/reportes/exportar-excel.ts` — exportación con exceljs
- API: `GET /api/reportes/produccion-diaria/{id}/pdf`, `GET /api/reportes/exportar`

**Reportes**:
- Informe diario de producción
- Informe semanal de mortalidad
- Informe de clasificación y ventas
- Resumen económico mensual
- Exportación de datos a Excel (.xlsx)

**Criterio de aprobación**:
- Build exitoso
- PDF genera y descarga correctamente
- Excel exporta datos filtrados
- Envío automático de reportes programado

---

## F26 — PWA y sincronización offline

**Objetivo**: Configurar Service Worker para funcionamiento offline con sincronización posterior.

**Dependencias**:
- `npm install next-pwa`
- IndexedDB (localforage o idb)

**Archivos a crear/modificar**:
- `next.config.ts` — configurar PWA
- `src/lib/sw.ts` — service worker
- `src/lib/indexed-db.ts` — almacenamiento local offline
- `src/lib/sync-queue.ts` — cola de sincronización
- Componente `sync-indicator.tsx` — indicador visual de estado

**Regla de negocio**:
- Los registros offline se sincronizan con "última escritura gana"
- Indicador visual: ✔ sincronizado, ⏳ pendiente, ✕ error

**Criterio de aprobación**:
- Build exitoso
- Service worker cachea la aplicación
- Registro diario funciona sin internet
- Sincronización automática al recuperar conexión
- Indicador de estado visible

---

## F27 — Accesibilidad WCAG 2.2 AA

**Objetivo**: Auditar y corregir accesibilidad en todas las pantallas.

**Archivos a modificar**:
- Todos los formularios: agregar `htmlFor`/`id` en labels
- Todas las tablas: `scope="col"` en `<th>`
- Todos los botones icono: `aria-label`
- Todos los toggles: `role="switch"`, `aria-checked`
- Agregar skip link en layout
- Tablas: reemplazar color-only info con texto + color
- Agregar `aria-live` en zonas de error/loading

**Criterio de aprobación**:
- Build exitoso
- Skip link visible al hacer Tab
- Todos los labels asociados con `htmlFor`/`id`
- Tablas con `scope="col"`
- Colores no son el único medio de información
- Navegación completa con teclado

---

## F28 — Responsive design completo

**Objetivo**: Todas las pantallas funcionales en teléfonos, tablets y computadores.

**Archivos a modificar**:
- `src/app/layout.tsx` — sidebar colapsable en mobile
- Todas las páginas: `overflow-x-auto` en tablas
- KPIs: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`
- Formularios: `grid-cols-1 sm:grid-cols-2`
- Headers: `flex-col sm:flex-row`
- Botones: touch targets ≥44px

**Criterio de aprobación**:
- Build exitoso
- Sidebar se oculta en <1024px con menú hamburguesa
- Tablas con scroll horizontal
- KPIs responsivos
- Formularios usables en mobile

---

## F29 — Auditoría y Seguridad

**Objetivo**: Implementar medidas de seguridad para entorno industrial.

**Archivos a crear/modificar**:
- RLS (Row Level Security) en Neon — políticas por tenant/rol
- Rate limiting en endpoints API
- CSP headers en `next.config.ts`
- Auditoría de cambios en datos sensibles (costos, precios, inventario)
- Logging de acciones críticas (tabla `auditoria_logs`)
- Backup diario automático
- 2FA para roles admin

**Tabla nueva**:
```prisma
model AuditoriaLog {
  id        String   @id @default(uuid())
  usuarioId String?
  accion    String   // 'crear_lote', 'cerrar_lote', 'registrar_costo', etc.
  entidad   String   // 'lotes', 'costos_lote', etc.
  entidadId String?
  detalle   Json?
  ip        String?
  createdAt DateTime @default(now())
  @@map("auditoria_logs")
}
```

**Criterio de aprobación**:
- Build exitoso
- Rate limiter activo en endpoints públicos
- CSP headers configurados
- Logs de auditoría para acciones críticas
- 2FA configurable para admin
- Backups automáticos verificados

---

## Apéndice: Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16+ con App Router y TypeScript |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Gráficos | Recharts |
| Backend | Next.js API Routes + Server Actions |
| Base de Datos | Neon (PostgreSQL serverless) + Prisma ORM v7 |
| Autenticación | NextAuth.js v5 (Auth.js) |
| Formularios | react-hook-form + @hookform/resolvers + Zod |
| PWA | next-pwa + IndexedDB |
| Cache | Upstash Redis (opcional) |
| PDF Reportes | exceljs + jspdf / @react-pdf |
| Despliegue | Vercel + Docker (local dev) |
