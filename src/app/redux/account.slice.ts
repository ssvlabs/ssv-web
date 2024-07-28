import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { set, unset } from 'lodash';
import { DEFAULT_PAGINATION } from '~app/common/config/config';
import { ICluster } from '~app/model/cluster.model';
import { IOperator } from '~app/model/operator.model';
import { IValidator } from '~app/model/validator.model';
import { getOperatorOptimisticPagination, getOptimisticOperators } from '~app/optimistic/operatorsList';
import { RootState, store } from '~app/store';
import { add0x } from '~lib/utils/strings';
import { getClustersByOwnerAddress } from '~root/services/cluster.service';
import { getOperatorsByOwnerAddress } from '~root/services/operator.service';

export interface Pagination {
  page: number;
  pages: number;
  total: number;
  per_page: number;
}

type OptimisticType = 'created' | 'updated' | 'deleted';

type OptimisticOperatorChanges = {
  operator: IOperator;
  type: OptimisticType;
};

type OptimisticOperatorsMap = {
  [id: string]: OptimisticOperatorChanges | undefined;
};

type OptimisticClusterChanges = {
  cluster: ICluster;
  type: OptimisticType;
};

type OptimisticClustersMap = {
  [id: string]: OptimisticClusterChanges | undefined;
};

type OptimisticValidatorChanges = OptimisticType;
type OptimisticValidatorMap = {
  [clusterId: string]: {
    [validatorPk: string]: OptimisticValidatorChanges;
  };
};

export interface AccountState {
  operators: IOperator[];
  optimisticOperatorsMap: OptimisticOperatorsMap;
  isFetchingOperators: boolean;
  operatorsPagination: Pagination;
  clusters: ICluster[];
  optimisticClustersMap: OptimisticClustersMap;
  optimisticValidatorsMap: OptimisticValidatorMap;
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
  optimisticClustersMap: {},
  optimisticValidatorsMap: {},
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
    setOptimisticOperator: (state, action: { payload: OptimisticOperatorChanges }) => {
      const id = action.payload.operator.id.toString();

      const prevChange = state.optimisticOperatorsMap[id];
      const isUpdate = action.payload.type === 'updated';

      state.optimisticOperatorsMap[id] = {
        ...action.payload,
        type: prevChange && isUpdate ? prevChange.type : action.payload.type
      };
    },
    removeOptimisticOperator: (state, action: { payload: number }) => {
      delete state.optimisticOperatorsMap[action.payload?.toString()];
    },
    setOptimisticCluster: (state, action: { payload: OptimisticClusterChanges }) => {
      const id = action.payload.cluster.clusterId;
      state.optimisticClustersMap[id] = action.payload;
    },
    removeOptimisticCluster: (state, action: { payload: string }) => {
      delete state.optimisticClustersMap[action.payload?.toString()];
    },
    setOptimisticValidator: (state, action: { payload: { clusterId: ICluster['clusterId']; publicKeys: string[]; type: OptimisticType } }) => {
      for (const publicKey of action.payload.publicKeys) {
        const formattedPK = add0x(publicKey).toLocaleLowerCase();
        set(state.optimisticValidatorsMap, [action.payload.clusterId, formattedPK], action.payload.type satisfies OptimisticValidatorChanges);
      }
    },
    removeOptimisticValidator: (state, action: { payload: { clusterId: ICluster['clusterId']; publicKey: string } }) => {
      const publicKey = add0x(action.payload.publicKey).toLocaleLowerCase();
      unset(state.optimisticValidatorsMap, [action.payload.clusterId, publicKey]);
    },
    setExcludedCluster: (state, action: { payload: ICluster | null }) => {
      state.excludedCluster = action.payload;
    },
    removeCluster: (state, action: { payload: string }) => {
      state.clusters = state.clusters.filter((c) => c.clusterId !== action.payload);
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

export const {
  resetPagination,
  setExcludedCluster,
  setOptimisticOperator,
  removeOptimisticOperator,
  setOptimisticCluster,
  removeOptimisticCluster,
  setSelectedClusterId,
  setSelectedOperatorId,
  sortOperatorsByStatus,
  setOptimisticValidator,
  removeCluster,
  reset
} = slice.actions;

export const getAccountOperators = getOptimisticOperators;
// export const getIsFetchingOperators = (state: RootState) => state.accountState.isFetchingOperators;
export const getOperatorsPagination = getOperatorOptimisticPagination;
export const getAccountClusters = (state: RootState) =>
  state.accountState.clusters.map((c) => {
    const cluster = state.accountState.optimisticClustersMap[c.clusterId.toString()]?.cluster || c;
    return addOptimisticOperatorsToCluster(state, cluster);
  });

// export const getIsFetchingClusters = (state: RootState) => state.accountState.isFetchingClusters;
export const getClustersPagination = (state: RootState) => state.accountState.clustersPagination;

type OptimisticValidatorOptions = {
  clusterId: ICluster['clusterId'];
  validators: IValidator[];
};

export const getOptimisticDeletedValidators = (state: RootState, clusterId: ICluster['clusterId']) => {
  return Object.keys(state.accountState.optimisticValidatorsMap[clusterId] || {});
};

export const removeOptimisticDeletedValidators = (state: RootState, { clusterId, validators }: OptimisticValidatorOptions) => {
  const optimisticValidators = state.accountState.optimisticValidatorsMap[clusterId];
  if (!optimisticValidators) return validators;

  return validators.filter((validator) => {
    const publicKey = add0x(validator.public_key).toLocaleLowerCase();
    return !Boolean(optimisticValidators[publicKey]);
  });
};

export const addOptimisticOperatorsToCluster = (state: RootState, cluster: ICluster) => {
  const clusterOperators = cluster.operators.map((operator) => state.accountState.optimisticOperatorsMap[operator.id.toString()]?.operator || operator);
  return { ...cluster, operators: clusterOperators };
};

export const getSelectedCluster = (state: RootState): ICluster => {
  if (state.accountState.excludedCluster) {
    const optimisticCluster = state.accountState.optimisticClustersMap[state.accountState.excludedCluster.clusterId.toString()];
    if (!optimisticCluster) return addOptimisticOperatorsToCluster(state, state.accountState.excludedCluster);
    if (optimisticCluster.cluster.updatedAt === state.accountState.excludedCluster.updatedAt) return addOptimisticOperatorsToCluster(state, optimisticCluster.cluster);
    return addOptimisticOperatorsToCluster(state, state.accountState.excludedCluster);
  }

  if (!state.accountState.selectedClusterId) return {} as ICluster;

  const selectedCluster = state.accountState.clusters.find((cluster: ICluster) => cluster.clusterId === state.accountState.selectedClusterId);
  if (!selectedCluster) return {} as ICluster;

  const optimisticCluster = state.accountState.optimisticClustersMap[state.accountState.selectedClusterId];
  if (!optimisticCluster) return addOptimisticOperatorsToCluster(state, selectedCluster);

  if (optimisticCluster.cluster.updatedAt === selectedCluster.updatedAt) return addOptimisticOperatorsToCluster(state, optimisticCluster.cluster);
  store.dispatch(removeOptimisticCluster(optimisticCluster.cluster.clusterId));
  return addOptimisticOperatorsToCluster(state, selectedCluster);
};

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
