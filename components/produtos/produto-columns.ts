"use client";

import { ColumnDef, Column } from "@tanstack/react-table";
import { format } from "date-fns";
import { Produto } from "@/hooks/use-produtos";
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

export const produtoColumns: ColumnDef<Produto>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sku",
    header: ({ column }) => createSortableHeader(column, "SKU"),
  },
  {
    accessorKey: "nome",
    header: ({ column }) => createSortableHeader(column, "Nome"),
  },
  {
    accessorKey: "categorias.nome",
    id: "categoria",
    header: ({ column }) => createSortableHeader(column, "Categoria"),
    filterFn: "arrIncludesSome",
    cell: ({ row }) => {
      const category = row.original.categorias;
      return category ? category.nome : "N/A";
    },
  },
  {
    accessorKey: "estoque_minimo",
    header: ({ column }) => createSortableHeader(column, "Estoque Mínimo"),
  },
  {
    accessorKey: "marca",
    header: ({ column }) => createSortableHeader(column, "Marca"),
    filterFn: "arrIncludesSome",
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
