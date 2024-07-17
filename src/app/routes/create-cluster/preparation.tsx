import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export type PreparationProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof PreparationProps> &
    PreparationProps
>;

export const Preparation: FCProps = ({ className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      Preparation
      <div className="flex">
        <Link to="select-operators">
          <Button>Button</Button>
        </Link>
        <Link to="generate-online">
          <Button>Button</Button>
        </Link>
      </div>
    </div>
  );
};

Preparation.displayName = "Preparation";
