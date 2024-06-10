import type { FC } from 'react';
import { Badge, BadgeProps } from '~app/components/ui/badge';
import { cn } from '~lib/utils/tailwind';

export type ActiveBadgeProps = {
  isActive?: boolean;
};

type FCProps = FC<Omit<BadgeProps, keyof ActiveBadgeProps> & ActiveBadgeProps>;

export const ActiveBadge: FCProps = ({ isActive, className, ...props }) => {
  return (
    <div>
      <Badge variant={isActive ? 'success' : 'info'} className={cn(className)} {...props}>
        {isActive ? 'Active' : 'Off'}
      </Badge>
    </div>
  );
};

ActiveBadge.displayName = 'ActiveBadge';
