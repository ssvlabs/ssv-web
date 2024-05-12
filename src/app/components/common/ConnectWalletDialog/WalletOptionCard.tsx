import { ComponentPropsWithoutRef, FC } from 'react';
import { Button } from '~app/components/ui/button';
import { cn } from '~lib/utils/tailwind';
import Spinner from '../Spinner';

type Props = {
  iconSrc: string;
  isLoading?: boolean;
};

export const WalletOptionCard: FC<Props & ComponentPropsWithoutRef<'button'>> = ({ iconSrc, isLoading, children, ...props }) => {
  return (
    <Button variant="outline" {...props} disabled={props.disabled || isLoading} className={cn('relative flex flex-1 flex-col gap-2 h-32 w-full rounded-2xl', props.className)}>
      <img src={iconSrc} className="size-10" />
      <p>{children}</p>
      {isLoading && (
        <div className="absolute left-1/2 top-1/2 transform  ml-2.5 -translate-x-1/2 -translate-y-1/2">
          <Spinner />
        </div>
      )}
    </Button>
  );
};

WalletOptionCard.displayName = 'WalletOptionCard';
