"use client";

import { DataTable } from "@/components/custom/data-table";
import { Input } from "@/components/ui/input";
import { useStockMovements } from "@/hooks/use-estoque-movimentacoes";
import { ArrowDown, ArrowUp } from "lucide-react";
import { estoqueMovimentacaoColumns } from "../estoque/estoque-movimentacao-columns";

export function MovimentacoesView() {
  const {
    data: movimentacoes,
    isLoading,
    isError,
    error,
  } = useStockMovements();

  const tipoOptions = [
    { label: "Entrada", value: "entrada", icon: ArrowUp },
    { label: "Saída", value: "saida", icon: ArrowDown },
  ];

  if (isError) {
    return (
      <div className="text-red-500">
        Erro ao carregar histórico: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={estoqueMovimentacaoColumns}
        data={movimentacoes || []}
        isLoading={isLoading}
        searchComponent={
          <Input placeholder="Filtrar movimentações..." className="max-w-sm" />
        }
        facetedFilters={[
          { columnName: "tipo", title: "Tipo", options: tipoOptions },
        ]}
      />
    </div>
  );
}
