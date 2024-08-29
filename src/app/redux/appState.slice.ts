import { createSlice } from '@reduxjs/toolkit';
import { TransactionStatus } from '~app/enums/transactionStatus.enum';
import { RootState } from '~app/store';
import { getFromLocalStorageByKey, removeFromLocalStorageByKey, saveInLocalStorage } from '~root/providers/localStorage.provider';
import React from 'react';
import { ButtonPropsType } from '~app/types/ButtonPropsType.ts';

type ModalPopUpType = null | {
  title: string;
  text: string[];
  width?: number;
  buttons: {
    component: React.FC<ButtonPropsType>;
    props: ButtonPropsType;
  }[];
};

export interface AppState {
  strategyName: string;
  isDarkMode: boolean;
  isLoading: boolean;
  isShowWalletPopup: boolean;
  isShowConnectWallet: boolean;
  isShowTxPendingPopup: boolean;
  isPopUpWithIndexingStatus: boolean;
  isShowSsvLoader: boolean;
  isMaintenancePage: boolean;
  transactionStatus: TransactionStatus;
  txHash: string;
  restrictedUserGeo: string;
  modalPopUp: ModalPopUpType;
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

const isMaintenancePage = !!getFromLocalStorageByKey('isMaintenancePage');

const initialState: AppState = {
  isMaintenancePage,
  strategyName: getInitialStrategyName(),
  isDarkMode: !!getFromLocalStorageByKey('isDarkMode') /* ?? (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) */,
  isLoading: false,
  isShowWalletPopup: false,
  isShowConnectWallet: false,
  isPopUpWithIndexingStatus: false,
  isShowTxPendingPopup: false,
  modalPopUp: null,
  isShowSsvLoader: !isMaintenancePage,
  transactionStatus: TransactionStatus.PENDING,
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
    setModalPopUp: (state, action: { payload: ModalPopUpType }) => {
      state.modalPopUp = action.payload;
    },
    setIsLoading: (state, action: { payload: boolean }) => {
      state.isLoading = action.payload;
    },
    setIsShowSsvLoader: (state, action: { payload: boolean }) => {
      state.isShowSsvLoader = !state.isMaintenancePage && action.payload;
    },
    setIsPopUpWithIndexingStatus: (state, action: { payload: boolean }) => {
      state.isPopUpWithIndexingStatus = action.payload;
    },
    setTransactionStatus: (state, action: { payload: TransactionStatus }) => {
      state.transactionStatus = action.payload;
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

export const {
  toggleDarkMode,
  setIsShowSsvLoader,
  setRestrictedUserGeo,
  setIsLoading,
  setIsShowWalletPopup,
  setTransactionStatus,
  setIsShowTxPendingPopup,
  setTxHash,
  setIsShowConnectWallet,
  setModalPopUp,
  setIsPopUpWithIndexingStatus
} = slice.actions;

export const getStrategyName = (state: RootState) => state.appState.strategyName;
export const getIsDarkMode = (state: RootState) => state.appState.isDarkMode;
export const getRestrictedUserGeo = (state: RootState) => state.appState.restrictedUserGeo;
export const getIsShowSsvLoader = (state: RootState) => state.appState.isShowSsvLoader;
export const getIsLoading = (state: RootState) => state.appState.isLoading;
export const getIsShowWalletPopup = (state: RootState) => state.appState.isShowWalletPopup;
export const getIsShowConnectWallet = (state: RootState) => state.appState.isShowConnectWallet;
export const getIsShowTxPendingPopup = (state: RootState) => state.appState.isShowTxPendingPopup;
export const getTxHash = (state: RootState) => state.appState.txHash;
export const getTransactionStatus = (state: RootState) => state.appState.transactionStatus;
export const getModalPopUp = (state: RootState) => state.appState.modalPopUp;
export const getIsMaintenancePage = (state: RootState) => state.appState.isMaintenancePage;
export const getIsPopUpWithIndexingStatus = (state: RootState) => state.appState.isPopUpWithIndexingStatus;
