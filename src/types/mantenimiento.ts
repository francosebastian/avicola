export type TipoMantenimiento = 'preventivo' | 'correctivo'

export interface Equipo {
  id: string
  galponId: string | null
  nombre: string
  tipo: string
  marca: string | null
  modelo: string | null
  numeroSerie: string | null
  fechaInstalacion: Date | string | null
  frecuenciaMantencionDias: number | null
  proximaMantencion: Date | string | null
  activo: boolean
  observaciones: string | null
}

export interface CreateEquipoInput {
  galponId?: string | null
  nombre: string
  tipo: string
  marca?: string | null
  modelo?: string | null
  numeroSerie?: string | null
  fechaInstalacion?: Date | string | null
  frecuenciaMantencionDias?: number | null
  proximaMantencion?: Date | string | null
  activo?: boolean
  observaciones?: string | null
}

export interface Mantenimiento {
  id: string
  equipoId: string
  tipo: TipoMantenimiento
  fecha: Date | string
  descripcion: string
  repuestosUtilizados: string | null
  costo: number | null
  duracionHoras: number | null
  responsable: string | null
  proximaFechaSugerida: Date | string | null
  createdAt: Date | string
}

export interface CreateMantenimientoInput {
  equipoId: string
  tipo: TipoMantenimiento
  fecha: Date | string
  descripcion: string
  repuestosUtilizados?: string | null
  costo?: number | null
  duracionHoras?: number | null
  responsable?: string | null
  proximaFechaSugerida?: Date | string | null
}
