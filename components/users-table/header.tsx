"use client";

import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

interface TableHeaderProps {
  table: Table<any>;
  page: number;
  totalPages: number;
}

export function TableHeader({ table, page, totalPages }: TableHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder="Buscar por e-mail..."
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("email")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />

      <div className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </div>
    </div>
  );
}
