import {
  // Gauge,
  Calendar,
  BarChart3,
  GaugeIcon,
  Settings,
  LayoutDashboard,
  Inbox,
  TicketsIcon,
} from 'lucide-react';

export const breadcrumbMap: Record<string, string> = {
  '/': 'Home',
  '/employee-management': 'Employee Management',
  '/employee-management/list': 'Employees List',
  '/employee-management/add': 'Add Employee',
  '/employee-management/edit/:id': 'Edit Employee',
  '/recruitment': 'Recruitment',
  '/recruitment/new': 'New Recruit',
  '/recruitment/details/:id': 'Recruit Details',
  '/projects': 'Projects',
  '/projects/new': 'New Project',
  '/projects/details/:id': 'Project Details',
  // Agrega más rutas según lo que necesites
};

export const items = {
  app: {
    title: '',
    items: [
      {
        key: 'app-dashboard',
        label: 'Dashboard',
        badge: '',
        icon: GaugeIcon,
        path: '/',
      },
      {
        key: 'app-inbox',
        label: 'Bandeja de entrada',
        badge: '4',
        icon: Inbox,
        path: 'inbox/requests',
      },
      {
        key: 'app-analytics',
        icon: BarChart3,
        label: 'Analytics',
        path: '/dashboard',
        badge: '',
      },
    ],
  },
  ticket: {
    title: 'Tickets',
    items: [
      {
        key: 'ticket-list',
        label: 'Listado de tickets',
        badge: '',
        icon: TicketsIcon,
        path: '/ticket',
      },
    ],
  },
  pined_ticket: {
    title: 'Pinned Tickets',
    items: [
      {
        key: 'ticket-list',
        label: 'Listado de tickets',
        badge: '',
        icon: TicketsIcon,
        path: '/ticket/pinned',
      },
    ],
  },
  organization: {
    title: 'Organization',
    items: [
      {
        key: 'organization-organization',
        label: 'Organization',
        badge: '',
        icon: LayoutDashboard,
        path: '/employee-management',
      },
      {
        key: 'organization-calendar',
        label: 'Calendar',
        badge: '',
        icon: Calendar,
        path: '/calendar',
      },
      {
        key: 'organization-settings',
        icon: Settings,
        label: 'Settings',
        path: '/settings',
        badge: '',
      },
    ],
  },
};
