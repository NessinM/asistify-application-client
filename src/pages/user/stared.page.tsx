import React, { useId, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';
import { Button } from '@/registry/default/ui/button';
import { Checkbox } from '@/registry/default/ui/checkbox';
import { Toaster } from 'sonner';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { RadioGroup, RadioGroupItem } from '@/registry/default/ui/radio-group';
import { SelectNative } from '@/registry/default/ui/select-native';
import { useTheme } from '@providers/theme.provider';
import { Factory, LogOut, Mail, Phone, ShieldUser, UsersRound } from 'lucide-react';
import PhoneIconNumberPhone from '@components/app/phone_icon_number_phone.component';
import {
  BookOpenText,
  BriefcaseConveyorBelt,
  Building2,
  Calculator,
  CalendarClock,
  ChartLine,
  ChevronsUpDown,
  Clock2,
  Gauge,
  MessageSquareHeart,
  Package,
  Receipt,
  TreePalm,
  UserRoundSearch,
  CircleAlertIcon,
} from 'lucide-react';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTrigger,
} from '@/registry/default/ui/stepper';
import { cn } from '@/registry/default/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/registry/default/ui/alert-dialog';
import { toast } from 'sonner';
import { useUserStore } from '@stores/user.store';

const steps = [1, 2, 3, 4];
const firstStep = steps[0];

