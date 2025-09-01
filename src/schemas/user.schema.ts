import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z
    .string()
    .min(8, 'Debe tener al menos 8 caracteres')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula'),
  remember: z.boolean().default(false),
});

export const RequestForgotPasswordSchema = z.object({
  username: z.string().email('Correo inválido'),
});

export const UpdateForgotPasswordSchema = z
  .object({
    code: z.string().min(1, 'Código requerido'),
    password: z
      .string()
      .min(8, 'Debe tener al menos 8 caracteres')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula'),
    reTypePassword: z
      .string()
      .min(8, 'Debe tener al menos 8 caracteres')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula'),
  })
  .refine((data) => data.password === data.reTypePassword, {
    message: 'Las contraseñas no coinciden',
    path: ['reTypePassword'],
  });

export const saveInitialConfigurationSchema = z.object({
  company_name: z.string().min(1),
  company_industry: z.string().min(1),
  user_last_name: z.string().min(1),
  user_name: z.string().min(1),
  user_job_title: z.string().min(1),
  company_country: z.string().min(1),
  company_number_phone: z.string().min(1),
  theme_primary_color: z.string().min(1),
  theme_mode_name: z.string().min(1),
  company_send_exclusive_offers: z.boolean().default(false),
  company_number_of_employees: z.number().min(1, 'Debe ser mayor a 0'),
});

export const SignUpSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z
    .string()
    .min(8, 'Debe tener al menos 8 caracteres')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula'),
});
