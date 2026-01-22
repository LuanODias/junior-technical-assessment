import * as repository from "@/repositories/estoque_movimentacoes.repository";
import { estoque_movimentacoes } from "@/generated/prisma/client";
import * as estoqueRepository from "@/repositories/estoque.repository";

export const getAllEstoqueMovimentacoes = async (): Promise<
  estoque_movimentacoes[]
> => {
  return repository.findAll();
};

export const getEstoqueMovimentacaoById = async (
  id: bigint,
): Promise<estoque_movimentacoes | null> => {
  return repository.findById(id);
};

export const createEstoqueMovimentacao = async (
  data: Omit<estoque_movimentacoes, "id" | "criado_em">,
): Promise<estoque_movimentacoes> => {
  const { produto_id, quantidade, tipo } = data;

  if (quantidade <= 0) {
    throw new Error("A quantidade da movimentação deve ser positiva.");
  }

  if (tipo === "saida") {
    const estoqueAtual = await estoqueRepository.findByProductId(produto_id);

    const saldoAtual = estoqueAtual?.quantidade || 0;

    if (saldoAtual < quantidade) {
      throw new Error(
        `Saldo insuficiente. Disponível: ${saldoAtual}, Solicitado: ${quantidade}`,
      );
    }
  }

  return repository.create({
    produto_id,
    quantidade,
    tipo,
  });
};
