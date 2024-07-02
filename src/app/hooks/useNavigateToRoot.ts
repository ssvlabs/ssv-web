import { useCallback, useEffect, useMemo, useRef as useReactRef } from 'react';
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

const useRef = <T>(state: T) => {
  const ref = useReactRef(state);
  useEffect(() => {
    ref.current = state;
  }, [ref, state]);

  return ref;
};

export const useNavigateToRoot = () => {
  const navigate = useRef(useNavigate());
  const dispatch = useRef(useAppDispatch());

  const navigateToRoot = useCallback(({ search, options }: NavigateProps = defaultNavigateProps) => {
    const path = rootPath + search;
    dispatch.current(setStrategyRedirect(path));
    navigate.current(path, options);
  }, []);

  return useMemo(() => ({ navigateToRoot }), [navigateToRoot]);
};
