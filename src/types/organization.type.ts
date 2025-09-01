import { LucideProps } from 'lucide-react';
import { z } from 'zod';
import { insertPersonSchema } from '@/schemas/organization.schema';
export interface ModuleType {
  key: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  path: string;
  badge?: string;
}
export interface Entity {
  _id: string;
  name: string;
  initials: string;
  industry: string;
  url_avatar: string;
  phone_number: string;
  number_of_employees: number;
  primary_color: string;
  send_exclusive_offers: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export type InsertPersonInput = z.infer<typeof insertPersonSchema>;
