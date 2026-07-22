export interface CurvaPosturaData {
  semana: number
  posturaReal: number
  posturaTeorica: number
  limiteInferior: number
  limiteSuperior: number
}

export interface MortalidadData {
  semana: number
  bajasSemanales: number
  mortalidadAcumulada: number
  porcentajeMortalidad: number
  viabilidad: number
}

export interface EficienciaAlimenticiaData {
  fecha: string
  consumoAveDiaGramos: number
  consumoTotalKg: number
  conversionKgAlimentoKgHuevo: number
  docenaHuevosKgAlimento: number
  costoAlimentoHuevo: number
}

export interface DashboardDiario {
  fechaActual: string
  posturaHoy: number
  posturaAyer: number
  tendencia7dias: number[]
  mortalidadAcumulada: number
  avesVivas: number
  clasificacionHoy: Record<string, number>
  alertasActivas: Array<{ tipo: string; mensaje: string }>
}

export interface PesoHuevoData {
  semana: number
  pesoPromedioGramos: number
  uniformidad: number
  cv: number
  huevosFueraRango: number
}

export interface ProyeccionData {
  semana: number
  produccionEstimada: number
  produccionReal: number
  ingresosProyectados: number
  costosProyectados: number
  margenEstimado: number
}

export interface ConsumoAguaData {
  fecha: string
  litrosAveDia: number
  consumoEsperado: number
  temperaturaPromedio: number
  alerta: boolean
}

export interface AmbientalData {
  fechaHora: string
  temperatura: number
  humedad: number
  amoniaco: number
  alertaActiva: boolean
}
