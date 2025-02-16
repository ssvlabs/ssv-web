import { Text } from "@/components/ui/text.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

const statusIcons = {
  ["waiting"]: (
    <img className="size-9" src={"/images/rectangle.svg"} alt="Step Done" />
  ),
  ["pending"]: <Spinner className="size-9" />,
  ["success"]: (
    <img className="size-9" src={"/images/step-done.svg"} alt="Step Done" />
  ),
};

const DoubleTx = ({
  stats,
  onClose,
}: {
  onClose: () => void;
  stats: {
    label: string;
    status: "waiting" | "pending" | "success";
  }[];
}) => {
  return (
    <div
      style={{ backgroundColor: "rgba(11, 42, 60, 0.16)" }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
    >
      <div className="w-[424px] relative rounded-lg shadow-lg bg-background p-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-row justify-between items-center">
            <Text variant="body-1-bold">Create Strategy</Text>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              &#10005;
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {stats.map((state) => (
              <div className="flex items-center gap-3">
                {statusIcons[state.status]}

                {state.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubleTx;
