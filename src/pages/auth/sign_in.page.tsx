import React, { useId, useState } from 'react';
import { Button } from '@/registry/default/ui/button';
import { Checkbox } from '@/registry/default/ui/checkbox';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/user.store';
import { toast } from 'sonner';

const SignInWithEmail: React.FC = () => {
  const id = useId();
  const { fetchHandleSignIn } = useUserStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('nesinalvaradob@gmail.com');
  const [password, setPassword] = useState('123456');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user } = await fetchHandleSignIn({
        email,
        password,
        remember,
      });

      if (!user.otp_code_to_validate_email) {
        navigate(`/verify-account?_id=${user._id}`);
        return;
        // window.location.href = '/'
        // window.location.reload()
      }
      if (!user.initial_configuration_done) {
        navigate(`/getting-started`);
        return;
        // window.location.href = '/'
        // window.location.reload()
      }

      navigate('/');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message, {
        description: error.message,
        position: 'bottom-left',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full mx-8 lg:w-72 lg:max-w-72 lg:min-w-72 space-y-2" onSubmit={handleSubmit}>
      <div className="my-6">
        <h1 className="sm:text-center text-4xl font-extrabold">Let's connect!</h1>
        <p className="sm:text-center text-muted-foreground text-sm">
          Enter your credentials to access the application
        </p>
      </div>
      <div className="*:not-first:mt-1">
        <Label htmlFor={`${id}-email`}>Email</Label>
        <Input
          id={`${id}-email`}
          placeholder="hi@yourcompany.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="*:not-first:mt-1">
        <Label htmlFor={`${id}-password`}>Password</Label>
        <Input
          id={`${id}-password`}
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex justify-between gap-2 my-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${id}-remember`}
            checked={remember}
            onChange={(e) => setRemember((e.target as HTMLInputElement).checked)}
          />
          <Label htmlFor={`${id}-remember`} className="text-muted-foreground font-normal">
            Remember me
          </Label>
        </div>
        <button
          type="button"
          className="text-sm underline hover:no-underline"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot password?
        </button>
      </div>

      <Button size="lg" type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};

export default SignInWithEmail;
