// /routes/RoutesLogged.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes';

import MainLayout from '@/layouts/main.layout';
import PageInboxRequest from '@/pages/inbox/request.page';
import PageWelcome from '@/pages/welcome/welcome.page';
import PageDashboard from '@/pages/dashboard/dashboard.page';
import PageProfile from '@/pages/profile/profile.page';
import PageEmployee from '@/pages/employee/employees.page';
import PageInsertEmployee from '@/pages/employee/insert.page';
import PageNotFound from '@/pages/not-found/not_found.page';

import PageSettings from '@/pages/setting/setting.page';

import PageTicket from '@/pages/ticket/list.page';
import PageNewTicket from '@/pages/ticket/new.page';
import PageDetailTicket from '@/pages/ticket/detail.page';

export const RoutesLogged: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.private.START} element={<PageWelcome />} />
        <Route path={ROUTES.private.IMBOX_REQUESTS} element={<PageInboxRequest />} />
        <Route path={ROUTES.private.DASHBOARD} element={<PageDashboard />} />
        <Route path={ROUTES.private.PROFILE} element={<PageProfile />} />
        <Route path={ROUTES.private.EMPLOYEE_MANAGEMENT} element={<PageEmployee />} />
        <Route path={ROUTES.private.EMPLOYEE_MANAGEMENT_ADD} element={<PageInsertEmployee />} />
        <Route path={'/ticket'} element={<PageTicket />} />
        <Route path={'/ticket/new'} element={<PageNewTicket />} />
        <Route path={'/ticket/:id'} element={<PageDetailTicket />} />

        <Route path={ROUTES.private.SETTINGS} element={<PageSettings />} />

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};
