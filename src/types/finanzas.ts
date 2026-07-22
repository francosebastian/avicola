export interface CostoLote {
  id: string
  loteId: string
  tipoCosto: string
  monto: number
  fecha: Date | string
  categoria: string | null
  descripcion: string | null
  createdAt: Date | string
}

export interface CreateCostoInput {
  loteId: string
  tipoCosto: string
  monto: number
  fecha: Date | string
  categoria?: string | null
  descripcion?: string | null
}

export interface ResumenLote {
  id: string
  loteId: string
  costoTotalAlimento: number | null
  costoTotalPollitas: number | null
  costoTotalOperativo: number | null
  ingresoTotalHuevos: number | null
  ingresoTotalGallinaza: number | null
  ingresoVentaDescarte: number | null
  updatedAt: Date | string
}

export interface Presupuesto {
  id: string
  loteId: string | null
  galponId: string | null
  anio: number
  tipo: string | null
  partidas: Record<string, unknown>
  createdAt: Date | string
  updatedAt: Date | string
}

export interface CreatePresupuestoInput {
  loteId?: string | null
  galponId?: string | null
  anio: number
  tipo?: string | null
  partidas: Record<string, unknown>
}
