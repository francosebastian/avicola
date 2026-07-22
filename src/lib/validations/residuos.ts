import { z } from "zod"

export const createResiduoSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  horaSalida: z.string().datetime({ offset: true }).optional(),
  tipo: z.enum(["gallinaza", "aves_muertas", "subproducto_huevo", "otros"], {
    error: "Tipo de residuo inválido",
  }),
  cantidad: z.number().positive("Cantidad debe ser positiva"),
  unidad: z.enum(["kg", "m3", "unidades", "docenas"], {
    error: "Unidad inválida",
  }),
  metodoDisposicion: z.string().optional(),
  transportista: z.string().max(200).optional(),
  patenteVehiculo: z.string().max(20).optional(),
  destinoDetalle: z.string().optional(),
  ingreso: z.number().nonnegative().default(0),
  costoDisposicion: z.number().nonnegative().default(0),
  observaciones: z.string().optional(),
})

export const updateResiduoSchema = z.object({
  cantidad: z.number().positive().optional(),
  unidad: z.enum(["kg", "m3", "unidades", "docenas"]).optional(),
  metodoDisposicion: z.string().optional(),
  transportista: z.string().max(200).optional(),
  patenteVehiculo: z.string().max(20).optional(),
  destinoDetalle: z.string().optional(),
  ingreso: z.number().nonnegative().optional(),
  costoDisposicion: z.number().nonnegative().optional(),
  observaciones: z.string().optional(),
})

export const listResiduosSchema = z.object({
  loteId: z.string().uuid().optional(),
  tipo: z.enum(["gallinaza", "aves_muertas", "subproducto_huevo", "otros"]).optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
