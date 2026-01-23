"use client";

import { ColumnDef, Column } from "@tanstack/react-table";
import { format } from "date-fns";
import { Categoria } from "@/hooks/use-categorias";
import { createElement } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const createSortableHeader = <TData, TValue>(
  column: Column<TData, TValue>,
  title: string,
) => {
  return createElement(
    Button,
    {
      variant: "ghost",
      onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      className: "-ml-4",
    },
    title,
    createElement(ArrowUpDown, { className: "ml-2 h-4 w-4" }),
  );
};

export const categoriaColumns: ColumnDef<Categoria>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nome",
    header: ({ column }) => createSortableHeader(column, "Nome"),
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
  },
  {
    accessorKey: "criado_em",
    header: ({ column }) => createSortableHeader(column, "Criado Em"),
    cell: ({ row }) => {
      const date = new Date(row.getValue("criado_em"));
      return format(date, "dd/MM/yyyy HH:mm");
    },
  },
];
