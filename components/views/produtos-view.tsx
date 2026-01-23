"use client";

import { useState } from "react";
import { useProdutos, Produto } from "@/hooks/use-produtos";
import { useCategories } from "@/hooks/use-categorias";
import { DataTable } from "@/components/custom/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { produtoColumns } from "@/components/produtos/produto-columns";
import { AddProductModal } from "@/components/produtos/produto-add-modal";
import { EditProductModal } from "@/components/produtos/produto-edit-modal";
import { DeleteProductDialog } from "@/components/produtos/produto-delete-dialog";
import { Tag, Box } from "lucide-react";

export function ProdutosView() {
  const { data: produtos, isLoading, isError, error } = useProdutos();
  const { data: categories } = useCategories();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null,
  );

  const categoriaOptions =
    categories?.map((cat) => ({
      label: cat.nome,
      value: cat.nome,
      icon: Tag,
    })) || [];

  const marcasUnicas = Array.from(
    new Set(produtos?.map((p) => p.marca).filter(Boolean)),
  );

  const marcaOptions = marcasUnicas.map((marca) => ({
    label: marca as string,
    value: marca as string,
    icon: Box,
  }));

  const handleEdit = (id: string) => {
    const productToEdit = produtos?.find((prod) => prod.id === id);
    if (productToEdit) {
      setSelectedProduct(productToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setProductIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load products."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={produtoColumns}
        data={produtos || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchComponent={
          <Input placeholder="Buscar produtos..." className="max-w-sm" />
        }
        facetedFilters={[
          {
            columnName: "categoria",
            title: "Categoria",
            options: categoriaOptions,
          },
          {
            columnName: "marca",
            title: "Marca",
            options: marcaOptions,
          },
        ]}
        actionButtons={[
          <Button key="new-product" onClick={() => setIsAddModalOpen(true)}>
            Novo Produto
          </Button>,
        ]}
      />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
      />
      <DeleteProductDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productId={productIdToDelete}
      />
    </>
  );
}
