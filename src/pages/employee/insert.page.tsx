import { z } from 'zod';
import React, { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';
import { Button } from '@/registry/default/ui/button';
import { Checkbox } from '@/registry/default/ui/checkbox';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { SelectNative } from '@/registry/default/ui/select-native';
import { Factory, Mail, Phone, CalendarIcon, ShieldUser, StoreIcon, ZapIcon } from 'lucide-react';
import PhoneIconNumberPhone from '@components/app/phone_icon_number_phone.component';
import { Building2, InfoIcon } from 'lucide-react';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTrigger,
} from '@/registry/default/ui/stepper';
import { cn } from '@/registry/default/lib/utils';

import {
  Button as ButtonAria,
  DatePicker,
  Dialog,
  Group,
  Label as LabelAria,
  Popover,
} from 'react-aria-components';
import { parseDate as parseDateIntl, CalendarDate } from '@internationalized/date';
import { parseISO, startOfDay, isAfter, isEqual } from 'date-fns';
import countries from '@/constants/countries.constants';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar } from '@/registry/default/ui/calendar-rac';
import { DateInput } from '@/registry/default/ui/datefield-rac';

import { useQuery } from '@tanstack/react-query';
import employeeApi from '@api/employee.api';
import { useOrganizationStore } from '@/stores/organization.store';

const steps = [1, 2, 3, 4, 5];
const firstStep = steps[0];
const daysList = [
  { value: 'Monday', label: 'Monday', defaultChecked: true },
  { value: 'Tuesday', label: 'Tuesday', defaultChecked: true },
  { value: 'Wednesday', label: 'Wednesday', defaultChecked: true },
  { value: 'Thursday', label: 'Thursday', defaultChecked: true },
  { value: 'Friday', label: 'Friday', defaultChecked: true },
  { value: 'Saturday', label: 'Saturday', defaultChecked: false },
  { value: 'Sunday', label: 'Sunday', defaultChecked: false, disabled: false },
];

