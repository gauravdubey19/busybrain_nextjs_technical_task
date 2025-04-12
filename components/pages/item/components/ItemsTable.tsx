"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Post } from "@/lib/types";
import { useRouter } from "next/navigation";

type ItemsTableProps = {
  loading: boolean;
  limit?: number;
  items: Post[];
  isSearchActive: boolean;
  searchQuery: string;
  handleClearSearch: () => void;
};
const ItemsTable: React.FC<ItemsTableProps> = ({
  loading,
  limit,
  items,
  isSearchActive,
  searchQuery,
  handleClearSearch,
}) => {
  const router = useRouter();
  return (
    <>
      <div className="max-h-[560px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background/80 backdrop-blur-md z-10">
            <TableRow>
              <TableHead className="font-semibold font-iceland text-xl">
                ID
              </TableHead>
              <TableHead className="font-semibold font-iceland text-xl">
                User ID
              </TableHead>
              <TableHead className="font-semibold font-iceland text-xl">
                Title
              </TableHead>
              <TableHead className="font-semibold font-iceland text-xl">
                Body
              </TableHead>
              <TableHead className="font-semibold font-iceland text-xl">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(limit || 8)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index} className="animate-pulse">
                    <TableCell>
                      <div className="h-4 w-8 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-8 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-8">
                  {isSearchActive ? (
                    <div className="space-y-2">
                      <p className="font-medium">
                        No items found for search &quot;{searchQuery}&quot;
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
                </TableCell>
              </TableRow>
            ) : (
              items.map((item: Post, index: number) => (
                <TableRow
                  key={index}
                  className="hover:bg-primary/5 transition-colors"
                >
                  <TableCell>{item?.id?.toString()}</TableCell>
                  <TableCell>{item?.userId?.toString()}</TableCell>
                  <TableCell className="capitalize">
                    {item?.title?.slice(0, 15) + "..."}
                  </TableCell>
                  <TableCell>{item?.body?.slice(0, 80) + "..."}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      onClick={() => router.push(`/items/${item?.id}`)}
                      variant="ghost"
                      effect="gooeyRight"
                      size="sm"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ItemsTable;
