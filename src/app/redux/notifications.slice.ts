import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~app/store';
import { AlertColor } from '@mui/material/Alert';

export interface NotificationsState {
  message: string;
  messageSeverity: AlertColor;
}

const initialState: NotificationsState = {
  message: '',
  messageSeverity: 'info',
};

export const slice = createSlice({
  name: 'notificationsState',
  initialState,
  reducers: {
    setMessageAndSeverity: (state, action: { payload: { message: string, severity: AlertColor } }) => {
      state.message = action.payload.message;
      state.messageSeverity = action.payload.severity;
    },
    clearMessage: (state) => {
      state.message = '';
      state.messageSeverity = 'info';
    },
  },
});

export const notificationsStateReducer = slice.reducer;

export const { setMessageAndSeverity, clearMessage } = slice.actions;

export const getMessageAndSeverity = (state: RootState) => ({ message: state.notificationsState.message, severity: state.notificationsState.messageSeverity });
