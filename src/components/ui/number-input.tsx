import type { InputProps } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { formatBigintInput } from "@/lib/utils/number";
import { mergeRefs } from "@/lib/utils/refs";
import { cn } from "@/lib/utils/tw";
import { isUndefined } from "lodash-es";
import type { ReactNode, Ref } from "react";
import { type FC, forwardRef, useMemo, useRef, useState } from "react";
import { useDebounce, useKey } from "react-use";
import { parseUnits } from "viem";

export type BigNumberInputProps = {
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

type Props = Omit<InputProps, keyof BigNumberInputProps> & BigNumberInputProps;
type BigNumberInputFC = FC<Props>;

const ignoreKeys = ["ArrowUp", "ArrowDown"];
const defaultStep = 0.1;

const format = (value: bigint, decimals: number) => {
  return formatBigintInput(value, decimals);
};

export const BigNumberInput: BigNumberInputFC = forwardRef<
  HTMLInputElement,
  Props
>(
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
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRefs = mergeRefs([ref, inputRef]);

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

    useKey(
      "ArrowUp",
      handleArrowKey("up"),
      {
        target: inputRef.current,
      },
      [value, decimals],
    );
    useKey(
      "ArrowDown",
      handleArrowKey("down"),
      {
        target: inputRef.current,
      },
      [value, decimals],
    );

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
            mergedRefs,
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

BigNumberInput.displayName = "BigNumberInput";

export type NumberInputProps = {
  value: number;
  max?: number;
  min?: number;
  allowNegative?: boolean;
  onChange: (value: number) => void;
  decimals?: number;
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

type NumberProps = Omit<InputProps, keyof NumberInputProps> & NumberInputProps;
type NumberInputFC = FC<NumberProps>;

const formatNumber = (value: number, decimals: number) => {
  if (isNaN(value)) return "0";
  return value.toFixed(decimals).replace(/\.?0+$/, "");
};

export const NumberInput: NumberInputFC = forwardRef<
  HTMLInputElement,
  NumberProps
>(
  (
    {
      value,
      max,
      min,
      className,
      decimals = 6,
      allowNegative = false,
      onChange,
      render,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRefs = mergeRefs([ref, inputRef]);

    const capture = useMemo(() => {
      const left = "^(-)?(0)?(\\d+)?";
      const right = `(\\.\\d{0,${decimals}})?`;
      return new RegExp(decimals > 0 ? `${left}${right}` : left);
    }, [decimals]);

    const [displayValue, setDisplayValue] = useState(
      formatNumber(value, decimals),
    );
    const [showMaxSet, setShowMaxSet] = useState(false);
    const [showMinSet, setShowMinSet] = useState(false);
    useDebounce(() => setShowMaxSet(false), 2500, [showMaxSet]);
    useDebounce(() => setShowMinSet(false), 2500, [showMinSet]);

    const setValue = (parsed: number, displayValue?: string) => {
      const hasMax = !isUndefined(max);
      const hasMin = !isUndefined(min);

      if (hasMax && parsed > max) {
        setShowMaxSet(true);
        onChange(max);
        return setDisplayValue(formatNumber(max, decimals));
      }

      if (hasMin && parsed < min) {
        setShowMinSet(true);
        onChange(min);
        return setDisplayValue(formatNumber(min, decimals));
      }

      if (!allowNegative && parsed < 0) {
        onChange(0);
        return setDisplayValue("0");
      }

      setDisplayValue(displayValue ?? formatNumber(parsed, decimals));
      onChange(parsed);
    };

    if (
      formatNumber(value, decimals) !==
      formatNumber(parseFloat(displayValue) || 0, decimals)
    ) {
      setValue(value);
    }

    const handleArrowKey =
      (direction: "up" | "down") => (event: KeyboardEvent) => {
        const step = defaultStep * (event.shiftKey ? 10 : 1);
        return setValue(value + step * (direction === "up" ? 1 : -1));
      };

    useKey(
      "ArrowUp",
      handleArrowKey("up"),
      {
        target: inputRef.current,
      },
      [value, decimals],
    );
    useKey(
      "ArrowDown",
      handleArrowKey("down"),
      {
        target: inputRef.current,
      },
      [value, decimals],
    );

    const onInput = (ev: React.FormEvent<HTMLInputElement>) => {
      const input = ev.currentTarget.value;
      const [, op = "", zero, d, dec = ""] = input.match(capture) || [];
      if (!allowNegative && op === "-") return;

      const nextDisplayValue = op + (d ?? zero ?? "") + dec;
      const parsed = parseFloat(nextDisplayValue) || 0;
      setValue(parsed, nextDisplayValue);
    };

    const onKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) =>
      ignoreKeys.includes(ev.key) && ev.preventDefault();

    const tooltipContent = showMaxSet
      ? "Max value set"
      : showMinSet
        ? "Min value set"
        : "";
    const showTooltip = showMaxSet || showMinSet;

    return (
      <Tooltip
        asChild
        content={tooltipContent}
        open={showTooltip}
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
            mergedRefs,
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
