import prisma from "@/lib/db";
import { estoque } from "@/generated/prisma/client";

export const findAll = async (): Promise<estoque[]> => {
  return prisma.estoque.findMany();
};

export const findById = async (id: bigint): Promise<estoque | null> => {
  return prisma.estoque.findUnique({
    where: {
      id,
    },
  });
};
