export interface RegistroDiario {
  id: string
  loteId: string
  seccionId: string
  fecha: Date | string
  avesVivas: number | null
  bajasDia: number | null
  huevosProducidos: number | null
  huevosJumbo: number | null
  huevosSuper: number | null
  huevosExtra: number | null
  huevosPrimera: number | null
  huevosSegunda: number | null
  huevosTercera: number | null
  huevosSubproducto: number | null
  consumoAlimentoKg: number | null
  consumoAguaLitros: number | null
  lecturaMedidorAgua: number | null
  temperaturaMin: number | null
  temperaturaMax: number | null
  observaciones: string | null
  fotoRegistro: string | null
  registradoPor: string | null
  sincronizado: boolean
  createdAt: Date | string
}

export interface CreateRegistroDiarioInput {
  loteId: string
  seccionId: string
  fecha: Date | string
  avesVivas?: number | null
  bajasDia?: number | null
  huevosProducidos?: number | null
  huevosJumbo?: number | null
  huevosSuper?: number | null
  huevosExtra?: number | null
  huevosPrimera?: number | null
  huevosSegunda?: number | null
  huevosTercera?: number | null
  huevosSubproducto?: number | null
  consumoAlimentoKg?: number | null
  consumoAguaLitros?: number | null
  lecturaMedidorAgua?: number | null
  temperaturaMin?: number | null
  temperaturaMax?: number | null
  observaciones?: string | null
  fotoRegistro?: string | null
  registradoPor?: string | null
  sincronizado?: boolean
}

export interface MuestreoPeso {
  id: string
  loteId: string
  fecha: Date | string
  avesMuestreadas: number
  pesoPromedioGramos: number
  uniformidadPorcentaje: number | null
  cv: number | null
  pesoMin: number | null
  pesoMax: number | null
  observaciones: string | null
}

export interface CreateMuestreoPesoInput {
  loteId: string
  fecha: Date | string
  avesMuestreadas: number
  pesoPromedioGramos: number
  uniformidadPorcentaje?: number | null
  cv?: number | null
  pesoMin?: number | null
  pesoMax?: number | null
  observaciones?: string | null
}

export interface ClasificacionHuevos {
  huevosJumbo: number
  huevosSuper: number
  huevosExtra: number
  huevosPrimera: number
  huevosSegunda: number
  huevosTercera: number
  huevosSubproducto: number
}
