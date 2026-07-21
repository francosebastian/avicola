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
| F1 — Autenticación y Roles | ⏳ Pendiente | — |
| F2 — Base de datos + Schema | ⏳ Pendiente | — |
| F3 — API Routes con validación | ⏳ Pendiente | — |
| F4 — Layout global, loading y error states | ⏳ Pendiente | — |
| F5 — Tipos TypeScript compartidos | ⏳ Pendiente | — |
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
| F19 — Gestión de Residuos | ⏳ Pendiente | F5 |
| F20 — Gráficos y Dashboard de KPIs | ⏳ Pendiente | F4 |
| F21 — Alertas y Notificaciones | ⏳ Pendiente | — |
| F22 — Presupuestos y Análisis Económico | ⏳ Pendiente | F5 |
| F23 — Accesibilidad WCAG 2.2 AA | ⏳ Pendiente | — |
| F24 — Responsive design completo | ⏳ Pendiente | — |
| F25 — PWA y sincronización offline | ⏳ Pendiente | — |
| F26 — Reportes PDF y exportación | ⏳ Pendiente | — |
| F27 — Auditoría y Seguridad | ⏳ Pendiente | — |

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
- `src/app/api/auth/[...nextauth]/route.ts` — API route de autenticación
- `src/components/auth/session-provider.tsx` — SessionProvider wrapper
- `src/middleware.ts` — proteger rutas según rol (admin, supervisor, galponero, veterinario)
- `src/app/(dashboard)/layout.tsx` — layout protegido con sidebar

**Reglas de autorización**:
- `admin`: acceso total
- `supervisor`: lotes, producción, sanidad, personal a cargo
- `galponero`: solo registro diario de su galpón/sección
- `veterinario`: sanidad, necropsias, bioseguridad
- `bodeguero`: inventarios, packing

**Criterio de aprobación**:
- Build exitoso (`npm run build`)
- Login con email/contraseña redirige al dashboard
- Login con PIN redirige al registro diario
- middleware redirige a `/login` si no hay sesión
- middleware retorna 403 si rol no tiene permiso

**Pruebas de validación**:
```bash
# 1. Build exitoso
npm run build 2>&1 | grep -i "error"; echo "Exit: $?"

# 2. Login page responde
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login

# 3. Dashboard sin sesión redirige a login
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/lotes
# Debe ser 302 (redirect) o 401

# 4. Login como galponero no puede acceder a /configuracion
# (requiere prueba con sesión real)
```

---

## F2 — Base de datos + Schema

**Objetivo**: Implementar el esquema completo de base de datos con Drizzle ORM y Neon PostgreSQL.

**Dependencias**:
- `npm install drizzle-orm @neondatabase/serverless dotenv`
- `npm install -D drizzle-kit`

**Archivos a crear/modificar**:
- `src/db/schema/` — todos los modelos del spec (`lotes`, `galpones`, `secciones`, `registro_diario`, `consumo_agua`, `registros_ambientales`, `formulas_alimento`, `recepcion_insumos`, `stock_insumos`, `fabricacion_alimento`, `registro_vacunacion`, `registro_tratamientos`, `necropsias`, `registro_visitas`, `checklist_bioseguridad`, `control_calidad_huevo`, `trazabilidad`, `registro_packing`, `formato_cajas`, `inventario_packing`, `despachos`, `detalle_despacho`, `almacenes`, `inventario_productos`, `movimientos_inventario`, `inventario_huevos`, `equipos`, `mantenimiento`, `costos_lote`, `resumen_lote`, `presupuestos`, `residuos`, `curvas_estandar`, `configuracion_alertas`, `usuarios`)
- `src/db/index.ts` — conexión a Neon
- `drizzle.config.ts` — configuración de Drizzle Kit
- `src/db/seed.ts` — datos de prueba

**Tablas** (ver `docs/avicola.md` para esquema detallado):

