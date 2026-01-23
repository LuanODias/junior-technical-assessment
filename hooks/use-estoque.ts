import { useQuery } from "@tanstack/react-query";
import * as z from "zod";

export const estoqueItemSchema = z.object({
  id: z.string(),
  produto_id: z.string(),
  quantidade: z.number(),
  atualizado_em: z.string(),
  produtos: z
    .object({
      id: z.string(),
      nome: z.string(),
      sku: z.string(),
      estoque_minimo: z.number().nullable().optional(),
    })
    .optional(),
});

export type EstoqueItem = z.infer<typeof estoqueItemSchema>;

const fetchStock = async (): Promise<EstoqueItem[]> => {
  const response = await fetch("/api/estoque");
  if (!response.ok) {
    throw new Error("Failed to fetch stock items");
  }

  const data = await response.json();

  return data;
};

export const useStock = () => {
  return useQuery<EstoqueItem[], Error>({
    queryKey: ["estoque"],
    queryFn: fetchStock,
  });
};
