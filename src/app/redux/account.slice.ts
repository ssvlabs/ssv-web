import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DEFAULT_PAGINATION } from '~app/common/config/config';
import { ICluster } from '~app/model/cluster.model';
import { IOperator } from '~app/model/operator.model';
import { getOperatorOptimisticPagination, getOptimisticOperators } from '~app/optimistic/operatorsList';
import { RootState, store } from '~app/store';
import { getClustersByOwnerAddress } from '~root/services/cluster.service';
import { getOperatorsByOwnerAddress } from '~root/services/operator.service';

export interface Pagination {
  page: number;
  pages: number;
  total: number;
  per_page: number;
}

type ModifiedOperatorData = {
  operator: IOperator;
  type: 'created' | 'updated' | 'deleted';
};

type ModifiedOperatorMap = {
  [id: string]: ModifiedOperatorData;
};

export interface AccountState {
  operators: IOperator[];
  optimisticOperatorsMap: ModifiedOperatorMap;
  isFetchingOperators: boolean;
  operatorsPagination: Pagination;
  clusters: ICluster[];
  isFetchingClusters: boolean;
  clustersPagination: Pagination;
  selectedClusterId: string | undefined;
  selectedOperatorId: number | undefined;
  excludedCluster: ICluster | null;
}

const initialState: AccountState = {
  operators: [] as IOperator[],
  optimisticOperatorsMap: {},
  isFetchingOperators: false,
  operatorsPagination: DEFAULT_PAGINATION,
  clusters: [] as ICluster[],
  isFetchingClusters: false,
  clustersPagination: DEFAULT_PAGINATION,
  selectedClusterId: undefined,
  selectedOperatorId: undefined,
  excludedCluster: null
};

export const fetchOperators = createAsyncThunk(
  'account/fetchOperators',
  async (
    {
      forcePage,
      forcePerPage
    }: {
      forcePage?: number;
      forcePerPage?: number;
    },
    thunkApi
  ) => {
    const state = thunkApi.getState() as RootState;
    const accountAddress = state.walletState.accountAddress;
    const { page, per_page } = state.accountState.operatorsPagination;
    return await getOperatorsByOwnerAddress({
      page: forcePage ?? page,
      perPage: forcePerPage ?? per_page,
      accountAddress
    });
  }
);

export const fetchClusters = createAsyncThunk(
  'account/fetchClusters',
  async (
    {
      forcePage,
      forcePerPage
    }: {
      forcePage?: number;
      forcePerPage?: number;
    },
    thunkApi
  ) => {
    const state = thunkApi.getState() as RootState;
    const accountAddress = state.walletState.accountAddress;
    const liquidationCollateralPeriod = state.networkState.liquidationCollateralPeriod;
    const minimumLiquidationCollateral = state.networkState.minimumLiquidationCollateral;
    const { page, per_page } = state.accountState.clustersPagination;
    return await getClustersByOwnerAddress({
      page: forcePage ?? page,
      perPage: forcePerPage ?? per_page,
      accountAddress,
      liquidationCollateralPeriod,
      minimumLiquidationCollateral
    });
  }
);

export const refreshOperatorsAndClusters = createAsyncThunk('account/refreshOperatorsAndClusters', async (_, thunkApi) => {
  await thunkApi.dispatch(fetchOperators({}));
  await thunkApi.dispatch(fetchClusters({}));
});

export const slice = createSlice({
  name: 'accountState',
  initialState,
  reducers: {
    resetPagination: (state) => {
      state.operatorsPagination = DEFAULT_PAGINATION;
      state.clustersPagination = DEFAULT_PAGINATION;
    },
    setSelectedClusterId: (state, action: { payload: AccountState['selectedClusterId'] }) => {
      state.selectedClusterId = action.payload;
    },
    setSelectedOperatorId: (state, action: { payload: AccountState['selectedOperatorId'] }) => {
      state.selectedOperatorId = action.payload;
    },
    setOptimisticOperator: (state, action: { payload: ModifiedOperatorData }) => {
      const prevOperator = state.optimisticOperatorsMap[action.payload.operator.id.toString()];
      const isUpdate = action.payload.type === 'updated';

      state.optimisticOperatorsMap[action.payload.operator.id.toString()] = {
        ...action.payload,
        type: prevOperator && isUpdate ? prevOperator.type : action.payload.type
      };
    },
    removeOptimisticOperator: (state, action: { payload: number }) => {
      delete state.optimisticOperatorsMap[action.payload?.toString()];
    },
    setExcludedCluster: (state, action: { payload: ICluster | null }) => {
      state.excludedCluster = action.payload;
    },
    sortOperatorsByStatus: (state) => {
      state.operators = state.operators.sort((a: any, b: any) => {
        if (a.status === 'Inactive') {
          return -1;
        } else if (b.status === 'Inactive') {
          return 1;
        } else if (a.status === 'Active') {
          return b.status === 'No Validators' ? -1 : -1;
        } else {
          return b.status === 'No Validators' ? 0 : 1;
        }
      });
    },
    reset: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOperators.pending, (state) => {
      state.isFetchingOperators = true;
    });
    builder.addCase(fetchOperators.fulfilled, (state, action) => {
      state.operators = action.payload.operators;
      state.operatorsPagination = action.payload.pagination;
      state.isFetchingOperators = false;
    });
    builder.addCase(fetchOperators.rejected, (state) => {
      state.isFetchingOperators = false;
    });

    builder.addCase(fetchClusters.pending, (state) => {
      state.isFetchingClusters = true;
    });
    builder.addCase(fetchClusters.fulfilled, (state, action) => {
      state.clusters = action.payload.clusters;
      state.clustersPagination = action.payload.pagination;
      state.isFetchingClusters = false;
    });
    builder.addCase(fetchClusters.rejected, (state) => {
      state.isFetchingClusters = false;
    });
  }
});

export const accountStateReducer = slice.reducer;

export const { resetPagination, setExcludedCluster, setOptimisticOperator, removeOptimisticOperator, setSelectedClusterId, setSelectedOperatorId, sortOperatorsByStatus, reset } =
  slice.actions;

export const getAccountOperators = getOptimisticOperators;
// export const getIsFetchingOperators = (state: RootState) => state.accountState.isFetchingOperators;
export const getOperatorsPagination = getOperatorOptimisticPagination;
export const getAccountClusters = (state: RootState) => state.accountState.clusters;
// export const getIsFetchingClusters = (state: RootState) => state.accountState.isFetchingClusters;
export const getClustersPagination = (state: RootState) => state.accountState.clustersPagination;
export const getSelectedCluster = (state: RootState) =>
  state.accountState.excludedCluster || state.accountState.clusters.find((cluster: ICluster) => cluster.clusterId === state.accountState.selectedClusterId) || ({} as ICluster);

export const getSelectedOperator = (state: RootState) => {
  const selectedOperator = getAccountOperators(state).find((operator: IOperator) => operator.id === state.accountState.selectedOperatorId);

  if (!selectedOperator) return undefined;

  const optimisticOperator = state.accountState.optimisticOperatorsMap[selectedOperator.id.toString()];
  if (!optimisticOperator) return selectedOperator;

  if (optimisticOperator.operator.updated_at === selectedOperator.updated_at) return optimisticOperator.operator;
  store.dispatch(removeOptimisticOperator(optimisticOperator.operator.id));
  return selectedOperator;
};

export const getSelectedOperatorId = (state: RootState) => state.accountState.selectedOperatorId;
export const getIsClusterSelected = (state: RootState) => Boolean(state.accountState.selectedClusterId);
