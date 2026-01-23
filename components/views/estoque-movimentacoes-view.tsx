"use client";

import { useStockMovements } from "@/hooks/use-estoque-movimentacoes";
import { DataTable } from "@/components/custom/data-table";
import { Input } from "@/components/ui/input";
import { estoqueMovimentacaoColumns } from "../estoque/estoque-movimentacao-columns";

export function MovimentacoesView() {
  const {
    data: movimentacoes,
    isLoading,
    isError,
    error,
  } = useStockMovements();

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
      />
    </div>
  );
}
