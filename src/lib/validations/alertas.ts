import { z } from "zod"

export const createConfiguracionAlertaSchema = z.object({
  loteId: z.string().uuid().optional(),
  tipoAlerta: z.string().min(1, "Tipo de alerta requerido"),
  umbralMin: z.number().optional(),
  umbralMax: z.number().optional(),
  activa: z.boolean().default(true),
  canalNotificacion: z.array(
    z.enum(["email", "sms", "push", "whatsapp"], {
      error: "Canal de notificación inválido",
    })
  ).min(1, "Debe tener al menos un canal de notificación"),
})

export const updateConfiguracionAlertaSchema = z.object({
  umbralMin: z.number().optional(),
  umbralMax: z.number().optional(),
  activa: z.boolean().optional(),
  canalNotificacion: z.array(
    z.enum(["email", "sms", "push", "whatsapp"])
  ).min(1).optional(),
})

export const listConfiguracionesAlertaSchema = z.object({
  loteId: z.string().uuid().optional(),
  tipoAlerta: z.string().optional(),
  activa: z.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
