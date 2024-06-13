import { useCallback, useMemo } from 'react';
import { useNavigate, Path as RoutePath, NavigateOptions } from 'react-router-dom';
import config from '~app/common/config';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setStrategyRedirect } from '~app/redux/navigation.slice';

type NavigateProps = {
  search?: RoutePath['search'];
  options?: NavigateOptions;
};
const defaultNavigateProps: NavigateProps = { search: '', options: {} };

const rootPath = import.meta.env.VITE_CLAIM_PAGE ? config.routes.DISTRIBUTION.ROOT : import.meta.env.VITE_FAUCET_PAGE ? config.routes.FAUCET.ROOT : config.routes.SSV.ROOT;

export const useNavigateToRoot = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const navigateToRoot = useCallback(
    ({ search, options }: NavigateProps = defaultNavigateProps) => {
      const path = rootPath + search;
      dispatch(setStrategyRedirect(path));
      navigate(path, options);
    },
    [dispatch, navigate]
  );

  return useMemo(() => ({ navigateToRoot }), [navigateToRoot]);
};
