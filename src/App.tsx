import './assets/styles/index.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect } from 'react';
import { useUserStore } from '@/stores/user.store';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/providers/theme.provider.tsx';
import { RoutesAuth } from '@/routes/auth.route';
import { RoutesLogged } from '@/routes/logged.route';
import { RoutesGettingStarted } from '@/routes/getting_started.route';
import { Toaster } from '@/registry/default/ui/sonner';
import { ReactQueryProvider } from '@/providers/query.provider';

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-screen h-screen  ">
      <div className="flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="w-9 h-9 animate-pulse" />
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated, user, getMe, isLoading } = useUserStore();

  useEffect(() => {
    getMe().catch(console.error);
  }, [getMe]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ReactQueryProvider>
          {isLoading ? (
            <LoadingScreen />
          ) : !isAuthenticated ? (
            <RoutesAuth />
          ) : user && !user.initial_configuration_done ? (
            <RoutesGettingStarted />
          ) : (
            <RoutesLogged />
          )}
          <Toaster />
        </ReactQueryProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
