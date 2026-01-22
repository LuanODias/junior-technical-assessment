import prisma from "@/lib/db";
import { estoque_movimentacoes } from "@/generated/prisma/client";

export const findAll = async (): Promise<estoque_movimentacoes[]> =>{
    return prisma.estoque_movimentacoes.findMany();
};

export const findById = async (id: bigint): Promise<estoque_movimentacoes | null> =>{
    return prisma.estoque_movimentacoes.findUnique({
        where: {
            id,
        }
    })
};

export const create = async (data: Omit<estoque_movimentacoes, 'id' | 'criado_em'>): Promise<estoque_movimentacoes> =>{
    return prisma.estoque_movimentacoes.create({
        data,
    });
};