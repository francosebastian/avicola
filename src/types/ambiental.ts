export interface RegistroAmbiental {
  id: string
  loteId: string
  seccionId: string
  fechaHora: Date | string
  temperatura: number | null
  humedad: number | null
  amoniacoPpm: number | null
  co2Ppm: number | null
  velocidadAireMs: number | null
  fuente: string
}

export interface CreateRegistroAmbientalInput {
  loteId: string
  seccionId: string
  fechaHora: Date | string
  temperatura?: number | null
  humedad?: number | null
  amoniacoPpm?: number | null
  co2Ppm?: number | null
  velocidadAireMs?: number | null
  fuente?: string
}
