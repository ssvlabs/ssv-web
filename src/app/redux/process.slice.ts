import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~app/store';
import { ProcessType, RegisterOperator, RegisterValidator, SingleCluster, SingleOperator } from '~app/model/processes.model.ts';

export type PossibleProcesses = RegisterValidator | RegisterOperator | SingleCluster | SingleOperator;

export interface ProcessSliceState {
  type: ProcessType | undefined;
  process: PossibleProcesses | undefined;
}

const initialState: ProcessSliceState = {
  type: undefined,
  process: undefined
};

export const slice = createSlice({
  name: 'processState',
  initialState,
  reducers: {
    setProcessAndType(state: ProcessSliceState, action: { payload: { process: PossibleProcesses; type: ProcessType } }) {
      state.type = action.payload.type;
      state.process = action.payload.process;
    },
    modifyProcess(state, action: { payload: Partial<RegisterValidator | RegisterOperator | SingleCluster | SingleOperator> }) {
      state.process = Object.assign({}, state.process, action.payload);
    }
  }
});

export const processStateReducer = slice.reducer;

export const { setProcessAndType, modifyProcess } = slice.actions;

export const getProcessItem = <T extends Exclude<PossibleProcesses, RegisterValidator>>(state: RootState): T['item'] => (state.processState.process as T | undefined)?.item;
export const getProcess = (state: RootState) => state.processState.process;
export const getType = (state: RootState) => state.processState.type;
export const getIsValidatorFlow = (state: RootState) => state.processState.type === ProcessType.Validator;
export const getIsSecondRegistration = (state: RootState) => state.processState.process && 'registerValidator' in state.processState.process;
