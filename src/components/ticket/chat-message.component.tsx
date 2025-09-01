import { cn } from '@registry/default/lib/utils';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@registry/default/ui/tooltip';
import { Code, Book, Repeat, Check } from 'lucide-react';

type ChatMessageProps = {
  isUser?: boolean;
  children: React.ReactNode;
};

export function ChatMessage({ isUser, children }: ChatMessageProps) {
  return (
    <article
      className={cn(
        'flex items-start gap-4 text-sm font-base leading-relaxed',
        isUser && 'justify-end'
      )}
    >
      <img
        className={cn('rounded-full', isUser ? 'order-1' : 'border border-black/[0.08] shadow-sm')}
        src={
          isUser
            ? 'https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png'
            : 'https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-01_i5l7tp.png'
        }
        alt={isUser ? 'User profile' : 'Bart logo'}
        width={30}
        height={30}
      />
      <div className={cn(isUser ? 'bg-muted px-3 py-2 rounded-xl rounded-se-none' : 'space-y-3')}>
        <div className="flex flex-col gap-2">
          <p className="sr-only">{isUser ? 'You' : 'Bart'} said:</p>
          {children}
        </div>
        {!isUser && <MessageActions />}
      </div>
    </article>
  );
}

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string;
};

function ActionButton({ icon, label }: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="relative text-muted-foreground/80 hover:text-foreground transition-colors size-7 flex items-center justify-center before:absolute before:inset-y-1.5 before:left-0 before:w-px before:bg-border first:before:hidden first-of-type:rounded-s-lg last-of-type:rounded-e-lg focus-visible:z-10 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring/70">
          {icon}
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="dark px-2 py-1 text-xs">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function MessageActions() {
  return (
    <div className="relative inline-flex bg-white rounded-md border border-black/[0.08] shadow-sm -space-x-px">
      <TooltipProvider delayDuration={0}>
        <ActionButton icon={<Code size={17} />} label="Show code" />
        <ActionButton icon={<Book size={17} />} label="Bookmark" />
        <ActionButton icon={<Repeat size={17} />} label="Refresh" />
        <ActionButton icon={<Check size={17} />} label="Approve" />
      </TooltipProvider>
    </div>
  );
}
