import * as repository from "@/repositories/produtos.repository";
import { produtos } from "@/generated/prisma/client";

export const getAllProdutos = async (): Promise<produtos[]> => {
  return repository.findAll();
};

export const getProdutoById = async (id: bigint): Promise<produtos | null> => {
  return repository.findById(id);
};

export const createProduto = async (
  data: Omit<produtos, "id" | "criado_em">,
): Promise<produtos> => {
  const { sku, nome, categoria_id, estoque_minimo, marca } = data;
  const newProduto = await repository.create({
    sku,
    nome,
    categoria_id,
    estoque_minimo,
    marca,
  });
  return newProduto;
};

export const updateProduto = async (
  id: bigint,
  data: Partial<Omit<produtos, "id" | "criado_em">>,
): Promise<produtos> => {
  return repository.update(id, data);
};

export const deleteProduto = async (id: bigint): Promise<produtos> => {
  return repository.remove(id);
};
