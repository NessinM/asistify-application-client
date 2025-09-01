import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/default/ui/accordion';
import {
  Globe,
  RefreshCw,
  Heading1Icon,
  Heading2Icon,
  MinusIcon,
  TextQuoteIcon,
  TypeIcon,
  EllipsisVertical,
} from 'lucide-react';
import { Badge } from '@/registry/default/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import { Button } from '@/registry/default/ui/button';

const SettingPage: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Here&rsquo;s an overview of your contacts. Manage or create new ones with ease!
          </p>
        </div>
      </div>
      <Accordion type="multiple" className="w-full" defaultValue={[]}>
        <>
          <AccordionItem
            value="1"
            key="1"
            className="has-focus-visible:border-ring has-focus-visible:ring-ring/50 outline-none has-focus-visible:ring-[3px]"
          >
            <AccordionTrigger className="justify-start gap-3 rounded-md text-sm leading-6 outline-none hover:no-underline focus-visible:ring-0 [&>svg]:-order-1">
              <div className="flex flex-col leading-tight">
                <span>Dominios</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Añade el dominio de tu empresa para configurar los inicios de sesión SSO mediante
                  SAML.
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="py-4">
              <div className="space-y-1">
                <div className="bg-background z-50 w-full rounded-md border p-4 hover:shadow-lg transition-normal ease-in duration-100">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                      aria-hidden="true"
                    >
                      <Globe className="opacity-60" size={16} />
                    </div>
                    <div className="flex grow items-center gap-12">
                      <div className="space-y-0">
                        <p className="text-sm font-medium">datacont.com</p>
                        <p className="text-muted-foreground text-xs">November 20 at 8:00 PM.</p>
                      </div>
                    </div>
                    <Badge variant={'secondary'} className="py-0.5 px-3">
                      No verificado
                    </Badge>
                    <Button size="sm" className="rounded-full px-2">
                      <RefreshCw size={16} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full shadow-none"
                          aria-label="Open edit menu"
                        >
                          <EllipsisVertical size={16} aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="pb-2">
                        <DropdownMenuLabel>Add block</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <div
                            className="bg-background flex size-8 items-center justify-center rounded-md border"
                            aria-hidden="true"
                          >
                            <TypeIcon size={16} className="opacity-60" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Text</div>
                            <div className="text-muted-foreground text-xs">
                              Start writing with plain text
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <div
                            className="bg-background flex size-8 items-center justify-center rounded-md border"
                            aria-hidden="true"
                          >
                            <TextQuoteIcon size={16} className="opacity-60" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Quote</div>
                            <div className="text-muted-foreground text-xs">Capture a quote</div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <div
                            className="bg-background flex size-8 items-center justify-center rounded-md border"
                            aria-hidden="true"
                          >
                            <MinusIcon size={16} className="opacity-60" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Divider</div>
                            <div className="text-muted-foreground text-xs">
                              Visually divide blocks
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <div
                            className="bg-background flex size-8 items-center justify-center rounded-md border"
                            aria-hidden="true"
                          >
                            <Heading1Icon size={16} className="opacity-60" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Heading 1</div>
                            <div className="text-muted-foreground text-xs">Big section heading</div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <div
                            className="bg-background flex size-8 items-center justify-center rounded-md border"
                            aria-hidden="true"
                          >
                            <Heading2Icon size={16} className="opacity-60" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Heading 2</div>
                            <div className="text-muted-foreground text-xs">
                              Medium section subheading
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* <Button
                      variant="ghost"
                      className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                      aria-label="Close notification"
                    >
                      <XIcon
                        size={16}
                        className="opacity-60 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Button> */}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="2"
            key="2"
            className="has-focus-visible:border-ring has-focus-visible:ring-ring/50 outline-none has-focus-visible:ring-[3px]"
          >
            <AccordionTrigger className="justify-start gap-3 rounded-md text-sm leading-6 outline-none hover:no-underline focus-visible:ring-0 [&>svg]:-order-1">
              <div className="flex flex-col leading-tight">
                <span>Inicio de sesión único (SSO)</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Permite a tus empleados/as iniciar sesión en Asistify mediante SAML Single Sign
                  On
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <span>detalles</span>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="3"
            key="3"
            className="has-focus-visible:border-ring has-focus-visible:ring-ring/50 outline-none has-focus-visible:ring-[3px]"
          >
            <AccordionTrigger className="justify-start gap-3 rounded-md text-sm leading-6 outline-none hover:no-underline focus-visible:ring-0 [&>svg]:-order-1">
              <div className="flex flex-col leading-tight">
                <span>Autenticación</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Gestiona cómo los/as empleados/as se registran e inician sesión en Asistify.
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <span>detalles</span>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="4"
            key="4"
            className="has-focus-visible:border-ring has-focus-visible:ring-ring/50 outline-none has-focus-visible:ring-[3px]"
          >
            <AccordionTrigger className="justify-start gap-3 rounded-md text-sm leading-6 outline-none hover:no-underline focus-visible:ring-0 [&>svg]:-order-1">
              <div className="flex flex-col leading-tight">
                <span>Soporte remoto de Asistify</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Permite que el personal de Asistify acceda a tu cuenta para cualquier asistencia
                  remota.
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <span>detalles</span>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="5"
            key="5"
            className="has-focus-visible:border-ring has-focus-visible:ring-ring/50 outline-none has-focus-visible:ring-[3px]"
          >
            <AccordionTrigger className="justify-start gap-3 rounded-md text-sm leading-6 outline-none hover:no-underline focus-visible:ring-0 [&>svg]:-order-1">
              <div className="flex flex-col leading-tight">
                <span>Renovación de contraseña</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Define una política de renovación de contraseñas para tus empleados/as.
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <span>detalles</span>
            </AccordionContent>
          </AccordionItem>
        </>
      </Accordion>
    </>
  );
};

export default SettingPage;
