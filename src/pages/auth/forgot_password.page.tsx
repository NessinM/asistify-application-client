import React, { useId } from 'react';
import { Button } from '@/registry/default/ui/button';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { useNavigate } from 'react-router-dom';

const SignInWithEmail: React.FC = () => {
  const id = useId();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigation = useNavigate();

  return (
    <form className="w-full mx-8 lg:w-72 lg:max-w-72 lg:min-w-72 space-y-6">
      <div className="my-6">
        <h1 className="sm:text-center font-bold"> Request forgot password</h1>
        <p className="sm:text-center text-muted-foreground text-sm">
          We just need a few details to get you started.
        </p>
      </div>
      <div className="*:not-first:mt-1">
        <Label htmlFor={`${id}-email`}>Email</Label>
        <Input id={`${id}-email`} placeholder="hi@yourcompany.com" type="email" required />
      </div>
      <Button size={'lg'} type="button" className="w-full">
        Sign in
      </Button>
    </form>
  );
};

export default SignInWithEmail;