| # | Tabla | Módulo |
|---|-------|--------|
| 1-5 | Configuración | usuarios, galpones, secciones, curvas_estandar, configuracion_alertas |
| 6-7 | Lotes | lotes, eventos_lote |
| 8-9 | Producción | registro_diario, muestreo_peso |
| 10 | Agua | consumo_agua |
| 11-12 | Iluminación | programa_iluminacion, registro_iluminacion_diario |
| 13 | Ambiental | registros_ambientales |
| 14-19 | Alimentación | formulas_alimento, consumo_alimento_diario, recepcion_insumos, stock_insumos, fabricacion_alimento, detalle_fabricacion |
| 20-24 | Sanidad | registro_vacunacion, registro_tratamientos, necropsias, registro_visitas, checklist_bioseguridad |
| 25-26 | Calidad | control_calidad_huevo, trazabilidad |
| 27-29 | Packing | registro_packing, formato_cajas, inventario_packing |
| 30-31 | Despacho | despachos, detalle_despacho |
| 32-35 | Inventario | almacenes, inventario_productos, movimientos_inventario, inventario_huevos |
| 36-37 | Mantenimiento | equipos, mantenimiento |
| 38-40 | Finanzas | costos_lote, resumen_lote, presupuestos |
| 41 | Residuos | residuos |

**Criterio de aprobación**:
- `npx drizzle-kit generate` genera migraciones sin errores
- `npx drizzle-kit migrate` aplica las tablas en Neon
- Seed inserta datos de prueba
- Conexión a Neon funciona con las variables de entorno

**Pruebas de validación**:
```bash
# 1. Generar migraciones
npx drizzle-kit generate 2>&1 | grep -i "error"

# 2. Aplicar migraciones
npx drizzle-kit migrate 2>&1 | grep -i "error"

# 3. Verificar tablas creadas
# (usar consola de Neon o psql)
```

---

## F3 — API Routes con validación Zod

**Objetivo**: Crear endpoints REST para todos los módulos con validación Zod compartida.

**Archivos a crear**:
- `src/lib/validations/lotes.ts` — schemas Zod para lotes
- `src/lib/validations/produccion.ts`
- `src/lib/validations/packing.ts`
- `src/lib/validations/despacho.ts`
- `src/lib/validations/alimentacion.ts`
- `src/lib/validations/sanidad.ts`
- `src/lib/validations/inventario.ts`
- `src/app/api/lotes/route.ts` — GET (listar), POST (crear)
- `src/app/api/lotes/[id]/route.ts` — GET, PUT, PATCH
- `src/app/api/produccion/registro-diario/route.ts`
- `src/app/api/packing/registro/route.ts`
- `src/app/api/packing/inventario/route.ts`
- `src/app/api/despacho/registro/route.ts`
- `src/app/api/despacho/balance-diario/route.ts`
- `src/app/api/agua/consumo/route.ts`
- `src/app/api/ambientales/route.ts`
- `src/app/api/iluminacion/route.ts`
- `src/app/api/alimentacion/route.ts`
- `src/app/api/fabrica/route.ts`
- `src/app/api/sanidad/route.ts`
- `src/app/api/bioseguridad/route.ts`
- `src/app/api/calidad/route.ts`
- `src/app/api/inventario/route.ts`
- `src/app/api/residuos/route.ts`
- `src/app/api/alertas/route.ts`
- `src/app/api/finanzas/route.ts`

**Criterio de aprobación**:
- Build exitoso
- POST /api/lotes con body válido crea registro en DB
- POST /api/lotes con body inválido retorna 400 con errores Zod
- GET /api/lotes retorna lista paginada
- GET /api/lotes/:id retorna detalle con relaciones
- Los endpoints de gráficos retornan datos agregados correctamente

**Pruebas de validación**:
```bash
# 1. Probar creación de lote
curl -s -X POST http://localhost:3000/api/lotes \
  -H "Content-Type: application/json" \
  -d '{"codigo_lote":"H-036","seccion_id":"...","linea_genetica":"Hy-Line Brown","cantidad_inicial":5000,"fecha_recepcion":"2026-07-21"}'

# 2. Probar validación (debe fallar)
curl -s -X POST http://localhost:3000/api/lotes \
  -H "Content-Type: application/json" \
  -d '{"codigo_lote":""}' | grep -c 'ZodError'

# 3. Listar lotes
curl -s http://localhost:3000/api/lotes | head -c 200
```

---

## F4 — Layout global, loading y error states

**Objetivo**: Agregar loading skeletons, error boundaries y estados vacíos en todas las páginas.

