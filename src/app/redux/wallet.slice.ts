import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~app/store';
import { changeNetwork, getStoredNetwork, NetworkInfo } from '~root/providers/networkInfo.provider';

export interface WalletState {
  connectedNetwork: NetworkInfo;
}

const initialState: WalletState = {
  connectedNetwork: getStoredNetwork(),
};

export const slice = createSlice({
  name: 'walletState',
  initialState,
  reducers: {
    setConnectedNetwork: (state, action: { payload: number }) => {
      state.connectedNetwork = changeNetwork(action.payload);
    },
  },
});

export const walletStateReducer = slice.reducer;

export const { setConnectedNetwork } = slice.actions;

export const getConnectedNetwork = (state: RootState) => state.walletState.connectedNetwork;
