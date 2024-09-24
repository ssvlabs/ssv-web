import { getSuperProperties, mixpanel } from "@/mixpanel";
import { useLocation } from "react-router-dom";
import { useDebounce } from "react-use";

export const useTrackPageViews = () => {
  const navigator = useLocation();
  useDebounce(
    () => {
      mixpanel.track_pageview(getSuperProperties());
    },
    50,
    [navigator.pathname],
  );
};
