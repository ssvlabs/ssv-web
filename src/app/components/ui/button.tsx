import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~lib/utils/tailwind';
import Spinner from '~app/components/common/Spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-100',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border dark:border-white/10 hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-primary-50 text-primary-500 hover:bg-primary-100 active:bg-primary-200',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      colorScheme: {
        wallet: 'bg-[#F9FBFC] hover:bg-[#F2F6FA] text-black dark:bg-[#062031] dark:hover:bg-[#011627]'
      },
      size: {
        default: 'h-10 px-4 py-2 font-semibold text-md rounded-lg',
        sm: 'h-9 px-3 font-semibold text-sm rounded-lg',
        lg: 'h-12 px-6 font-semibold text-md rounded-lg',
        xl: 'h-[60px] px-6 font-semibold text-md rounded-lg',
        icon: 'h-10 w-10 rounded-lg',
        network: 'h-12 pl-3 pr-4 font-semibold text-md rounded-lg',
        wallet: 'h-12 px-4 font-semibold text-md rounded-lg'
      },
      width: {
        full: 'w-full',
        default: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      width: 'default'
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  isActionBtn?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, colorScheme, width, asChild = false, isLoading, loadingText, children, isActionBtn, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const _loadingText = loadingText ?? 'Waiting for Wallet Confirmation...';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, colorScheme, className, width }), {
          'opacity-50': isLoading
        })}
        type={type}
        ref={ref}
        {...props}
        onClick={isLoading ? undefined : props.onClick}
      >
        {isLoading && <Spinner />}
        {isLoading ? (isActionBtn ? _loadingText : children) : children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
