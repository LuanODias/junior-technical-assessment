"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EstoqueItem } from "@/hooks/use-estoque";

export const estoqueColumns: ColumnDef<EstoqueItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "produtos.nome",
    header: "Produto",
    cell: ({ row }) => {
      return row.original.produtos?.nome || "Produto Desconhecido";
    },
  },
  {
    accessorKey: "produtos.sku",
    header: "SKU",
    cell: ({ row }) => {
      return row.original.produtos?.sku || "-";
    },
  },
  {
    accessorKey: "quantidade",
    header: "Quantidade",
    cell: ({ row }) => {
      const quantidade = row.getValue("quantidade") as number;
      const minimo = row.original.produtos?.estoque_minimo || 0;

      if (quantidade === 0) {
        return "0 (Esgotado)";
      }

      if (quantidade <= minimo) {
        return `${quantidade} (Baixo)`;
      }

      return quantidade;
    },
  },
  {
    accessorKey: "atualizado_em",
    header: "Última Atualização",
    cell: ({ row }) => {
      const dateValue = row.getValue("atualizado_em");
      if (!dateValue) return "-";

      const date = new Date(dateValue as string);
      return format(date, "dd/MM/yyyy HH:mm");
    },
  },
];
