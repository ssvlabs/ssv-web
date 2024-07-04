import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '~app/store';
import { camelToSnakeFieldsMapping, CountryType, exceptions, FIELD_KEYS, FIELDS, MetadataEntity, OPERATOR_NODE_TYPES } from '~lib/utils/operatorMetadataHelper.ts';
import { IOperator } from '~app/model/operator.model.ts';
import { snakeCase } from 'lodash';
import { getOperatorAvailableLocations, getOperatorNodes } from '~root/services/operator.service.ts';

export interface OperatorMetadataSlice {
  metadata: Record<FIELD_KEYS, MetadataEntity>;
  locationsData: CountryType[];
  locationsList: Record<string, string>;
}

const initialState: OperatorMetadataSlice = {
  metadata: {} as Record<FIELD_KEYS, MetadataEntity>,
  locationsData: [],
  locationsList: {}
};

export const slice = createSlice({
  name: 'operatorMetadataState',
  initialState,
  reducers: {
    initMetadata(state, { payload }: { payload: IOperator }) {
      const metadata = {} as Record<FIELD_KEYS, MetadataEntity>;
      Object.values(FIELD_KEYS).forEach((metadataFieldName) => {
        if (camelToSnakeFieldsMapping.includes(metadataFieldName)) {
          if (metadataFieldName === FIELD_KEYS.MEV_RELAYS) {
            metadata[metadataFieldName] = {
              ...FIELDS[metadataFieldName],
              value: (payload[exceptions[metadataFieldName]!] as string).split(',') || ''
            };
          } else {
            metadata[metadataFieldName] = {
              ...FIELDS[metadataFieldName],
              value: payload[exceptions[metadataFieldName]!] || ''
            };
          }
        } else {
          if (metadataFieldName === FIELD_KEYS.OPERATOR_IMAGE) {
            metadata[metadataFieldName] = {
              ...FIELDS[metadataFieldName],
              imageFileName: payload[metadataFieldName] || ''
            };
          } else {
            metadata[metadataFieldName] = {
              ...FIELDS[metadataFieldName],
              value: payload[snakeCase(metadataFieldName) as keyof IOperator] || ''
            };
          }
        }
      });
      state.metadata = metadata;
    },
    setMetadataEntity(state, { payload }: { payload: { metadataFieldName: FIELD_KEYS; value: MetadataEntity } }) {
      state.metadata[payload.metadataFieldName] = payload.value;
    },
    setMetadataValue(state, { payload }: { payload: { metadataFieldName: FIELD_KEYS; value: MetadataEntity['value'] } }) {
      const data = state.metadata[payload.metadataFieldName];
      data.value = payload.value;
      // state.metadata[payload.metadataFieldName] = data;
    },
    setMetadataOptions(state, { payload }: { payload: { metadataFieldName: FIELD_KEYS; options: MetadataEntity['options'] } }) {
      const data = state.metadata[payload.metadataFieldName];
      data.options = payload.options;
      // state.metadata[payload.metadataFieldName] = data;
    },
    setErrorMessage(state, { payload }: { payload: { metadataFieldName: FIELD_KEYS; message: string } }) {
      const data = state.metadata[payload.metadataFieldName];
      data.errorMessage = payload.message;
      // state.metadata[payload.metadataFieldName] = data;
    },
    setLocations(state, { payload }: { payload: CountryType[] }) {
      payload.forEach((option: CountryType) => {
        state.locationsList[`${option.name} (${option['alpha-3']})`] = option.name;
      });
      state.locationsData = payload;
    }
  }
});

export const operatorMetadataReducer = slice.reducer;

export const { initMetadata, setMetadataEntity, setMetadataValue, setErrorMessage, setMetadataOptions, setLocations } = slice.actions;

export const updateOperatorNodeOptions = createAsyncThunk('operatorMetadata/updateOperatorNodeOptions', async (_, thunkAPI) => {
  for (const key of Object.keys(OPERATOR_NODE_TYPES) as (keyof typeof OPERATOR_NODE_TYPES)[]) {
    const options = await getOperatorNodes(OPERATOR_NODE_TYPES[key]);
    thunkAPI.dispatch(setMetadataOptions({ metadataFieldName: key, options }));
  }
});

export const updateOperatorLocations = createAsyncThunk('operatorMetadata/updateOperatorLocations', async (_, thunkAPI) => {
  const options: CountryType[] = await getOperatorAvailableLocations();
  thunkAPI.dispatch(setLocations(options));
});

// SELECTORS

export const selectMetadata = (state: RootState) => state.operatorMetadataState.metadata;
export const selectLocationsData = (state: RootState) => state.operatorMetadataState.locationsData;
export const selectLocationsList = (state: RootState) => state.operatorMetadataState.locationsList;

export const selectMetadataEntityByName = createSelector([selectMetadata, (_, name: FIELD_KEYS) => name], (metadata, name): MetadataEntity => metadata[name]);

export const selectMetadataValueByName = createSelector([selectMetadataEntityByName], (getMetadataEntity) => getMetadataEntity?.value);
