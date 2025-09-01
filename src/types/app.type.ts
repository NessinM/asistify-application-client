import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';
export interface Organization {
  name: string;
  logo: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  order: number;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export interface AppSidebarDataType {
  options: SidebarGroup[];
}
