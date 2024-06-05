import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '~app/store';
import { fetchNetworkFeeAndLiquidationCollateral } from '~root/services/tokenContract.service';

export interface NetworkState {
  networkFee: number;
  liquidationCollateralPeriod: number;
  minimumLiquidationCollateral: number;
}

const initialState: NetworkState = {
  networkFee: 0,
  liquidationCollateralPeriod: 0,
  minimumLiquidationCollateral: 0
};

export const fetchAndSetNetworkFeeAndLiquidationCollateral = createAsyncThunk('network/fetchAndSetNetworkFeeAndLiquidationCollateral', async () => {
  return await fetchNetworkFeeAndLiquidationCollateral();
});

export const slice = createSlice({
  name: 'networkState',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchAndSetNetworkFeeAndLiquidationCollateral.fulfilled,
      (
        state,
        action: {
          payload: {
            networkFee: number;
            liquidationCollateralPeriod: number;
            minimumLiquidationCollateral: number;
          };
        }
      ) => {
        state.networkFee = action.payload.networkFee;
        state.liquidationCollateralPeriod = action.payload.liquidationCollateralPeriod;
        state.minimumLiquidationCollateral = action.payload.minimumLiquidationCollateral;
      }
    );
  }
});

export const networkStateReducer = slice.reducer;

export const getNetworkFeeAndLiquidationCollateral = (state: RootState) => ({
  networkFee: state.networkState.networkFee,
  liquidationCollateralPeriod: state.networkState.liquidationCollateralPeriod,
  minimumLiquidationCollateral: state.networkState.minimumLiquidationCollateral
});
