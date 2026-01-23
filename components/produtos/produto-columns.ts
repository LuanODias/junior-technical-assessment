"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Produto } from "@/hooks/use-produtos";

export const produtoColumns: ColumnDef<Produto>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "categorias.nome",
    id: "categoria",
    header: "Categoria",
    filterFn: "arrIncludesSome",
    cell: ({ row }) => {
      const category = row.original.categorias;
      return category ? category.nome : "N/A";
    },
  },
  {
    accessorKey: "estoque_minimo",
    header: "Estoque Mínimo",
  },
  {
    accessorKey: "marca",
    header: "Marca",
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "criado_em",
    header: "Criado Em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("criado_em"));
      return format(date, "dd/MM/yyyy HH:mm");
    },
  },
];
