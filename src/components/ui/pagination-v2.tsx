import type { Pagination as IPagination } from "@/types/api";
import { textVariants } from "@/components/ui/text.tsx";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";

type PaginationProps = {
  pagination: IPagination;
};

const Pagination = ({ pagination }: PaginationProps) => {
  const options = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
  const [searchParams, setSearchParams] = useSearchParams();

  const perPage = searchParams.get("perPage");
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("perPage", value.toString());
      return params;
    });
  };

  const handlePageClick = (page: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", page.toString());
      return params;
    });
  };

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
        {pagination.page > 1
          ? pagination.page * pagination.per_page
          : pagination.per_page}
        &nbsp; of&nbsp; {pagination.total}
      </div>
      <div className={`flex items-center gap-10`}>
        <div>
          Rows per page:&nbsp;
          <select
            className="w-[55px] h-[32px] border rounded-md text-center focus:outline-none focus:ring-0"
            defaultValue={perPage || 10}
            onChange={handleChange}
          >
            {options.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className={`flex gap-2`}>
          <Button
            size="icon"
            variant={"ghost"}
            disabled={pagination.page === 1}
            onClick={() => {
              handlePageClick(1);
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
              handlePageClick(pagination.page - 1);
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
              handlePageClick(pagination.page + 1);
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
              handlePageClick(pagination.pages);
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
