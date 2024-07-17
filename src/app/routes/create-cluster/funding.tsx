import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export type FundingProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof FundingProps> & FundingProps
>;

export const Funding: FCProps = ({ className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      Funding
    </div>
  );
};

Funding.displayName = "Funding";
