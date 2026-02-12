import { locationState } from "@/app/routes/router";
import { matchPath } from "react-router";

export const isFrom = (pattern: string) => {
  return matchPath(pattern, locationState.previous.pathname ?? "");
};
