"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon, Search, X } from "lucide-react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { getItems } from "@/lib/actions/items.actions";
import { ItemsProps, Post } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Items: React.FC<ItemsProps> = ({ page, limit: limitNumbers }) => {
  const router = useRouter();
  const [items, setItems] = useState<Post[]>([]);
  const [allItems, setAllItems] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(items?.length || 0);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(limitNumbers || 8);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("all");
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  const fetchData = async (pageNum: number, postLimit: number) => {
    try {
      setLoading(true);

      const result = await getItems(pageNum, postLimit);

      setAllItems(result.posts);
      setItems(result.posts);
      setLimit(result.limit);
      setTotalPages(result.totalPages);
      setTotalItems(result.posts.length);
      setCurrentPage(pageNum);

      setIsSearchActive(false);
      setSearchQuery("");
    } catch (error) {
      console.error(`Error fetching page ${pageNum}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allItems.length === 0) fetchData(currentPage, limit);
    if (page !== currentPage || limitNumbers !== limit) {
      setCurrentPage(page);
      setLimit(limitNumbers || 8);
      fetchData(page, limitNumbers || 8);
    }
  }, [page, limitNumbers, currentPage, limit, allItems.length]);

  const performSearch = useCallback(
    (query: string, field: string) => {
      if (!query.trim()) {
        setItems(allItems);
        setTotalItems(allItems.length);
        setIsSearchActive(false);
        return;
      }

      const lowerQuery = query.toLowerCase();

      const filteredItems = allItems.filter((item) => {
        if (field === "id") {
          return item.id?.toString().includes(lowerQuery);
        } else if (field === "userId") {
          return item.userId?.toString().includes(lowerQuery);
        } else if (field === "title") {
          return item.title?.toLowerCase().includes(lowerQuery);
        } else if (field === "body") {
          return item.body?.toLowerCase().includes(lowerQuery);
        } else {
          // "all" - search in all fields
          return (
            item.id?.toString().includes(lowerQuery) ||
            item.userId?.toString().includes(lowerQuery) ||
            item.title?.toLowerCase().includes(lowerQuery) ||
            item.body?.toLowerCase().includes(lowerQuery)
          );
        }
      });

      setIsSearchActive(true);
      setItems(filteredItems);
      setTotalItems(filteredItems.length);
    },
    [allItems]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    if (e.target.value.trim() === "") {
      setIsSearchActive(false);
      setItems(allItems);
      setTotalItems(allItems.length);
      setSearchQuery("");
      return;
    }
    const query = e.target.value;
    setSearchQuery(query);
    // performSearch(query, searchField);
  };

  const handleSearchFieldChange = (value: string) => {
    setSearchField(value);
    performSearch(searchQuery, value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery, searchField);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setItems(allItems);
    setTotalItems(allItems.length);
    setIsSearchActive(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleRefresh = () => {
    fetchData(currentPage, limit);
  };

  return (
    <div className="container mx-auto p-4 py-8 animate-fade-in">
      <div className="flex justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold">Items ({totalItems})</h2>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="pr-8"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-shrink-0">
                    <Select
                      value={searchField}
                      onValueChange={handleSearchFieldChange}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Search in..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Fields</SelectItem>
                        <SelectItem value="id">ID</SelectItem>
                        <SelectItem value="userId">User ID</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="body">Body</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select field to search in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={handleSearch}
              type="button"
              variant="secondary"
              size="sm"
              effect="gooeyLeft"
            >
              <Search className="mr-1" />
            </Button>
          </div>
          {isSearchActive && (
            <div className="mb-4 text-sm flex items-center justify-between gap-2">
              <span className="text-zinc-500">
                Found{" "}
                <span className="font-semibold text-primary">{totalItems}</span>{" "}
                results
                {searchField !== "all" && (
                  <span>
                    {" "}
                    in <span className="font-semibold">{searchField}</span>
                  </span>
                )}{" "}
                for:{" "}
                <span className="font-medium text-primary">{searchQuery}</span>
              </span>
              <Button
                onClick={handleClearSearch}
                variant="outline"
                size="sm"
                className="h-7 px-2 py-1"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-h-[560px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-10">
            <tr>
              <th className="text-left p-3 font-semibold font-iceland text-xl">
                ID
              </th>
              <th className="text-left p-3 font-semibold font-iceland text-xl">
                User ID
              </th>
              <th className="text-left p-3 font-semibold font-iceland text-xl">
                Title
              </th>
              <th className="text-left p-3 font-semibold font-iceland text-xl">
                Body
              </th>
              <th className="text-left p-3 font-semibold font-iceland text-xl">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <LoaderIcon className="animate-spin h-5 w-5" />
                    <span>Loading items...</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8">
                  {isSearchActive ? (
                    <div className="space-y-2">
                      <p className="font-medium">
                        No items found for search &quot{searchQuery}&quot;
                      </p>
                      <p className="text-sm text-zinc-500">
                        Try a different search term or clear filters
                      </p>
                      <Button
                        onClick={handleClearSearch}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Clear Search
                      </Button>
                    </div>
                  ) : (
                    "No items found"
                  )}
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-primary/5 transition-colors"
                >
                  <td className="p-3">{item?.id?.toString()}</td>
                  <td className="p-3">{item?.userId?.toString()}</td>
                  <td className="p-3 capitalize">
                    {item?.title?.slice(0, 15) + "..."}
                  </td>
                  <td className="p-3">{item?.body?.slice(0, 80) + "..."}</td>
                  <td className="p-3">
                    <Button
                      type="button"
                      onClick={() => router.push(`/items/${item?.id}`)}
                      variant="ghost"
                      effect="gooeyRight"
                      size="sm"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="w-full p-4 flex-between flex-col md:flex-row gap-6 border-t border-zinc-400 dark:border-zinc-600 mt-8">
        <div className="w-full md:max-w-2xl flex-1 flex-between">
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
    </div>
  );
};

export default Items;
