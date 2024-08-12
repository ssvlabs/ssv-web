import type { FC } from 'react';
import { Badge, BadgeProps } from '~app/components/ui/badge';
import { cn } from '~lib/utils/tailwind';
import { MdLockOutline } from 'react-icons/md';
import styled from 'styled-components';

const EyeIcon = styled.div`
  width: 18px;
  height: 18px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(/images/eyelless.svg);
`;

const Text = styled.p<{ isPrivate: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme, isPrivate }) => (isPrivate ? theme.colors.primarySuccessDark : theme.colors.gray40)};
`;
export type OperatorStatusBadgeProps = {
  isPrivate?: boolean;
};

type FCProps = FC<Omit<BadgeProps, keyof OperatorStatusBadgeProps> & OperatorStatusBadgeProps>;

export const OperatorStatusBadge: FCProps = ({ isPrivate, className, ...props }) => {
  const Icon = isPrivate ? MdLockOutline : EyeIcon;
  return (
    <Badge variant={isPrivate ? 'success' : 'info'} className={cn(className)} {...props}>
      <Icon className="size-[18px]" />
      <Text isPrivate={!!isPrivate}>{isPrivate ? 'Private' : 'Public'}</Text>
    </Badge>
  );
};

OperatorStatusBadge.displayName = 'OperatorStatusBadge';
