import { useTheme } from '@providers/theme.provider'; // ajusta el path según tu estructura
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = (props: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position="top-center"
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          description: 'text-muted-foreground',
        },
        duration: 4000,
      }}
      {...props}
    />
  );
};

export { Toaster };
