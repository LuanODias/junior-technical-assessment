"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriasView } from "@/components/views/categorias-view";
import { EstoqueView } from "@/components/views/estoque-view";
import { ProdutosView } from "@/components/views/produtos-view";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Gestão de Estoque</h1>
      </div>

      <Tabs defaultValue="categorias" className="w-full max-w-5xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
        </TabsList>
        <TabsContent value="categorias">
          <CategoriasView />
        </TabsContent>
        <TabsContent value="produtos">
          <ProdutosView />
        </TabsContent>
        <TabsContent value="estoque">
          <EstoqueView />
        </TabsContent>
      </Tabs>
    </main>
  );
}
