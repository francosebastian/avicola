import { z } from "zod"

export const createEquipoSchema = z.object({
  galponId: z.string().uuid("Galpón inválido").optional(),
  nombre: z.string().min(1, "Nombre requerido").max(200),
  tipo: z.string().min(1, "Tipo requerido"),
  marca: z.string().max(100).optional(),
  modelo: z.string().max(100).optional(),
  numeroSerie: z.string().max(100).optional(),
  fechaInstalacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  frecuenciaMantencionDias: z.number().int().positive().optional(),
  proximaMantencion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  observaciones: z.string().optional(),
})

export const updateEquipoSchema = z.object({
  nombre: z.string().min(1).max(200).optional(),
  tipo: z.string().min(1).optional(),
  marca: z.string().max(100).optional(),
  modelo: z.string().max(100).optional(),
  numeroSerie: z.string().max(100).optional(),
  fechaInstalacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  frecuenciaMantencionDias: z.number().int().positive().optional(),
  proximaMantencion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  observaciones: z.string().optional(),
})

export const listEquiposSchema = z.object({
  galponId: z.string().uuid().optional(),
  tipo: z.string().optional(),
  activo: z.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createMantenimientoSchema = z.object({
  equipoId: z.string().uuid("Equipo inválido"),
  tipo: z.enum(["preventivo", "correctivo"], {
    error: "Tipo debe ser preventivo o correctivo",
  }),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  descripcion: z.string().min(1, "Descripción requerida"),
  repuestosUtilizados: z.string().optional(),
  costo: z.number().nonnegative().optional(),
  duracionHoras: z.number().nonnegative().optional(),
  responsable: z.string().max(200).optional(),
  proximaFechaSugerida: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const updateMantenimientoSchema = z.object({
  tipo: z.enum(["preventivo", "correctivo"]).optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  descripcion: z.string().min(1).optional(),
  repuestosUtilizados: z.string().optional(),
  costo: z.number().nonnegative().optional(),
  duracionHoras: z.number().nonnegative().optional(),
  responsable: z.string().max(200).optional(),
  proximaFechaSugerida: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const listMantenimientosSchema = z.object({
  equipoId: z.string().uuid().optional(),
  tipo: z.enum(["preventivo", "correctivo"]).optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
