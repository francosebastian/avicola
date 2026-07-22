import { z } from "zod"

export const createRegistroVisitaSchema = z.object({
  visitanteNombre: z.string().min(1, "Nombre del visitante requerido").max(200),
  visitanteEmpresa: z.string().max(200).optional(),
  visitanteRut: z.string().max(20).optional(),
  fechaVisita: z.string().datetime({ offset: true }).optional(),
  ultimaVisitaOtraGranja: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  periodoCuarentenaCumplido: z.boolean().default(false),
  vehiculoPlaca: z.string().max(20).optional(),
  vehiculoDesinfectado: z.boolean().default(false),
  autorizadoPor: z.string().max(200).optional(),
  observaciones: z.string().optional(),
})

export const updateRegistroVisitaSchema = z.object({
  visitanteNombre: z.string().min(1).max(200).optional(),
  visitanteEmpresa: z.string().max(200).optional(),
  visitanteRut: z.string().max(20).optional(),
  ultimaVisitaOtraGranja: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  periodoCuarentenaCumplido: z.boolean().optional(),
  vehiculoPlaca: z.string().max(20).optional(),
  vehiculoDesinfectado: z.boolean().optional(),
  autorizadoPor: z.string().max(200).optional(),
  observaciones: z.string().optional(),
})

export const listRegistrosVisitaSchema = z.object({
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createChecklistBioseguridadSchema = z.object({
  galponId: z.string().uuid("Galpón inválido"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  loteId: z.string().uuid().optional(),
  pediluviosActivos: z.boolean().optional(),
  cortinasBuenEstado: z.boolean().optional(),
  mallasAvesSilvestres: z.boolean().optional(),
  ausenciaRoedores: z.boolean().optional(),
  ausenciaMoscasExcesivas: z.boolean().optional(),
  rodaluvioFuncional: z.boolean().optional(),
  cercoPerimetralIntacto: z.boolean().optional(),
  observaciones: z.string().optional(),
})

export const updateChecklistBioseguridadSchema = z.object({
  pediluviosActivos: z.boolean().optional(),
  cortinasBuenEstado: z.boolean().optional(),
  mallasAvesSilvestres: z.boolean().optional(),
  ausenciaRoedores: z.boolean().optional(),
  ausenciaMoscasExcesivas: z.boolean().optional(),
  rodaluvioFuncional: z.boolean().optional(),
  cercoPerimetralIntacto: z.boolean().optional(),
  observaciones: z.string().optional(),
})

export const listChecklistsBioseguridadSchema = z.object({
  galponId: z.string().uuid().optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
