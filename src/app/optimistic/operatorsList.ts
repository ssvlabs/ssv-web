import { chunk, differenceBy } from 'lodash';
import { IOperator } from '~app/model/operator.model';
import { Pagination } from '~app/redux/account.slice';
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

const filterUniqueOptimisticOperators = (operators: IOperator[]): IOperator[] => {
  const optimisticOperators = getCachedData();

  const uniques = differenceBy(optimisticOperators, operators, 'id');
  if (uniques.length !== operators.length) setCachedData(uniques);

  return uniques;
};

type Params = {
  operators: IOperator[];
  pagination: Pagination;
};

export const getOptimisticOperators = ({ operators, pagination }: Params): Params => {
  const optimisticOperators = filterUniqueOptimisticOperators(operators);
  if (!optimisticOperators.length) return { operators, pagination };

  const pages = chunk([...Array(pagination.total), ...optimisticOperators], pagination.per_page);
  const optimisticPage = (pages[pagination.page - 1] || []).filter(Boolean);

  const [pageOperators] = chunk([...operators, ...optimisticPage], pagination.per_page);
  return {
    operators: pageOperators,
    pagination: {
      ...pagination,
      total: pagination.total + optimisticOperators.length,
      pages: pages.length
    }
  };
};
