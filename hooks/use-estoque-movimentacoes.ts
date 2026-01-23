import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

// --- Zod Schemas ---
export const createMovimentacaoSchema = z.object({
  produto_id: z.string().min(1, "Produto é obrigatório"),
  quantidade: z.coerce.number().min(1, "A quantidade deve ser maior que zero"),
  tipo: z.enum(["entrada", "saida"] as const, {
    message: "Tipo é obrigatório",
  }),
});

export type EstoqueMovimentacao = {
  id: string;
  produto_id: string;
  quantidade: number;
  tipo: "entrada" | "saida";
  criado_em: string;
  produtos?: {
    id: string;
    nome: string;
    sku: string;
  };
};

export type CreateMovimentacaoPayload = z.infer<
  typeof createMovimentacaoSchema
>;

const fetchStockMovements = async (): Promise<EstoqueMovimentacao[]> => {
  const response = await fetch("/api/estoque_movimentacoes");
  if (!response.ok) {
    throw new Error("Failed to fetch stock movements");
  }
  return response.json();
};

const createStockMovement = async (
  payload: CreateMovimentacaoPayload,
): Promise<EstoqueMovimentacao> => {
  const response = await fetch("/api/estoque_movimentacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || errorData.message || "Failed to create movement",
    );
  }
  return response.json();
};

export const useStockMovements = () => {
  return useQuery<EstoqueMovimentacao[], Error>({
    queryKey: ["estoque-movimentacoes"],
    queryFn: fetchStockMovements,
  });
};

export const useCreateStockMovement = () => {
  const queryClient = useQueryClient();
  return useMutation<EstoqueMovimentacao, Error, CreateMovimentacaoPayload>({
    mutationFn: createStockMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estoque-movimentacoes"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
    },
  });
};
