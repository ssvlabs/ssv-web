import { chunk, differenceBy } from 'lodash';
import { IOperator } from '~app/model/operator.model';
import { Pagination } from '~app/redux/account.slice';
import { RootState } from '~app/store';
import { tryCatch } from '~lib/utils/tryCatch';

const storageKey = 'operatorsList';

const getCachedData = (): IOperator[] => {
  return tryCatch(() => {
    const stored = localStorage.getItem(storageKey);
    const parsed = JSON.parse(stored!);
    return Array.isArray(parsed) ? parsed : [];
  }, [] as IOperator[]);
};

const setCachedData = (data: IOperator[]): void => {
  tryCatch(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, null);
};

export const addOptimisticOperators = (operators: IOperator[]): void => {
  const optimisticOperators = getCachedData();
  if (!optimisticOperators) return setCachedData(operators);
  const newOperators = [...optimisticOperators, ...operators].map((operator) => ({ ...operator, isOptimistic: true }));
  setCachedData(newOperators);
};

const filterUniqueOptimisticOperators = ({ accountState }: RootState): IOperator[] => {
  const optimisticOperators = Object.values(accountState.optimisticOperatorsMap)
    .filter((o) => o.type === 'created')
    .map((o) => o.operator);

  const uniques = differenceBy(optimisticOperators, accountState.operators, 'id');
  if (uniques.length !== accountState.operators.length) {
    // TODO: remove duplicates from state
  }
  return uniques;
};

export const getOperatorOptimisticPagination = (state: RootState): Pagination => {
  const optimisticOperators = filterUniqueOptimisticOperators(state);
  if (!optimisticOperators.length) return state.accountState.operatorsPagination;

  return {
    ...state.accountState.operatorsPagination,
    total: state.accountState.operatorsPagination.total + optimisticOperators.length,
    pages: Math.ceil((state.accountState.operatorsPagination.total + optimisticOperators.length) / state.accountState.operatorsPagination.per_page)
  };
};

export const getOptimisticOperators = (state: RootState): IOperator[] => {
  const optimisticOperators = filterUniqueOptimisticOperators(state);
  if (!optimisticOperators.length) return state.accountState.operators;

  const pages = chunk([...Array(state.accountState.operatorsPagination.total), ...optimisticOperators], state.accountState.operatorsPagination.per_page);
  const optimisticPage = (pages[state.accountState.operatorsPagination.page - 1] || []).filter(Boolean);

  const [pageOperators] = chunk([...state.accountState.operators, ...optimisticPage], state.accountState.operatorsPagination.per_page);
  return pageOperators;
};
