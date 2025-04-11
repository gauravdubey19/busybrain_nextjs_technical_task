"use client";

import { useState } from "react";
// import Link from "next/link";
import { getItems } from "@/lib/actions/items.actions";
import { ItemsProps, Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

import PostCard from "@/components/ui/post-card";

const Items: React.FC<ItemsProps> = ({
  posts,
  // total,
  page,
  totalPages: totalPagesNumbers,
}) => {
  const [items, setItems] = useState<Post[]>(posts);
  // const [totalItems, setTotalItems] = useState<number>(total);
  const [totalPages, setTotalPages] = useState<number>(totalPagesNumbers);
  const [pageItems, setPageItems] = useState<number>(posts.length);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchItems = async (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage)
      return;

    try {
      setLoading(true);
      const result = await getItems(pageNumber);
      setItems(result.posts);
      // setTotalItems(result.total);
      setTotalPages(result.totalPages);
      setPageItems(result.posts.length);
      setCurrentPage(pageNumber);
    } catch (error) {
      console.error(`Error fetching page ${pageNumber}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      await fetchItems(currentPage - 1);
    }
  };

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      await fetchItems(currentPage + 1);
    }
  };

  const handleFirstPage = async () => {
    if (currentPage > 1) {
      await fetchItems(1);
    }
  };

  const handleLastPage = async () => {
    if (currentPage < totalPages) {
      await fetchItems(totalPages);
    }
  };

  const handleRefresh = async () => {
    await fetchItems(currentPage);
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Items ({pageItems})</h2>

      {items.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">No items found</div>
      )}

      <div className="w-full p-4 flex-between border-t border-zinc-400 dark:border-zinc-600 mt-8">
        <Button
          onClick={handleRefresh}
          type="button"
          variant="secondary"
          size="sm"
          effect="gooeyLeft"
          disabled={loading || items.length === 0}
          className={loading ? "animate-pulse" : ""}
        >
          {loading && <LoaderIcon className="animate-spin mr-2" />}
          Refresh
        </Button>
        <div className="text-lg text-zinc-600 dark:text-zinc-400 font-iceland">
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            effect="gooeyLeft"
            onClick={handleFirstPage}
            disabled={currentPage === 1 || loading}
            title="Go to First Page"
            className="w-8 h-8 p-0 bg-zinc-200 dark:bg-zinc-700"
          >
            <MdOutlineKeyboardDoubleArrowLeft className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            effect="gooeyLeft"
            onClick={handlePrevPage}
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
            size="icon"
            variant="outline"
            effect="gooeyLeft"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            title="Go to Next Page"
            className="w-8 h-8 p-0 bg-zinc-200 dark:bg-zinc-700"
          >
            <MdKeyboardArrowRight className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            effect="gooeyLeft"
            onClick={handleLastPage}
            disabled={currentPage === totalPages || loading}
            title="Go to Last Page"
            className="w-8 h-8 p-0 bg-zinc-200 dark:bg-zinc-700"
          >
            <MdOutlineKeyboardDoubleArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Items;
