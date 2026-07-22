import { z } from "zod"

export const createFormulaAlimentoSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido").max(200),
  tipoAlimento: z.string().min(1, "Tipo de alimento requerido"),
  ingredientes: z.array(z.object({
    ingrediente: z.string().min(1, "Ingrediente requerido"),
    porcentaje: z.number().min(0).max(100, "Porcentaje debe estar entre 0 y 100"),
  })).min(1, "Debe tener al menos un ingrediente"),
  costoKgEstimado: z.number().nonnegative().optional(),
  proteinaBruta: z.number().nonnegative().optional(),
  energiaMetabolizable: z.number().nonnegative().optional(),
})

export const updateFormulaAlimentoSchema = z.object({
  nombre: z.string().min(1).max(200).optional(),
  tipoAlimento: z.string().min(1).optional(),
  ingredientes: z.array(z.object({
    ingrediente: z.string().min(1),
    porcentaje: z.number().min(0).max(100),
  })).optional(),
  costoKgEstimado: z.number().nonnegative().optional(),
  proteinaBruta: z.number().nonnegative().optional(),
  energiaMetabolizable: z.number().nonnegative().optional(),
})

export const listFormulasAlimentoSchema = z.object({
  tipoAlimento: z.string().optional(),
  activo: z.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createConsumoAlimentoDiarioSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  tipoAlimento: z.string().min(1, "Tipo de alimento requerido"),
  cantidadKg: z.number().positive("Cantidad debe ser positiva"),
  formulaId: z.string().uuid().optional(),
})

export const updateConsumoAlimentoDiarioSchema = z.object({
  cantidadKg: z.number().positive().optional(),
  tipoAlimento: z.string().min(1).optional(),
  formulaId: z.string().uuid().optional(),
})

export const listConsumosAlimentoDiarioSchema = z.object({
  loteId: z.string().uuid().optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  tipoAlimento: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createRecepcionInsumoSchema = z.object({
  fechaLlegada: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  proveedor: z.string().min(1, "Proveedor requerido").max(200),
  vehiculo: z.string().max(50).optional(),
  patente: z.string().max(20).optional(),
  tipoInsumo: z.string().min(1, "Tipo de insumo requerido"),
  cantidadKg: z.number().positive("Cantidad debe ser positiva"),
  numeroLote: z.string().min(1, "Número de lote requerido"),
  numeroGuia: z.string().min(1, "Número de guía requerido"),
})

export const updateRecepcionInsumoSchema = z.object({
  proveedor: z.string().min(1).max(200).optional(),
  vehiculo: z.string().max(50).optional(),
  patente: z.string().max(20).optional(),
  cantidadKg: z.number().positive().optional(),
  numeroLote: z.string().min(1).optional(),
  numeroGuia: z.string().min(1).optional(),
})

export const listRecepcionesInsumoSchema = z.object({
  tipoInsumo: z.string().optional(),
  proveedor: z.string().optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createFabricacionAlimentoSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  formulaId: z.string().uuid("Fórmula inválida"),
  cantidadProducidaKg: z.number().positive("Cantidad debe ser positiva"),
  destinoGalponId: z.string().uuid().optional(),
  destinoSeccionId: z.string().uuid().optional(),
  loteFabricacion: z.string().min(1, "Lote de fabricación requerido"),
})

export const updateFabricacionAlimentoSchema = z.object({
  cantidadProducidaKg: z.number().positive().optional(),
  destinoGalponId: z.string().uuid().optional(),
  destinoSeccionId: z.string().uuid().optional(),
})

export const listFabricacionesAlimentoSchema = z.object({
  formulaId: z.string().uuid().optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
