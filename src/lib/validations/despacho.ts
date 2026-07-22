import { z } from "zod"

export const createDespachoSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  chofer: z.string().min(1, "Chofer requerido").max(200),
  destino: z.string().min(1, "Destino requerido"),
  vehiculoPatente: z.string().max(20).optional(),
  numeroGuia: z.string().max(50).optional(),
  observaciones: z.string().optional(),
  detalle: z.array(z.object({
    categoria: z.string().min(1, "Categoría requerida"),
    cantidadCajas: z.number().int().positive("Cantidad de cajas debe ser positiva"),
    cantidadUnidades: z.number().int().nonnegative().optional(),
  })).min(1, "Debe tener al menos un detalle"),
})

export const updateDespachoSchema = z.object({
  chofer: z.string().min(1).max(200).optional(),
  destino: z.string().min(1).optional(),
  vehiculoPatente: z.string().max(20).optional(),
  numeroGuia: z.string().max(50).optional(),
  observaciones: z.string().optional(),
})

export const listDespachosSchema = z.object({
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createDetalleDespachoSchema = z.object({
  despachoId: z.string().uuid("Despacho inválido"),
  categoria: z.string().min(1, "Categoría requerida"),
  cantidadCajas: z.number().int().positive("Cantidad de cajas debe ser positiva"),
  cantidadUnidades: z.number().int().nonnegative().optional(),
})

export const updateDetalleDespachoSchema = z.object({
  cantidadCajas: z.number().int().positive().optional(),
  cantidadUnidades: z.number().int().nonnegative().optional(),
})
