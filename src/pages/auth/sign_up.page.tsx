import React, { useId, useState } from 'react';
import { Button } from '@/registry/default/ui/button';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { MailIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/user.store';
import { ROUTES } from '@routes/routes';
import { Checkbox } from '@/registry/default/ui/checkbox';
import { toast } from 'sonner';
import InputPasswordStrengthIndicator from '@/components/app/input_with_password_strength_indicator.component';

const SignUp: React.FC = () => {
  const emailId = useId();
  const termsId = useId();

  const { fetchHandleSignUp } = useUserStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState<boolean | 'indeterminate'>(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error('Todos los campos son obligatorios.', {
        description: 'Todos los campos son obligatorios.',
        position: 'bottom-left',
      });
    }

    if (!termsAccepted) {
      return toast.error('Debes aceptar los términos y condiciones.', {
        description: 'Todos los campos son obligatorios.',
        position: 'bottom-left',
      });
    }

    setLoading(true);

    try {
      const { user } = await fetchHandleSignUp({ email, password });
      navigate(`${ROUTES.public.VERIFICATION_CODE}?_id=${user._id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return toast.error(error.message, {
        description: 'Todos los campos son obligatorios.',
        position: 'bottom-left',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full mx-8 lg:w-80 space-y-2" onSubmit={handleSubmit}>
      <div className="my-4 text-left">
        <h1 className="font-bold text-lg">Necesitamos saber un par de cosas</h1>
        <p className="text-muted-foreground text-sm">
          Cuéntanos un poco sobre ti para que podamos personalizar tu experiencia.
        </p>
      </div>

      <div className="*:not-first:mt-2">
        <Label htmlFor={emailId}>Email </Label>
        <div className="relative">
          <Input
            id={emailId}
            className="peer ps-9"
            placeholder="Ingrese tu email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
            <MailIcon size={16} aria-hidden="true" />
          </div>
        </div>
      </div>

      <InputPasswordStrengthIndicator
        value={password}
        onChange={setPassword}
      ></InputPasswordStrengthIndicator>

      <div className="flex items-center gap-2 my-4">
        <Checkbox
          id={termsId}
          checked={termsAccepted}
          onCheckedChange={(value) =>
            setTermsAccepted(value === 'indeterminate' ? 'indeterminate' : !!value)
          }
          disabled={loading}
        />
        <Label htmlFor={termsId} className="text-muted-foreground font-normal">
          He leído y acepto los
          <a
            className="underline text-black mx-1 font-medium"
            href="https://originui.com"
            target="_blank"
          >
            términos y condiciones
          </a>
          y el tratamiento de mis datos de conformidad con la{' '}
          <a
            className="underline text-black mx-1 font-medium"
            href="https://originui.com"
            target="_blank"
          >
            Política de Privacidad
          </a>{' '}
          .
        </Label>
      </div>

      <Button size="lg" type="submit" className="w-full" disabled={loading || !termsAccepted}>
        {loading ? 'Registering...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default SignUp;
