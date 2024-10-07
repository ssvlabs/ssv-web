import { cn } from "@/lib/utils/tw";
import {
  type FC,
  type ComponentPropsWithoutRef,
  isValidElement,
  cloneElement,
} from "react";

export type NodeProps = {
  as: React.ElementType<
    ComponentPropsWithoutRef<"div">,
    keyof React.JSX.IntrinsicElements
  >;
  children: React.ReactNode;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof NodeProps> & NodeProps
>;

export const Node: FCProps = ({ as: Cmp, children, className, ...props }) => {
  if (isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      // @ts-expect-error className is not a valid prop
      className: cn(className, children.props.className),
    });
  }

  return (
    <Cmp className={cn(className)} {...props}>
      {children}
    </Cmp>
  );
};

Node.displayName = "Node";
