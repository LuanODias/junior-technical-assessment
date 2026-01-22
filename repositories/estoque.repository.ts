import prisma from '@/lib/db';
import { estoque } from '@/generated/prisma/client';

export const findAll = async (): Promise<estoque[]> => {
    return prisma.estoque.findMany();
}

export const findById = async (id: string): Promise<estoque | null> =>{
    return prisma.estoque.findUnique({
        where: {
            id,
        }
    })
}

export const update = async (id: bigint, data: Partial<Omit<estoque, 'id' | 'atualizado_em'>>): Promise<estoque> => {
  return prisma.estoque.update({
    where: { id },
    data,
  });
};


