import type { NumberFormatValues } from "react-number-format";

type PercentageHandlerProps = {
  setter: (value: number) => void;
  maxValue?: number;
};

export const percentageMaxHandler = ({
  setter,
  maxValue = 100,
}: PercentageHandlerProps) => {
  return (values: NumberFormatValues) => {
    const { floatValue, value } = values;
    if (value.startsWith("00")) return false;
    const [left] = value.split(".");
    if (left.length > 1 && left[0] === "0") {
      setter(Number(value));
      return false;
    }
    if (floatValue && floatValue > maxValue) {
      setter(maxValue);
      return false;
    }
    return !floatValue || floatValue <= maxValue;
  };
};
