export type ClasificacionCalibre =
  | 'JUMBO'
  | 'SUPER'
  | 'EXTRA'
  | 'PRIMERA'
  | 'SEGUNDA'
  | 'TERCERA'
  | 'SUBPRODUCTO'

export interface ControlCalidadHuevo {
  id: string
  loteId: string
  fecha: Date | string
  muestraId: number | null
  pesoPromedioGramos: number | null
  unidadHaugh: number | null
  colorYema: number | null
  resistenciaCascaraKgf: number | null
  phClara: number | null
  phYema: number | null
  camaraAireMm: number | null
  observaciones: string | null
  registradoPor: string | null
}

export interface CreateControlInput {
  loteId: string
  fecha: Date | string
  muestraId?: number | null
  pesoPromedioGramos?: number | null
  unidadHaugh?: number | null
  colorYema?: number | null
  resistenciaCascaraKgf?: number | null
  phClara?: number | null
  phYema?: number | null
  camaraAireMm?: number | null
  observaciones?: string | null
  registradoPor?: string | null
}

export interface Trazabilidad {
  id: string
  codigoEnvase: string
  loteId: string
  seccionId: string | null
  galponId: string | null
  fechaPostura: Date | string
  clasificacion: ClasificacionCalibre
  fechaDespacho: Date | string | null
  certificadoSanitario: string | null
  createdAt: Date | string
}

export interface CreateTrazabilidadInput {
  codigoEnvase: string
  loteId: string
  seccionId?: string | null
  galponId?: string | null
  fechaPostura: Date | string
  clasificacion: ClasificacionCalibre
  fechaDespacho?: Date | string | null
  certificadoSanitario?: string | null
}
