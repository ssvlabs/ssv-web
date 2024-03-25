import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~app/store';
import { changeNetwork, getStoredNetwork, MAINNET_NETWORK_ID, NetworkInfo } from '~root/providers/networkInfo.provider';

export interface WalletState {
  connectedNetwork: NetworkInfo;
  isMainnet: boolean;
}

const initialState: WalletState = {
  connectedNetwork: getStoredNetwork(),
  isMainnet: getStoredNetwork().networkId === MAINNET_NETWORK_ID,
};

export const slice = createSlice({
  name: 'walletState',
  initialState,
  reducers: {
    setConnectedNetwork: (state, action: { payload: number }) => {
      state.connectedNetwork = changeNetwork(action.payload);
      state.isMainnet = state.connectedNetwork.networkId === MAINNET_NETWORK_ID;
    },
  },
});

export const walletStateReducer = slice.reducer;

export const { setConnectedNetwork } = slice.actions;

export const getConnectedNetwork = (state: RootState) => state.walletState.connectedNetwork;
export const getIsMainnet = (state: RootState) => state.walletState.isMainnet;
