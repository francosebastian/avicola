export interface RegistroVacunacion {
  id: string
  loteId: string
  tipoVacuna: string
  fechaAplicacion: Date | string
  viaAplicacion: string
  dosisMl: number | null
  loteVacuna: string | null
  proveedorVacuna: string | null
  aplicadoPor: string | null
  observaciones: string | null
}

export interface CreateVacunacionInput {
  loteId: string
  tipoVacuna: string
  fechaAplicacion: Date | string
  viaAplicacion: string
  dosisMl?: number | null
  loteVacuna?: string | null
  proveedorVacuna?: string | null
  aplicadoPor?: string | null
  observaciones?: string | null
}

export interface RegistroTratamiento {
  id: string
  loteId: string
  medicamento: string
  principioActivo: string | null
  dosis: number | null
  viaAplicacion: string | null
  fechaInicio: Date | string
  fechaFin: Date | string | null
  periodoRetiroHoras: number | null
  periodoRetiroFinal: Date | string | null
  motivo: string | null
  responsable: string | null
  ventaBloqueada: boolean
  createdAt: Date | string
}

export interface CreateTratamientoInput {
  loteId: string
  medicamento: string
  principioActivo?: string | null
  dosis?: number | null
  viaAplicacion?: string | null
  fechaInicio: Date | string
  fechaFin?: Date | string | null
  periodoRetiroHoras?: number | null
  motivo?: string | null
  responsable?: string | null
  ventaBloqueada?: boolean
}

export interface Necropsia {
  id: string
  loteId: string
  fecha: Date | string
  avesExaminadas: number
  hallazgosMacroscopicos: string | null
  hallazgosOrganos: Record<string, unknown> | null
  fotos: string[]
  diagnosticoPresuntivo: string | null
  diagnosticoConfirmado: string | null
  laboratorio: string | null
  realizadaPor: string | null
  createdAt: Date | string
}

export interface CreateNecropsiaInput {
  loteId: string
  fecha: Date | string
  avesExaminadas?: number
  hallazgosMacroscopicos?: string | null
  hallazgosOrganos?: Record<string, unknown> | null
  fotos?: string[]
  diagnosticoPresuntivo?: string | null
  diagnosticoConfirmado?: string | null
  laboratorio?: string | null
  realizadaPor?: string | null
}
