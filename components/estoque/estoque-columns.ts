"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EstoqueItem } from "@/hooks/use-estoque";
import { createElement } from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

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
  },
  {
    id: "status",
    header: "Status",
    accessorFn: (row) => {
      const qtd = row.quantidade;
      const min = row.produtos?.estoque_minimo || 0;

      if (qtd === 0) return "Esgotado";
      if (qtd <= min) return "Baixo";
      return "Normal";
    },
    filterFn: "arrIncludesSome",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      let Icon = CheckCircle;
      let colorClass = "text-green-600";

      if (status === "Baixo") {
        Icon = AlertTriangle;
        colorClass = "text-yellow-600";
      }

      if (status === "Esgotado") {
        Icon = XCircle;
        colorClass = "text-red-600";
      }

      return createElement(
        "div",
        { className: `flex items-center gap-2 ${colorClass}` },
        createElement(Icon, { className: "h-4 w-4" }),
        createElement("span", null, status),
      );
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
