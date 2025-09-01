import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/app/sidebar.component';
import AppBarBreadcrumb from '@/components/app/ui/app_breadcrumb.component';
import { Separator } from '@/registry/default/ui/separator';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/providers/sidebar.provider';
import UserDropdown from '@/components/user/dropdown_options.components';
import FeedbackDialog from '@/components/feedback/dialog.component';
import ThemeSelector from '@components/app/theme_selector.component';

const MainLayout = () => {
  return (
    <div className="flex h-svh">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-auto px-4 md:px-6 lg:px-8">
          <header className="flex h-[var(--sidebar-width-icon))] max-h-[var(--sidebar-width-icon))] shrink-0 items-center gap-2  border-b  bg-card  backdrop-blur-sm sticky top-0 z-50">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger className="-ms-4" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <AppBarBreadcrumb />
            </div>
            <div className="flex gap-3 ml-auto">
              <FeedbackDialog />
              <ThemeSelector />
              <UserDropdown />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 lg:gap-6 ">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
