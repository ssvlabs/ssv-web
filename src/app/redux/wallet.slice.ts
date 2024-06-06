import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { METAMASK_LABEL } from '~app/constants/constants';
import { RootState } from '~app/store';
import { TEST_WALLET_ADDRESS } from '~lib/utils/developerHelper';
import { getFromLocalStorageByKey } from '~root/providers/localStorage.provider';
import { MAINNET_NETWORK_ID, NetworkInfo, changeNetwork, getStoredNetwork } from '~root/providers/networkInfo.provider';
import { checkIfWalletIsContract } from '~root/services/wallet.service';

export interface WalletSliceState {
  accountAddress: string;
  label: string;
  isNotMetamask: boolean;
  isContractWallet: boolean;
  connectedNetwork: NetworkInfo;
  isMainnet: boolean;
}

const initialState: WalletSliceState = {
  accountAddress: '',
  label: '',
  isNotMetamask: false,
  isContractWallet: false,
  connectedNetwork: getStoredNetwork(),
  isMainnet: false
};

const checkIfWalletIsContractAction = createAsyncThunk('wallet/checkIfWalletIsContractStatus', async (provider: ethers.providers.JsonRpcProvider, thunkAPI) => {
  const walletState = (thunkAPI.getState() as RootState).walletState;
  if (walletState.accountAddress && walletState.isNotMetamask) {
    return await checkIfWalletIsContract({ provider, walletAddress: walletState.accountAddress });
  }
  return false;
});

export const slice = createSlice({
  name: 'walletState',
  initialState,
  reducers: {
    setWallet: (state, action: { payload: { label: string; address: string } }) => {
      state.label = action.payload.label;
      const testWalletAddress = getFromLocalStorageByKey(TEST_WALLET_ADDRESS);
      state.accountAddress = testWalletAddress ?? action.payload.address;
      state.isNotMetamask = action.payload.label !== METAMASK_LABEL;
    },
    resetWallet: (state) => {
      state.label = '';
      state.accountAddress = '';
      state.isNotMetamask = false;
      state.isContractWallet = false;
      state.isMainnet = false;
    },
    setConnectedNetwork: (state, action: { payload: number }) => {
      state.connectedNetwork = changeNetwork(action.payload);
      state.isMainnet = state.connectedNetwork.networkId === MAINNET_NETWORK_ID;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(checkIfWalletIsContractAction.fulfilled, (state, action: { payload: boolean }) => {
      state.isContractWallet = action.payload;
    });
  }
});

export const walletStateReducer = slice.reducer;

export const { setWallet, resetWallet, setConnectedNetwork } = slice.actions;

export { checkIfWalletIsContractAction };

export const getWalletLabel = (state: RootState) => state.walletState.label;
export const getAccountAddress = (state: RootState) => state.walletState.accountAddress;
export const getIsContractWallet = (state: RootState) => state.walletState.isContractWallet;
export const getIsNotMetamask = (state: RootState) => state.walletState.isNotMetamask;
export const getConnectedNetwork = (state: RootState) => state.walletState.connectedNetwork;
export const getIsMainnet = (state: RootState) => state.walletState.isMainnet;
