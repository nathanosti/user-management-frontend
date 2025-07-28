"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";

import { useUsers } from "@/hooks/use-users";
import { userColumns } from "./columns";

import { TableHeader } from "./header";
import { TableContent } from "./table-content";
import { Pagination } from "./pagination";

import { motion, AnimatePresence } from "framer-motion";

export function UsersTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, isError, isFetching } = useUsers(page, limit);

  const totalPages = data?.meta.totalPages ?? 1;
  const totalItems = data?.meta.total ?? 0;

  const table = useReactTable({
    data: data?.data ?? [],
    columns: userColumns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const canPreviousPage = page > 1;
  const canNextPage = page < totalPages;

  return (
    <div className="w-full space-y-4">
      <TableHeader table={table} page={page} totalPages={totalPages} />

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <TableContent
            table={table}
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching}
            columnsLength={userColumns.length}
          />
          <Pagination
            page={page}
            totalItems={totalItems}
            currentLength={data?.data.length ?? 0}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            onPageChange={setPage}
            limit={limit}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
