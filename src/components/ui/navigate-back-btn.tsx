import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tw";
import type { FC } from "react";
import { FaAngleLeft } from "react-icons/fa";
import type { To } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

export const NavigateBackBtn: FC<
  ButtonProps & ({ by?: "path"; to: To } | { by?: "history" })
> = ({ className, by = "path", ...props }) => {
  const navigate = useNavigate();
  const isPath = by === "path";
  return (
    <Button
      as={isPath ? Link : "button"}
      variant="subtle"
      icon={<FaAngleLeft className="text-primary-500" />}
      className={cn(className, "font-bold w-fit")}
      {...(isPath
        ? { to: "to" in props ? props.to ?? ".." : ".." }
        : {
            onClick: () => navigate(-1),
          })}
      {...props}
    >
      {props.children ?? "Back"}
    </Button>
  );
};

NavigateBackBtn.displayName = "NavigateBackBtn";
