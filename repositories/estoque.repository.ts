import prisma from "@/lib/db";
import { estoque } from "@/generated/prisma/client";

export const findAll = async (): Promise<estoque[]> => {
  return prisma.estoque.findMany({
    include: {
      produtos: true,
    },
  });
};

export const findByProductId = async (
  ProductId: bigint,
): Promise<estoque | null> => {
  return prisma.estoque.findUnique({
    where: {
      produto_id: ProductId,
    },
    include: {
      produtos: true,
    },
  });
};
