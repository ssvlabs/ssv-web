import type { Pagination as IPagination } from "@/types/api";
import { textVariants } from "@/components/ui/text.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
  FaChevronDown,
} from "react-icons/fa6";
import { usePaginationQuery } from "@/lib/query-states/use-pagination";

type PaginationProps = {
  pagination: IPagination;
};

const Pagination = ({ pagination }: PaginationProps) => {
  const options = [10, 25, 50, 100];
  const paginationQuery = usePaginationQuery();
  return (
    <div
      className={`${textVariants({ variant: "body-3-medium" })} text-gray-600 h-[60px] w-full flex items-center justify-between px-6 py-3.5`}
    >
      <div
        className={`${textVariants({ variant: "body-3-medium" })} text-gray-600`}
      >
        {pagination.page > 1
          ? (pagination.page - 1) * pagination.per_page
          : pagination.page}
        &nbsp;-&nbsp;
        {pagination.has_next_page
          ? pagination.page > 1
            ? pagination.page * pagination.per_page
            : pagination.per_page
          : pagination.total}
        &nbsp; of&nbsp; {pagination.total}
      </div>
      <div className={`flex items-center gap-10`}>
        <div>
          Rows per page:&nbsp;
          <div className="relative inline-block">
            <select
              className="w-[60px] h-[32px] pl-2 pr-6 border rounded-md text-center focus:outline-none focus:ring-0 bg-gray-50 border-gray-400 appearance-none"
              value={paginationQuery.perPage}
              onChange={(event) => {
                paginationQuery.setPerPage(parseInt(event.target.value));
              }}
            >
              {options.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
              <FaChevronDown className="size-2.5" />
            </div>
          </div>
        </div>
        <div className={`flex gap-2`}>
          <Button
            size="icon"
            variant={"ghost"}
            disabled={pagination.page === 1}
            onClick={() => {
              paginationQuery.setPage(1);
            }}
            className={
              "size-8 rounded-[8px] border border-gray-400 flex items-center justify-center cursor-pointer"
            }
          >
            <FaAnglesLeft />
          </Button>
          <Button
            size="icon"
            variant={"ghost"}
            disabled={pagination.page === 1}
            onClick={() => {
              paginationQuery.prev();
            }}
            className={
              "size-8 rounded-[8px] border border-gray-400 flex items-center justify-center cursor-pointer"
            }
          >
            <FaAngleLeft />
          </Button>
          <Button
            size="icon"
            variant={"ghost"}
            disabled={pagination.page === pagination.pages}
            onClick={() => {
              paginationQuery.next();
            }}
            className={
              "size-8 rounded-[8px] border border-gray-400 flex items-center justify-center cursor-pointer"
            }
          >
            <FaAngleRight />
          </Button>
          <Button
            size="icon"
            variant={"ghost"}
            disabled={pagination.page === pagination.pages}
            onClick={() => {
              paginationQuery.setPage(pagination.pages);
            }}
            className={
              "size-8 rounded-[8px] border border-gray-400 flex items-center justify-center cursor-pointer"
            }
          >
            <FaAnglesRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { Pagination };
