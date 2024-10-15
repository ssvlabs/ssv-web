import { useState } from "react";
import type { OrderBy, Sort } from "@/api/operator.ts";

export const useOrdering = () => {
  const [orderBy, setOrderBy] = useState<OrderBy>("id");
  const [sort, setSort] = useState<Sort>("asc");
  const [ordering, setOrdering] = useState<`${OrderBy}:${Sort}`>(
    `${orderBy}:${sort}`,
  );

  const handleOrdering = (orderBy: OrderBy) => {
    let newOrderBy: OrderBy = orderBy;
    let newSort: Sort = "desc";
    if (ordering.includes(orderBy)) {
      if (ordering.includes("asc")) {
        newOrderBy = "id";
        newSort = "asc";
      } else {
        newSort = "asc";
      }
    }
    setOrderBy(newOrderBy);
    setSort(newSort);
    setOrdering(`${newOrderBy}:${newSort}`);
  };

  return { orderBy, sort, ordering, handleOrdering };
};
