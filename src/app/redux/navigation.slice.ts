import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~app/store';
import config from '~app/common/config';

export interface NavState {
  strategyRedirect: string;
}

const getInitialState = () => {
  if (process.env.REACT_APP_FAUCET_PAGE) {
    return config.routes.FAUCET.ROOT;
  } if (process.env.REACT_APP_CLAIM_PAGE) {
    return config.routes.DISTRIBUTION.ROOT;
  }
  return config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD;
};

const initialState: NavState = {
  strategyRedirect: getInitialState(),
};

export const slice = createSlice({
  name: 'navState',
  initialState,
  reducers: {
    setStrategyRedirect: (state, action: { payload: string }) => {
      state.strategyRedirect = action.payload;
    },
  },
});

export const navStateReducer = slice.reducer;

export const { setStrategyRedirect } = slice.actions;

export const getStrategyRedirect = (state: RootState) => state.navState.strategyRedirect;
