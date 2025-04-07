import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { useLocalStorage } from "react-use";
import { Text } from "@/components/ui/text";
import { Spacer } from "@/components/ui/spacer";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TbAlertTriangleFilled } from "react-icons/tb";

export const HoleskySunsetBanner: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const [showHoleskySunsetBanner, setShowHoleskySunsetBanner] = useLocalStorage(
    "showHoleskySunsetBanner",
    true,
  );
  if (!showHoleskySunsetBanner) return null;
  return (
    <div
      {...props}
      className={cn(
        "flex items-center gap-3 bg-[#E57C09] px-5 py-4 text-[#fff]",
      )}
    >
      <div className="w-6 min-w-6" />
      <Spacer />
      <div className="flex gap-3 items-center">
        <TbAlertTriangleFilled className="size-6 min-w-6" />
        <Text variant="body-2-medium" className="text-[#fff]">
          Holesky network support will be deprecated on April 21st, 2025. As of
          this date, the official testnet will shift to the Hoodi testnet.
        </Text>
      </div>
      <Spacer />
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-[#fff]/20"
        onClick={() => setShowHoleskySunsetBanner(false)}
      >
        <X />
      </Button>
    </div>
  );
};

HoleskySunsetBanner.displayName = "HoleskySunsetBanner";
