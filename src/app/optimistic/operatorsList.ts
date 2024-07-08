import { chunk, differenceBy } from 'lodash';
import { IOperator } from '~app/model/operator.model';
import { Pagination } from '~app/redux/account.slice';
import { RootState } from '~app/store';

const getCreatedOptimisticOperators = ({ accountState }: RootState): IOperator[] => {
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
  const optimisticOperators = getCreatedOptimisticOperators(state);
  if (!optimisticOperators.length) return state.accountState.operatorsPagination;

  return {
    ...state.accountState.operatorsPagination,
    total: state.accountState.operatorsPagination.total + optimisticOperators.length,
    pages: Math.ceil((state.accountState.operatorsPagination.total + optimisticOperators.length) / state.accountState.operatorsPagination.per_page)
  };
};

export const getOptimisticOperators = (state: RootState): IOperator[] => {
  const optimisticOperators = getCreatedOptimisticOperators(state);

  const accountOperators = state.accountState.operators.filter((o) => {
    const optimistic = state.accountState.optimisticOperatorsMap[o.id];
    return !optimistic || optimistic.type !== 'deleted';
  });

  if (!optimisticOperators.length) return accountOperators;

  const pages = chunk([...Array(state.accountState.operatorsPagination.total), ...optimisticOperators], state.accountState.operatorsPagination.per_page);
  const optimisticPage = (pages[state.accountState.operatorsPagination.page - 1] || []).filter(Boolean);

  const [pageOperators] = chunk([...accountOperators, ...optimisticPage], state.accountState.operatorsPagination.per_page);
  return pageOperators;
};
