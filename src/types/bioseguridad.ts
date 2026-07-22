export interface RegistroVisita {
  id: string
  visitanteNombre: string
  visitanteEmpresa: string | null
  visitanteRut: string | null
  fechaVisita: Date | string
  ultimaVisitaOtraGranja: Date | string | null
  periodoCuarentenaCumplido: boolean
  vehiculoPlaca: string | null
  vehiculoDesinfectado: boolean
  firmaDigital: string | null
  autorizadoPor: string | null
  observaciones: string | null
}

export interface CreateVisitaInput {
  visitanteNombre: string
  visitanteEmpresa?: string | null
  visitanteRut?: string | null
  fechaVisita?: Date | string
  ultimaVisitaOtraGranja?: Date | string | null
  periodoCuarentenaCumplido?: boolean
  vehiculoPlaca?: string | null
  vehiculoDesinfectado?: boolean
  firmaDigital?: string | null
  autorizadoPor?: string | null
  observaciones?: string | null
}

export interface ChecklistBioseguridad {
  id: string
  galponId: string
  fecha: Date | string
  loteId: string | null
  pediluviosActivos: boolean | null
  cortinasBuenEstado: boolean | null
  mallasAvesSilvestres: boolean | null
  ausenciaRoedores: boolean | null
  ausenciaMoscasExcesivas: boolean | null
  rodaluvioFuncional: boolean | null
  cercoPerimetralIntacto: boolean | null
  observaciones: string | null
  registradoPor: string | null
}

export interface CreateChecklistInput {
  galponId: string
  fecha: Date | string
  loteId?: string | null
  pediluviosActivos?: boolean | null
  cortinasBuenEstado?: boolean | null
  mallasAvesSilvestres?: boolean | null
  ausenciaRoedores?: boolean | null
  ausenciaMoscasExcesivas?: boolean | null
  rodaluvioFuncional?: boolean | null
  cercoPerimetralIntacto?: boolean | null
  observaciones?: string | null
  registradoPor?: string | null
}
