import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react';
import { useId, useMemo, useState } from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PasswordInput({ value, onChange }: PasswordInputProps) {
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'Al menos 8 caracteres' },
      { regex: /[0-9]/, text: 'Al menos 1 número' },
      { regex: /[a-z]/, text: 'Al menos 1 letra minúscula' },
      { regex: /[A-Z]/, text: 'Al menos 1 letra mayúscula' },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(value);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-border';
    if (score <= 1) return 'bg-rose-500';
    if (score <= 2) return 'bg-orange-500';
    if (score === 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Ingresa una contraseña';
    if (score <= 2) return 'Contraseña débil';
    if (score === 3) return 'Contraseña media';
    return 'Contraseña fuerte';
  };

  return (
    <div>
      {/* Campo de contraseña con botón de visibilidad */}
      <div className="*:not-first:mt-2">
        <Label htmlFor={id}>Contraseña</Label>
        <div className="relative">
          <Input
            id={id}
            className="pe-9"
            placeholder="Contraseña"
            type={isVisible ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={`${id}-description`}
          />
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOffIcon size={16} aria-hidden="true" />
            ) : (
              <EyeIcon size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Indicador de fuerza de la contraseña */}
      <div
        className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label="Fuerza de la contraseña"
      >
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        ></div>
      </div>

      {/* Descripción de la fuerza de la contraseña */}
      <p id={`${id}-description`} className="text-foreground mb-2 text-sm font-medium">
        {getStrengthText(strengthScore)}. Debe contener:
      </p>

      {/* Lista de requisitos de la contraseña */}
      <ul className="space-y-1.5" aria-label="Requisitos de la contraseña">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <CheckIcon size={16} className="text-emerald-500" aria-hidden="true" />
            ) : (
              <XIcon size={16} className="text-muted-foreground/80" aria-hidden="true" />
            )}
            <span className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}>
              {req.text}
              <span className="sr-only">
                {req.met ? ' - Requisito cumplido' : ' - Requisito no cumplido'}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
