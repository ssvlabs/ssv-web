import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tw";
import type { FC } from "react";
import { FaAngleLeft } from "react-icons/fa";
import type { To } from "react-router-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const NavigateBackBtn: FC<
  ButtonProps &
    ({ by?: "path"; to: To } | { by?: "history" }) & {
      persistSearch?: boolean;
    }
> = ({ className, by = "path", persistSearch, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPath = by === "path" || "to" in props;

  const getTo = (): To => {
    const baseTo = "to" in props ? props.to ?? ".." : "..";
    if (persistSearch && location.search) {
      if (typeof baseTo === "string") {
        return `${baseTo}${location.search}`;
      }
      return {
        ...baseTo,
        search: location.search,
      };
    }
    return baseTo;
  };

  return (
    <Button
      as={isPath ? Link : "button"}
      variant="subtle"
      icon={<FaAngleLeft className="text-primary-500" />}
      className={cn(className, "font-bold w-fit")}
      {...(isPath
        ? { to: getTo() }
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
