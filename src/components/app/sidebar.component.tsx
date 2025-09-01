import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarRail,
} from '@/providers/sidebar.provider';
import { items } from '@/constants/items_sidebar.constant';
import { LogOutIcon } from 'lucide-react';
import { organizationTypes } from '@/types';
import { matchPath, useLocation, NavLink } from 'react-router-dom';
import { OrganizationSwitcher } from '@/components/organization/switcher.component';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
        {/* <hr className="border-t border-border mx-2 -mt-px" /> */}
      </SidebarHeader>
      <SidebarContent>
        {Object.values(items).map((item) => (
          <SidebarGroup key={item.title}>
            {item.title && (
              <SidebarGroupLabel className="uppercase text-muted-foreground/60">
                {item.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent className="px-2 group-data-[collapsible=icon]:px-0">
              <SidebarMenu>
                {item.items.map((list) => (
                  <SidebarItem item={list} key={list.key}></SidebarItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <hr className="border-t border-border mx-2 -mt-px" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto">
              <LogOutIcon
                className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                size={22}
                aria-hidden="true"
              />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

const SidebarItem = React.memo(({ item }: { item: organizationTypes.ModuleType }) => {
  const location = useLocation();
  const isActive = !!matchPath(item.path || '', location.pathname);

  return (
    <SidebarMenuItem key={item.label}>
      <SidebarMenuButton
        asChild
        tooltip={item.label}
        isActive={isActive}
        className="h-8.5 group/menu-button group-data-[collapsible=icon]:justify-center font-medium gap-3 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
      >
        <NavLink to={item.path || '#'} aria-current={isActive ? 'page' : undefined}>
          {item.icon && (
            <item.icon
              className="text-muted-foreground/60 dark:group-data-[active=true]/menu-button:text-white group-data-[active=true]/menu-button:text-primary"
              size={18}
              aria-hidden="true"
            />
          )}
          <>
            <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            {item.badge && (
              <SidebarMenuBadge className="group-data-[collapsible=icon]:hidden">
                {item.badge}
              </SidebarMenuBadge>
            )}
          </>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});
