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
    })
    .optional(),
});

export type EstoqueItem = z.infer<typeof estoqueItemSchema>;

const fetchEstoque = async (): Promise<EstoqueItem[]> => {
  const response = await fetch("/api/estoque");
  if (!response.ok) {
    throw new Error("Failed to fetch stock items");
  }

  const data = await response.json();

  return data;
};

export const useEstoque = () => {
  return useQuery<EstoqueItem[], Error>({
    queryKey: ["estoque"],
    queryFn: fetchEstoque,
  });
};