**Archivos a crear/modificar**:
- `src/app/loading.tsx` — loading global con spinner
- `src/app/error.tsx` — error boundary global con botón reintentar
- `src/app/lotes/loading.tsx` — skeleton de tabla de lotes
- `src/app/lotes/[id]/loading.tsx` — skeleton de detalle de lote
- `src/app/produccion/loading.tsx`
- `src/app/packing/loading.tsx`
- `src/app/despacho/loading.tsx`
- `src/app/graficos/loading.tsx`
- `src/components/ui/skeleton.tsx` — componente Skeleton de shadcn/ui
- `src/components/empty-state.tsx` — componente reutilizable "No hay registros"
- `src/components/data-table.tsx` — tabla reutilizable con paginación y empty state
- Todas las páginas: reemplazar `key={i}` por keys únicas basadas en IDs
- Todas las páginas: agregar `scope="col"` en `<th>`
- Todas las páginas: agregar `overflow-x-auto` en tablas anchas

**Criterio de aprobación**:
- Build exitoso
- Cada página tiene su propio `loading.tsx`
- Error boundary global atrapa errores no manejados
- Tablas vacías muestran "No hay registros" con icono
- Skeleton visible durante carga
- Scroll horizontal en tablas con 6+ columnas

**Pruebas de validación**:
```bash
# 1. Verificar loading states
test -f src/app/lotes/loading.tsx && echo "OK" || echo "FALTA"
test -f src/app/packing/loading.tsx && echo "OK" || echo "FALTA"

# 2. Verificar empty-state component
test -f src/components/empty-state.tsx && echo "OK" || echo "FALTA"

# 3. Verificar skeleton component
test -f src/components/ui/skeleton.tsx && echo "OK" || echo "FALTA"

# 4. Build exitoso
npm run build 2>&1 | grep -i "error"; echo "Exit: $?"
```

---

## F5 — Tipos TypeScript compartidos

**Objetivo**: Definir interfaces y tipos para todas las entidades del sistema.

**Archivos a crear**:
- `src/types/index.ts` — tipos base
- `src/types/lotes.ts` — `Lote`, `EventoLote`, `LoteStatus`
- `src/types/produccion.ts` — `RegistroDiario`, `MuestreoPeso`
- `src/types/packing.ts` — `RegistroPacking`, `FormatoCaja`, `InventarioPacking`
- `src/types/despacho.ts` — `Despacho`, `DetalleDespacho`
- `src/types/alimentacion.ts` — `FormulaAlimento`, `RecepcionInsumo`, `StockInsumo`, `FabricacionAlimento`
- `src/types/agua.ts` — `ConsumoAgua`
- `src/types/ambiental.ts` — `RegistroAmbiental`
- `src/types/iluminacion.ts` — `ProgramaIluminacion`, `RegistroIluminacion`
- `src/types/sanidad.ts` — `RegistroVacunacion`, `RegistroTratamiento`, `Necropsia`
- `src/types/bioseguridad.ts` — `RegistroVisita`, `ChecklistBioseguridad`
- `src/types/calidad.ts` — `ControlCalidad`, `Trazabilidad`
- `src/types/inventario.ts` — `Almacen`, `Producto`, `MovimientoInventario`
- `src/types/mantenimiento.ts` — `Equipo`, `Mantenimiento`
- `src/types/finanzas.ts` — `CostoLote`, `ResumenLote`, `Presupuesto`
- `src/types/residuos.ts` — `Residuo`
- `src/types/graficos.ts` — interfaces para datos de gráficos (CurvaPosturaData, MortalidadData, etc.)
- `src/types/alertas.ts` — `Alerta`, `ConfigAlerta`

**Criterio de aprobación**:
- Build exitoso
- Todos los tipos se exportan desde `src/types/index.ts`
- No hay tipos `any` en las interfaces
- Los tipos de gráficos coinciden con las interfaces del spec

**Pruebas de validación**:
```bash
# 1. Verificar que los tipos existen
for f in lotes produccion packing despacho alimentacion agua ambiental iluminacion sanidad bioseguridad calidad inventario mantenimiento finanzas residuos graficos alertas; do
  test -f "src/types/$f.ts" && echo "$f: OK" || echo "$f: FALTA"
done

# 2. Verificar que el barrel export existe
grep -c "export" src/types/index.ts

# 3. Build exitoso
npm run build 2>&1 | grep -i "error"; echo "Exit: $?"
```

---

