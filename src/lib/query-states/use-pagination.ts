import { parseAsInteger, useQueryState } from "nuqs";

export const usePaginationQuery = () => {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({
      history: "push",
    }),
  );

  const [perPage, _setPerPage] = useQueryState(
    "perPage",
    parseAsInteger.withDefault(10).withOptions({
      history: "push",
    }),
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
