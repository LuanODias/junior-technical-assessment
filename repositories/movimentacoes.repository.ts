import prisma from "@/lib/db";
import { estoque_movimentacoes } from "@/generated/prisma/client";

export const findAll = async (): Promise<estoque_movimentacoes[]> => {
  return prisma.estoque_movimentacoes.findMany({
    include: {
      produtos: true,
    },
    orderBy: {
      criado_em: "desc",
    },
  });
};

export const findById = async (
  id: bigint,
): Promise<estoque_movimentacoes | null> => {
  return prisma.estoque_movimentacoes.findUnique({
    where: {
      id,
    },
    include: {
      produtos: true,
    },
  });
};

export const create = async (
  data: Omit<estoque_movimentacoes, "id" | "criado_em">,
): Promise<estoque_movimentacoes> => {
  return prisma.$transaction(async (tx) => {
    const movimentacao = await tx.estoque_movimentacoes.create({
      data,
    });
    const ajuste = data.tipo === "entrada" ? data.quantidade : -data.quantidade;
    if (data.produto_id) {
      await tx.estoque.upsert({
        where: { produto_id: data.produto_id },
        update: {
          quantidade: { increment: ajuste },
          atualizado_em: new Date(),
        },
        create: {
          produto_id: data.produto_id,
          quantidade: ajuste > 0 ? ajuste : 0,
        },
      });
    }

    return movimentacao;
  });
};
