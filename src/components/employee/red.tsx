import { useId, useMemo, useState } from 'react';
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVertical,
  MoveRight,
  RefreshCcw,
  SearchIcon,
  TextQuoteIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';

import { cn } from '@/registry/default/lib/utils';
import { Checkbox } from '@/registry/default/ui/checkbox';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/registry/default/ui/table';
import { employee } from '@/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button } from '@/registry/default/ui/button';

const columns: ColumnDef<employee.Entity>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    header: 'Nombre',
    accessorKey: 'name',
    cell: ({ row }) => <div className="font-base text-sm ">{row.getValue('name')}</div>,
    size: 200,
    enableHiding: false,
  },
  {
    header: 'Apellidos',
    accessorKey: 'last_name',
    cell: ({ row }) => <div className="font-base ">{row.getValue('last_name')}</div>,
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: ({ row }) => <div className="font-base ">{row.getValue('email')}</div>,
  },
  {
    header: 'Puesto',
    accessorKey: 'position',
    cell: ({ row }) => <div className="font-base ">{row.getValue('position')}</div>,
  },
  {
    header: 'Contratación',
    accessorKey: 'position',
    cell: ({ row }) => <div className="font-base ">{row.getValue('position')}</div>,
  },
  {
    header: 'Fecha de registro',
    accessorKey: 'created_at',
    cell: ({ row }) => <div className="font-base text-sm ">{row.getValue('created_at')}</div>,
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div className="flex gap-2">
          {/* <div
            key={status}
            className={cn(
              "flex px-3 rounded-md border py-1 items-center justify-center  text-xs font-semibold",
              {
                "bg-emerald-400/5 border-emerald-300 text-emerald-500":
                  status === "actived",
                "bg-amber-400/5 text-amber-500": status === "pending",
                "bg-rose-400/5 text-rose-500": status === "desactived",
              }
            )}
          >
            {status}
          </div> */}
        </div>
      );
    },
    enableSorting: false,
    meta: {
      filterVariant: 'select',
    },
    filterFn: (row, id, filterValue) => {
      const rowValue = row.getValue(id);
      return Array.isArray(rowValue) && rowValue.includes(filterValue);
    },
  },
  // {
  //   header: "Acciones",
  //   accessorKey: "actions",
  //   cell: ({ row }) => (
  //     <div className="inline-flex items-center gap-2">
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button
  //             size="icon"
  //             variant="ghost"
  //             className="rounded-full shadow-none"
  //             aria-label="Open edit menu"
  //           >
  //             <EllipsisVertical size={16} aria-hidden="true" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent className="pb-2 max-w-60">
  //           <DropdownMenuLabel>Add block</DropdownMenuLabel>
  //           <DropdownMenuItem>
  //             <div
  //               className="bg-background flex min-w-8 min-h-8 items-center justify-center rounded-md border"
  //               aria-hidden="true"
  //             >
  //               <RefreshCcw size={16} className="opacity-60" />
  //             </div>
  //             <div>
  //               <div className="text-sm font-medium">Iniciar sesión</div>
  //               <div className="text-muted-foreground text-xs">
  //                 Verificar su visibilidad en la aplicación
  //               </div>
  //             </div>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem>
  //             <div
  //               className="bg-background flex min-w-8 min-h-8 items-center justify-center rounded-md border"
  //               aria-hidden="true"
  //             >
  //               <TextQuoteIcon size={16} className="opacity-60" />
  //             </div>
  //             <div>
  //               <div className="text-sm font-medium">Finalizar empleado/a</div>
  //               <div className=" text-muted-foreground text-xs">
  //                 Archiva empleado cuando deje de trabajar en tu empresa
  //               </div>
  //             </div>
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //       <Button size="sm" className="rounded-full px-2">
  //         <MoveRight size={16} />
  //       </Button>
  //     </div>
  //   ),
  //   enableSorting: false,
  // },
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];

