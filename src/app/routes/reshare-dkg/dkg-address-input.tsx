import type { ControllerRenderProps } from "react-hook-form";
import type { Address } from "abitype";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

export const DkgAddressInput = ({
  field,
  isInputDisabled,
  value,
  setIsInputDisabled,
  isAcceptedButtonDisabled,
  acceptedButtonLabel,
}: {
  field: ControllerRenderProps<
    {
      ownerAddress: Address | string;
      withdrawAddress: Address | string;
      signature: string;
    },
    "ownerAddress" | "withdrawAddress" | "signature"
  >;
  isInputDisabled: boolean;
  isAcceptedButtonDisabled: boolean;
  value: string;
  acceptedButtonLabel?: string;
  setIsInputDisabled: (isDisabled: boolean) => void;
}) => (
  <Input
    {...field}
    disabled={isInputDisabled}
    value={value}
    rightSlot={
      acceptedButtonLabel && (
        <Button
          className="border-none text-primary-500 hover:bg-transparent hover:text-primary-500"
          variant={isInputDisabled ? "outline" : "secondary"}
          disabled={isAcceptedButtonDisabled}
          onClick={() => {
            setIsInputDisabled(!isInputDisabled);
          }}
        >
          {acceptedButtonLabel}
        </Button>
      )
    }
  />
);
