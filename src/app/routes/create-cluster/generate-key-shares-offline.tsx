import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export type GenerateKeySharesOfflineProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof GenerateKeySharesOfflineProps> &
    GenerateKeySharesOfflineProps
>;

export const GenerateKeySharesOffline: FCProps = ({ className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      GenerateKeySharesOffline
    </div>
  );
};

GenerateKeySharesOffline.displayName = "GenerateKeySharesOffline";
