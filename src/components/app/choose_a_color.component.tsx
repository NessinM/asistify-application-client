import { RadioGroup, RadioGroupItem } from '@/registry/default/ui/radio-group';
import { useId } from 'react';

export default function ChooseAColor() {
  const id = useId();
  return (
    <fieldset className="space-y-4">
      <legend className="text-foreground text-sm leading-none font-medium">
        Choose a theme color
      </legend>
      <RadioGroup className="flex gap-1.5" defaultValue="blue">
        <RadioGroupItem
          value="black"
          id={id}
          aria-label="Black"
          className="size-8 border-black bg-black shadow-none data-[state=checked]:border-black data-[state=checked]:bg-black"
        />
        <RadioGroupItem
          value="blue"
          id={id}
          aria-label="Blue"
          className="size-8 border-blue-500 bg-blue-500 shadow-none data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
        />
        <RadioGroupItem
          value="indigo"
          id={id}
          aria-label="Indigo"
          className="size-8 border-indigo-500 bg-indigo-500 shadow-none data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500"
        />
        <RadioGroupItem
          value="pink"
          id={id}
          aria-label="Pink"
          className="size-8 border-pink-500 bg-pink-500 shadow-none data-[state=checked]:border-pink-500 data-[state=checked]:bg-pink-500"
        />
        <RadioGroupItem
          value="red"
          id={id}
          aria-label="red"
          className="size-8 border-rose-500 bg-rose-500 shadow-none data-[state=checked]:border-rose-500 data-[state=checked]:bg-rose-500"
        />
        <RadioGroupItem
          value="orange"
          id={id}
          aria-label="orange"
          className="size-8 border-orange-500 bg-orange-500 shadow-none data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
        />
        <RadioGroupItem
          value="amber"
          id={id}
          aria-label="amber"
          className="size-8 border-amber-500 bg-amber-500 shadow-none data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500"
        />
        <RadioGroupItem
          value="emerald"
          id={id}
          aria-label="emerald"
          className="size-8 border-emerald-500 bg-emerald-500 shadow-none data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
        />
      </RadioGroup>
    </fieldset>
  );
}
