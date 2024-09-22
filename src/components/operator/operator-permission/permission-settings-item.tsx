import { Node } from "@/components/ui/node";
import { cn } from "@/lib/utils/tw";
import { ChevronRight } from "lucide-react";
import { type ComponentPropsWithoutRef, type FC } from "react";
import type { To } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export type PermissionSettingsItemProps = {
  addon?: React.ReactNode;
  route?: To;
  title: React.ReactNode;
  description?: React.ReactNode;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof PermissionSettingsItemProps> &
    PermissionSettingsItemProps
>;

export const PermissionSettingsItem: FCProps = ({
  className,
  route,
  title,
  addon,
  description,
  ...props
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-6 px-8 transition-colors duration-100",
        {
          "cursor-pointer hover:bg-gray-100 active:bg-gray-200": Boolean(route),
        },
        className,
      )}
      onClick={route ? () => navigate(route) : undefined}
      {...props}
    >
      <div className="flex flex-col gap-2 flex-1">
        <Node as="h2" className="font-bold">
          {title}
        </Node>
        <Node as="p" className="text-gray-700 text-sm font-medium">
          {description}
        </Node>
      </div>
      {addon}
      {route && <ChevronRight />}
    </div>
  );
};

PermissionSettingsItem.displayName = "PermissionSettingsItem";
