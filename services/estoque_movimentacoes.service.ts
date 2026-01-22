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

  const estoqueAtual = await estoqueRepository.findById(produto_id);

  if (!estoqueAtual) {
    throw new Error("Estoque não encontrado para este produto.");
  }

  let novoSaldo = Number(estoqueAtual.quantidade);

  if (tipo === "ENTRADA") {
    novoSaldo += quantidade;
  } else if (tipo === "SAIDA") {
    if (novoSaldo < quantidade) {
      throw new Error("Saldo insuficiente para realizar essa saída.");
    }
    novoSaldo -= quantidade;
  }

  const newEstoqueMovimentacao = await repository.create({
    produto_id,
    quantidade,
    tipo,
  });

  await estoqueRepository.update(produto_id, { quantidade: novoSaldo });

  return newEstoqueMovimentacao;
};
