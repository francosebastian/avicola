import { z } from "zod"

export const createControlCalidadHuevoSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  muestraId: z.number().int().nonnegative().optional(),
  pesoPromedioGramos: z.number().nonnegative().optional(),
  unidadHaugh: z.number().min(0).max(110, "Unidad Haugh fuera de rango").optional(),
  colorYema: z.number().int().min(1).max(15).optional(),
  resistenciaCascaraKgf: z.number().nonnegative().optional(),
  phClara: z.number().min(0).max(14).optional(),
  phYema: z.number().min(0).max(14).optional(),
  camaraAireMm: z.number().nonnegative().optional(),
  observaciones: z.string().optional(),
})

export const updateControlCalidadHuevoSchema = z.object({
  pesoPromedioGramos: z.number().nonnegative().optional(),
  unidadHaugh: z.number().min(0).max(110).optional(),
  colorYema: z.number().int().min(1).max(15).optional(),
  resistenciaCascaraKgf: z.number().nonnegative().optional(),
  phClara: z.number().min(0).max(14).optional(),
  phYema: z.number().min(0).max(14).optional(),
  camaraAireMm: z.number().nonnegative().optional(),
  observaciones: z.string().optional(),
})

export const listControlesCalidadHuevoSchema = z.object({
  loteId: z.string().uuid().optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createTrazabilidadSchema = z.object({
  codigoEnvase: z.string().min(1, "Código de envase requerido").max(100),
  loteId: z.string().uuid("Lote inválido"),
  seccionId: z.string().uuid().optional(),
  galponId: z.string().uuid().optional(),
  fechaPostura: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  clasificacion: z.string().min(1, "Clasificación requerida"),
  fechaDespacho: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  certificadoSanitario: z.string().optional(),
})

export const updateTrazabilidadSchema = z.object({
  clasificacion: z.string().min(1).optional(),
  fechaDespacho: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  certificadoSanitario: z.string().optional(),
})

export const listTrazabilidadSchema = z.object({
  loteId: z.string().uuid().optional(),
  codigoEnvase: z.string().optional(),
  clasificacion: z.string().optional(),
  fechaPosturaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaPosturaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
