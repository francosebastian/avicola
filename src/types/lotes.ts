export type LoteStatus = 'cria' | 'recria' | 'postura' | 'descarte' | 'cerrado'

export interface Lote {
  id: string
  codigoLote: string
  seccionId: string
  lineaGenetica: string
  proveedorPollita: string | null
  cantidadInicial: number
  fechaRecepcion: Date | string
  fechaNacimiento: Date | string | null
  pesoInicialPromedio: number | null
  costoPollitaUnitario: number | null
  estado: LoteStatus
  fechaCierre: Date | string | null
  motivoCierre: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface EventoLote {
  id: string
  loteId: string
  tipoEvento: string
  fecha: Date | string
  descripcion: string | null
  fotoUrl: string | null
  createdBy: string | null
  createdAt: Date | string
}

export interface CreateLoteInput {
  codigoLote: string
  seccionId: string
  lineaGenetica: string
  proveedorPollita?: string | null
  cantidadInicial: number
  fechaRecepcion: Date | string
  fechaNacimiento?: Date | string | null
  pesoInicialPromedio?: number | null
  costoPollitaUnitario?: number | null
  estado?: LoteStatus
  fechaCierre?: Date | string | null
  motivoCierre?: string | null
}

export interface UpdateLoteInput {
  codigoLote?: string
  seccionId?: string
  lineaGenetica?: string
  proveedorPollita?: string | null
  cantidadInicial?: number
  fechaRecepcion?: Date | string
  fechaNacimiento?: Date | string | null
  pesoInicialPromedio?: number | null
  costoPollitaUnitario?: number | null
  estado?: LoteStatus
  fechaCierre?: Date | string | null
  motivoCierre?: string | null
}

export interface LoteResumen {
  loteId: string
  codigoLote: string
  lineaGenetica: string
  avesVivas: number
  postura: number
  posturaPorcentaje: number
  huevosProducidos: number
  mortalidadAcumulada: number
  viabilidad: number
  edadSemanas: number
  consumoDiarioKg: number
  conversionAlimento: number
}
