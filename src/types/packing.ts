export interface RegistroPacking {
  id: string
  fecha: Date | string
  loteId: string
  seccionId: string
  huevosSucio: number
  huevosRoto: number
  huevosDescarte: number
  cajasJumbo: number
  cajasSuper: number
  cajasExtra: number
  cajasPrimera: number
  cajasSegunda: number
  cajasTercera: number
  registradoPor: string | null
  createdAt: Date | string
}

export interface FormatoCaja {
  id: string
  categoria: string
  unidadesPorCaja: number
  activo: boolean
}

export interface InventarioPacking {
  id: string
  categoria: string
  stockCajas: number
  stockUnidades: number
  stockMinimoCajas: number
  updatedAt: Date | string
}

export interface CreatePackingInput {
  fecha: Date | string
  loteId: string
  seccionId: string
  huevosSucio?: number
  huevosRoto?: number
  huevosDescarte?: number
  cajasJumbo?: number
  cajasSuper?: number
  cajasExtra?: number
  cajasPrimera?: number
  cajasSegunda?: number
  cajasTercera?: number
  registradoPor?: string | null
}
