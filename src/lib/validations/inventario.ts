import { z } from "zod"

export const createProductoSchema = z.object({
  almacenId: z.string().uuid("Almacén inválido"),
  nombre: z.string().min(1, "Nombre requerido").max(200),
  sku: z.string().max(50).optional(),
  categoria: z.string().max(100).optional(),
  unidadMedida: z.string().min(1, "Unidad de medida requerida").max(50),
  stockActual: z.number().nonnegative("Stock actual no puede ser negativo").default(0),
  stockMinimo: z.number().nonnegative().default(0),
  costoPromedioUnitario: z.number().nonnegative().optional(),
})

export const updateProductoSchema = z.object({
  nombre: z.string().min(1).max(200).optional(),
  sku: z.string().max(50).optional(),
  categoria: z.string().max(100).optional(),
  unidadMedida: z.string().min(1).max(50).optional(),
  stockActual: z.number().nonnegative().optional(),
  stockMinimo: z.number().nonnegative().optional(),
  costoPromedioUnitario: z.number().nonnegative().optional(),
})

export const listProductosSchema = z.object({
  almacenId: z.string().uuid().optional(),
  categoria: z.string().optional(),
  activo: z.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createMovimientoSchema = z.object({
  productoId: z.string().uuid("Producto inválido"),
  tipoMovimiento: z.enum(["entrada", "salida", "transferencia", "ajuste"], {
    error: "Tipo de movimiento inválido",
  }),
  cantidad: z.number().positive("Cantidad debe ser positiva"),
  referenciaTipo: z.string().max(50).optional(),
  referenciaId: z.string().uuid().optional(),
  costoUnitario: z.number().nonnegative().optional(),
  loteProveedor: z.string().max(100).optional(),
  observaciones: z.string().optional(),
})

export const updateMovimientoSchema = z.object({
  observaciones: z.string().optional(),
})

export const listMovimientosSchema = z.object({
  productoId: z.string().uuid().optional(),
  tipoMovimiento: z.enum(["entrada", "salida", "transferencia", "ajuste"]).optional(),
  referenciaTipo: z.string().optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
