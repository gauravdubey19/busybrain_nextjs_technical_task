"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
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
import ItemsTable from "./components/ItemsTable";
import ItemsPagination from "./components/ItemsPagination";

const Items: React.FC<ItemsProps> = ({ page, limit: limitNumbers }) => {
  const [items, setItems] = useState<Post[]>([]);
  const [allItems, setAllItems] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(items?.length || 0);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(limitNumbers || 8);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("title");
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
              disabled={loading || searchQuery.trim() === ""}
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

      <ItemsTable
        loading={loading}
        limit={limit}
        items={items}
        isSearchActive={isSearchActive}
        searchQuery={searchQuery}
        handleClearSearch={handleClearSearch}
      />

      <ItemsPagination
        loading={loading}
        totalPages={totalPages}
        currentPage={currentPage}
        page={currentPage}
        limit={limit}
        itemsLength={totalItems}
        handleRefresh={handleRefresh}
      />
    </div>
  );
};

export default Items;
