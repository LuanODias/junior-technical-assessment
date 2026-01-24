"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Pencil, Trash2 } from "lucide-react";

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
  filterComponent?: React.ReactNode;
  searchComponent?: React.ReactNode;
  actionButtons?: React.ReactNode[];
  facetedFilters?: {
    columnName: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading = false,
  filterComponent,
  searchComponent,
  actionButtons,
  facetedFilters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  const generateSkeletonRow = (columnCount: number, key: number) => (
    <TableRow key={key}>
      {Array.from({ length: columnCount }).map((_, colIndex) => (
        <TableCell key={colIndex}>
          <Skeleton className="h-6 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div>
      <div className="flex items-center py-4 gap-2">
        {searchComponent && React.isValidElement(searchComponent)
          ? React.cloneElement(
              searchComponent as React.ReactElement<{
                value: string;
                onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
              }>,
              {
                value: globalFilter ?? "",
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                  setGlobalFilter(event.target.value),
              },
            )
          : null}
        {filterComponent}
        {facetedFilters?.map((filter) => {
          const column = table.getColumn(filter.columnName);
          return (
            column && (
              <DataTableFacetedFilter
                key={filter.columnName}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          );
        })}
        <div className="ml-auto flex gap-2">
          {actionButtons?.map((button, index) => (
            <React.Fragment key={index}>{button}</React.Fragment>
          ))}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
                {(onEdit || onDelete) && (
                  <TableHead className="w-[100px]"></TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Render skeleton rows when loading
              Array.from({ length: 5 }).map((_, index) =>
                generateSkeletonRow(columns.length, index),
              )
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon" // Deixa o botão quadrado
                          onClick={() => onEdit(row.original.id)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 mr-2"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" /> {/* Ícone aqui */}
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon" // Deixa o botão quadrado
                          onClick={() => onDelete(row.original.id)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" /> {/* Ícone aqui */}
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
