import { useOperator } from "@/hooks/use-operator";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Link, useParams } from "react-router-dom";

export const Operator: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const params = useParams<{ id: string }>();
  const operator = useOperator(params.id!);

  return (
    <div className={cn(className)} {...props}>
      Operator
      <Link to="settings">1</Link>
      <pre>{JSON.stringify(operator.data, null, 2)}</pre>
    </div>
  );
};

Operator.displayName = "Operator";
