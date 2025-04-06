import { CopyBtn } from "@/components/ui/copy-btn";
import { shortenAddress } from "@/lib/utils/strings";
import { cn } from "@/lib/utils/tw";
import type { Address } from "abitype";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Link, type LinkProps } from "react-router-dom";

export type AddressProps = {
  address: Address;
  copyable?: boolean;
  linkProps?: LinkProps;
};

type AddressFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof AddressProps> & AddressProps
>;

export const AddressDisplay: AddressFC = ({
  address,
  className,
  copyable,
  linkProps,
  children,
  ...props
}) => {
  const shortened = shortenAddress(address);

  return (
    <div
      className={cn(
        "inline-flex font-mono items-center gap-[0.62em]",
        className,
      )}
      {...props}
    >
      {linkProps ? (
        <>
          <Link
            {...linkProps}
            className={cn(
              "text-primary-500 underline-offset-4 hover:underline",
              linkProps.className,
            )}
          >
            {shortened}
          </Link>
          {children}
        </>
      ) : (
        <>
          <span>{shortened}</span>
          {children}
        </>
      )}

      {copyable && <CopyBtn text={address} />}
      {children}
    </div>
  );
};

AddressDisplay.displayName = "AddressDisplay";
