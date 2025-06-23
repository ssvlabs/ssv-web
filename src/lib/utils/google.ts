import { format } from "date-fns";

type GoogleCalendarEventOptions = {
  title: string;
  dates: {
    start: number;
    end: number;
  };
  link?: string;
  description?: string;
  isAllDay?: boolean;
};

export const generateGoogleCalendarUrl = ({
  title,
  dates,
  description = "",
  isAllDay,
}: GoogleCalendarEventOptions): string => {
  const startDateStr = isAllDay
    ? format(new Date(dates.start), "yyyyMMdd")
    : format(new Date(dates.start), "yyyyMMdd'T'HHmmss");
  const endDateStr = isAllDay
    ? format(new Date(dates.end), "yyyyMMdd")
    : format(new Date(dates.end), "yyyyMMdd'T'HHmmss");
  const datesStr = `${startDateStr}/${endDateStr}`;

  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: datesStr,
    ...(description && { details: description }),
  })}`;
};
