import React, { useId, useMemo } from 'react';
import RPNInput, {
  FlagProps,
  Country,
  getCountryCallingCode,
  parsePhoneNumber,
} from 'react-phone-number-input';

import flags from 'react-phone-number-input/flags';
import { cn } from '@/registry/default/lib/utils';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { ChevronDownIcon, PhoneIcon } from 'lucide-react';

type Props = {
  label?: string;
  value?: string;
  onChangeValue?: (value: string) => void;
  defaultCountry?: Country;
  error?: string;
};

export default function PhoneNumberInput({
  label,
  value,
  onChangeValue,
  defaultCountry = 'PE',
  error,
}: Props) {
  const id = useId();

  // Extrae el país del número para placeholder dinámico
  const countryForPlaceholder = useMemo(() => {
    try {
      const pn = value ? parsePhoneNumber(value) : undefined;
      return pn?.country ?? defaultCountry;
    } catch {
      return defaultCountry;
    }
  }, [value, defaultCountry]);

  const placeholder = `+${getCountryCallingCode(countryForPlaceholder)} ${
    value ? value.replace(/^\+\d+\s?/, '') : ''
  }`;

  return (
    <div className="grid gap-1" dir="ltr">
      <Label htmlFor={id} className="mb-1.5">
        {label ?? 'Número de teléfono'}
      </Label>

      <RPNInput
        id={id}
        className="flex w-full rounded-md"
        international
        defaultCountry={defaultCountry}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={PhoneInput}
        placeholder={placeholder}
        value={value}
        onChange={(v) => onChangeValue?.(v ?? '')}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error && (
        <p id={`${id}-error`} className="text-destructive text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

// ====================
// Phone Input
// ====================
const PhoneInput = ({ className, ...props }: React.ComponentProps<'input'>) => (
  <Input
    data-slot="phone-input"
    className={cn('-ms-px rounded-s-none shadow-none focus-visible:z-10', className)}
    {...props}
  />
);

PhoneInput.displayName = 'PhoneInput';

// ====================
// Country Select
// ====================
type CountrySelectProps = {
  disabled?: boolean;
  value?: Country;
  onChange: (value: Country) => void;
  options: { label: string; value?: Country }[];
};

const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Country;
    if (val) onChange(val);
  };

  const filteredOptions = useMemo(() => options.filter((o) => o.value), [options]);

  return (
    <div
      className="relative inline-flex items-center self-stretch rounded-s-md border border-input
                 bg-background text-muted-foreground py-2 ps-3 pe-2 transition-[color,box-shadow]
                 outline-none focus-within:z-10 focus-within:ring-[3px] focus-within:ring-ring/50
                 hover:bg-accent hover:text-foreground
                 has-aria-invalid:border-destructive/60 has-aria-invalid:ring-destructive/20
                 dark:has-aria-invalid:ring-destructive/40"
    >
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        {value ? <FlagComponent country={value} countryName={value} /> : <PhoneIcon size={16} />}
        <ChevronDownIcon size={16} className="text-muted-foreground/80" />
      </div>

      <select
        disabled={disabled}
        value={value ?? 'PE'}
        onChange={handleSelect}
        className="absolute inset-0 w-full h-full opacity-0 text-sm cursor-pointer"
        aria-label="Select country"
      >
        {filteredOptions.map((opt, idx) => (
          <option key={opt.value ?? `empty-${idx}`} value={opt.value}>
            {opt.label} {opt.value && `+${getCountryCallingCode(opt.value)}`}
          </option>
        ))}
      </select>
    </div>
  );
};

// ====================
// Flag Component
// ====================
const FlagComponent = React.memo(({ country, countryName }: FlagProps) => {
  const Flag = country ? flags[country] : null;
  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? <Flag title={countryName} /> : <PhoneIcon size={16} />}
    </span>
  );
});
