"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalItems: number;
  currentLength: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

export function Pagination({
  page,
  totalItems,
  currentLength,
  canPreviousPage,
  canNextPage,
  onPageChange,
  limit,
  onLimitChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-muted-foreground text-sm">
        {currentLength} usuários exibidos de {totalItems}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm text-muted-foreground">
            Itens por página:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-md border px-2 py-1 text-sm shadow-sm"
          >
            {[5, 10, 15, 20, 25, 30].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!canPreviousPage}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!canNextPage}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
