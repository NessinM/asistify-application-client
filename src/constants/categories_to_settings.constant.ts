import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

type CategoryType = {
  to: string;
  name: string;
  description: string;
  isNew: boolean;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
};

export interface ComponentCategory {
  slug: string;
  title: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  list: CategoryType[];
}

import {
  Settings,
  ShieldCheck,
  Briefcase,
  Building2,
  FileStack,
  MapPin,
  Globe2,
  // LockKey,
  Paintbrush,
  Share2,
  Users,
  Clock,
  CalendarClock,
  UserPlus2,
  KeyRound,
  BellRing,
  ScrollText,
} from 'lucide-react';

export const categories: ComponentCategory[] = [
  {
    slug: 'general',
    title: 'General',
    icon: Settings,
    list: [
      {
        to: '/settings/security',
        name: 'Configuración de seguridad',
        description:
          'Configura la forma en la que las personas inician sesión en Asistify y otras opciones de seguridad.',
        isNew: true,
        icon: ShieldCheck,
      },
      {
        to: '/settings/work-data',
        name: 'Datos laborales',
        description: 'Define las condiciones laborales y los grupos de aprobación de contrato.',
        isNew: false,
        icon: Briefcase,
      },
      {
        to: '/settings/company-details',
        name: 'Detalles de la empresa',
        description: 'Consulta y actualiza los datos de tu empresa.',
        isNew: false,
        icon: Building2,
      },
      {
        to: '/settings/documents',
        name: 'Documentos',
        description: 'Organiza tus carpetas de documentos.',
        isNew: false,
        icon: FileStack,
      },
      {
        to: '/settings/workplaces',
        name: 'Lugares de trabajo',
        description: 'Establece y asigna los lugares de trabajo y días feriados en tu empresa.',
        isNew: false,
        icon: MapPin,
      },
      {
        to: '/settings/company-page',
        name: 'Página de empresa',
        description: 'Publica y personaliza una página pública para compartir información',
        isNew: false,
        icon: Globe2,
      },
      {
        to: '/settings/permissions',
        name: 'Permisos',
        description: 'Gestiona qué empleados/as pueden ver y hacer qué acciones.',
        isNew: false,
        icon: Paintbrush,
      },
      {
        to: '/settings/customization',
        name: 'Personalización',
        description: 'Personaliza el espacio de trabajo de tu empresa.',
        isNew: false,
        icon: Paintbrush,
      },
      {
        to: '/settings/referrals',
        name: 'Refiere Asistify',
        description:
          'Consigue un descuento por referirnos a otra empresa. La buena gente atrae a buena gente.',
        isNew: false,
        icon: Share2,
      },
      {
        to: '/settings/external-users',
        name: 'Usuarios externos',
        description:
          'Usuarios que no tienen contrato con la empresa pero tienen acceso a Asistify',
        isNew: false,
        icon: Users,
      },
    ],
  },
  {
    slug: 'time',
    title: 'Tiempo',
    icon: Clock,
    list: [
      {
        to: '/settings/time-categories',
        name: 'Categorías de tiempo',
        description: 'Categoriza las horas de trabajo y establece valores para ellas.',
        isNew: true,
        icon: Clock,
      },
      {
        to: '/settings/work-schedules',
        name: 'Horarios laborales',
        description: 'Establece y asigna los calendarios laborales de tu empresa.',
        isNew: false,
        icon: CalendarClock,
      },
    ],
  },
  {
    slug: 'person',
    title: 'Persona',
    icon: Users,
    list: [
      {
        to: '/settings/onboarding',
        name: 'Onboarding de empleados',
        description: 'Gestiona el espacio de Onboarding.',
        isNew: true,
        icon: UserPlus2,
      },
    ],
  },
  {
    slug: 'advanced-settings',
    title: 'Configuración avanzada',
    icon: Settings,
    list: [
      {
        to: '/settings/api-keys',
        name: 'Claves API',
        description: 'Genera claves para acceder a tu cuenta.',
        isNew: true,
        icon: KeyRound,
      },
      {
        to: '/settings/custom-notifications',
        name: 'Notificaciones personalizadas',
        description: 'Personaliza las rutinas automáticas en Asistify.',
        isNew: true,
        icon: BellRing,
      },
      {
        to: '/settings/audit-log',
        name: 'Registro de auditoría',
        description: 'Consulta un registro de eventos y actividades',
        isNew: true,
        icon: ScrollText,
      },
    ],
  },
];

export function getCategory(slug: string): ComponentCategory | undefined {
  return categories.find((category) => category.slug === slug);
}