const PersonAddPage: React.FC = () => {
  const navigate = useNavigate();
  const { organizations } = useOrganizationStore();

  //schemas
  const insertPersonSchema = z
    .object({
      email: z
        .string()
        .min(1)
        .email()
        .transform((val) => val.toLowerCase().trim())
        .refine((val) => val.includes('@'), {
          message: ' Email must contain @',
        }),

      first_name: z.string().min(1).max(100),

      last_name: z.string().min(1).max(100),
      contract_start_date: z
        .string()
        .min(1)
        .refine(
          (start_date) => {
            const start = startOfDay(parseISO(start_date));
            return isAfter(start, startOfDay(new Date())) || isEqual(start, startOfDay(new Date()));
          },
          {
            message: ' Contract start date must be in the future',
          }
        ),

      contract_end_date: z.string().min(1, {
        message: ' Contract end date is required',
      }),

      legal_entity_id: z.string().optional(),
      employee_group_id: z.string().optional(),
      nationality: z.string().optional(),
      gender: z.string().optional(),
      phone_number: z.string().optional(),
      date_of_birth: z.string().nullable().optional(),
      identification_number: z.string().nullable().optional(),
      identification_number_expiration_date: z.string().nullable().optional(),
      social_security_number: z.string().optional(),
      address_street_and_number: z.string().optional(),
      address_city: z.string().optional(),
      address_postal_code: z.string().optional(),
      address_province: z.string().optional(),
      address_country: z.string().optional(),
      bank_account_format: z.string().optional(),
      bank_account_number: z.string().optional(),
      bank_entity_name: z.string().optional(),
      role_id: z.string().optional(),
      level_id: z.string().optional(),
      workplace_id: z.string().optional(),
      team_id: z.string().optional(),
      manager_id: z.string().optional(),
      head_absences_id: z.string().optional(),
      base_salary: z.number().nonnegative().min(0),
      salary_period: z.string().optional(),
      has_trial_period: z.boolean().optional(),
      trial_period_end_date: z.string().nullable().optional(),
      working_days: z.array(z.string()).min(1),
      working_hours: z.number().nonnegative().min(0),
      working_hours_frequency: z.string().optional(),
      permission_group_id: z.string().optional(),
      send_invitation_to_join: z.boolean().optional(),
      activate_onboarding_space: z.boolean().optional(),
      onboarding_template_id: z.string().optional(),
    })
    .refine(
      (data) => {
        const start = startOfDay(parseISO(data.contract_start_date));
        const end = startOfDay(parseISO(data.contract_end_date));
        return isAfter(end, start);
      },
      (data) => {
        const start = startOfDay(parseISO(data.contract_start_date));
        return {
          path: ['contract_end_date'],
          message: tzod('errors.too_small.date.inclusive', {
            minimum: start.toLocaleDateString(),
          }),
        };
      }
    );

  type InsertPersonInput = z.infer<typeof insertPersonSchema>;

  const [currentStep, setCurrentStep] = useState(1);
  const id = useId();
  const fieldsPerStep: Record<number, (keyof InsertPersonInput)[]> = {
    1: ['email', 'first_name', 'last_name'],
    2: [],
    3: [],
    4: ['contract_start_date', 'contract_end_date'],
  };
  const {
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setFocus,
    setValue,
  } = useForm<InsertPersonInput>({
    values: {
      email: '',
      first_name: '',
      last_name: '',
      contract_start_date: '',
      contract_end_date: '',
      legal_entity_id: '',
      employee_group_id: '',
      date_of_birth: null,
      gender: '',
      identification_number: '',
      identification_number_expiration_date: null,
      address_street_and_number: '',
      address_city: '',
      address_postal_code: '',
      address_province: '',
      bank_account_format: '',
      workplace_id: '',
      team_id: '',
      manager_id: '',
      head_absences_id: '',
      role_id: '',
      level_id: '',
      has_trial_period: false,
      trial_period_end_date: null,
      working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      base_salary: 0,
      salary_period: '',
      working_hours: 0,
      permission_group_id: '',
      send_invitation_to_join: false,
      activate_onboarding_space: false,
      onboarding_template_id: '',
      phone_number: '',
      address_country: '',
      social_security_number: '',
      bank_account_number: '',
      bank_entity_name: '',
      nationality: '',
      working_hours_frequency: '',
    },
    resolver: zodResolver(insertPersonSchema),
    mode: 'onChange',
  });

  const hasTrialPeriod = watch('has_trial_period');
  const sendInvitationToJoin = watch('send_invitation_to_join');

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['insert_employee', {}],
    queryFn: () => employeeApi.fetchHandleInsert({}),
  });

  const addPerson = handleSubmit(async (input) => {
    console.log('input --->', input);
    navigate('/employee-management');
  });

  const handleNextStep = async () => {
    console.log('errores', errors);
    if (currentStep < steps[steps.length - 1]) {
      const isValid = await trigger(fieldsPerStep[currentStep]);
      if (!isValid) {
        const firstError = fieldsPerStep[currentStep].find((field) => errors[field]);
        if (firstError) setFocus(firstError);
        return;
      }

      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > firstStep) setCurrentStep(currentStep - 1);
  };

  const parseDate = (date: string | null): CalendarDate | null => {
    if (!date) return null;

    try {
      return parseDateIntl(date); // Convierte el string en un CalendarDate válido
    } catch {
      return null; // Maneja strings inválidos
    }
  };

  const renderTitleContentInput = (title: string) => {
    return (
      <div className="flex my-2  items-center w-full">
        <div className=" py-1.5 flex  items-center space-x-2 font-semibold text-muted-foreground/30 text-xs text-nowrap">
          <ZapIcon className="-ms-0.5 opacity-60" size={18} aria-hidden="true" />
          <span className="mr-2"> {title}</span>
        </div>
        <span className="  w-full border-dashed border-border border-b  h-2"></span>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-between  pr-6 space-y-4    border-r">
        <div className="space-y-0">
          <h1 className="text-xl font-bold leading-tight">dhfjkdsfdsf</h1>
          <p className="text-sm text-muted-foreground">sdfdsfdsf</p>
        </div>

        <div className="w-full flex lg:justify-center  ">
          <div className="lg:max-w-md w-full space-y-2">
            {currentStep === 1 && (
              <>
                <div className="rounded-md border border-orange-500/30 px-4 py-3 bg-orange-500/2 text-orange-600 mb-4">
                  <p className="text-sm font-medium">
                    <InfoIcon
                      className="me-3 -mt-0.5 inline-flex opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    sadsadasd
                  </p>
                </div>

                {/* Correo electrónico */}
                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-email`}>
                    Correo electrónico <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`${id}-email`}
                    className={cn({ 'peer pe-9': !errors.email })}
                    placeholder="persona@ejemplo.com"
                    {...register('email')}
                    type="email"
                    required
                    aria-invalid={!!errors.email}
                  />

                  {errors.email ? (
                    <p className="text-rose-500 mt-0.5 text-xs" role="region" aria-live="polite">
                      {errors.email.message}
                    </p>
                  ) : (
                    <p
                      className="text-muted-foreground mt-2 text-xs"
                      role="alert"
                      aria-live="polite"
                    >
                      Puedes añadir un correo electrónico personal si aún no está disponible.
                    </p>
                  )}
                </div>

                {/* Nombre y Apellido */}
                <div className="flex flex-col space-x-0 sm:flex-row sm:space-x-4">
                  <div className="flex-1 *:not-first:mt-1">
                    <Label htmlFor={`${id}-first-name`}>
                      Nombres <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`${id}-first-name`}
                      placeholder="Ingresa un nombre válido"
                      {...register('first_name')}
                      type="text"
                      required
                      aria-invalid={!!errors.first_name}
                    />
                    {errors.first_name && (
                      <p className="text-rose-500 mt-0.5 text-xs" role="region" aria-live="polite">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-1  *:not-first:mt-1">
                    <Label htmlFor={`${id}-last-name`}>
                      Apellidos <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`${id}-last-name`}
                      {...register('last_name')}
                      placeholder="Ingresa un apellido válido"
                      type="text"
                      required
                      aria-invalid={!!errors.last_name}
                    />
                    {errors.last_name && (
                      <p className="text-rose-500 mt-0.5 text-xs" role="region" aria-live="polite">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* {renderTitleContentInput("Detalles de empleo")} */}

                {/* Entidad legal */}
                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-legal-entity`}>Entidad legal</Label>
                  <SelectNative id={`${id}-legal-entity`} {...register('legal_entity_id')}>
                    <option value="">Seleccionar</option>
                    {organizations.map((org) => (
                      <option key={org._id} value={org._id}>
                        {org.name}
                      </option>
                    ))}
                    {/* <option value="Datacont sac">Datacont sac</option>
                    <option value="Kambo LTE">Kambo LTE</option> */}
                  </SelectNative>
                  {errors.legal_entity_id && (
                    <p className="text-sm text-rose-500 mt-0.5">{errors.legal_entity_id.message}</p>
                  )}
                </div>

                {/* Grupo de empleados */}
                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-group-employee`}>Grupo de empleados</Label>
                  <SelectNative id={`${id}-group-employee`} {...register('employee_group_id')}>
                    <option value="">Seleccionar</option>
                    <option value="Datacont sac">Datacont sac</option>
                    <option value="Kambo LTE">Kambo LTE</option>
                  </SelectNative>
                  {errors.employee_group_id && (
                    <p className="text-sm text-rose-500 mt-0.5">
                      {errors.employee_group_id.message}
                    </p>
                  )}
                </div>

                {renderTitleContentInput('Datos personales')}

                {/* Fecha de nacimiento */}
                <DatePicker
                  className="*:not-first:mt-1"
                  value={
                    getValues().date_of_birth ? parseDate(getValues().date_of_birth ?? null) : null
                  }
                  onChange={(date) => {
                    setValue('date_of_birth', date ? date.toString() : '', {
                      shouldValidate: true,
                    });
                  }}
                >
                  <LabelAria className="text-foreground text-sm font-medium  ">
                    Fecha de nacimiento
                  </LabelAria>
                  <div className="flex">
                    <Group className="w-full">
                      <DateInput className="pe-9" />
                    </Group>
                    <ButtonAria className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
                      <CalendarIcon size={16} />
                    </ButtonAria>
                  </div>
                  <Popover className="z-50 rounded-lg border shadow-lg bg-background">
                    <Dialog className="max-h-[inherit] overflow-auto p-2">
                      <Calendar />
                    </Dialog>
                  </Popover>
                </DatePicker>

                {/* Género */}
                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-gender`}>Género</Label>
                  <SelectNative id={`${id}-gender`} {...register('gender')}>
                    <option value="">Seleccionar</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </SelectNative>
                  {errors.gender && (
                    <p className="text-sm text-rose-500 mt-0.5">{errors.gender.message}</p>
                  )}
                </div>

                {/* Teléfono */}
                <PhoneIconNumberPhone
                  label="Numero de telefono"
                  value={getValues().phone_number}
                  onChangeValue={(v) => setValue('phone_number', v)}
                />
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* {renderTitleContentInput("Información de identificación")} */}
                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-numero-identificacion`}>Número de identificación</Label>
                  <div className="relative">
                    <Input
                      id={`${id}-numero-identificacion`}
                      placeholder="Ingresa una identificación válida"
                      {...register('identification_number')}
                    />
                  </div>
                  {errors.identification_number && (
                    <p className="text-sm text-rose-500 mt-0.5">
                      {errors.identification_number.message}
                    </p>
                  )}
                </div>

                <DatePicker
                  className="*:not-first:mt-1"
                  value={
                    getValues().identification_number_expiration_date
                      ? parseDate(getValues().identification_number_expiration_date ?? null)
                      : null
                  }
                  onChange={(date) => {
                    setValue('identification_number_expiration_date', date ? date.toString() : '', {
                      shouldValidate: true,
                    });
                  }}
                >
                  <LabelAria className="text-foreground text-sm font-medium ">
                    Fecha de vencimiento del ID
                    {/* <span className="text-destructive ml-1">*</span> */}
                  </LabelAria>
                  <div className="flex ">
                    <Group className="w-full">
                      <DateInput
                        className="pe-9"
                        {...register('identification_number_expiration_date')}
                        aria-invalid={!!errors.identification_number_expiration_date}
                      />
                    </Group>
                    <ButtonAria className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
                      <CalendarIcon size={16} />
                    </ButtonAria>
                  </div>
                  {errors.identification_number_expiration_date && (
                    <p className="text-rose-500 mt-0.5 text-xs" role="region" aria-live="polite">
                      {errors.identification_number_expiration_date.message}
                    </p>
                  )}
                  <Popover
                    className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border shadow-lg outline-hidden"
                    offset={4}
                  >
                    <Dialog className="max-h-[inherit] overflow-auto p-2">
                      <Calendar />
                    </Dialog>
                  </Popover>
                </DatePicker>

                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}_social_security_number`}>
                    Numero de la seguridad social
                  </Label>
                  <Input
                    type="text"
                    id={`${id}_social_security_number`}
                    placeholder="Ingrese un numero valido"
                    {...register('social_security_number')}
                  />
                  {errors.address_street_and_number && (
                    <p className="text-sm text-rose-500 mt-0.5">
                      {errors.address_street_and_number.message}
                    </p>
                  )}
                </div>

                {renderTitleContentInput('Detalles de la dirección')}

                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-direccion-calle-numero`}>Dirección - calle y número</Label>
                  <Input
                    id={`${id}-direccion-calle-numero`}
                    placeholder="Ej. Calle 123"
                    {...register('address_street_and_number')}
                  />
                  {errors.address_street_and_number && (
                    <p className="text-sm text-rose-500 mt-0.5">
                      {errors.address_street_and_number.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-x-4 sm:flex-row">
                  <div className="flex-1 *:not-first:mt-1">
                    <Label htmlFor={`${id}-direccion-ciudad`}>Dirección - ciudad</Label>
                    <Input
                      id={`${id}-direccion-ciudad`}
                      placeholder="Ej. Lima"
                      {...register('address_city')}
                    />
                    {errors.address_city && (
                      <p className="text-sm text-rose-500 mt-0.5">{errors.address_city.message}</p>
                    )}
                  </div>
                  <div className="flex-1 *:not-first:mt-1">
                    <Label htmlFor={`${id}-direccion-codigo-postal`}>Dirección código postal</Label>
                    <Input
                      id={`${id}-direccion-codigo-postal`}
                      placeholder="Ej. 15001"
                      {...register('address_postal_code')}
                    />
                    {errors.address_postal_code && (
                      <p className="text-sm text-rose-500 mt-0.5">
                        {errors.address_postal_code.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-x-4 sm:flex-row">
                  <div className="flex-1 *:not-first:mt-1">
                    <Label htmlFor={`${id}-direccion-provincia`}>Dirección - provincia</Label>
                    <div className="relative">
                      <Input
                        id={`${id}-direccion-provincia`}
                        placeholder="Ej. Lima"
                        {...register('address_province')}
                      />
                    </div>
                    {errors.address_province && (
                      <p className="text-sm text-rose-500 mt-0.5">
                        {errors.address_province.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-1 *:not-first:mt-1">
                    <Label htmlFor={`${id}_address_country`}>Dirección - país</Label>
                    <SelectNative id={`${id}_address_country`} {...register('address_country')}>
                      <option value="">Seleccionar</option>
                      {countries.map((country, index) => (
                        <option key={index} value={country.value}>
                          {country.name}
                        </option>
                      ))}
                    </SelectNative>
                  </div>
                </div>

                {renderTitleContentInput('Información bancaria')}

                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-formato-cuenta-bancaria`}>
                    Formato de cuenta bancaria
                  </Label>
                  <SelectNative
                    id={`${id}-formato-cuenta-bancaria`}
                    {...register('bank_account_format')}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Nombre del banco + número de la cuenta">
                      Nombre del banco + número de la cuenta
                    </option>
                    <option value="Numero de cuenta  + Codigo de orden">
                      Número de cuenta + Código de orden
                    </option>
                    <option value="Numero de cuenta  + Numero de ruta">
                      Número de cuenta + Número de ruta
                    </option>
                    <option value="CLABE">CLABE</option>
                    <option value="IBAN">IBAN</option>
                    <option value="Otro">Otro</option>
                  </SelectNative>
                  {errors.bank_account_format && (
                    <p className="text-sm text-rose-500 mt-0.5">
                      {errors.bank_account_format.message}
                    </p>
                  )}
                </div>

                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}_bank_entity_name`}>Nombre de banco</Label>
                  <Input
                    id={`${id}_bank_entity_name`}
                    placeholder="Ingrese un valor valido"
                    {...register('bank_entity_name')}
                  />
                  {errors.bank_entity_name && (
                    <p className="text-sm text-rose-500 mt-0.5">
                      {errors.bank_entity_name.message}
                    </p>
                  )}
                </div>
                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-numero-cuenta-banco`}>Número de cuenta</Label>
                  <Input
                    id={`${id}-numero-cuenta-banco`}
                    placeholder="Ingrese un valor valido"
                    {...register('bank_account_number')}
                  />
                  {errors.bank_account_number && (
                    <p className="text-sm text-rose-500 mt-0.5">
                      {errors.bank_account_number.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="rounded-md border border-cyan-500/30 px-4 py-3 bg-cyan-500/2 text-cyan-600 mb-4">
                  <p className="text-sm font-medium">
                    <InfoIcon
                      className="me-3 -mt-0.5 inline-flex opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Muchos procesos están estrechamente relacionados con el rol de tu empleado/a. Te
                    recomendamos que completes esta información.
                  </p>
                </div>
                {/* {renderTitleContentInput("Asignación de trabajo")} */}
                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-roles`}>Rol</Label>
                  <SelectNative
                    id={`${id}-roles`}
                    {...register('role_id')}
                    aria-invalid={!!errors.role_id}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Desarrollador fullstack">Desarrollador fullstack</option>
                  </SelectNative>
                  {errors.role_id && (
                    <p className="text-rose-500 text-sm ">{errors.role_id.message}</p>
                  )}
                </div>

                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-niveles`}>Nivel</Label>
                  <SelectNative
                    id={`${id}-niveles`}
                    {...register('level_id')}
                    aria-invalid={!!errors.level_id}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Desarrollador fullstack">Desarrollador fullstack</option>
                  </SelectNative>
                  {errors.level_id && (
                    <p className="text-rose-500 text-sm ">{errors.level_id.message}</p>
                  )}
                </div>
                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-lugar-trabajo`}>Lugar de trabajo</Label>
                  <SelectNative id={`${id}-lugar-trabajo`} {...register('workplace_id')}>
                    <option value="">Seleccionar</option>
                    <option value="Datacont sac">Datacont sac</option>
                    <option value="Kambo LTE">Kambo LTE</option>
                  </SelectNative>
                  {errors.workplace_id && (
                    <p className="text-sm text-rose-500 mt-0.5">{errors.workplace_id.message}</p>
                  )}
                </div>

                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-team-empresa`}>Equipo</Label>
                  <SelectNative id={`${id}-team-empresa`} {...register('team_id')}>
                    <option value="">Seleccionar</option>
                    <option value="Por horas">Desarrollador fullstack</option>
                  </SelectNative>
                  {errors.team_id && (
                    <p className="text-sm text-rose-500 mt-0.5">{errors.team_id.message}</p>
                  )}
                </div>

                {renderTitleContentInput('Datos de superiores')}

                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-manager-empresa`}>Manager</Label>
                  <SelectNative id={`${id}-manager-empresa`} {...register('manager_id')}>
                    <option value="">Seleccionar</option>
                    <option value="Desarrollador fullstack">Desarrollador fullstack</option>
                  </SelectNative>
                  {errors.manager_id && (
                    <p className="text-sm text-rose-500 mt-0.5">{errors.manager_id.message}</p>
                  )}
                </div>

                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-responsable-de-ausencias`}>Responsable de ausencias</Label>
                  <SelectNative
                    id={`${id}-responsable-de-ausencias`}
                    {...register('head_absences_id')}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Desarrollador fullstack">Desarrollador fullstack</option>
                  </SelectNative>
                  {errors.head_absences_id && (
                    <p className="text-sm text-rose-500 mt-0.5">
                      {errors.head_absences_id.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div className="rounded-md border border-orange-500/30 px-4 py-3 bg-orange-500/2 text-orange-600 mb-4">
                  <p className="text-sm font-medium">
                    <InfoIcon
                      className="me-3 -mt-0.5 inline-flex opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Al proporcionar el salario base de los empleados, comprenderás mejor los costes
                    de tus empleados dentro del espacio de trabajo financiero.
                  </p>
                </div>
                {/* {renderTitleContentInput("Detalles de contrato")} */}

                <div className="flex flex-col space-x-4 sm:flex-row">
                  <div className="flex-1  ">
                    <DatePicker
                      className="*:not-first:mt-1"
                      value={
                        getValues().contract_start_date
                          ? parseDate(getValues().contract_start_date ?? null)
                          : null
                      }
                      onChange={(date) => {
                        setValue('contract_start_date', date ? date.toString() : '', {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <LabelAria className="text-foreground text-sm font-medium ">
                        Fecha inicio del contrato
                        <span className="text-destructive ml-1">*</span>
                      </LabelAria>
                      <div className="flex">
                        <Group className="w-full">
                          <DateInput
                            className="pe-9"
                            {...register('contract_start_date')}
                            aria-invalid={!!errors.contract_start_date}
                          />
                        </Group>
                        <ButtonAria className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
                          <CalendarIcon size={16} />
                        </ButtonAria>
                      </div>
                      {errors.contract_start_date && (
                        <p
                          className="text-rose-500 mt-0.5 text-xs"
                          role="region"
                          aria-live="polite"
                        >
                          {errors.contract_start_date.message}
                        </p>
                      )}
                      <Popover
                        className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border shadow-lg outline-hidden"
                        offset={4}
                      >
                        <Dialog className="max-h-[inherit] overflow-auto p-2">
                          <Calendar />
                        </Dialog>
                      </Popover>
                    </DatePicker>
                  </div>
                  <div className="flex-1 ">
                    <DatePicker
                      className="*:not-first:mt-1"
                      value={
                        getValues().contract_end_date
                          ? parseDate(getValues().contract_end_date ?? null)
                          : null
                      }
                      onChange={(date) => {
                        setValue('contract_end_date', date ? date.toString() : '', {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <LabelAria className="text-foreground text-sm font-medium ">
                        Fecha de finalización del contrato
                        <span className="text-destructive ml-1">*</span>
                      </LabelAria>
                      <div className="flex">
                        <Group className="w-full">
                          <DateInput
                            className="pe-9 "
                            {...register('contract_end_date')}
                            aria-invalid={!!errors.contract_end_date}
                          />
                        </Group>
                        <ButtonAria className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
                          <CalendarIcon size={16} />
                        </ButtonAria>
                      </div>
                      {errors.contract_end_date && (
                        <p
                          className="text-rose-500 mt-0.5 text-xs"
                          role="region"
                          aria-live="polite"
                        >
                          {errors.contract_end_date.message}
                        </p>
                      )}
                      <Popover
                        className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border shadow-lg outline-hidden"
                        offset={4}
                      >
                        <Dialog className="max-h-[inherit] overflow-auto p-2">
                          <Calendar />
                        </Dialog>
                      </Popover>
                    </DatePicker>
                  </div>
                </div>

                <div className="flex flex-col space-x-4 sm:flex-row">
                  <div className="flex-1  *:not-first:mt-1">
                    <Label htmlFor={`${id}-periodo`}>Periodo</Label>
                    <SelectNative
                      id={`${id}-periodo`}
                      {...register('salary_period')}
                      aria-invalid={!!errors.salary_period}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Por horas">Por horas</option>
                      <option value="Diario">Diario</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Mensual">Mensual</option>
                      <option value="Anual">Anual</option>
                    </SelectNative>
                    {errors.salary_period && (
                      <p className="text-rose-500 text-sm ">{errors.salary_period.message}</p>
                    )}
                  </div>
                  <div className="flex-1  *:not-first:mt-1">
                    <Label htmlFor={`${id}-salario-base`}>Salario base</Label>
                    <Input
                      id={`${id}-salario-base`}
                      type="number"
                      placeholder="Enter valid salary"
                      {...register('base_salary', { valueAsNumber: true })}
                      aria-invalid={!!errors.base_salary}
                    />
                    {errors.base_salary && (
                      <p className="text-rose-500 text-sm ">{errors.base_salary.message}</p>
                    )}
                  </div>
                </div>

                <Controller
                  control={control}
                  name="has_trial_period"
                  render={({ field }) => (
                    <div className="flex items-center py-1 space-x-2  *:not-first:mt-1">
                      <Checkbox
                        id={`${id}_has_trial_period`}
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        aria-label="Tiene periodo de prueba"
                      />
                      <Label htmlFor={`${id}_has_trial_period`}>Tiene periodo de prueba</Label>
                    </div>
                  )}
                />

                {hasTrialPeriod && (
                  <DatePicker
                    className="*:not-first:mt-1"
                    value={
                      getValues().trial_period_end_date
                        ? parseDate(getValues().trial_period_end_date ?? null)
                        : null
                    }
                    onChange={(date) => {
                      setValue('trial_period_end_date', date ? date.toString() : '', {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <LabelAria className="text-foreground text-sm font-medium ">
                      Fecha de finalización del periodo de prueba
                      <span className="text-destructive ml-1">*</span>
                    </LabelAria>
                    <div className="flex">
                      <Group className="w-full">
                        <DateInput
                          className="pe-9 "
                          {...register('trial_period_end_date')}
                          aria-invalid={!!errors.trial_period_end_date}
                        />
                      </Group>
                      <ButtonAria className="text-muted-foreground/80 hover:text-foreground z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition outline-none data-focus-visible:ring-[3px]">
                        <CalendarIcon size={16} />
                      </ButtonAria>
                    </div>
                    {errors.trial_period_end_date && (
                      <p className="text-rose-500 mt-0.5 text-xs" role="region" aria-live="polite">
                        {errors.trial_period_end_date.message}
                      </p>
                    )}
                    <Popover
                      className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border shadow-lg outline-hidden"
                      offset={4}
                    >
                      <Dialog className="max-h-[inherit] overflow-auto p-2">
                        <Calendar />
                      </Dialog>
                    </Popover>
                  </DatePicker>
                )}

                {renderTitleContentInput(' Horas de trabajo')}

                <Controller
                  control={control}
                  name="working_days"
                  render={({ field }) => (
                    <fieldset className="my-2">
                      <legend className="text-foreground text-sm leading-none font-medium mb-2">
                        Días laborables
                      </legend>
                      <div className="flex gap-1.5">
                        {daysList.map((item) => {
                          const isChecked = field.value?.includes(item.value);

                          const toggleValue = () => {
                            if (isChecked) {
                              field.onChange(field.value.filter((v: string) => v !== item.value));
                            } else {
                              field.onChange([...(field.value || []), item.value]);
                            }
                          };

                          return (
                            <label
                              key={`${id}-${item.value}`}
                              className={cn(
                                'border-input ',
                                isChecked && 'border-primary bg-primary text-primary-foreground',
                                'relative flex size-9 cursor-pointer flex-col items-center justify-center gap-3 rounded-full border text-center shadow-xs transition-[color,box-shadow] outline-none'
                              )}
                            >
                              <Checkbox
                                id={`${id}-${item.value}`}
                                value={item.value}
                                checked={isChecked}
                                onCheckedChange={toggleValue}
                                disabled={item.disabled}
                                className="sr-only after:absolute after:inset-0"
                              />
                              <span aria-hidden="true" className="text-sm font-medium">
                                {item.label[0]}
                              </span>
                              <span className="sr-only">{item.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}
                />

                <div className="flex flex-col space-x-4 sm:flex-row">
                  <div className="flex-1 *:not-first:mt-1 ">
                    <Label htmlFor={`${id}-horas-trabajo`}>Horas de trabajo</Label>
                    <Input
                      id={`${id}-horas-trabajo`}
                      type="number"
                      placeholder="Enter valid working hours"
                      {...register('working_hours', { valueAsNumber: true })}
                      aria-invalid={!!errors.working_hours}
                    />
                    {errors.working_hours && (
                      <p className="text-rose-500 text-sm ">{errors.working_hours.message}</p>
                    )}
                  </div>

                  <div className="flex-1 *:not-first:mt-1">
                    <Label htmlFor={`${id}-frecuencia`}>Frecuencia</Label>
                    <SelectNative
                      id={`${id}-frecuencia`}
                      {...register('working_hours_frequency')}
                      aria-invalid={!!errors.working_hours_frequency}
                    >
                      <option value="">Seleccionar</option>
                      <option value="day">Día</option>
                      <option value="week">Semana</option>
                      <option value="month">Mes</option>
                      <option value="year">Año</option>
                    </SelectNative>
                    {errors.working_hours_frequency && (
                      <p className="text-rose-500 text-sm ">
                        {errors.working_hours_frequency.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                {renderTitleContentInput(' Configuracion general')}
                <div>
                  <Label htmlFor={`${id}-grupo-permisos`}>Grupo de permisos</Label>
                  <SelectNative
                    id={`${id}-grupo-permisos`}
                    {...register('permission_group_id')}
                    className={cn({
                      'border-destructive': errors.permission_group_id,
                    })}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Empleados por defecto">Empleados por defecto</option>
                  </SelectNative>
                  {errors.permission_group_id && (
                    <p className="text-destructive text-xs ">
                      {errors.permission_group_id.message?.toString()}
                    </p>
                  )}
                </div>

                <Controller
                  control={control}
                  name="send_invitation_to_join"
                  render={({ field }) => (
                    <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                      <Checkbox
                        aria-describedby={`${id}_send_invitation_to_join`}
                        id={`${id}_send_invitation_to_join`}
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        aria-label="Enviar invitación a asistify"
                        className="order-1 after:absolute after:inset-0"
                      />
                      <div className="flex grow items-center gap-3">
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-full border"
                          aria-hidden="true"
                        >
                          <StoreIcon className="opacity-80" size={16} />
                        </div>
                        <div>
                          <Label
                            htmlFor={`${id}_send_invitation_to_join`}
                            className="text-sm font-semibold"
                          >
                            Enviar invitación a Asistify
                          </Label>
                          <p
                            id={`${id}_send_invitation_to_join`}
                            className="text-muted-foreground text-xs"
                          >
                            Enviar un correo electrónico con un enlace para unirte a Asistify
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                />

                {sendInvitationToJoin && (
                  <Controller
                    control={control}
                    name="activate_onboarding_space"
                    render={({ field }) => (
                      <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                        <Checkbox
                          aria-describedby={`${id}_activate_onboarding_space`}
                          id={`${id}_activate_onboarding_space`}
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                          aria-label="Activar el espacio de Onboarding"
                          className="order-1 after:absolute after:inset-0"
                        />
                        <div className="flex grow items-center gap-3">
                          <div
                            className="flex size-10 shrink-0 items-center justify-center rounded-full border"
                            aria-hidden="true"
                          >
                            <StoreIcon className="opacity-80" size={16} />
                          </div>
                          <div>
                            <Label
                              htmlFor={`${id}_activate_onboarding_space`}
                              className="text-sm font-semibold"
                            >
                              Activar el espacio de Onboarding
                            </Label>
                            <p
                              id={`${id}_send_invitation_to_join`}
                              className="text-muted-foreground text-xs"
                            >
                              Activa un espacio personal para completar tus tareas relacionadas con
                              el onboarding.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex  justify-between items-center  lg:flex-row md:flex-row space-y-4 lg:space-y-0 md:space-y-0">
          <div className=" flex w-32 space-x-2">
            <Stepper value={currentStep} onValueChange={setCurrentStep}>
              {steps.map((step) => (
                <StepperItem key={step} step={step} className="flex-1">
                  <StepperTrigger className="w-full flex-col items-start gap-2" asChild>
                    <StepperIndicator asChild className="bg-border h-2 w-full rounded-none">
                      <span className="sr-only">{step}</span>
                    </StepperIndicator>
                  </StepperTrigger>
                </StepperItem>
              ))}
            </Stepper>
            <div className="text-muted-foreground text-xs font-medium tabular-nums">
              {currentStep}/{steps.length}
            </div>
          </div>
          <div className="flex justify-center space-x-2 mx-6">
            <Button
              variant="outline"
              size={'sm'}
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>
            {currentStep === steps.length ? (
              <Button size={'sm'} onClick={addPerson} disabled={isLoading}>
                Continuar
              </Button>
            ) : (
              <Button size={'sm'} onClick={handleNextStep} disabled={currentStep >= steps.length}>
                Continuar
              </Button>
            )}
          </div>
        </div>
      </div>

      <div
        className={cn(
          'w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-6 md:p-0 flex-col'
        )}
      >
        <div className="bg-background z-50 max-w-[500px] min-w-[350px] rounded-md border p-6 shadow-lg mb-2 ">
          <div className="flex gap-3">
            <Avatar className="rounded-md size-11 bg-muted-foreground/10 items-center justify-center flex">
              <Building2 className="text-muted-foreground/80" size={22}></Building2>
            </Avatar>
            <div className="flex grow flex-col gap-3">
              <div className="space-y-0">
                <p className="text-foreground font-semibold text-md">adssadasd</p>
                {/* {companyName ? (
                  <p className="text-foreground font-semibold text-md">
                    adssadasd
                  </p>
                ) : (
                  <div className="w-full h-5 bg-gray-100 rounded-full my-1"></div>
                )} */}

                <div className="flex space-x-1 items-center mb-1 ">
                  <Factory size={14} className="text-muted-foreground/70"></Factory>
                  <p className="text-muted-foreground/70 text-xs">sadsaddsa</p>
                </div>
                <div className="flex space-x-1 items-center ">
                  <Phone size={15} className="text-muted-foreground/80"></Phone>
                  <p className="text-muted-foreground/80 text-xs">sdasdasdsad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-background z-50 max-w-[500px] min-w-[350px] rounded-md border p-6 shadow-lg mb-2 ">
          <div className="flex gap-3">
            <Avatar className="rounded-md size-11">
              <AvatarImage src="/images/avatdar-2.jpeg" alt="Logo" />
              <AvatarFallback className="font-extrabold text-md text-primary bg-primary/10">
                MA
              </AvatarFallback>
              {/* <AvatarFallback className="font-extrabold text-md text-primary bg-primary/10">
                {name.charAt(0).toUpperCase()}
                {lastname.charAt(0).toUpperCase()}
              </AvatarFallback> */}
            </Avatar>
            <div className="flex grow flex-col gap-3">
              <div className="space-y-0">
                {/* {true ? (
                  <p className="text-foreground font-semibold text-md">
                    sdsadsadsadsad
                  </p>
                ) : (
                  <div className="w-full h-5 bg-gray-100 rounded-full my-1"></div>
                )} */}
                <p className="text-foreground font-semibold text-md">sdsadsadsadsad</p>

                <div className="flex space-x-1 items-center mb-1 ">
                  <Mail size={14} className="text-muted-foreground/70"></Mail>
                  <p className="text-muted-foreground/70 text-xs">hdsjfdsgfjhdgjhfgdsf</p>
                </div>
                <div className="flex space-x-1 items-center ">
                  <ShieldUser size={15} className="text-muted-foreground/80"></ShieldUser>
                  <p className="text-muted-foreground/80 text-xs">hfjdhfjkhdfkhdkjhfkjdhf</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonAddPage;
