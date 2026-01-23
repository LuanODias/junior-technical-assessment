"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EstoqueMovimentacao } from "@/hooks/use-estoque-movimentacoes";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { createElement } from "react";

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
      const isEntrada = tipo === "entrada";

      const Icon = isEntrada ? ArrowUpCircle : ArrowDownCircle;
      const colorClass = isEntrada ? "text-green-600" : "text-orange-600";
      const label = isEntrada ? "Entrada" : "Saída";

      return createElement(
        "div",
        { className: `flex items-center gap-2 ${colorClass}` },
        createElement(Icon, { className: "h-4 w-4" }),
        createElement("span", { className: "font-medium" }, label),
      );
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
