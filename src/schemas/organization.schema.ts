import { z } from 'zod'; // Asegúrate de que la ruta sea correcta

// Esquema de validación con mensajes automáticos
export const insertPersonSchema = z
  .object({
    email: z
      .string()
      .min(1, {}) // Mensaje personalizado
      .email() // Mensaje de email
      .transform((val) => val.toLowerCase().trim())
      .refine((val) => val.includes('@'), {
        message: 'Email must contain @',
      }),

    first_name: z
      .string()
      .min(1) // Personalizar mensaje
      .max(100),

    last_name: z
      .string()
      .min(1) // Personalizar mensaje
      .max(100),

    contract_start_date: z
      .string()
      .nullable()
      .refine((date) => date !== null && new Date(date) > new Date(), {
        message: ' Contract start date must be in the future',
      }), // Personalizar mensaje de fechas

    contract_end_date: z
      .string()
      .nullable()
      .refine((date) => date !== null && new Date(date) > new Date(), {
        message: ' Contract end date must be in the future',
      }), // Personalizar mensaje de fechad
  })
  .refine(
    (data) =>
      data.contract_end_date &&
      data.contract_start_date &&
      new Date(data.contract_end_date) > new Date(data.contract_start_date),
    {
      path: ['contract_end_date'],
      message: ' Contract end date must be in the future',
    }
  );

// Tipo inferido
export type InsertPersonData = z.infer<typeof insertPersonSchema>;
