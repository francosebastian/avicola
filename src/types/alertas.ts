export type TipoAlerta =
  | 'TEMPERATURA'
  | 'HUMEDAD'
  | 'POSTURA'
  | 'MORTALIDAD'
  | 'CONSUMO_AGUA'
  | 'CONSUMO_ALIMENTO'
  | 'PESO_HUEVO'

export type CanalNotificacion = 'app' | 'email' | 'sms' | 'push'

export interface ConfiguracionAlerta {
  id: string
  loteId: string | null
  tipoAlerta: TipoAlerta
  umbralMin: number | null
  umbralMax: number | null
  activa: boolean
  canalNotificacion: CanalNotificacion[]
  createdAt: Date | string
}

export interface AlertaActiva {
  id: string
  configuracionId: string
  loteId: string
  tipoAlerta: TipoAlerta
  mensaje: string
  valorActual: number
  umbral: number
  canal: CanalNotificacion
  leida: boolean
  createdAt: Date | string
}
