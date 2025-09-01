import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/providers/sidebar.provider';
import { Plus, ChevronsUpDown } from 'lucide-react';
import { Entity } from '@/types/organization.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';
import { useOrganizationMemberStore } from '@stores/organization_member.store';
import { toast } from 'sonner';

export function OrganizationSwitcher() {
  const organizationMember = useOrganizationMemberStore();
  const [activeOrganization, setActiveOrganization] = useState<Entity | null>(null);
  const [organizations, setOrganizations] = useState<Entity[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const { data } = await organizationMember.get();
      if (data.organizations.length) {
        setOrganizations(data.organizations);
        setActiveOrganization(data.organizations[0]);
      }
    };

    fetchOrganizations();
  }, [organizationMember]);

  const showToast = () => {
    toast.success('Mensaje de prueba', {
      description: 'Esta es una descripcion aleatoria',
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-2 [&>svg]:size-auto rounded-lg "
            >
              {activeOrganization && (
                <Avatar className="rounded-md size-8.5">
                  <AvatarImage
                    width={36}
                    height={36}
                    src={activeOrganization.url_avatar}
                    alt={activeOrganization.name}
                  />
                  <AvatarFallback className=" font-extrabold bg-primary text-white dark:text-black">
                    {activeOrganization.initials}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="grid flex-1 text-left text-base leading-none  group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold ">
                  {activeOrganization?.name ?? 'Select a organization '}
                </span>
                <span className="truncate font-medium text-xs text-muted-foreground/70">
                  {activeOrganization?.industry}
                </span>
              </div>
              <ChevronsUpDown
                className="ms-auto text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden"
                size={17}
                aria-hidden="true"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className=" w-(--radix-dropdown-menu-trigger-width) min-w-48 rounded-md"
            align="start"
            side="bottom"
            sideOffset={3}
          >
            <DropdownMenuLabel className="text-muted-foreground/70 text-[10px] uppercase">
              Organizations
            </DropdownMenuLabel>
            {organizations.map((o, index) => (
              <DropdownMenuItem
                key={o.name}
                onClick={() => setActiveOrganization(o)}
                className="gap-2 p-2"
              >
                <Avatar className="rounded-sm size-7">
                  <AvatarImage src={o.url_avatar} alt={o.name} width={36} height={36} />
                  <AvatarFallback className="font-semibold">{o.initials}</AvatarFallback>
                </Avatar>
                {o.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={showToast}>
              <Plus className="opacity-60" size={16} aria-hidden="true" />
              <div className="font-medium">Add organization</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
