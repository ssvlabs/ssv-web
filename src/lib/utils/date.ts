import { ms } from "@/lib/utils/number";
import type { FormatDurationOptions } from "date-fns";
import { formatDistance, formatDuration, intervalToDuration } from "date-fns";

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

export const humanizeFundingDuration = (duration: number) => {
  return formatDistance(0, duration, {
    includeSeconds: false,
    addSuffix: false,
  });
};