function RowActions({ row }: { row: Row<employee.Entity> }) {
  return (
    <div className="inline-flex items-center gap-2">
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
        <DropdownMenuContent className="pb-2 max-w-60">
          <DropdownMenuLabel>Add block</DropdownMenuLabel>
          <DropdownMenuItem>
            <div
              className="bg-background flex min-w-8 min-h-8 items-center justify-center rounded-md border"
              aria-hidden="true"
            >
              <RefreshCcw size={16} className="opacity-60" />
            </div>
            <div>
              <div className="text-sm font-medium">Iniciar sesión</div>
              <div className="text-muted-foreground text-xs">
                Verificar su visibilidad en la aplicación
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div
              className="bg-background flex min-w-8 min-h-8 items-center justify-center rounded-md border"
              aria-hidden="true"
            >
              <TextQuoteIcon size={16} className="opacity-60" />
            </div>
            <div>
              <div className="text-sm font-medium">Finalizar empleado/a</div>
              <div className=" text-muted-foreground text-xs">
                Archiva empleado cuando deje de trabajar en tu empresa
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button size="sm" className="rounded-full px-2">
        <MoveRight size={16} />
      </Button>
    </div>
  );
}

const items: employee.Entity[] = [
  {
    _id: '65dfb5a31c4e88a9f7b3e8a1',
    _id_organization: '65dfb5a31c4e88a9f7b3e8b1',
    name: 'Nesyn Meomer',
    last_name: 'Alvarado Bedoya',
    department: 'IT',
    email: 'nesyn@example.com',
    initials: 'NM',
    position: 'Software Engineer',
    role: 'employee',
    status: 'actived',
    created_at: '2024-03-30T10:00:00Z',
    deleted_at: '',
    updated_at: '2024-03-30T10:00:00Z',
    url_avatar: 'https://i.pravatar.cc/300',
    phone_number: '123456789',
    birthday: '1990-05-15',
    gender: 'male',
    address: { street: 'Calle 123', city: 'Lima', country: 'Peru' },
    nationality: 'Peruvian',
    contract_type: 'full-time',
    contract_end_date: '',
    salary: 5000,
    working_hours: { start: '09:00', end: '18:00' },
    manager_id: '65dfb5a31c4e88a9f7b3e8a2',
    employment_status: 'active',
    documents: [{ name: 'Contrato', url: 'https://example.com/contrato.pdf' }],
    social_security_number: '987654321',
    tax_id: '123456789',
    notes: 'Empleado destacado en proyectos recientes',
    tags: ['Remote', 'Senior'],
  },
  {
    _id: '65dfb5a31c4e88a9f7b3e8a2',
    _id_organization: '65dfb5a31c4e88a9f7b3e8b1',
    name: 'Juan Oscar',
    last_name: 'Valdez Ramirez',
    department: 'HR',
    email: 'juan@example.com',
    initials: 'JO',
    position: 'HR Manager',
    role: 'manager',
    status: 'actived',
    created_at: '2024-03-30T10:00:00Z',
    deleted_at: '',
    updated_at: '2024-03-30T10:00:00Z',
    url_avatar: 'https://i.pravatar.cc/300',
    phone_number: '987654321',
    birthday: '1985-08-20',
    gender: 'male',
    address: {
      street: 'Avenida 456',
      city: 'Buenos Aires',
      country: 'Argentina',
    },
    nationality: 'Argentinian',
    contract_type: 'full-time',
    contract_end_date: '',
    salary: 7000,
    working_hours: { start: '08:00', end: '17:00' },
    manager_id: '',
    employment_status: 'active',
    documents: [
      {
        name: 'Certificación RRHH',
        url: 'https://example.com/certificado.pdf',
      },
    ],
    social_security_number: '876543219',
    tax_id: '987654321',
    notes: 'Lidera el equipo de recursos humanos con éxito',
    tags: ['On-site', 'Senior'],
  },
  {
    _id: '65dfb5a31c4e88a9f7b3e8a3',
    _id_organization: '65dfb5a31c4e88a9f7b3e8b1',
    name: 'Maria López',
    last_name: 'Fernández',
    department: 'Finance',
    email: 'maria@example.com',
    initials: 'ML',
    position: 'Accountant',
    role: 'employee',
    status: 'actived',
    created_at: '2024-03-30T10:00:00Z',
    deleted_at: '',
    updated_at: '2024-03-30T10:00:00Z',
    url_avatar: 'https://i.pravatar.cc/300',
    phone_number: '654321987',
    birthday: '1992-11-30',
    gender: 'female',
    address: { street: 'Calle Falsa 123', city: 'Madrid', country: 'Spain' },
    nationality: 'Spanish',
    contract_type: 'part-time',
    contract_end_date: '',
    salary: 4000,
    working_hours: { start: '10:00', end: '16:00' },
    manager_id: '65dfb5a31c4e88a9f7b3e8a2',
    employment_status: 'active',
    documents: [
      {
        name: 'Certificación Contable',
        url: 'https://example.com/cert-contable.pdf',
      },
    ],
    social_security_number: '123123123',
    tax_id: '321321321',
    notes: 'Especialista en auditorías internas',
    tags: ['Hybrid', 'Mid-level'],
  },
  {
    _id: '65dfb5a31c4e88a9f7b3e8a1',
    _id_organization: '65dfb5a31c4e88a9f7b3e8b1',
    name: 'Nesyn Meomer',
    last_name: 'Alvarado Bedoya',
    department: 'IT',
    email: 'nesyn@example.com',
    initials: 'NM',
    position: 'Software Engineer',
    role: 'employee',
    status: 'actived',
    created_at: '2024-03-30T10:00:00Z',
    deleted_at: '',
    updated_at: '2024-03-30T10:00:00Z',
    url_avatar: 'https://i.pravatar.cc/300',
    phone_number: '123456789',
    birthday: '1990-05-15',
    gender: 'male',
    address: { street: 'Calle 123', city: 'Lima', country: 'Peru' },
    nationality: 'Peruvian',
    contract_type: 'full-time',
    contract_end_date: '',
    salary: 5000,
    working_hours: { start: '09:00', end: '18:00' },
    manager_id: '65dfb5a31c4e88a9f7b3e8a2',
    employment_status: 'active',
    documents: [{ name: 'Contrato', url: 'https://example.com/contrato.pdf' }],
    social_security_number: '987654321',
    tax_id: '123456789',
    notes: 'Empleado destacado en proyectos recientes',
    tags: ['Remote', 'Senior'],
  },
  {
    _id: '65dfb5a31c4e88a9f7b3e8a2',
    _id_organization: '65dfb5a31c4e88a9f7b3e8b1',
    name: 'Juan Oscar',
    last_name: 'Valdez Ramirez',
    department: 'HR',
    email: 'juan@example.com',
    initials: 'JO',
    position: 'HR Manager',
    role: 'manager',
    status: 'actived',
    created_at: '2024-03-30T10:00:00Z',
    deleted_at: '',
    updated_at: '2024-03-30T10:00:00Z',
    url_avatar: 'https://i.pravatar.cc/300',
    phone_number: '987654321',
    birthday: '1985-08-20',
    gender: 'male',
    address: {
      street: 'Avenida 456',
      city: 'Buenos Aires',
      country: 'Argentina',
    },
    nationality: 'Argentinian',
    contract_type: 'full-time',
    contract_end_date: '',
    salary: 7000,
    working_hours: { start: '08:00', end: '17:00' },
    manager_id: '',
    employment_status: 'active',
    documents: [
      {
        name: 'Certificación RRHH',
        url: 'https://example.com/certificado.pdf',
      },
    ],
    social_security_number: '876543219',
    tax_id: '987654321',
    notes: 'Lidera el equipo de recursos humanos con éxito',
    tags: ['On-site', 'Senior'],
  },
  {
    _id: '65dfb5a31c4e88a9f7b3e8a3',
    _id_organization: '65dfb5a31c4e88a9f7b3e8b1',
    name: 'Maria López',
    last_name: 'Fernández',
    department: 'Finance',
    email: 'maria@example.com',
    initials: 'ML',
    position: 'Accountant',
    role: 'employee',
    status: 'actived',
    created_at: '2024-03-30T10:00:00Z',
    deleted_at: '',
    updated_at: '2024-03-30T10:00:00Z',
    url_avatar: 'https://i.pravatar.cc/300',
    phone_number: '654321987',
    birthday: '1992-11-30',
    gender: 'female',
    address: { street: 'Calle Falsa 123', city: 'Madrid', country: 'Spain' },
    nationality: 'Spanish',
    contract_type: 'part-time',
    contract_end_date: '',
    salary: 4000,
    working_hours: { start: '10:00', end: '16:00' },
    manager_id: '65dfb5a31c4e88a9f7b3e8a2',
    employment_status: 'active',
    documents: [
      {
        name: 'Certificación Contable',
        url: 'https://example.com/cert-contable.pdf',
      },
    ],
    social_security_number: '123123123',
    tax_id: '321321321',
    notes: 'Especialista en auditorías internas',
    tags: ['Hybrid', 'Mid-level'],
  },
  {
    _id: '65dfb5a31c4e88a9f7b3e8a1',
    _id_organization: '65dfb5a31c4e88a9f7b3e8b1',
    name: 'Nesyn Meomer',
    last_name: 'Alvarado Bedoya',
    department: 'IT',
    email: 'nesyn@example.com',
    initials: 'NM',
    position: 'Software Engineer',
    role: 'employee',
    status: 'actived',
    created_at: '2024-03-30T10:00:00Z',
    deleted_at: '',
    updated_at: '2024-03-30T10:00:00Z',
    url_avatar: 'https://i.pravatar.cc/300',
    phone_number: '123456789',
    birthday: '1990-05-15',
    gender: 'male',
    address: { street: 'Calle 123', city: 'Lima', country: 'Peru' },
    nationality: 'Peruvian',
    contract_type: 'full-time',
    contract_end_date: '',
    salary: 5000,
    working_hours: { start: '09:00', end: '18:00' },
    manager_id: '65dfb5a31c4e88a9f7b3e8a2',
    employment_status: 'active',
    documents: [{ name: 'Contrato', url: 'https://example.com/contrato.pdf' }],
    social_security_number: '987654321',
    tax_id: '123456789',
    notes: 'Empleado destacado en proyectos recientes',
    tags: ['Remote', 'Senior'],
  },
];

