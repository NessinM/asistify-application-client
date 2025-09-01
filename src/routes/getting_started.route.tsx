import { Routes, Route, Navigate } from 'react-router-dom';
import GettingStartedLayout from '@/layouts/get_stared.layout';
import GettingStartedPage from '@/pages/user/stared.page';

export const RoutesGettingStarted = () => (
  <Routes>
    <Route element={<GettingStartedLayout />}>
      <Route path="/getting-started" element={<GettingStartedPage />} />
      <Route path="*" element={<Navigate to="/getting-started" />} />
    </Route>
  </Routes>
);
