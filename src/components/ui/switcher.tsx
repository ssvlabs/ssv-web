import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils/tw.ts";

type BtnType = {
  type: string;
  label: string;
  count: number;
  isSelected: boolean;
};

export const buttonVariants = cva(
  "w-[133px] h-10 flex items-center justify-center gap-2 text-[14px] rounded-[12px]",
  {
    variants: {
      variant: {
        selected: "bg-white font-semibold",
      },
    },
  },
);

export const countVariants = cva(
  "size-6 rounded-[4px] bg-primary-100 text-primary-400 flex items-center justify-center",
  {
    variants: {
      variant: {
        selected: "bg-primary-400 text-white",
      },
    },
  },
);

const Switcher = ({
  buttons,
  onBtnClick,
}: {
  buttons: BtnType[];
  onBtnClick: (value: string) => void;
}) => {
  return (
    <div
      className={
        "h-12 bg-gray-300 p-1 border border-gray-400 rounded-2xl flex cursor-pointer items-center"
      }
    >
      {buttons.map((btn: BtnType) => (
        <div
          onClick={() => onBtnClick(btn.type)}
          className={cn(
            buttonVariants({
              variant: btn.isSelected ? "selected" : undefined,
            }),
          )}
        >
          {btn.label}
          <div
            className={cn(
              countVariants({
                variant: btn.isSelected ? "selected" : undefined,
              }),
            )}
          >
            {btn.count}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Switcher;