## F6 — Formularios funcionales (react-hook-form + Zod)

**Objetivo**: Hacer que todos los formularios del prototipo envíen datos reales.

**Dependencias**:
- `npm install react-hook-form @hookform/resolvers`

**Archivos a modificar**:
- `src/app/lotes/nuevo/page.tsx` — migrar a react-hook-form + Zod, enviar POST a `/api/lotes`
- `src/app/produccion/page.tsx` — formulario de registro diario funcional
- `src/app/packing/page.tsx` — formulario de packing funcional
- `src/app/despacho/page.tsx` — formulario de despacho funcional
- `src/app/fabrica-alimento/page.tsx` — formularios de recepción y fabricación funcionales
- `src/app/sanidad/page.tsx` — formularios de vacunación/tratamiento
- `src/app/bioseguridad/page.tsx` — checklist persistente
- `src/app/calidad/page.tsx` — formulario de control de calidad

**Requerimientos**:
- Todos los inputs usan `value` + `onChange` controlados
- Validación con Zod (schemas de F3)
- `<form>` wrapping con `onSubmit`
- Toast de éxito/error con Sonner
- Loading state en botón de submit
- Errores de campo mostrados inline

**Criterio de aprobación**:
- Build exitoso
- Todos los formularios tienen `<form>` + `onSubmit`
- Los datos se persisten en DB vía API
- Errores de validación se muestran inline
- Toast de éxito aparece al guardar

**Pruebas de validación**:
```bash
# 1. Build exitoso
npm run build 2>&1 | grep -i "error"; echo "Exit: $?"

# 2. Verificar que todos los formularios tienen form + onSubmit
grep -l '<form' src/app/*/page.tsx src/app/*/nuevo/page.tsx

# 3. Verificar validación Zod
grep -r 'z\.object' src/lib/validations/ | wc -l
# Debe ser > 0
```

---

## F7 — Dashboard con datos reales

**Objetivo**: Reemplazar datos hardcodeados del dashboard con datos desde API.

**Dependencias**: F2, F3

**Archivos a modificar**:
- `src/app/page.tsx` — reemplazar datos mock con Server Components que llaman a API
- KPIs: postura_hoy, huevos_hoy, aves_vivas, mortalidad, conversión desde DB
- Gráfico de curva de postura: datos desde `GET /api/metricas/curva-postura`
- Gráfico de clasificación: datos desde `GET /api/packing/resumen-diario`
- Alertas activas: desde `GET /api/alertas/activas`

**Server Component pattern**:
```tsx
// src/app/page.tsx (Server Component)
export default async function DashboardPage() {
  const [posturaData, clasificacionData, alertas] = await Promise.all([
    getCurvaPostura(),
    getResumenPacking(),
    getAlertasActivas(),
  ])
  return <DashboardClient data={{ posturaData, clasificacionData, alertas }} />
}
```

**Criterio de aprobación**:
- Build exitoso
- Dashboard muestra datos reales desde DB
- Los números cambian al insertar datos de producción
- Las alertas reflejan reglas de negocio del spec
- Loading skeleton mientras carga

