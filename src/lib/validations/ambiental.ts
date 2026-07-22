import { z } from "zod"

export const createRegistroAmbientalSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
  seccionId: z.string().uuid("Sección inválida"),
  fechaHora: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)),
  temperatura: z.number().optional(),
  humedad: z.number().min(0).max(100).optional(),
  amoniacoPpm: z.number().nonnegative().optional(),
  co2Ppm: z.number().nonnegative().optional(),
  velocidadAireMs: z.number().nonnegative().optional(),
})

export const updateRegistroAmbientalSchema = z.object({
  temperatura: z.number().optional(),
  humedad: z.number().min(0).max(100).optional(),
  amoniacoPpm: z.number().nonnegative().optional(),
  co2Ppm: z.number().nonnegative().optional(),
  velocidadAireMs: z.number().nonnegative().optional(),
})

export const listRegistrosAmbientalesSchema = z.object({
  loteId: z.string().uuid().optional(),
  seccionId: z.string().uuid().optional(),
  fechaHoraDesde: z.string().optional(),
  fechaHoraHasta: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
