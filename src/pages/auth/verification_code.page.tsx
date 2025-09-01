import { toast } from 'sonner';
import { useUserStore } from '@/stores/user.store';
import { cn } from '@/registry/default/lib/utils';
import { OTPInput, SlotProps } from 'input-otp';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { fetchHandleVerifyOTPCode } = useUserStore();
  const navigate = useNavigate();

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Foco automático en el input OTP al renderizar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault?.();
    inputRef.current?.select();

    setLoading(true);

    try {
      const _id = searchParams.get('_id');
      if (!_id) {
        throw new Error('No _id provided in the URL');
      }

      await fetchHandleVerifyOTPCode(_id, value);
      navigate('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message, {
        description: error.message,
        position: 'bottom-left',
      });
      setValue('');
      setTimeout(() => {
        inputRef.current?.blur();
        inputRef.current?.focus();
      }, 20);
    } finally {
      setLoading(false);
    }
  };

  const Slot = (props: SlotProps) => {
    return (
      <div
        className={cn(
          'flex size-9 items-center justify-center rounded-lg border border-input bg-background font-medium text-foreground shadow-sm transition-shadow',
          { 'z-10 border border-ring ring-[3px] ring-ring/20': props.isActive }
        )}
      >
        {props.char !== null ? <div>{props.char}</div> : <span className="opacity-50"></span>}
      </div>
    );
  };

  return (
    <div className="h-dvh w-full flex items-center justify-center dark:text-white">
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center  justify-center py-3">
          <h1 className="sm:text-center font-bold">Verification account</h1>
          <p className="sm:text-center text-muted-foreground text-sm">
            Check your email and enter the code we sent you.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <OTPInput
              id="verify-account"
              ref={inputRef}
              value={value}
              onChange={setValue}
              containerClassName="flex items-center gap-3 has-[:disabled]:opacity-50"
              maxLength={6}
              disabled={loading}
              render={({ slots }) => (
                <div className="flex gap-2">
                  {slots.map((slot, idx) => (
                    <Slot key={idx} {...slot} />
                  ))}
                </div>
              )}
              onComplete={onSubmit}
            />
          </div>
          <p className="text-center text-sm">
            <a className="underline hover:no-underline" href="#">
              Resend code
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
