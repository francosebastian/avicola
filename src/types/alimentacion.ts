export interface FormulaAlimento {
  id: string
  nombre: string
  tipoAlimento: string
  ingredientes: FormulaIngrediente[]
  costoKgEstimado: number | null
  proteinaBruta: number | null
  energiaMetabolizable: number | null
  activo: boolean
}

export interface FormulaIngrediente {
  ingrediente: string
  porcentaje: number
}

export interface ConsumoAlimentoDiario {
  id: string
  loteId: string
  fecha: Date | string
  tipoAlimento: string
  cantidadKg: number
  formulaId: string | null
  inventarioMovimientoId: string | null
}

export interface RecepcionInsumo {
  id: string
  fechaLlegada: Date | string
  proveedor: string
  vehiculo: string | null
  patente: string | null
  tipoInsumo: string
  cantidadKg: number
  numeroLote: string
  numeroGuia: string
  createdAt: Date | string
}

export interface StockInsumo {
  id: string
  tipoInsumo: string
  stockActualKg: number
  stockMinimoKg: number
  updatedAt: Date | string
}

export interface FabricacionAlimento {
  id: string
  fecha: Date | string
  formulaId: string
  cantidadProducidaKg: number
  destinoGalponId: string | null
  destinoSeccionId: string | null
  loteFabricacion: string
  createdAt: Date | string
  detalle: DetalleFabricacion[]
}

export interface DetalleFabricacion {
  id: string
  fabricacionId: string
  tipoInsumo: string
  cantidadRequeridaKg: number
}

export interface CreateFabricacionInput {
  fecha: Date | string
  formulaId: string
  cantidadProducidaKg: number
  destinoGalponId?: string | null
  destinoSeccionId?: string | null
  loteFabricacion: string
  detalle: Omit<DetalleFabricacion, 'id' | 'fabricacionId'>[]
}
