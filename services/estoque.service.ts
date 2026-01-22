import * as repository from "@/repositories/estoque.repository";
import { estoque } from "@/generated/prisma/client";

export const getAllEstoques = async (): Promise<estoque[]> => {
  return repository.findAll();
};

export const getEstoqueById = async (id: bigint): Promise<estoque | null> => {
  return repository.findById(id);
};
