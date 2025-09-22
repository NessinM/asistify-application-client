// /routes/RoutesAuth.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from '@/layouts/auth.layout';
import { ROUTES } from './routes';

import PageSignIn from '@/pages/auth/sign_in.page';
import PageSignUp from '@/pages/auth/sign_up.page';
import PageForgotPassword from '@/pages/auth/forgot_password.page';
import PageConfirmationCode from '@/pages/auth/verification_code.page';
import PageAttendance from '@/pages/attendance/attendance.page';

export const RoutesAuth: React.FC = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path={ROUTES.public.SIGN_IN} element={<PageSignIn />} />
      <Route path={ROUTES.public.SIGN_UP} element={<PageSignUp />} />
      <Route path={ROUTES.public.FORGOT_PASSWORD} element={<PageForgotPassword />} />
      <Route path={ROUTES.public.VERIFICATION_CODE} element={<PageConfirmationCode />} />
      <Route path={ROUTES.public.ATTENDANCE} element={<PageAttendance />} />
      <Route path="*" element={<PageSignIn />} />
    </Route>
  </Routes>
);
