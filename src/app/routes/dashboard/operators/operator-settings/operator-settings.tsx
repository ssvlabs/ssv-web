import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useParams } from "react-router-dom";

export const OperatorSettings: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const params = useParams<{ id: string }>();
  return (
    <div className={cn(className)} {...props}>
      OperatorSettings [{params.id}]
    </div>
  );
};

OperatorSettings.displayName = "OperatorSettings";
