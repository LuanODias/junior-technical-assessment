"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EstoqueMovimentacao } from "@/hooks/use-estoque-movimentacoes";

export const estoqueMovimentacaoColumns: ColumnDef<EstoqueMovimentacao>[] = [
  {
    accessorKey: "criado_em",
    header: "Data/Hora",
    cell: ({ row }) => {
      const dateValue = row.getValue("criado_em");
      if (!dateValue) return "-";

      const date = new Date(dateValue as string);
      return format(date, "dd/MM/yyyy HH:mm");
    },
  },
  {
    accessorKey: "produtos.nome",
    header: "Produto",
    cell: ({ row }) => {
      return row.original.produtos?.nome || "Produto Desconhecido";
    },
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    filterFn: "arrIncludesSome",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string;
      return tipo === "entrada" ? "ENTRADA (+)" : "SAÍDA (-)";
    },
  },
  {
    accessorKey: "quantidade",
    header: "Qtd.",
    cell: ({ row }) => {
      return row.getValue("quantidade");
    },
  },
];
