import { z } from "zod"

export const createCostoLoteSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
  tipoCosto: z.string().min(1, "Tipo de costo requerido"),
  monto: z.number().positive("Monto debe ser positivo"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  categoria: z.enum(["fijo", "variable"]).optional(),
  descripcion: z.string().optional(),
})

export const updateCostoLoteSchema = z.object({
  tipoCosto: z.string().min(1).optional(),
  monto: z.number().positive().optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  categoria: z.enum(["fijo", "variable"]).optional(),
  descripcion: z.string().optional(),
})

export const listCostosLoteSchema = z.object({
  loteId: z.string().uuid().optional(),
  tipoCosto: z.string().optional(),
  categoria: z.enum(["fijo", "variable"]).optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createPresupuestoSchema = z.object({
  loteId: z.string().uuid().optional(),
  galponId: z.string().uuid().optional(),
  anio: z.number().int().min(2000, "Año inválido").max(2100),
  tipo: z.string().optional(),
  partidas: z.record(z.string(), z.unknown(), {
    error: "Partidas debe ser un objeto JSON",
  }),
})

export const updatePresupuestoSchema = z.object({
  tipo: z.string().optional(),
  partidas: z.record(z.string(), z.unknown()).optional(),
})

export const listPresupuestosSchema = z.object({
  loteId: z.string().uuid().optional(),
  galponId: z.string().uuid().optional(),
  anio: z.coerce.number().int().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
