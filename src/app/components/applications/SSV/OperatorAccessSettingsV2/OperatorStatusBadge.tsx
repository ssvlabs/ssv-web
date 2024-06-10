import type { FC } from 'react';
import { Badge, BadgeProps } from '~app/components/ui/badge';
import { cn } from '~lib/utils/tailwind';
import { TbEye } from 'react-icons/tb';
import { MdLockOutline } from 'react-icons/md';

export type OperatorStatusBadgeProps = {
  isPrivate?: boolean;
};

type FCProps = FC<Omit<BadgeProps, keyof OperatorStatusBadgeProps> & OperatorStatusBadgeProps>;

export const OperatorStatusBadge: FCProps = ({ isPrivate, className, ...props }) => {
  const Icon = isPrivate ? MdLockOutline : TbEye;
  return (
    <Badge variant={isPrivate ? 'success' : 'info'} className={cn(className)} {...props}>
      <Icon className="size-[18px]" />
      {isPrivate ? 'Private' : 'Public'}
    </Badge>
  );
};

OperatorStatusBadge.displayName = 'OperatorStatusBadge';
