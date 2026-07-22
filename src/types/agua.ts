export interface ConsumoAgua {
  id: string
  loteId: string
  seccionId: string | null
  fecha: Date | string
  lecturaMedidor: number | null
  litrosConsumidos: number | null
  avesPeriodo: number | null
  observaciones: string | null
}

export interface CreateConsumoAguaInput {
  loteId: string
  seccionId?: string | null
  fecha: Date | string
  lecturaMedidor?: number | null
  litrosConsumidos?: number | null
  avesPeriodo?: number | null
  observaciones?: string | null
}
