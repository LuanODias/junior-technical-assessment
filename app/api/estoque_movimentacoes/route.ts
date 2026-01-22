import { NextResponse } from "next/server";
import * as service from "@/services/estoque_movimentacoes.service";

export async function GET() {
  try {
    const movimentacoes = await service.getAllEstoqueMovimentacoes();

    const serialized = movimentacoes.map((mov) => {
      return JSON.parse(
        JSON.stringify(mov, (key, value) =>
          typeof value === "bigint" ? value.toString() : value,
        ),
      );
    });

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Erro ao buscar movimentações:", error);
    return NextResponse.json(
      { error: "Falha ao buscar movimentações" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { produto_id, quantidade, tipo } = body;

    if (!produto_id || !quantidade || !tipo) {
      return NextResponse.json(
        { error: "Produto, quantidade e tipo são obrigatórios" },
        { status: 400 },
      );
    }

    if (tipo !== "entrada" && tipo !== "saida") {
      return NextResponse.json(
        { error: "O tipo deve ser 'entrada' ou 'saida'" },
        { status: 400 },
      );
    }

    const novaMovimentacao = await service.createEstoqueMovimentacao({
      produto_id: BigInt(produto_id),
      quantidade: Number(quantidade),
      tipo: tipo,
    });

    const serialized = JSON.parse(
      JSON.stringify(novaMovimentacao, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    return NextResponse.json(serialized, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar movimentação:", error);

    if (error.message && error.message.includes("Saldo insuficiente")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Falha ao criar movimentação" },
      { status: 500 },
    );
  }
}
