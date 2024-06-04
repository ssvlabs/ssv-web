import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOperator } from '~app/model/operator.model.ts';
import { RootState } from '~app/store.ts';
import { fromWei } from '~root/services/conversions.service.ts';
import { getMaxOperatorFee, initFeeIncreaseAndPeriods, syncOperatorFeeInfo, updateOperatorValidatorsLimit } from '~root/services/operatorContract.service.ts';

type OperatorStateType = {
  selectedOperators: Record<string, IOperator>;
  clusterSize: number;
  operatorValidatorsLimit: number;
  operatorCurrentFee: string;
  operatorFutureFee: string;
  operatorApprovalBeginTime: string;
  operatorApprovalEndTime: string;
  operatorProcessId: number;
  getSetOperatorFeePeriod: number;
  declaredOperatorFeePeriod: number;
  maxFeeIncrease: number;
  maxOperatorFeePerYear: number;
};

const initialState: OperatorStateType = {
  selectedOperators: {},
  clusterSize: 4,
  operatorValidatorsLimit: 0,
  operatorCurrentFee: '',
  operatorFutureFee: '',
  operatorApprovalBeginTime: '',
  operatorApprovalEndTime: '',
  operatorProcessId: 0,
  maxFeeIncrease: 0,
  getSetOperatorFeePeriod: 0,
  declaredOperatorFeePeriod: 0,
  maxOperatorFeePerYear: 0
};

export const fetchAndSetOperatorValidatorsLimit = createAsyncThunk('operator/fetchAndSetOperatorValidatorsLimit', async () => {
  return await updateOperatorValidatorsLimit();
});

export const fetchAndSetOperatorFeeInfo = createAsyncThunk('operator/fetchAndSetOperatorFeeInfo', async (operatorId: number) => {
  return await syncOperatorFeeInfo(operatorId);
});

export const fetchAndSetFeeIncreaseAndPeriods = createAsyncThunk('operator/fetchAndSetFeeIncreaseAndPeriods', async () => {
  return await initFeeIncreaseAndPeriods();
});
export const fetchAndSetMaxOperatorFee = createAsyncThunk('operator/fetchAndSetMaxOperatorFee', async () => {
  return await getMaxOperatorFee();
});

export const slice = createSlice({
  name: 'operatorState',
  initialState,
  reducers: {
    setOperatorProcessId: (state, action: { payload: number }) => {
      state.operatorProcessId = action.payload;
    },
    selectOperator: (
      state,
      action: {
        payload: { operator: IOperator; selectedIndex: number; clusterBox: number[] };
      }
    ) => {
      if (Object.values(state.selectedOperators).some((operator: IOperator) => operator.id === action.payload.operator.id)) {
        return;
      }
      state.selectedOperators[action.payload.selectedIndex.toString()] = action.payload.operator;
    },
    selectOperators: (state, action: { payload: IOperator[] }) => {
      const newRecord: Record<string, IOperator> = {};
      action.payload.forEach((value: IOperator, index: number) => {
        newRecord[`${index + 1}`] = value;
      });
      state.selectedOperators = newRecord;
    },
    unselectOperator: (state, action: { payload: number }) => {
      delete state.selectedOperators[action.payload.toString()];
    },
    clearAllSettings: (state) => {
      state.maxFeeIncrease = 0;
      state.operatorFutureFee = '';
      state.operatorCurrentFee = '';
      state.getSetOperatorFeePeriod = 0;
      state.operatorApprovalEndTime = '';
      state.declaredOperatorFeePeriod = 0;
      state.operatorApprovalBeginTime = '';
    },
    unselectAllOperators: (state) => {
      state.selectedOperators = {};
    },
    setClusterSize: (state, action: { payload: number }) => {
      state.clusterSize = action.payload;
    },
    clearOperatorFeeInfo: (state) => {
      state.operatorApprovalBeginTime = '';
      state.operatorApprovalEndTime = '';
      state.operatorFutureFee = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAndSetOperatorValidatorsLimit.fulfilled, (state, action: { payload: number }) => {
      state.operatorValidatorsLimit = action.payload;
    });
    builder.addCase(fetchAndSetOperatorFeeInfo.fulfilled, (state, action) => {
      state.operatorApprovalBeginTime = action.payload.operatorApprovalBeginTime;
      state.operatorApprovalEndTime = action.payload.operatorApprovalEndTime;
      state.operatorFutureFee = action.payload.operatorFutureFee;
      state.operatorCurrentFee = action.payload.operatorCurrentFee;
    });
    builder.addCase(fetchAndSetFeeIncreaseAndPeriods.fulfilled, (state, action) => {
      state.getSetOperatorFeePeriod = action.payload.getSetOperatorFeePeriod;
      state.declaredOperatorFeePeriod = action.payload.declaredOperatorFeePeriod;
      state.maxFeeIncrease = action.payload.maxFeeIncrease;
    });
    builder.addCase(fetchAndSetMaxOperatorFee.fulfilled, (state, action) => {
      state.maxOperatorFeePerYear = action.payload;
    });
  }
});

export const operatorStateReducer = slice.reducer;
export const { unselectOperator, unselectAllOperators, selectOperators, selectOperator, setClusterSize, setOperatorProcessId, clearOperatorFeeInfo, clearAllSettings } =
  slice.actions;

export const getSelectedOperatorsFee = (state: RootState) =>
  Object.values(state.operatorState.selectedOperators).reduce((acc: number, operator: IOperator) => {
    return acc + fromWei(operator.fee);
  }, 0);
export const getOperatorProcessId = (state: RootState) => state.operatorState.operatorProcessId;
export const getSelectedOperators = (state: RootState) => state.operatorState.selectedOperators;
export const getClusterSize = (state: RootState) => state.operatorState.clusterSize;
export const getMaxOperatorFeePerYear = (state: RootState) => state.operatorState.maxOperatorFeePerYear;
export const hasEnoughSelectedOperators = (state: RootState) => Object.values(state.operatorState.selectedOperators).length === state.operatorState.clusterSize;
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
});
