import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOperator } from '~app/model/operator.model.ts';
import { RootState } from '~app/store.ts';
import { fromWei } from '~root/services/conversions.service.ts';
import { enableMapSet } from 'immer';
import {
  getMaxOperatorFee,
  initFeeIncreaseAndPeriods,
  syncOperatorFeeInfo,
  updateOperatorValidatorsLimit
} from '~root/services/operatorContract.service.ts';

type OperatorStateType = {
  selectedOperators: Map<string, IOperator>
  clusterSize: number
  operatorValidatorsLimit: number
  operatorCurrentFee: number
  operatorFutureFee: number
  operatorApprovalBeginTime: number
  operatorApprovalEndTime: number
  operatorProcessId: number
  getSetOperatorFeePeriod: number
  declaredOperatorFeePeriod: number
  maxFeeIncrease: number
  maxOperatorFeePerYear: number
}

const initialState: OperatorStateType = {
  selectedOperators: new Map<string, IOperator>(),
  clusterSize: 4,
  operatorValidatorsLimit: 0,
  operatorCurrentFee: 0,
  operatorFutureFee: 0,
  operatorApprovalBeginTime: 0,
  operatorApprovalEndTime: 0,
  operatorProcessId: 0,
  maxFeeIncrease: 0,
  getSetOperatorFeePeriod: 0,
  declaredOperatorFeePeriod: 0,
  maxOperatorFeePerYear: 0
};

enableMapSet();

export const fetchAndSetOperatorValidatorsLimit =
  createAsyncThunk('operator/fetchAndSetOperatorValidatorsLimit', async () => {
    return await updateOperatorValidatorsLimit();
  });

export const fetchAndSetOperatorFeeInfo =
  createAsyncThunk('operator/fetchAndSetOperatorFeeInfo', async (operatorId: number) => {
    return await syncOperatorFeeInfo(operatorId);
  });

export const fetchAndSetFeeIncreaseAndPeriods =
  createAsyncThunk('operator/fetchAndSetFeeIncreaseAndPeriods', async () => {
    return await initFeeIncreaseAndPeriods();
  });
export const fetchAndSetMaxOperatorFee =
  createAsyncThunk('operator/fetchAndSetMaxOperatorFee', async () => {
    return await getMaxOperatorFee();
  });

export const slice = createSlice({
  name: 'operatorState',
  initialState,
  reducers: {
    setOperatorProcessId: (state, action: { payload: number }) => {
      state.operatorProcessId = action.payload;
    },
    selectOperator: (state, action: {
      payload: { operator: IOperator, selectedIndex: number, clusterBox: number[] }
    }) => {
      if (Object.values(state.selectedOperators).some((operator: IOperator) => operator.id === action.payload.operator.id)) {
        return;
      }
      state.selectedOperators.set(action.payload.selectedIndex.toString(), action.payload.operator);
    },
    selectOperators: (state, action: { payload: IOperator[] }) => {
      const newMap = new Map<string, IOperator>()
      action.payload
        .sort((operator: IOperator) => operator.id)
        .forEach((value: IOperator, index: number) => {
          newMap.set(`${index}`, value);
        });
      state.selectedOperators = newMap;
    },
    unselectOperator: (state, action: { payload: number }) => {
      state.selectedOperators.delete(action.payload.toString());
    },
    clearAllSettings: (state) => {
        state.maxFeeIncrease = 0;
        state.operatorFutureFee = 0;
        state.operatorCurrentFee = 0;
        state.getSetOperatorFeePeriod = 0;
        state.operatorApprovalEndTime = 0;
        state.declaredOperatorFeePeriod = 0;
        state.operatorApprovalBeginTime = 0;
    },
    unselectAllOperators: (state) => {
      state.selectedOperators = new Map();
    },
    setClusterSize: (state, action: { payload: number }) => {
      state.clusterSize = action.payload;
    },
    clearOperatorFeeInfo: (state) => {
      state.operatorApprovalBeginTime = 0;
      state.operatorApprovalEndTime = 0;
      state.operatorFutureFee = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAndSetOperatorValidatorsLimit.fulfilled, (state, action: { payload: number }) => {
      state.operatorValidatorsLimit = action.payload;
    });
    builder.addCase(fetchAndSetOperatorFeeInfo.fulfilled, (state, action) => {
      if (action.payload) {
        state.operatorApprovalBeginTime = action.payload.operatorApprovalBeginTime;
        state.operatorApprovalEndTime = action.payload.operatorApprovalEndTime;
        state.operatorFutureFee = action.payload.operatorFutureFee;
        state.operatorCurrentFee = action.payload.operatorCurrentFee;
      }
    });
    builder.addCase(fetchAndSetFeeIncreaseAndPeriods.fulfilled, (state, action) => {
      if (action.payload) {
        state.getSetOperatorFeePeriod = action.payload.getSetOperatorFeePeriod;
        state.declaredOperatorFeePeriod = action.payload.declaredOperatorFeePeriod;
        state.maxFeeIncrease = action.payload.maxFeeIncrease;
      }
    });
    builder.addCase(fetchAndSetMaxOperatorFee.fulfilled, (state, action) => {
      if (action.payload) {
        state.maxOperatorFeePerYear = action.payload;
      }
    });
  }
});

export const operatorStateReducer = slice.reducer;
export const {
  unselectOperator,
  unselectAllOperators,
  selectOperators,
  selectOperator,
  setClusterSize,
  setOperatorProcessId,
  clearOperatorFeeInfo,
  clearAllSettings
} = slice.actions;

export const getSelectedOperatorsFee = (state: RootState) => [...state.operatorState.selectedOperators.values()].reduce((acc: number, operator: IOperator) => {
  return acc + fromWei(operator.fee);
}, 0);
export const getOperatorProcessId = (state: RootState) => state.operatorState.operatorProcessId;
export const getSelectedOperators = (state: RootState) => state.operatorState.selectedOperators;
export const getClusterSize = (state: RootState) => state.operatorState.clusterSize;
export const getMaxOperatorFeePerYear = (state: RootState) => state.operatorState.maxOperatorFeePerYear;
export const hasEnoughSelectedOperators = (state: RootState) => state.operatorState.selectedOperators.size === state.operatorState.clusterSize;
export const getOperatorValidatorsLimit = (state: RootState) => state.operatorState.operatorValidatorsLimit;
export const getOperatorFeeData = (state: RootState) => ({
  operatorApprovalBeginTime: state.operatorState.operatorApprovalBeginTime,
  operatorApprovalEndTime: state.operatorState.operatorApprovalEndTime,
  operatorFutureFee: state.operatorState.operatorFutureFee,
  operatorCurrentFee: state.operatorState.operatorCurrentFee
});
export const getFeeIncreaseAndPeriods = (state: RootState) => ({
  getSetOperatorFeePeriod: state.operatorState.getSetOperatorFeePeriod,
  declaredOperatorFeePeriod: state.operatorState.declaredOperatorFeePeriod,
  maxFeeIncrease: state.operatorState.maxFeeIncrease
})
