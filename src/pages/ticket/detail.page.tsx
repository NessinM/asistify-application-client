import Chat from '@/components/ticket/chat.component';
import { SettingsPanel, SettingsPanelProvider } from '@/providers/ticket.provider';
import React from 'react';

const DetailTicketPage: React.FC = () => {
  return (
    <SettingsPanelProvider>
      {/* <div className="flex h-[calc(100svh-6rem)] bg-[hsl(240_5%_92.16%)] md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none transition-all ease-in-out duration-300"> */}
      <div className="flex h-[calc(100svh-4rem)] bg-sidebar  md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none transition-all ease-in-out duration-300">
        <Chat />
        <SettingsPanel />
      </div>
    </SettingsPanelProvider>
  );
};

export default DetailTicketPage;
