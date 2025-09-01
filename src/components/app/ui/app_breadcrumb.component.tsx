import { Fragment, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Gauge } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/registry/default/ui/breadcrumb';
import { ModuleType } from '@/types/organization.type';
import { items, breadcrumbMap } from '@/constants/items_sidebar.constant';

const mapModulesToDictionary = (modules: ModuleType[]) => {
  return modules.reduce(
    (acc, module) => {
      acc[module.path] = module.label;
      return acc;
    },
    { ...breadcrumbMap }
  );
};

export default function AppBarBreadcrumb() {
  const location = useLocation();
  const paths = useMemo(() => location.pathname.split('/').filter(Boolean), [location.pathname]);

  const modules = useMemo(
    () => [
      ...items.app.items,
      ...items.ticket.items,
      ...items.organization.items,
      // ...items.conversation.items,
      // ...items.favorite.items,
      ...items.pined_ticket.items,
    ],
    []
  );

  const moduleDictionary = useMemo(() => mapModulesToDictionary(modules), [modules]);

  const getBreadcrumbName = (fullPath: string) => {
    const matchedPath = Object.keys(moduleDictionary).find((key) => {
      const regex = new RegExp(`^${key.replace(/:\w+/g, '[^/]+')}$`);
      return regex.test(fullPath);
    });
    return moduleDictionary[matchedPath || fullPath] || null;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link to="/">
              <Gauge size={19} aria-hidden="true" />
              <span className="sr-only">Inicio</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {paths.map((_, index) => {
          const fullPath = `/${paths.slice(0, index + 1).join('/')}`;
          const name = getBreadcrumbName(fullPath);
          const isLast = index === paths.length - 1;

          return name ? (
            <Fragment key={fullPath}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={fullPath}>{name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ) : null;
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
