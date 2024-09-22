import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { DashboardPicker } from "@/components/dashboard/dashboard-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type OperatorDashboardProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorDashboardProps> &
    OperatorDashboardProps
>;

export const OperatorDashboard: FCProps = ({ className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      <div className="flex justify-between">
        <DashboardPicker />
        <Button>Connect Wallet</Button>
      </div>
      <Card>Helloo</Card>
    </div>
  );
};

OperatorDashboard.displayName = "OperatorDashboard";
