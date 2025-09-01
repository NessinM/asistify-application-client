import { z } from 'zod';
import { getSchema } from '../schemas/employee.schema';
import { insertPersonSchema } from '@/schemas/organization.schema';

export interface Entity {
  _id: string;
  _id_organization: string;
  email: string;
  name: string;
  last_name: string;
  initials: string;
  url_avatar: string;
  role: string;
  position: string;
  department: string;
  status: 'active' | 'pending' | 'desactive';
  created_at: string;
  updated_at: string;
  deleted_at: string;

  // Información personal
  phone_number?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street: string;
    city: string;
    country: string;
  };
  nationality?: string;

  // Información laboral
  contract_type?: 'full-time' | 'part-time' | 'freelance' | 'intern';
  contract_end_date?: string;
  salary?: number;
  working_hours?: {
    start: string;
    end: string;
  };
  manager_id?: string;
  employment_status?: 'active' | 'on_leave' | 'terminated';

  // Documentación
  documents?: { name: string; url: string }[];
  social_security_number?: string;
  tax_id?: string;

  // Información interna
  notes?: string;
  tags?: string[];
}

export type GetType = z.infer<typeof getSchema>;
export type InsertPerson = z.infer<typeof insertPersonSchema>;