**Pruebas de validación**:
```bash
# 1. Build exitoso
npm run build 2>&1 | grep -i "error"; echo "Exit: $?"

# 2. Dashboard carga (requiere sesión)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

---

## F8 — Gestión de Lotes (CRUD)

**Objetivo**: Implementar CRUD completo de lotes con ciclo de vida.

**Dependencias**: F2, F3, F5, F6

**Archivos a modificar**:
- `src/app/lotes/page.tsx` — listar lotes desde DB, filtros por estado
- `src/app/lotes/nuevo/page.tsx` — formulario funcional (F6)
- `src/app/lotes/[id]/page.tsx` — detalle con KPIs, curva, eventos, pestañas
- `src/app/lotes/[id]/editar/page.tsx` — edición de lote
- API: `GET /api/lotes`, `POST /api/lotes`, `GET /api/lotes/:id`, `PUT /api/lotes/:id`, `PATCH /api/lotes/:id/estado`

**Regla de negocio**:
- Al cambiar estado de "recria" a "postura" → calcular fecha de inicio postura
- Al cerrar lote → inhabilitar registro diario, generar resumen económico

**Criterio de aprobación**:
- Build exitoso
- Lista de lotes con datos reales, paginada
- Crear lote redirige al detalle
- Editar lote actualiza datos
- Cambio de estado registra evento automático
- Tabla muestra loading/empty/error states

---

## F9 — Registro Diario de Producción

**Objetivo**: Formulario de registro diario funcional por sección.

**Dependencias**: F2, F3, F5, F6

**Archivos a modificar**:
- `src/app/produccion/page.tsx` — formulario con selector de sección, registro de aves/huevos/consumo
- API: `POST /api/produccion/registro-diario`, `GET /api/produccion/registro-diario`

**Reglas de negocio**:
- Unique por `(seccion_id, fecha)` — no duplicar registro del día
- Al guardar: actualizar `aves_vivas` del lote
- Validación: bajas ≤ aves vivas día anterior
- Móvil: teclado numérico por defecto

**Criterio de aprobación**:
- Build exitoso
- Registro diario se guarda en DB
- No permite duplicados para misma sección/fecha
- Validación de consistencia funciona
- Interfaz mobile-first

---

## F10 — Packing con cajas y formato configurable

**Objetivo**: Registro de packing por cajas con formato (180/100 uds), inventario acumulado.

**Dependencias**: F2, F3, F5, F6

**Archivos a modificar**:
- `src/app/packing/page.tsx` — registro por cajas + inventario acumulado
- API: `POST /api/packing/registro`, `GET /api/packing/inventario`, `PUT /api/packing/formato-cajas`

**Reglas de negocio**:
- Al confirmar packing: sumar cajas y unidades a `inventario_packing`
- Formato configurable por categoría (tabla `formato_cajas`)
- Merma calculada como diferencia entre total procesado y clasificado

**Criterio de aprobación**:
- Build exitoso
- Ingresar cajas calcula unidades automáticamente
- Al confirmar, el inventario de packing se actualiza
- El formato de cajas se puede configurar
- El balance diario muestra entradas

---

## F11 — Despacho y salidas de inventario

**Objetivo**: Registrar despachos con descuento automático de stock.

**Dependencias**: F2, F3, F5, F6, F10

**Archivos a modificar**:
- `src/app/despacho/page.tsx` — formulario de despacho + historial + balance
- API: `POST /api/despacho/registro`, `GET /api/despacho/balance-diario`, `GET /api/despacho/registro`

**Reglas de negocio**:
- Al confirmar despacho: descontar cajas de `inventario_packing`
- No permitir despachar más stock del disponible
- Balance diario: `stock_inicial + entradas_packing - salidas_despacho = stock_final`
- Alerta si stock cae bajo mínimo

**Criterio de aprobación**:
- Build exitoso
- Despacho descuenta stock automáticamente
- No permite stock negativo
- Balance diario muestra entradas y salidas correctamente
- Historial de despachos con detalle

---

## F12 — Monitoreo de Consumo de Agua

**Objetivo**: Registro y monitoreo de consumo de agua con alertas.

**Dependencias**: F2, F3, F5

**Archivos a modificar**:
- `src/app/agua/page.tsx` — gráfico de tendencia + tabla de lecturas
- API: `POST /api/agua/consumo`, `GET /api/agua/consumo`, `GET /api/agua/alertas`
- Regla de alerta: caída >20% respecto a promedio de 3 días

**Criterio de aprobación**:
- Build exitoso
- Registro de consumo diario por sección
- Gráfico con tendencia y línea de alerta
- Alerta se activa cuando consumo cae >20%

---

## F12+ — (próximas features siguen mismo formato)

Ver `docs/avicola.md` para especificación detallada de cada módulo.

<!--
Template para nuevas features:

## F{N} — {Nombre}

**Objetivo**: ...

**Dependencias**: ...

**Archivos a crear/modificar**:
- `...`

**Criterio de aprobación**:
- Build exitoso
- ...

**Pruebas de validación**:
```bash
...
```
-->

---

## Apéndice: Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14+ con App Router y TypeScript |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Gráficos | Recharts |
| Backend | Next.js API Routes + Server Actions |
| Base de Datos | Neon (PostgreSQL serverless) + Prisma ORM |
| Autenticación | NextAuth.js v5 (Auth.js) |
| Formularios | react-hook-form + @hookform/resolvers + Zod |
| PWA | next-pwa |
| Cache | Upstash Redis |
| Despliegue | Vercel |