const StaredUser: React.FC = () => {
  const { user } = useUserStore();
  const [currentStep, setCurrentStep] = useState(1);
  const { fetchHandleLogOut, fetchHandleSaveInitialConfiguration } = useUserStore();
  const { setPrimaryColor, primaryColor, theme } = useTheme();
  const navigate = useNavigate();
  const id = useId();
  const employeNumberId = useId();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean | 'indeterminate'>(false);
  const [name, setName] = useState(user?.name || ''),
    [lastname, setLastName] = useState(user?.last_name || ''),
    [companyName, setCompanyName] = useState(''),
    [jobTitle, setJobTitle] = useState(user?.job_title || ''),
    [companyIndustry, setCompanyIndustry] = useState(''),
    [companyPhone, setCompanyPhone] = useState(''),
    [employeesNumber, setEmployeesNumber] = useState(19);

  const [modules, setModules] = useState([
    {
      id: 1,
      icon: Clock2,
      label: 'Time Tracking',
      path: '/time-tracking',
      defaultChecked: false,
      badge: '',
    },
    {
      id: 2,
      icon: TreePalm,
      label: 'Absences & Vacations',
      path: '/absences-vacations',
      defaultChecked: false,
      badge: '',
    },
    {
      id: 3,
      icon: CalendarClock,
      label: 'Shift Management',
      path: '/shift-management',
      defaultChecked: false,
      badge: '',
    },
    {
      id: 4,
      icon: MessageSquareHeart,
      label: 'Engagement & Culture',
      path: '/engagement-culture',
      defaultChecked: false,
      badge: '',
    },
    {
      id: 5,
      icon: ChartLine,
      label: 'Performance Review',
      path: '/performance-review',
      defaultChecked: false,
      badge: '',
    },
    {
      id: 6,
      icon: UserRoundSearch,
      label: 'Recruitment',
      path: '/recruitment',
      defaultChecked: false,
      badge: '',
    },
    {
      id: 7,
      icon: Receipt,
      label: 'Expenses',
      path: '/expenses',
      defaultChecked: false,
      badge: '',
    },
    {
      id: 8,
      icon: BookOpenText,
      label: 'Training',
      path: '/training',
      defaultChecked: false,
      badge: '',
    },
    {
      id: 9,
      icon: Calculator,
      label: 'IT Management',
      path: '/it-management',
      defaultChecked: false,
      badge: '',
    },
    {
      id: 10,
      icon: Package,
      label: 'Space Management',
      path: '/space-management',
      defaultChecked: false,
      badge: '',
    },
    {
      id: 11,
      icon: BriefcaseConveyorBelt,
      label: 'Project Management',
      path: '/project-management',
      defaultChecked: false,
      badge: '',
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchHandleSaveInitialConfiguration({
        user_name: name,
        user_last_name: lastname,
        user_job_title: jobTitle,
        company_send_exclusive_offers: termsAccepted === true,
        company_name: companyName,
        company_industry: companyIndustry,
        company_country: 'Perú',
        company_number_phone: companyPhone,
        theme_primary_color: primaryColor,
        theme_mode_name: theme,
        company_number_of_employees: employeesNumber,
      });

      toast.success('Los datos se guardaron correctamente', {
        description: 'Los datos se guardaron correctamente',
        position: 'bottom-left',
      });

      navigate('/');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message, {
        description: error.errors,
        position: 'bottom-left',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      await fetchHandleLogOut();
      navigate('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message, {
        description: error.message,
        position: 'bottom-left',
      });
    }
  };

  const handleNextStep = useCallback(() => {
    if (currentStep < steps[steps.length - 1]) setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > firstStep) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const toggleModule = useCallback((id: number) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, defaultChecked: !m.defaultChecked } : m))
    );
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      {/* Sección izquierda */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-6 md:p-8 border-r">
        {/* Logo */}
        <div className="flex items-center w-full justify-between">
          <img className="rounded-full w-34" src="/logo.svg" alt="Asistify Logo" />
          <div className="gap-2 max-md:flex-wrap lg:flex hidden">
            <Button
              size="sm"
              className="underline"
              variant="link"
              onClick={() => navigate('/sign-up')}
            >
              Skip configuration
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <LogOut className="opacity-60" size={19} aria-hidden="true" />
                  Log out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Do you really want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your account? All your data will be removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogOut}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Content */}
        {currentStep === 1 && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="max-w-sm">
              <h1 className="font-extrabold text-xl ">Empieza tu viaje</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Configura tu cuenta de prueba de <strong>7 días</strong> y empieza a usar los
                <a className="text-primary font-medium hover:underline cursor-default">
                  Planes Starter
                </a>
                , una serie de packs de productos diseñados para ayudar a tu negocio según las
                necesidades de tu sector.
              </p>

              <form className="space-y-4 mt-6">
                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-name`}>Nombre</Label>
                  <Input
                    id={`${id}-name`}
                    placeholder="Tu nombre"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-lastname`}>Apellidos</Label>
                  <Input
                    id={`${id}-lastname`}
                    placeholder="Tus apellidos"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="*:not-first:mt-1.5 ">
                  <Label htmlFor={`${id}-color-select`}>Choose a theme color</Label>
                  <RadioGroup
                    className="flex gap-x-1.5  "
                    defaultValue={primaryColor}
                    onValueChange={setPrimaryColor}
                  >
                    <RadioGroupItem
                      value="black"
                      id={id}
                      aria-label="Black"
                      className="size-8 border-black bg-black shadow-none data-[state=checked]:border-black data-[state=checked]:bg-black"
                    />
                    <RadioGroupItem
                      value="oklch(0.623 0.214 259.815)"
                      id={id}
                      aria-label="Blue"
                      className="size-8 border-blue-500 bg-blue-500 shadow-none data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                    />
                    <RadioGroupItem
                      value="oklch(0.585 0.233 277.117)"
                      id={id}
                      aria-label="Indigo"
                      className="size-8 border-indigo-500 bg-indigo-500 shadow-none data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500"
                    />
                    <RadioGroupItem
                      value="oklch(0.596 0.145 163.225)"
                      id={id}
                      aria-label="emerald"
                      className="size-8 border-emerald-500 bg-emerald-500 shadow-none data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                    />
                    <RadioGroupItem
                      value="oklch(0.656 0.241 354.308)"
                      id={id}
                      aria-label="Pink"
                      className="size-8 border-pink-500 bg-pink-500 shadow-none data-[state=checked]:border-pink-500 data-[state=checked]:bg-pink-500"
                    />
                    <RadioGroupItem
                      value="oklch(0.645 0.246 16.439)"
                      id={id}
                      aria-label="rose"
                      className="size-8 border-rose-500 bg-rose-500 shadow-none data-[state=checked]:border-rose-500 data-[state=checked]:bg-rose-500"
                    />

                    <RadioGroupItem
                      value="oklch(0.769 0.188 70.08)"
                      id={id}
                      aria-label="amber"
                      className="size-8 border-amber-500 bg-amber-500 shadow-none data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500"
                    />
                  </RadioGroup>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="max-w-sm">
              <h1 className="font-extrabold text-xl ">¿Qué define mejor tu rol?</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Cúentanos un poco sobre ti para que podamos personalizar tu experiencia
              </p>

              <form className="space-y-4 mt-6">
                <div className="*:not-first:mt-2">
                  <Label htmlFor={id}>Select rol </Label>
                  <SelectNative
                    id={id}
                    onChange={(e) => setJobTitle(e.target.value)}
                    defaultValue={jobTitle}
                  >
                    <option value="Equipo IT">Equipo IT</option>
                    <option value="Equipo de administracion/contable">
                      Equipo de administracion/contable
                    </option>
                    <option value="Equipo de operaciones">Equipo de operaciones</option>
                    <option value="Equipo directo">Equipo directo</option>
                    <option value="Especialista RRHH">Especialista RRHH</option>
                    <option value="Estoy en practicas">Estoy en practicas</option>
                    <option value="Manager de RRHH">Manager de RRHH</option>
                    <option value="Soy estudian">Soy estudiante</option>
                    <option value="Otro">Otro</option>
                  </SelectNative>
                  <p
                    className="text-muted-foreground mt-2 text-xs"
                    role="region"
                    aria-live="polite"
                  >
                    Tell us what&lsquo;s your favorite Select framework
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="max-w-sm">
              <h1 className="font-extrabold text-xl ">
                Te damos la bienvenida, Nesyn! Vamos a empezar
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Esto nos ayudará a personalizar tu experienciaen Asistify
              </p>

              <form className="space-y-4 mt-6">
                <div className="*:not-first:mt-1">
                  <Label htmlFor={`${id}-company-name`}>Nombre de la empresa</Label>
                  <Input
                    id={`${id}-company-name`}
                    placeholder="Tu nombre"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor={employeNumberId}>Numero de empleados/as </Label>
                  <SelectNative
                    id={employeNumberId}
                    value={employeesNumber}
                    onChange={(e) => setEmployeesNumber(+e.target.value)}
                  >
                    <option value={19}>1 - 19</option>
                    <option value={30}>20 - 30</option>
                    <option value={50}>31 - 50</option>
                    <option value={100}>51 - 100</option>
                    <option value={150}>101 - 150</option>
                    <option value={300}>151 - 300</option>
                    <option value={500}>301 - 500</option>
                    <option value={1000}>501 - 1000</option>
                    <option value={1001}>1000+</option>
                  </SelectNative>
                </div>
                <div className="*:not-first:mt-1">
                  <Label htmlFor={id}>Seleccione una industria </Label>
                  <SelectNative
                    id={id}
                    onChange={(e) => setCompanyIndustry(e.target.value)}
                    defaultValue={companyIndustry}
                  >
                    <option value="Industry">Industry</option>
                    <option value="Aerospace & Defense">Aerospace & Defense</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Automobiles & Components">Automobiles & Components</option>
                    <option value="Banking & Insurance">Banking & Insurance</option>
                    <option value="Chemicals">Chemicals</option>
                    <option value="Commercial & Professional Services">
                      Commercial & Professional Services
                    </option>
                    <option value="Commodities">Commodities</option>
                    <option value="Construction & Engineering">Construction & Engineering</option>
                    <option value="Consumer Durables & Apparel">Consumer Durables & Apparel</option>
                    <option value="Consumer Services">Consumer Services</option>
                    <option value="Containers & Packaging">Containers & Packaging</option>
                    <option value="Diversified Financials">Diversified Financials</option>
                    <option value="Education">Education</option>
                    <option value="Energy">Energy</option>
                    <option value="Food & Staples Retailing">Food & Staples Retailing</option>
                    <option value="Food, Beverage & Tobacco">Food, Beverage & Tobacco</option>
                    <option value="Government Administration">Government Administration</option>
                    <option value="Health Care Equipment & Services">
                      Health Care Equipment & Services
                    </option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Internet & Direct Marketing Retail">
                      Internet & Direct Marketing Retail
                    </option>
                    <option value="Legal Services">Legal Services</option>
                    <option value="Machinery">Machinery</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Media & Entertainment">Media & Entertainment</option>
                    <option value="Metals & Mining">Metals & Mining</option>
                    <option value="Military">Military</option>
                    <option value="Non-Profit Organization">Non-Profit Organization</option>
                    <option value="Other">Other</option>
                    <option value="Pharmaceuticals & Biotechnology">
                      Pharmaceuticals & Biotechnology
                    </option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Research & Consulting Services">
                      Research & Consulting Services
                    </option>
                    <option value="Retailing">Retailing</option>
                    <option value="Semiconductors">Semiconductors</option>
                    <option value="Software & IT Services">Software & IT Services</option>
                    <option value="Technology Hardware & Equipment">
                      Technology Hardware & Equipment
                    </option>
                    <option value="Telecommunication">Telecommunication</option>
                    <option value="Trading Companies & Distributors">
                      Trading Companies & Distributors
                    </option>
                    <option value="Transportation">Transportation</option>
                    <option value="Travel & Tourism">Travel & Tourism</option>
                    <option value="Utilities">Utilities</option>
                  </SelectNative>
                </div>
                <PhoneIconNumberPhone value={companyPhone} onChangeValue={setCompanyPhone} />

                <div className="flex items-center gap-2 my-4">
                  <Checkbox
                    id={'terminos-aceptados'}
                    checked={termsAccepted}
                    onCheckedChange={(value) =>
                      setTermsAccepted(value === 'indeterminate' ? 'indeterminate' : !!value)
                    }
                    disabled={loading}
                  />
                  <Label
                    className="text-muted-foreground font-normal"
                    htmlFor={'terminos-aceptados'}
                  >
                    Asistify will send you members-only deals, inspiration, SMS and marketing
                    emails. You can unsubscribe at any time.
                  </Label>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="max-w-sm">
              <h1 className="font-extrabold text-xl ">
                ¿Qué parte de asistify te interesa explorar?
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Elige las aplicaciones perfectas para tu empresa ahora; puedes agregar más en
                cualquier momento.
              </p>

              <form className="space-y-4 mt-6">
                <div className="space-y-3">
                  <div className="grid gap-3">
                    {modules.map((item) => (
                      <div className="flex items-center gap-2" key={item.id}>
                        <Checkbox
                          id={`${id}-${item.label}`}
                          value={item.label}
                          defaultChecked={item.defaultChecked}
                          onCheckedChange={() => toggleModule(item.id)}
                        />
                        <Label
                          className={cn('font-normal text-muted-foreground', {
                            '!text-black !font-medium': item.defaultChecked,
                          })}
                          htmlFor={`${id}-${item.label}`}
                        >
                          {item.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stepper y botón continuar */}
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
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              size={'sm'}
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>
            {currentStep === 4 ? (
              <Button size={'sm'} onClick={handleSubmit} disabled={loading}>
                Guardar cambios
              </Button>
            ) : (
              <Button size={'sm'} onClick={handleNextStep} disabled={currentStep >= steps.length}>
                Continuar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sección derecha */}
      <div
        className={cn('w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-6 md:p-0', {
          'justify-end': currentStep === 4,
          ' flex-col ': currentStep < 4,
        })}
      >
        {currentStep > 2 && currentStep < 4 && (
          <div className="bg-background z-50 max-w-[500px] min-w-[350px] rounded-md border p-6 shadow-lg mb-2">
            <div className="flex gap-3">
              <Avatar className="rounded-md size-11 bg-muted-foreground/10 items-center justify-center flex">
                <Building2 className="text-muted-foreground/80" size={22}></Building2>
              </Avatar>
              <div className="flex grow flex-col gap-3">
                <div className="space-y-0">
                  {companyName ? (
                    <p className="text-foreground font-semibold text-md">{companyName}</p>
                  ) : (
                    <div className="w-full h-5 bg-gray-100 rounded-full my-1"></div>
                  )}

                  <div className="flex space-x-1 items-center mb-1 ">
                    <Factory size={14} className="text-muted-foreground/70"></Factory>
                    <p className="text-muted-foreground/70 text-xs">{companyIndustry}</p>
                  </div>
                  {companyPhone && (
                    <div className="flex space-x-1 items-center ">
                      <Phone size={15} className="text-muted-foreground/80"></Phone>
                      <p className="text-muted-foreground/80 text-xs">{companyPhone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep > 0 && currentStep < 4 && (
          <div className="bg-background z-50 max-w-[500px] min-w-[350px] rounded-md border p-6 shadow-lg">
            <div className="flex gap-3">
              <Avatar className="rounded-md size-11">
                <AvatarImage src="/images/avatdar-2.jpeg" alt="Logo" />
                <AvatarFallback className="font-extrabold text-md text-primary bg-primary/10">
                  {name.charAt(0).toUpperCase()}
                  {lastname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex grow flex-col gap-3">
                <div className="space-y-0">
                  {name || lastname ? (
                    <p className="text-foreground font-semibold text-md">
                      {name} {lastname}
                    </p>
                  ) : (
                    <div className="w-full h-5 bg-gray-100 rounded-full my-1"></div>
                  )}

                  <div className="flex space-x-1 items-center mb-1 ">
                    <Mail size={14} className="text-muted-foreground/70"></Mail>
                    <p className="text-muted-foreground/70 text-xs">{user?.email}</p>
                  </div>
                  <div className="flex space-x-1 items-center ">
                    <ShieldUser size={15} className="text-muted-foreground/80"></ShieldUser>
                    <p className="text-muted-foreground/80 text-xs">{jobTitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex h-auto  w-[80%] bg-white rounded-l-md border  shadow-lg overflow-hidden">
            {/* Sidebar */}
            <div className="w-56 flex flex-col border-r  bg-white">
              {/* Logo */}
              <div className="flex h-12 min-h-12 max-h-12 items-center px-4 border-b ">
                <div className="flex items-center gap-3 rounded-md px-2 py-2">
                  <div className="h-6 w-6 rounded-md bg-gray-100 " />
                  <div className="h-4 w-24 rounded-md bg-gray-100 " />
                </div>
                <button className="ml-auto text-muted-foreground/30">
                  <ChevronsUpDown size={18} />
                </button>
              </div>

              {/* Sidebar sections */}
              <div className="px-2 py-4">
                <div className="text-xxs font-medium uppercase text-gray-300 mb-2 px-2">
                  Sections
                </div>

                {/* Menu items with skeletons */}
                <div className="space-y-1 overflow-y-auto h-auto">
                  <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
                    <Gauge size={16} className="text-muted-foreground" />
                    <span className="font-normal text-xs text-muted-foreground">Dashboard</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
                    <UsersRound size={16} className="text-muted-foreground" />
                    <span className="font-normal text-xs text-muted-foreground">
                      Employee Management
                    </span>
                  </div>
                  {modules
                    .filter((m) => m.defaultChecked)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-md px-2 py-1.5 text-muted-foreground/70"
                      >
                        <item.icon size={16} className="text-muted-foreground/70"></item.icon>

                        <span className="font-normal text-xs ">{item.label}</span>
                      </div>
                    ))}

                  <div className="flex items-center gap-3 rounded-md px-2 py-2">
                    <div className="h-6 w-6 rounded-md bg-gray-100 " />
                    <div className="h-4 w-24 rounded-md bg-gray-100 " />
                  </div>
                </div>

                {/* Other section */}
                <div className="mt-6">
                  <div className="text-xxs font-medium uppercase text-gray-300 mb-2 px-2">
                    Other
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-3 rounded-md px-2 py-2">
                      <div className="h-6 w-6 rounded-md bg-gray-100 " />
                      <div className="h-4 w-24 rounded-md bg-gray-100 " />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Header */}
              <header className="flex  h-12 min-h-12 max-h-12 items-center justify-between border-b  px-6">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 rounded-md bg-gray-100 " />
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 overflow-hidden rounded-full   bg-gray-100"></div>
                  <div className="h-6 w-6 overflow-hidden rounded-full   bg-gray-100"></div>
                </div>
              </header>

              <main className="flex-1 overflow-auto p-6"></main>
            </div>
          </div>
        )}
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

export default StaredUser;