export default function Component() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client-side filtering
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(), // client-side faceting
    getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
    getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
    onSortingChange: setSorting,
    enableSortingRemoval: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <div className="w-44">
          <Filter column={table.getColumn('name')!} />
        </div>
        <div className="w-44">
          <Filter column={table.getColumn('status')!} />
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="relative h-10 border-t select-none"
                    aria-sort={
                      header.column.getIsSorted() === 'asc'
                        ? 'ascending'
                        : header.column.getIsSorted() === 'desc'
                          ? 'descending'
                          : 'none'
                    }
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            'flex h-full cursor-pointer items-center justify-between gap-2 select-none'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          // Enhanced keyboard handling for sorting
                          if (header.column.getCanSort() && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: (
                            <ChevronUpIcon
                              className="shrink-0 opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          ),
                          desc: (
                            <ChevronDownIcon
                              className="shrink-0 opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <span className="size-4" aria-hidden="true" />
                        )}
                      </div>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="py-1" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Filter({ column }: { column: Column<any, unknown> }) {
  const id = useId();
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnHeader = typeof column.columnDef.header === 'string' ? column.columnDef.header : '';
  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === 'range') return [];

    // Get all unique values from the column
    const values = Array.from(column.getFacetedUniqueValues().keys());

    // If the values are arrays, flatten them and get unique items
    const flattenedValues = values.reduce((acc: string[], curr) => {
      if (Array.isArray(curr)) {
        return [...acc, ...curr];
      }
      return [...acc, curr];
    }, []);

    // Get unique values and sort them
    return Array.from(new Set(flattenedValues)).sort();
  }, [column.getFacetedUniqueValues(), filterVariant]);

  if (filterVariant === 'range') {
    return (
      <div className="*:not-first:mt-1">
        <Label>{columnHeader}</Label>
        <div className="flex">
          <Input
            id={`${id}-range-1`}
            className="flex-1 rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value ? Number(e.target.value) : undefined,
                old?.[1],
              ])
            }
            placeholder="Min"
            type="number"
            aria-label={`${columnHeader} min`}
          />
          <Input
            id={`${id}-range-2`}
            className="-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value ? Number(e.target.value) : undefined,
              ])
            }
            placeholder="Max"
            type="number"
            aria-label={`${columnHeader} max`}
          />
        </div>
      </div>
    );
  }

  if (filterVariant === 'select') {
    return (
      <div className="*:not-first:mt-1">
        <Label htmlFor={`${id}-select`}>{columnHeader}</Label>
        <Select
          value={columnFilterValue?.toString() ?? 'all'}
          onValueChange={(value) => {
            column.setFilterValue(value === 'all' ? undefined : value);
          }}
        >
          <SelectTrigger id={`${id}-select`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {sortedUniqueValues.map((value) => (
              <SelectItem key={String(value)} value={String(value)}>
                {String(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="*:not-first:mt-1">
      <Label htmlFor={`${id}-input`}>{columnHeader}</Label>
      <div className="relative">
        <Input
          id={`${id}-input`}
          className="peer ps-9"
          value={(columnFilterValue ?? '') as string}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Search ${columnHeader.toLowerCase()}`}
          type="text"
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  );
}
