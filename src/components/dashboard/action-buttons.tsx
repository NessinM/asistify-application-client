import { Button } from '@/registry/default/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/registry/default/ui/tooltip';
import DatePicker from './date-picker';
import { ChevronRight, Plus } from 'lucide-react';
import { useIsMobile } from '@/registry/default/hooks/use-mobile.hook';

export function ActionButtons() {
  const isMobile = useIsMobile();

  return (
    <div className="flex gap-3">
      <DatePicker />
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="aspect-square max-lg:p-0">
              <ChevronRight className="lg:-ms-1 opacity-40 size-5" size={20} aria-hidden="true" />
              <span className="max-lg:sr-only">Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="lg:hidden" hidden={isMobile}>
            Export
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="aspect-square max-lg:p-0">
              <Plus className="lg:-ms-1 opacity-40 size-5" size={20} aria-hidden="true" />
              <span className="max-lg:sr-only">Add Chart</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="lg:hidden" hidden={isMobile}>
            Add Chart
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
