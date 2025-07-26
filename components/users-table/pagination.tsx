import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalItems: number;
  currentLength: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalItems,
  currentLength,
  canPreviousPage,
  canNextPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground text-sm">
        {currentLength} usuários exibidos de {totalItems}
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
  );
}
