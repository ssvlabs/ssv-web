import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~app/store';
import { getFromLocalStorageByKey, removeFromLocalStorageByKey, saveInLocalStorage } from '~root/providers/localStorage.provider';
import config from '~app/common/config';

export interface AppState {
  strategyName: string;
  isDarkMode: boolean;
  isLoading: boolean;
  isShowWalletPopup: boolean;
  isShowTxPendingPopup: boolean;
  txHash: string;
  userGeo: string;
}

const getInitialStrategyName = () => {
  if (process.env.REACT_APP_FAUCET_PAGE) {
    return 'faucet';
  } if (process.env.REACT_APP_CLAIM_PAGE) {
    return 'distribution';
  }
  return 'ssv-web';
};

const initialState: AppState = {
  strategyName: getInitialStrategyName(),
  isDarkMode: !!getFromLocalStorageByKey('isDarkMode') ?? (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches),
  isLoading: false,
  isShowWalletPopup: false,
  isShowTxPendingPopup: false,
  txHash: '',
  userGeo: '',
};

export const slice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      if (state.isDarkMode) {
        removeFromLocalStorageByKey('isDarkMode');
      } else {
        saveInLocalStorage('isDarkMode', '1');
      }
      state.isDarkMode = !state.isDarkMode;
    },
    setUserGeo: (state, action: { payload: string }) => {
      state.userGeo = action.payload;
    },
    setIsLoading: (state, action: { payload: boolean }) => {
      state.isLoading = action.payload;
    },
    setIsShowWalletPopup: (state, action: { payload: boolean }) => {
      state.isShowWalletPopup = action.payload;
    },
    setIsShowTxPendingPopup: (state, action: { payload: boolean }) => {
      state.isShowTxPendingPopup = action.payload;
    },
    setTxHash: (state, action: { payload: string }) => {
      state.txHash = action.payload;
    },
  },
});

export const appStateReducer = slice.reducer;

export const { toggleDarkMode, setUserGeo, setIsLoading, setIsShowWalletPopup, setIsShowTxPendingPopup, setTxHash } = slice.actions;

export const getStrategyName = (state: RootState) => state.appState.strategyName;
export const getIsDarkMode = (state: RootState) => state.appState.isDarkMode;
export const getUserGeo = (state: RootState) => state.appState.userGeo;
export const getIsLoading = (state: RootState) => state.appState.isLoading;
export const getIsShowWalletPopup = (state: RootState) => state.appState.isShowWalletPopup;
export const getIsShowTxPendingPopup = (state: RootState) => state.appState.isShowTxPendingPopup;
export const getTxHash = (state: RootState) => state.appState.txHash;
