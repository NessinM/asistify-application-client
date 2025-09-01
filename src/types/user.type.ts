import {
  SignInSchema,
  SignUpSchema,
  RequestForgotPasswordSchema,
  saveInitialConfigurationSchema,
  UpdateForgotPasswordSchema,
} from '@/schemas/user.schema';

import { z } from 'zod';

// Definir Roles y Themes como enums de TypeScript
export enum Roles {
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN',
  USER = 'USER',
  SUPPORT_MANAGER = 'SUPPORT_MANAGER',
  GUEST = 'GUEST',
}

export enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system',
}

// UserEntity ahora usa directamente los enums de TypeScript
export interface entity {
  _id: string;
  email: string;
  otp_code_to_validate_email?: string;
  name: string;
  initials: string;
  job_title: string;
  last_name: string;
  role: Roles; // Ahora es un enum de TypeScript
  password: string;
  avatar: string;
  password_reset_hash?: string;
  initial_configuration_done: boolean;
  theme: {
    mode: Themes; // Ahora es un enum de TypeScript
    primary_color: string;
  };
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

// Enum de Zod para validación
export const RoleEnum = z.enum([
  Roles.ADMIN,
  Roles.TECHNICIAN,
  Roles.USER,
  Roles.SUPPORT_MANAGER,
  Roles.GUEST,
]);
export const ThemeEnum = z.enum([Themes.DARK, Themes.LIGHT, Themes.SYSTEM]);

// Input types inferred from schemas
export type SignInInput = z.infer<typeof SignInSchema>;
export type SaveInitialConfigurationInput = z.infer<typeof saveInitialConfigurationSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type RequestForgotPasswordInput = z.infer<typeof RequestForgotPasswordSchema>;
export type UpdateForgotPasswordInput = z.infer<typeof UpdateForgotPasswordSchema>;

// Usar directamente los enums en los tipos de las entradas
export type RoleType = Roles; // Ahora es directamente el enum Roles
export type ThemeType = 'light' | 'dark' | 'system'; // Ahora es directamente el enum Themes
