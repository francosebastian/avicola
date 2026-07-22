import { z } from "zod"

export const createRegistroVacunacionSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
  tipoVacuna: z.string().min(1, "Tipo de vacuna requerido").max(200),
  fechaAplicacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  viaAplicacion: z.enum(["ocular", "im", "sc", "agua_bebida", "subcutanea"], {
    error: "Vía de aplicación inválida",
  }),
  dosisMl: z.number().nonnegative().optional(),
  loteVacuna: z.string().max(100).optional(),
  proveedorVacuna: z.string().max(200).optional(),
  aplicadoPor: z.string().max(200).optional(),
  observaciones: z.string().optional(),
})

export const updateRegistroVacunacionSchema = z.object({
  tipoVacuna: z.string().min(1).max(200).optional(),
  fechaAplicacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  viaAplicacion: z.enum(["ocular", "im", "sc", "agua_bebida", "subcutanea"]).optional(),
  dosisMl: z.number().nonnegative().optional(),
  loteVacuna: z.string().max(100).optional(),
  proveedorVacuna: z.string().max(200).optional(),
  aplicadoPor: z.string().max(200).optional(),
  observaciones: z.string().optional(),
})

export const listRegistrosVacunacionSchema = z.object({
  loteId: z.string().uuid().optional(),
  tipoVacuna: z.string().optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createRegistroTratamientoSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
  medicamento: z.string().min(1, "Medicamento requerido").max(200),
  principioActivo: z.string().max(200).optional(),
  dosis: z.number().nonnegative().optional(),
  viaAplicacion: z.string().max(50).optional(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  periodoRetiroHoras: z.number().int().nonnegative().optional(),
  motivo: z.string().optional(),
  responsable: z.string().max(200).optional(),
})

export const updateRegistroTratamientoSchema = z.object({
  medicamento: z.string().min(1).max(200).optional(),
  principioActivo: z.string().max(200).optional(),
  dosis: z.number().nonnegative().optional(),
  viaAplicacion: z.string().max(50).optional(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  periodoRetiroHoras: z.number().int().nonnegative().optional(),
  motivo: z.string().optional(),
  responsable: z.string().max(200).optional(),
})

export const listRegistrosTratamientoSchema = z.object({
  loteId: z.string().uuid().optional(),
  medicamento: z.string().optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
