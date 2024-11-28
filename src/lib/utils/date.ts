import { ms, numberFormatter } from "@/lib/utils/number";
import type { FormatDurationOptions } from "date-fns";
import { formatDuration, intervalToDuration } from "date-fns";

const daysFormat = ["days", "hours"] satisfies FormatDurationOptions["format"];
const hoursFormat = [
  "hours",
  "minutes",
] satisfies FormatDurationOptions["format"];
const minutesFormat = [
  "minutes",
  "seconds",
] satisfies FormatDurationOptions["format"];

export const humanizeDuration = (duration: number) =>
  formatDuration(
    intervalToDuration({
      start: 0,
      end: duration,
    }),
    {
      format:
        duration > ms(1, "days")
          ? daysFormat
          : duration > ms(1, "hours")
            ? hoursFormat
            : minutesFormat,
    },
  );

export const humanizeFundingDuration = (days: number) => {
  return `${numberFormatter.format(days)} day${days > 1 || days === 0 ? "s" : ""}`;
};
