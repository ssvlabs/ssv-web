import { chunk } from 'lodash';
import { IOperator } from '~app/model/operator.model';
import { Pagination } from '~app/redux/account.slice';
import { tryCatch } from '~lib/utils/tryCatch';

type OptimisticOperators = {
  operators: IOperator[];
  pagination: {
    total: number;
  };
};

const operatorCacheKey = 'newOperatorCache';

type Params = {
  operators: IOperator[];
  pagination: Pagination;
};

const getCachedData = (): OptimisticOperators | null => {
  return tryCatch(() => {
    const stored = localStorage.getItem(operatorCacheKey);
    return stored ? (JSON.parse(stored) as OptimisticOperators) : null;
  }, null);
};

const setCachedData = (data: OptimisticOperators): void => {
  tryCatch(() => {
    localStorage.setItem(operatorCacheKey, JSON.stringify(data));
  }, null);
};

export const updateOptimisticPagination = (pagination: Pagination): void => {
  const cached = getCachedData();
  if (!cached) return;
  const totalDiff = pagination.total - cached.pagination.total;
  setCachedData({ operators: cached.operators.slice(totalDiff), pagination });
};

export const clearOptimisticOperators = (): void => {
  localStorage.removeItem(operatorCacheKey);
};

export const addOptimisticOperators = ({ operators, pagination }: Params): void => {
  const cached = getCachedData();
  if (!cached) return setCachedData({ operators, pagination });
  const newOperators = [...cached.operators, ...operators];
  setCachedData({ operators: newOperators, pagination });
};

export const getOptimisticOperators = ({ operators, pagination }: Params): Params => {
  const cached = getCachedData();
  if (!cached) return { operators, pagination };

  const optimistic = chunk([...Array(pagination.total), ...(cached.operators || [])], pagination.per_page);
  const optimisticPage = (optimistic[pagination.page - 1] || []).filter(Boolean);

  const [pageOperators] = chunk([...operators, ...optimisticPage], pagination.per_page);
  return {
    operators: pageOperators,
    pagination: {
      ...pagination,
      total: cached.pagination.total,
      pages: optimistic.length
    }
  };
};
