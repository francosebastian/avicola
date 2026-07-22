import { z } from "zod"

export const createRegistroPackingSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
  seccionId: z.string().uuid("Sección inválida"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  huevosSucio: z.number().int().nonnegative().default(0),
  huevosRoto: z.number().int().nonnegative().default(0),
  huevosDescarte: z.number().int().nonnegative().default(0),
  cajasJumbo: z.number().int().nonnegative().default(0),
  cajasSuper: z.number().int().nonnegative().default(0),
  cajasExtra: z.number().int().nonnegative().default(0),
  cajasPrimera: z.number().int().nonnegative().default(0),
  cajasSegunda: z.number().int().nonnegative().default(0),
  cajasTercera: z.number().int().nonnegative().default(0),
})

export const updateRegistroPackingSchema = z.object({
  huevosSucio: z.number().int().nonnegative().optional(),
  huevosRoto: z.number().int().nonnegative().optional(),
  huevosDescarte: z.number().int().nonnegative().optional(),
  cajasJumbo: z.number().int().nonnegative().optional(),
  cajasSuper: z.number().int().nonnegative().optional(),
  cajasExtra: z.number().int().nonnegative().optional(),
  cajasPrimera: z.number().int().nonnegative().optional(),
  cajasSegunda: z.number().int().nonnegative().optional(),
  cajasTercera: z.number().int().nonnegative().optional(),
})

export const listRegistrosPackingSchema = z.object({
  loteId: z.string().uuid().optional(),
  seccionId: z.string().uuid().optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createFormatoCajaSchema = z.object({
  categoria: z.string().min(1, "Categoría requerida").max(50),
  unidadesPorCaja: z.number().int().positive("Unidades por caja debe ser positiva"),
})

export const updateFormatoCajaSchema = z.object({
  categoria: z.string().min(1).max(50).optional(),
  unidadesPorCaja: z.number().int().positive().optional(),
})

export const listFormatosCajaSchema = z.object({
  activo: z.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
