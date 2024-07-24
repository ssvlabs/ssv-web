import { useLocation } from 'react-router-dom';
import { useDebounce } from 'react-use';
import { getSuperProperties, mixpanel } from '~root/mixpanel';

export const useTrackPageViews = () => {
  const navigator = useLocation();
  useDebounce(
    () => {
      mixpanel.track_pageview(getSuperProperties());
    },
    50,
    [navigator.pathname]
  );
};
