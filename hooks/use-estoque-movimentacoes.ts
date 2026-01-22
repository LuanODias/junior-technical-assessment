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

const fetchMovimentacoes = async (): Promise<EstoqueMovimentacao[]> => {
  const response = await fetch("/api/movimentacoes");
  if (!response.ok) {
    throw new Error("Failed to fetch stock movements");
  }
  return response.json();
};

const createMovimentacao = async (
  payload: CreateMovimentacaoPayload,
): Promise<EstoqueMovimentacao> => {
  const response = await fetch("/api/movimentacoes", {
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

export const useEstoqueMovimentacoes = () => {
  return useQuery<EstoqueMovimentacao[], Error>({
    queryKey: ["estoque-movimentacoes"],
    queryFn: fetchMovimentacoes,
  });
};

export const useCreateMovimentacao = () => {
  const queryClient = useQueryClient();
  return useMutation<EstoqueMovimentacao, Error, CreateMovimentacaoPayload>({
    mutationFn: createMovimentacao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estoque-movimentacoes"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
    },
  });
};
