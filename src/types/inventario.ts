export type TipoMovimiento = 'entrada' | 'salida' | 'transferencia' | 'ajuste'

export interface Almacen {
  id: string
  nombre: string
  tipo: string
  ubicacion: string | null
  responsable: string | null
  activo: boolean
}

export interface InventarioProducto {
  id: string
  almacenId: string
  nombre: string
  sku: string | null
  categoria: string | null
  unidadMedida: string
  stockActual: number
  stockMinimo: number
  costoPromedioUnitario: number | null
  activo: boolean
}

export interface MovimientoInventario {
  id: string
  productoId: string
  tipoMovimiento: TipoMovimiento
  cantidad: number
  saldoAnterior: number | null
  saldoNuevo: number | null
  referenciaTipo: string | null
  referenciaId: string | null
  costoUnitario: number | null
  loteProveedor: string | null
  observaciones: string | null
  createdBy: string | null
  createdAt: Date | string
}

export interface InventarioHuevo {
  id: string
  almacenId: string
  loteId: string
  clasificacion: string
  cantidadDocenas: number
  fechaProduccion: Date | string
  fechaVencimiento: Date | string | null
  stockActualDocenas: number
  ubicacion: string | null
}
