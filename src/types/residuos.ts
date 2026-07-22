export type TipoResiduo = 'gallinaza' | 'aves_muertas' | 'subproducto_huevo' | 'otros'

export interface Residuo {
  id: string
  loteId: string
  fecha: Date | string
  horaSalida: Date | string | null
  tipo: TipoResiduo
  cantidad: number
  unidad: string
  metodoDisposicion: string | null
  transportista: string | null
  patenteVehiculo: string | null
  destinoDetalle: string | null
  ingreso: number
  costoDisposicion: number
  observaciones: string | null
}

export interface CreateResiduoInput {
  loteId: string
  fecha: Date | string
  horaSalida?: Date | string | null
  tipo: TipoResiduo
  cantidad: number
  unidad: string
  metodoDisposicion?: string | null
  transportista?: string | null
  patenteVehiculo?: string | null
  destinoDetalle?: string | null
  ingreso?: number
  costoDisposicion?: number
  observaciones?: string | null
}
