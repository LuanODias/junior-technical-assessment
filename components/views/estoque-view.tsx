"use client";

import { useState } from "react";
import { useStock } from "@/hooks/use-estoque";
import { DataTable } from "@/components/custom/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { estoqueColumns } from "../estoque/estoque-columns";
import { AddMovimentacaoModal } from "../estoque/movimentacao-add-modal";
import { useStockMovements } from "@/hooks/use-estoque-movimentacoes";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function EstoqueView() {
  const { data: estoqueItens, isLoading, isError, error } = useStock();
  const { data: estoqueMovimentacoes } = useStockMovements();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const statusOptions = [
    { label: "Normal", value: "Normal", icon: CheckCircle },
    { label: "Baixo", value: "Baixo", icon: AlertTriangle },
    { label: "Esgotado", value: "Esgotado", icon: XCircle },
  ];

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load stock data."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={estoqueColumns}
        data={estoqueItens || []}
        isLoading={isLoading}
        facetedFilters={[
          {
            columnName: "status", // Conecta com o id: "status" da coluna
            title: "Status",
            options: statusOptions,
          },
        ]}
        searchComponent={
          <Input
            placeholder="Buscar estoque dos produtos..."
            className="max-w-sm"
          />
        }
        actionButtons={[
          <Button key="new-movement" onClick={() => setIsAddModalOpen(true)}>
            Nova Movimentação
          </Button>,
        ]}
      />

      <AddMovimentacaoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
