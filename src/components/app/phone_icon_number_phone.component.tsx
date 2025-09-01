import { cn } from '@/registry/default/lib/utils';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { ChevronDownIcon, PhoneIcon } from 'lucide-react';
import React, { useId, useMemo } from 'react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

type Props = {
  label?: string;
  value?: string;
  onChangeValue?: (value: string) => void;
};

export default function Component({ value, onChangeValue, label }: Props) {
  const id = useId();

  return (
    <div className="grid *:not-first:mt-1" dir="ltr">
      <Label htmlFor={id} className="mb-1.5">
        {label || 'Numero de telefono '}
      </Label>
      <RPNInput
        className="flex rounded-md shadow-xs"
        international
        defaultCountry="PE" // Perú por defecto
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={PhoneInput}
        id={id}
        placeholder="Enter phone number"
        value={value}
        onChange={(newValue) => (onChangeValue ?? (() => {}))(newValue ?? '')}
      />
    </div>
  );
}

const PhoneInput = ({ className, ...props }: React.ComponentProps<'input'>) => (
  <Input
    data-slot="phone-input"
    className={cn('-ms-px rounded-s-none shadow-none focus-visible:z-10', className)}
    {...props}
  />
);

PhoneInput.displayName = 'PhoneInput';

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country | undefined;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
};

const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as RPNInput.Country);
  };

  const filteredOptions = useMemo(() => options.filter((x) => x.value), [options]);

  return (
    <div className="relative inline-flex items-center self-stretch rounded-s-md border border-input bg-background text-muted-foreground py-2 ps-3 pe-2 transition-[color,box-shadow] outline-none focus-within:z-10 focus-within:ring-[3px] focus-within:ring-ring/50 hover:bg-accent hover:text-foreground has-aria-invalid:border-destructive/60 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40">
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        {value ? (
          <FlagComponent country={value} countryName={value} />
        ) : (
          <div className="w-5">
            <PhoneIcon size={16} aria-hidden="true" />
          </div>
        )}
        <ChevronDownIcon size={16} aria-hidden="true" className="text-muted-foreground/80" />
      </div>
      <select
        disabled={disabled}
        value={value ?? 'PE'} // Inicia en Perú
        onChange={handleSelect}
        className="absolute inset-0 w-full h-full opacity-0 text-sm"
        aria-label="Select country"
      >
        {filteredOptions.map((option, i) => (
          <option key={option.value ?? `empty-${i}`} value={option.value}>
            {option.label} {option.value && `+${RPNInput.getCountryCallingCode(option.value)}`}
          </option>
        ))}
      </select>
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = country ? flags[country] : null;
  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? <Flag title={countryName} /> : <PhoneIcon size={16} aria-hidden="true" />}
    </span>
  );
};
