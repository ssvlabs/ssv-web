import { type FC, type ComponentPropsWithoutRef, isValidElement, cloneElement } from 'react';
import { cn } from '~lib/utils/tailwind';

export type NodeProps = {
  as: React.ElementType<ComponentPropsWithoutRef<'div'>, keyof React.JSX.IntrinsicElements>;
  children: React.ReactNode;
};

type FCProps = FC<Omit<ComponentPropsWithoutRef<'div'>, keyof NodeProps> & NodeProps>;

export const Node: FCProps = ({ as: Cmp, children, className, ...props }) => {
  if (isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      // @ts-ignore
      className: cn(className, children.props.className)
    });
  }

  return (
    <Cmp className={cn(className)} {...props}>
      {children}
    </Cmp>
  );
};

Node.displayName = 'Node';
