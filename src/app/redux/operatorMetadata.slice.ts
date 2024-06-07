import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '~app/store';
import { camelToSnakeFieldsMapping, CountryType, exceptions, FIELD_KEYS, FIELDS, MetadataEntity, OPERATOR_NODE_TYPES } from '~lib/utils/operatorMetadataHelper.ts';
import { IOperator } from '~app/model/operator.model.ts';
import { snakeCase } from 'lodash';
import { getOperatorAvailableLocations, getOperatorNodes } from '~root/services/operator.service.ts';

export interface OperatorMetadataSlice {
  metadata: Map<string, MetadataEntity>;
  locationsData: CountryType[];
  locationsList: Record<string, string>;
}

const initialState: OperatorMetadataSlice = {
  metadata: new Map<string, MetadataEntity>(),
  locationsData: [],
  locationsList: {}
};

export const slice = createSlice({
  name: 'operatorMetadataState',
  initialState,
  reducers: {
    initMetadata(state, { payload }: { payload: IOperator }) {
      const metadata = new Map<string, MetadataEntity>();
      Object.values(FIELD_KEYS).forEach((metadataFieldName) => {
        if (camelToSnakeFieldsMapping.includes(metadataFieldName)) {
          if (metadataFieldName === FIELD_KEYS.MEV_RELAYS) {
            metadata.set(metadataFieldName, {
              ...FIELDS[metadataFieldName],
              value: (payload[exceptions[metadataFieldName]!] as string).split(',') || ''
            });
          } else {
            metadata.set(metadataFieldName, {
              ...FIELDS[metadataFieldName],
              value: payload[exceptions[metadataFieldName]!] || ''
            });
          }
        } else {
          if (metadataFieldName === FIELD_KEYS.OPERATOR_IMAGE) {
            metadata.set(metadataFieldName, {
              ...FIELDS[metadataFieldName],
              imageFileName: payload[metadataFieldName] || ''
            });
          } else {
            metadata.set(metadataFieldName, {
              ...FIELDS[metadataFieldName],
              value: payload[snakeCase(metadataFieldName) as keyof IOperator] || ''
            });
          }
        }
      });
      state.metadata = metadata;
    },
    setMetadataEntity(state, { payload }: { payload: { metadataFieldName: string; value: MetadataEntity } }) {
      state.metadata.set(payload.metadataFieldName, payload.value);
    },
    setMetadataValue(state, { payload }: { payload: { metadataFieldName: string; value: MetadataEntity['value'] } }) {
      const data = state.metadata.get(payload.metadataFieldName)!;
      data.value = payload.value;
      state.metadata.set(payload.metadataFieldName, data);
    },
    setMetadataOptions(state, { payload }: { payload: { metadataFieldName: string; options: MetadataEntity['options'] } }) {
      const data = state.metadata.get(payload.metadataFieldName)!;
      data.options = payload.options;
      state.metadata.set(payload.metadataFieldName, data);
    },
    setErrorMessage(state, { payload }: { payload: { metadataFieldName: string; message: string } }) {
      const data = state.metadata.get(payload.metadataFieldName)!;
      data.errorMessage = payload.message;
      state.metadata.set(payload.metadataFieldName, data);
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

// TODO rename selectors to "select*"

export const getMetadata = (state: RootState) => state.operatorMetadataState.metadata;
export const getLocationsData = (state: RootState) => state.operatorMetadataState.locationsData;
export const getLocationsList = (state: RootState) => state.operatorMetadataState.locationsList;

export const getMetadataEntityByName = createSelector([getMetadata, (_, name) => name], (metadata, name): MetadataEntity => metadata.get(name)!);

export const getMetadataValueByName = createSelector([getMetadataEntityByName], (getMetadataEntity) => getMetadataEntity?.value);
