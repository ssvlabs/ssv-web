import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~app/store';
import { getFromLocalStorageByKey, removeFromLocalStorageByKey, saveInLocalStorage } from '~root/providers/localStorage.provider';

export interface AppState {
  strategyName: string;
  isDarkMode: boolean;
  isLoading: boolean;
  isShowWalletPopup: boolean;
  isShowConnectWallet: boolean;
  isShowTxPendingPopup: boolean;
  isShowSsvLoader: boolean;
  txHash: string;
  restrictedUserGeo: string;
}

const getInitialStrategyName = () => {
  if (import.meta.env.VITE_FAUCET_PAGE) {
    return 'faucet';
  }
  if (import.meta.env.VITE_CLAIM_PAGE) {
    return 'distribution';
  }
  return 'ssv-web';
};

const initialState: AppState = {
  strategyName: getInitialStrategyName(),
  isDarkMode: !!getFromLocalStorageByKey('isDarkMode') /* ?? (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) */,
  isLoading: false,
  isShowWalletPopup: false,
  isShowConnectWallet: false,
  isShowTxPendingPopup: false,
  isShowSsvLoader: true,
  txHash: '',
  restrictedUserGeo: ''
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
    setRestrictedUserGeo: (state, action: { payload: string }) => {
      state.restrictedUserGeo = action.payload;
    },
    setIsLoading: (state, action: { payload: boolean }) => {
      state.isLoading = action.payload;
    },
    setIsShowSsvLoader: (state, action: { payload: boolean }) => {
      state.isShowSsvLoader = action.payload;
    },
    setIsShowWalletPopup: (state, action: { payload: boolean }) => {
      state.isShowWalletPopup = action.payload;
    },
    setIsShowConnectWallet: (state, action: { payload: boolean }) => {
      state.isShowConnectWallet = action.payload;
    },
    setIsShowTxPendingPopup: (state, action: { payload: boolean }) => {
      state.isShowTxPendingPopup = action.payload;
    },
    setTxHash: (state, action: { payload: string }) => {
      state.txHash = action.payload;
    }
  }
});

export const appStateReducer = slice.reducer;

export const { toggleDarkMode, setIsShowSsvLoader, setRestrictedUserGeo, setIsLoading, setIsShowWalletPopup, setIsShowTxPendingPopup, setTxHash, setIsShowConnectWallet } =
  slice.actions;

export const getStrategyName = (state: RootState) => state.appState.strategyName;
export const getIsDarkMode = (state: RootState) => state.appState.isDarkMode;
export const getRestrictedUserGeo = (state: RootState) => state.appState.restrictedUserGeo;
export const getIsShowSsvLoader = (state: RootState) => state.appState.isShowSsvLoader;
export const getIsLoading = (state: RootState) => state.appState.isLoading;
export const getIsShowWalletPopup = (state: RootState) => state.appState.isShowWalletPopup;
export const getIsShowConnectWallet = (state: RootState) => state.appState.isShowConnectWallet;
export const getIsShowTxPendingPopup = (state: RootState) => state.appState.isShowTxPendingPopup;
export const getTxHash = (state: RootState) => state.appState.txHash;
