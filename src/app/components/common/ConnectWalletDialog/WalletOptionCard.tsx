import { ComponentPropsWithoutRef, FC } from 'react';
import { Button } from '~app/components/ui/button';
import { cn } from '~lib/utils/tailwind';

type Props = {
  iconSrc: string;
};

export const WalletOptionCard: FC<Props & ComponentPropsWithoutRef<'button'>> = ({ iconSrc, children, ...props }) => {
  return (
    <Button variant="outline" {...props} className={cn('flex flex-1 flex-col gap-2 h-32 w-full rounded-2xl', props.className)}>
      <img src={iconSrc} className="size-10" />
      <p>{children}</p>
    </Button>
  );
};

WalletOptionCard.displayName = 'WalletOptionCard';
