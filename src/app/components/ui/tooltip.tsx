import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '~lib/utils/tailwind';

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipArrow = TooltipPrimitive.Arrow;

const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 max-w-md overflow-hidden rounded-md bg-gray-700 px-4 py-2.5 text-[13px] font-medium text-gray-50 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

interface TooltipProps extends Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, 'content'> {
  children: React.ReactNode;
  content?: React.ReactNode;
  hasArrow?: boolean;
  delayDuration?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ children, asChild, delayDuration, content, hasArrow, ...props }) => {
  if (!content) return children;
  return (
    <TooltipProvider>
      <TooltipRoot delayDuration={delayDuration || 0}>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent {...props}>
          {hasArrow && <TooltipArrow className="fill-gray-700" />}
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
};

export { Tooltip, TooltipRoot, TooltipArrow, TooltipTrigger, TooltipContent, TooltipProvider };
