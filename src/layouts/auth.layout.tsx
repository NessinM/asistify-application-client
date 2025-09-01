import { Button } from '@/registry/default/ui/button';
import { useNavigate, Outlet } from 'react-router-dom';
import { User2 } from 'lucide-react';
import { Toaster } from 'sonner';

const AuthLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col ">
      <div className="flex grow justify-center lg:justify-between gap-3 md:flex-row md:items-center px-8 py-6 fixed w-full z-10 ">
        <div className="flex" onClick={() => navigate('/')}>
          <img className="rounded-full" src="/logo.svg" width={150} alt="Asistify" />
        </div>
        <div className="gap-2 max-md:flex-wrap lg:flex hidden">
          <Button size="default" variant="link" onClick={() => navigate('/sign-in')}>
            Iniciar sesion
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/sign-up')}>
            <User2 className="opacity-60" size={19} aria-hidden="true" />
            Registrate
          </Button>
        </div>
      </div>
      <div className="h-full flex justify-center items-center">
        <Toaster position="top-center" />
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
