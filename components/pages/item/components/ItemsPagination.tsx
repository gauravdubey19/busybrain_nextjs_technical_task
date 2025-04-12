"use client";

import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

type ItemsPaginationProps = {
  loading: boolean;
  totalPages: number;
  currentPage: number;
  page: number;
  limit: number;
  itemsLength: number;
  handleRefresh: () => void;
};

const ItemsPagination: React.FC<ItemsPaginationProps> = ({
  loading,
  totalPages,
  currentPage,
  page,
  limit,
  itemsLength,
  handleRefresh,
}) => {
  const router = useRouter();
  return (
    <>
      <div className="w-full p-4 flex-between flex-col md:flex-row gap-6 border-t border-zinc-400 dark:border-zinc-600 mt-8">
        <div className="w-full md:max-w-2xl flex-1 flex-between">
          <Button
            onClick={handleRefresh}
            type="button"
            variant="secondary"
            size="sm"
            effect="gooeyLeft"
            disabled={loading || itemsLength === 0}
            className={loading ? "animate-pulse" : ""}
          >
            {loading && <LoaderIcon className="animate-spin mr-2" />}
            Refresh
          </Button>
          <div className="text-lg text-zinc-600 dark:text-zinc-400 font-iceland">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`/items?page=1&limit=${limit}`)}
            // onClick={() =>
            //   router.push({
            //     pathname: "/items",
            //     query: { page: 1, limit: limit },
            //   })
            // }
            size="icon"
            variant="outline"
            effect="gooeyLeft"
            disabled={currentPage === 1 || loading}
            title="Go to First Page"
            className="w-8 h-8 p-0 bg-zinc-200 dark:bg-zinc-700"
          >
            <MdOutlineKeyboardDoubleArrowLeft className="w-5 h-5" />
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/items?page=${Math.max(1, currentPage - 1)}&limit=${limit}`
              )
            }
            size="icon"
            variant="outline"
            effect="gooeyLeft"
            disabled={currentPage === 1 || loading}
            title="Go to Previous Page"
            className="w-8 h-8 p-0 bg-zinc-200 dark:bg-zinc-700"
          >
            <MdKeyboardArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-1 px-2 font-iceland text-lg">
            <span className="font-medium">{1}</span>
            {currentPage >= 2 && <span className="px-2">...</span>}
            {currentPage > 1 && currentPage <= totalPages && currentPage}
            {" / "}
            <span className="font-medium">{totalPages}</span>
          </div>

          <Button
            onClick={() =>
              router.push(
                `/items?page=${
                  totalPages !== page ? page + 1 : totalPages
                }&limit=${limit}`
              )
            }
            size="icon"
            variant="outline"
            effect="gooeyLeft"
            disabled={currentPage === totalPages || loading}
            title="Go to Next Page"
            className="w-8 h-8 p-0 bg-zinc-200 dark:bg-zinc-700"
          >
            <MdKeyboardArrowRight className="w-5 h-5" />
          </Button>

          <Button
            onClick={() =>
              router.push(`/items?page=${totalPages}&limit=${limit}`)
            }
            size="icon"
            variant="outline"
            effect="gooeyLeft"
            disabled={currentPage === totalPages || loading}
            title="Go to Last Page"
            className="w-8 h-8 p-0 bg-zinc-200 dark:bg-zinc-700"
          >
            <MdOutlineKeyboardDoubleArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ItemsPagination;
