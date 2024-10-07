import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils/tw";
import type { FC } from "react";

export type ActiveBadgeProps = {
  isActive?: boolean;
};

type FCProps = FC<Omit<BadgeProps, keyof ActiveBadgeProps> & ActiveBadgeProps>;

export const ActiveBadge: FCProps = ({ isActive, className, ...props }) => {
  return (
    <div>
      <Badge
        variant={isActive ? "success" : "unstyled"}
        className={cn(className)}
        {...props}
      >
        {isActive ? "Active" : "Off"}
      </Badge>
    </div>
  );
};

ActiveBadge.displayName = "ActiveBadge";
