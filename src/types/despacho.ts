export interface Despacho {
  id: string
  fecha: Date | string
  horaSalida: Date | string
  chofer: string
  destino: string
  vehiculoPatente: string | null
  numeroGuia: string | null
  observaciones: string | null
  registradoPor: string | null
  createdAt: Date | string
  detalle: DetalleDespacho[]
}

export interface DetalleDespacho {
  id: string
  despachoId: string
  categoria: string
  cantidadCajas: number
  cantidadUnidades: number | null
}

export interface CreateDespachoInput {
  fecha: Date | string
  horaSalida?: Date | string
  chofer: string
  destino: string
  vehiculoPatente?: string | null
  numeroGuia?: string | null
  observaciones?: string | null
  registradoPor?: string | null
  detalle: Omit<DetalleDespacho, 'id' | 'despachoId'>[]
}

export interface BalanceDiario {
  fecha: Date | string
  produccionTotal: number
  embaladoCajas: Record<string, number>
  embaladoUnidades: number
  despachadoCajas: Record<string, number>
  despachadoUnidades: number
  mermasSucio: number
  mermasRoto: number
  mermasDescarte: number
  stockFinalCajas: Record<string, number>
  stockFinalUnidades: number
}
