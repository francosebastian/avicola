import { z } from "zod"

export const produccionDiariaParamsSchema = z.object({
  loteId: z.string().uuid().optional(),
  seccionId: z.string().uuid().optional(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  agruparPor: z.enum(["dia", "semana", "mes"]).default("dia"),
})

export const posturaParamsSchema = z.object({
  loteId: z.string().uuid().optional(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const mortalidadParamsSchema = z.object({
  loteId: z.string().uuid().optional(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const pesoHuevoParamsSchema = z.object({
  loteId: z.string().uuid().optional(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const climaParamsSchema = z.object({
  seccionId: z.string().uuid().optional(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const packingParamsSchema = z.object({
  loteId: z.string().uuid().optional(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})
