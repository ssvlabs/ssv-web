import type { InputProps } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { formatBigintInput } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import { isUndefined } from "lodash-es";
import type { ReactNode, Ref } from "react";
import { type FC, forwardRef, useMemo, useState } from "react";
import { useDebounce, useKey } from "react-use";
import { parseUnits } from "viem";

export type NumberInputProps = {
  value: bigint;
  max?: bigint;
  allowNegative?: boolean;
  onChange: (value: bigint) => void;
  decimals?: number;
  displayDecimals?: number;
  render?: (
    props: {
      onInput: (ev: React.FormEvent<HTMLInputElement>) => void;
      onKeyDown: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
      value: string;
      inputMode: InputProps["inputMode"];
      type: InputProps["type"];
    },
    ref: Ref<HTMLInputElement>,
  ) => ReactNode;
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
      render,
      ...props
    },
    ref,
  ) => {
    const capture = useMemo(() => {
      const left = "^(-)?(0)?(\\d+)?";
      const right = `(\\.\\d{0,${displayDecimals}})?`;
      return new RegExp(displayDecimals > 0 ? `${left}${right}` : left);
    }, [displayDecimals]);

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

    const onInput = (ev: React.FormEvent<HTMLInputElement>) => {
      const input = ev.currentTarget.value;
      const [, op = "", zero, d, dec = ""] = input.match(capture) || [];
      if (!allowNegative && op === "-") return;

      const nextDisplayValue = op + (d ?? zero ?? "") + dec;

      const parsed = parseUnits(nextDisplayValue, decimals);
      setValue(parsed, nextDisplayValue);
    };

    const onKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) =>
      ignoreKeys.includes(ev.key) && ev.preventDefault();

    return (
      <Tooltip
        asChild
        content={"Max value set"}
        open={showMaxSet}
        hasArrow
        side="left"
      >
        {render ? (
          render(
            {
              onInput,
              onKeyDown,
              value: displayValue,
              inputMode: "numeric",
              type: "text",
            },
            ref,
          )
        ) : (
          <Input
            {...props}
            ref={ref}
            value={displayValue}
            onKeyDown={onKeyDown}
            onInput={onInput}
            className={cn(className)}
            inputMode="numeric"
            type="text"
          />
        )}
      </Tooltip>
    );
  },
);

NumberInput.displayName = "NumberInput";
