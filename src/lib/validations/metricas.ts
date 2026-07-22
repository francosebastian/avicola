import { z } from "zod"

export const dashboardParamsSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const resumenLoteParamsSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
})

export const comparativaLotesParamsSchema = z.object({
  loteIds: z.array(z.string().uuid()).min(2, "Debe seleccionar al menos 2 lotes").max(10, "Máximo 10 lotes"),
  metricas: z.array(
    z.enum(["postura", "mortalidad", "peso_promedio", "consumo_alimento", "conversion"])
  ).min(1, "Debe seleccionar al menos una métrica"),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const indicadoresEficienciaParamsSchema = z.object({
  loteId: z.string().uuid().optional(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const costosParamsSchema = z.object({
  loteId: z.string().uuid().optional(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  agruparPor: z.enum(["dia", "semana", "mes"]).default("mes"),
})
