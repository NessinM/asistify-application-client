import React from 'react';
import { Button } from '@/registry/default/ui/button';
import InboxRequestList from '@/components/inbox/list.component';
import { ChevronDownIcon, FolderUp, MailPlus, UserRoundPlus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/registry/default/ui/badge';
import { ScrollArea, ScrollBar } from '@/registry/default/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/default/ui/tabs';

const ProfilePage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0">
          <h1 className="text-xl font-bold leading-tight">Perfil</h1>
          <p className="text-sm text-muted-foreground">
            Here&rsquo;s an overview of your contacts. Manage or create new ones with ease!
          </p>
        </div>
        <div className="inline-flex -space-x-px rounded-lg shadow-xs rtl:space-x-reverse">
          <Button
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
            variant={'default'}
            onClick={() => navigate('/employee-management/add')}
          >
            New
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-none shadow-none first:rounded-s-full last:rounded-e-lg focus-visible:z-10">
                <ChevronDownIcon size={16} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <UserRoundPlus size={16} className="opacity-60" aria-hidden="true" />
                Invite employee
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MailPlus size={16} className="opacity-60" aria-hidden="true" />
                Bulk invite
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FolderUp size={16} className="opacity-60" aria-hidden="true" />
                Import employees
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Tabs defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="text-foreground mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1">
            <TabsTrigger
              value="tab-1"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Vista general
              <Badge className="bg-primary/15 ms-1.5 min-w-5 px-1" variant="secondary">
                3
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Detalles laborales
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Detalles personales
            </TabsTrigger>
            <TabsTrigger
              value="tab-4"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Contratos
            </TabsTrigger>
            <TabsTrigger
              value="tab-5"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Planificación de tiempo
            </TabsTrigger>
            <TabsTrigger
              value="tab-6"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Otros
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="tab-1">
          <div className=" flex-1 h-full">
            <InboxRequestList />
          </div>
        </TabsContent>
        <TabsContent value="tab-2">
          <p className="text-muted-foreground pt-1 text-center text-xs">Content for Tab 2</p>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ProfilePage;
