"use client";

import * as z from "zod";
import {
  useCreateStockMovement,
  createMovimentacaoSchema,
} from "@/hooks/use-estoque-movimentacoes";
import { useProdutos } from "@/hooks/use-produtos";
import { BaseModal } from "@/components/custom/base-modal";
import { DynamicForm } from "@/components/custom/dynamic-form";
import { toast } from "sonner";

export function AddMovimentacaoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const createStockMovementMutation = useCreateStockMovement();
  const { data: produtos } = useProdutos();

  const productOptions =
    produtos?.map((prod) => ({
      label: prod.nome,
      value: prod.id,
    })) || [];

  const formFields = [
    {
      name: "produto_id" as const,
      label: "Produto",
      placeholder: "Selecione um produto",
      component: "select" as const,
      options: productOptions,
    },
    {
      name: "tipo" as const,
      label: "Tipo de Movimentação",
      placeholder: "Selecione o tipo",
      component: "select" as const,
      options: [
        { label: "Entrada (Adicionar)", value: "entrada" },
        { label: "Saída (Remover)", value: "saida" },
      ],
    },
    {
      name: "quantidade" as const,
      label: "Quantidade",
      placeholder: "Ex: 10",
      component: "input" as const,
      type: "number",
    },
  ];

  const handleSubmit = (data: z.infer<typeof createMovimentacaoSchema>) => {
    createStockMovementMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Movimentação registrada com sucesso!");
        onClose();
      },
      onError: (error) => {
        toast.error(`Erro ao registrar: ${error.message}`);
      },
    });
  };

  return (
    <BaseModal
      title="Nova Movimentação"
      description="Registre uma entrada ou saída de estoque."
      isOpen={isOpen}
      onClose={onClose}
    >
      <DynamicForm
        schema={createMovimentacaoSchema}
        onSubmit={handleSubmit}
        defaultValues={{ produto_id: "", tipo: "entrada", quantidade: 1 }}
        fields={formFields}
        submitButtonText="Confirmar Movimentação"
        isSubmitting={createStockMovementMutation.isPending}
      />
    </BaseModal>
  );
}
