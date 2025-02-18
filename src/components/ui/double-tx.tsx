import { Text } from "@/components/ui/text.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { TbExternalLink } from "react-icons/tb";
import { useLinks } from "@/hooks/use-links.ts";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { Button } from "@/components/ui/button.tsx";

const statusIcons = {
  ["waiting"]: (
    <img className="size-9" src={"/images/rectangle.svg"} alt="Step Done" />
  ),
  ["pending"]: <Spinner className="size-9" />,
  ["success"]: (
    <img className="size-9" src={"/images/step-done.svg"} alt="Step Done" />
  ),
  ["failed"]: (
    <img className="size-9" src={"/images/step-failed.svg"} alt="Step Done" />
  ),
};

const DoubleTx = ({
  stats,
  onClose,
  action,
  actionLabel,
  isLoading,
}: {
  onClose?: () => void;
  action?: () => void;
  isLoading?: boolean;
  actionLabel?: string;
  stats: {
    label: string;
    status: "waiting" | "pending" | "success" | "failed";
    txHash?: `0x${string}`;
  }[];
}) => {
  const { etherscan } = useLinks();
  return (
    <div
      style={{ backgroundColor: "rgba(11, 42, 60, 0.16)" }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
    >
      <div className="w-[424px] relative rounded-lg shadow-lg bg-background p-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-row justify-between items-center">
            <Text variant="body-1-bold">Create Strategy</Text>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
              >
                &#10005;
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {stats.map((state, index) => (
              <div key={index} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {statusIcons[state.status]}
                    {state.label}
                  </div>
                  {state.txHash && (
                    <a
                      target="_blank"
                      href={`${etherscan}/tx/${state.txHash}`}
                      className="flex items-center gap-1 text-[12px] text-primary-500 rounded-[4px] bg-primary-50 px-2 py-1 cursor-pointer"
                    >
                      {shortenAddress(state.txHash)}
                      <TbExternalLink className="size-3" />
                    </a>
                  )}
                </div>
                {index < stats.length - 1 && (
                  <div className="w-0 h-[18.5px] border-[0.5px] border-gray-400 ml-[18px]" />
                )}
              </div>
            ))}
          </div>
          {actionLabel && action && (
            <Button isLoading={isLoading} onClick={action}>
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubleTx;
