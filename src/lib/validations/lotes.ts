import { z } from "zod"

export const createLoteSchema = z.object({
  codigoLote: z.string().min(1, "Código de lote requerido").max(50),
  seccionId: z.string().uuid("Sección inválida"),
  lineaGenetica: z.string().min(1, "Línea genética requerida"),
  proveedorPollita: z.string().max(200).optional(),
  cantidadInicial: z.number().int().positive("Cantidad debe ser positiva"),
  fechaRecepcion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida").optional(),
  pesoInicialPromedio: z.number().positive().optional(),
  costoPollitaUnitario: z.number().positive().optional(),
})

export const updateLoteSchema = z.object({
  codigoLote: z.string().min(1).max(50).optional(),
  seccionId: z.string().uuid().optional(),
  lineaGenetica: z.string().min(1).optional(),
  cantidadInicial: z.number().int().positive().optional(),
  estado: z.enum(["cria", "recria", "postura", "descarte", "cerrado"]).optional(),
})

export const changeEstadoSchema = z.object({
  estado: z.enum(["cria", "recria", "postura", "descarte", "cerrado"]),
})

export const listLotesSchema = z.object({
  estado: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
