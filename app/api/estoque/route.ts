import { NextResponse } from "next/server";
import * as service from "@/services/estoque.service";

export async function GET() {
  try {
    const estoques = await service.getAllEstoques();
    const estoquesSerialized = estoques.map((estoque) => {
      return JSON.parse(
        JSON.stringify(estoque, (key, value) =>
          typeof value === "bigint" ? value.toString() : value,
        ),
      );
    });
    return NextResponse.json(estoquesSerialized);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Falha ao buscar estoques" },
      { status: 500 },
    );
  }
}
