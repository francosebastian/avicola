export interface ProgramaIluminacion {
  id: string
  loteId: string
  semanaVida: number
  horasLuz: number
  intensidadLux: number | null
  horaEncendido: string | null
  horaApagado: string | null
  tipoPeriodo: string
}

export interface RegistroIluminacionDiario {
  id: string
  loteId: string
  seccionId: string | null
  fecha: Date | string
  horasLuzReales: number | null
  horaEncendidoReal: string | null
  horaApagadoReal: string | null
  intensidadLux: number | null
  observaciones: string | null
}

export interface CreateProgramaInput {
  loteId: string
  semanaVida: number
  horasLuz: number
  intensidadLux?: number | null
  horaEncendido?: string | null
  horaApagado?: string | null
  tipoPeriodo?: string
}

export interface CreateRegistroIluminacionInput {
  loteId: string
  seccionId?: string | null
  fecha: Date | string
  horasLuzReales?: number | null
  horaEncendidoReal?: string | null
  horaApagadoReal?: string | null
  intensidadLux?: number | null
  observaciones?: string | null
}
