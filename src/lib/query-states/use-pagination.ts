import { parseAsInteger, useQueryState } from "nuqs";

export const usePaginationQuery = (params = { page: 1, perPage: 10 }) => {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(params.page),
  );

  const [perPage, _setPerPage] = useQueryState(
    "perPage",
    parseAsInteger.withDefault(params.perPage),
  );

  const setPerPage = (perPage: number) => {
    _setPerPage(perPage);
    setPage(1);
  };

  const next = () => {
    setPage(page + 1);
  };

  const prev = () => {
    setPage(Math.max(1, page - 1));
  };

  return {
    page,
    perPage,
    setPage,
    setPerPage,
    next,
    prev,
  };
};
