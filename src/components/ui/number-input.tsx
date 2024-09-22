import type { InputProps } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { formatBigintInput } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import { isUndefined } from "lodash-es";
import { type FC, forwardRef, useState } from "react";
import { useDebounce, useKey } from "react-use";
import { parseUnits } from "viem";

export type NumberInputProps = {
  value: bigint;
  max?: bigint;
  allowNegative?: boolean;
  onChange: (value: bigint) => void;
  decimals?: number;
  displayDecimals?: number;
};

type Props = Omit<InputProps, keyof NumberInputProps> & NumberInputProps;
type NumberInputFC = FC<Props>;

const ignoreKeys = ["ArrowUp", "ArrowDown"];
const defaultStep = 0.1;

const format = (value: bigint, decimals: number) => {
  return formatBigintInput(value, decimals);
};

export const NumberInput: NumberInputFC = forwardRef<HTMLInputElement, Props>(
  (
    {
      value,
      max,
      className,
      decimals = 18,
      allowNegative = false,
      onChange,
      displayDecimals = 7,
      ...props
    },
    ref,
  ) => {
    const capture = new RegExp(
      `^(-)?(0)?(\\d+)?(\\.\\d{0,${displayDecimals}})?`,
    );

    const [displayValue, setDisplayValue] = useState(format(value, decimals));
    const [showMaxSet, setShowMaxSet] = useState(false);
    useDebounce(() => setShowMaxSet(false), 2500, [showMaxSet]);

    const setValue = (parsed: bigint, displayValue?: string) => {
      const hasMax = !isUndefined(max);

      if (hasMax && parsed > max) {
        setShowMaxSet(true);
        onChange(max);
        return setDisplayValue(formatBigintInput(max, decimals));
      }

      if (!allowNegative && parsed < 0) {
        onChange(0n);
        return setDisplayValue("0");
      }

      setDisplayValue(displayValue ?? formatBigintInput(parsed, decimals));
      onChange(parsed);
    };

    if (
      formatBigintInput(value, decimals) !==
      formatBigintInput(parseUnits(displayValue, decimals), decimals)
    ) {
      setValue(value);
    }

    const handleArrowKey =
      (direction: "up" | "down") => (event: KeyboardEvent) => {
        const step = defaultStep * (event.shiftKey ? 10 : 1);
        return setValue(
          value +
            parseUnits(step.toString(), decimals) *
              (direction === "up" ? 1n : -1n),
        );
      };

    useKey("ArrowUp", handleArrowKey("up"), undefined, [value, decimals]);
    useKey("ArrowDown", handleArrowKey("down"), undefined, [value, decimals]);
    return (
      <Tooltip
        asChild
        content={"Max value set"}
        open={showMaxSet}
        hasArrow
        side="left"
      >
        <Input
          {...props}
          ref={ref}
          value={displayValue}
          onKeyDown={(ev) => ignoreKeys.includes(ev.key) && ev.preventDefault()}
          onInput={(ev) => {
            const input = ev.currentTarget.value;
            const [, op = "", zero, d, dec = ""] = input.match(capture) || [];
            if (!allowNegative && op === "-") return;

            const nextDisplayValue = op + (d ?? zero ?? "") + dec;

            const parsed = parseUnits(nextDisplayValue, decimals);
            setValue(parsed, nextDisplayValue);
          }}
          className={cn(className)}
          inputMode="numeric"
          type="text"
        />
      </Tooltip>
    );
  },
);

NumberInput.displayName = "NumberInput";
