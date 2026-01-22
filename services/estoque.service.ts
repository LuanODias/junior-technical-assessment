import * as repository from '@/repositories/estoque.repository';
import { estoque } from '@/generated/prisma/client';

export const getAllEstoques = async (): Promise<estoque[]> => {
    return repository.findAll();
};

export const getEstoqueById = async (id: bigint): Promise<estoque | null> => {
    return repository.findById(id);
};


export const updateEstoque = async (id: bigint, data: Partial<Omit<estoque, 'id' | 'atualizado_em'>>): Promise<estoque> => {

    
    if (data.quantidade !== undefined && data.quantidade < 0) {
        throw new Error("Não é permitido definir um estoque negativo.");
    }

    const estoqueExiste = await repository.findById(id);
    if (!estoqueExiste) {
        throw new Error("Estoque não encontrado para este ID."); 
    }

    return repository.update(id, data);
};
