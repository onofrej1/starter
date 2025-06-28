"use client";

import { DataTableRowAction } from "@/types/data-table";
import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "./table-columns";
import { useQueryClient } from "@tanstack/react-query";
import ResourceFormDialog from "../form-dialog";
import { TableData } from "@/types/resources";
import { ResourceContext, useContext } from "@/resource-context";
import { use, useEffect, useState } from "react";
import { DataTableAdvancedToolbar } from "@/components/data-table/toolbar/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table/filter/data-table-filter-list";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableToolbar } from "@/components/data-table/toolbar/data-table-toolbar";
import { DeleteRowDialog } from "../delete-row-dialog";
import { TableActionBar } from "./table-action-bar";

interface TableProps {
  dataPromise: Promise<[data: TableData[], pageCount: number]>;
}

export function Table(props: TableProps) {
  const {
    resource: { resource, advancedFilter },
  } = useContext(ResourceContext);

  const queryClient = useQueryClient();

  const [data, pageCount] = use(props.dataPromise);
  const [initialized, setInitialized] = useState(false);
  const [tableColumns, setTableColumns] = useState<ColumnDef<TableData>[]>([]);

  const [rowAction, setRowAction] =
    useState<DataTableRowAction<TableData> | null>(null);

  useEffect(() => {
    async function fetchColumns() {
      const cols = await getColumns({ resource, setRowAction, queryClient });
      setTableColumns(cols);
      setInitialized(true);
    }
    fetchColumns();
  }, [queryClient, resource]);

  const { table } = useDataTable({
    data,
    columns: tableColumns,
    pageCount,
    enableAdvancedFilter: advancedFilter,
    initialState: {
      //sorting: [{ id: "id", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id.toString(),
    shallow: false,
    clearOnDefault: true,
  });

  if (!initialized) return null;

  return (
    <div className="mt-2">
      <DataTable table={table} actionBar={<TableActionBar table={table} />}>
        {advancedFilter ? (
          <DataTableAdvancedToolbar table={table}>
            <DataTableFilterList table={table} />
            <DataTableSortList table={table} />
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table} key={tableColumns.length}>
            <DataTableSortList table={table} />
          </DataTableToolbar>
        )}
      </DataTable>

      {rowAction?.variant === "update" && (
        <ResourceFormDialog
          open={rowAction?.variant === "update"}
          onOpenChange={() => setRowAction(null)}
          id={rowAction?.row.original.id}
        />
      )}

      {rowAction?.variant === "delete" && (
        <DeleteRowDialog
          open={rowAction?.variant === "delete"}
          onOpenChange={() => setRowAction(null)}
          row={rowAction?.row.original}
          onSuccess={() => {
            rowAction?.row.toggleSelected(false);
            queryClient.invalidateQueries({
              queryKey: ["getAll", resource],
            });
          }}
        />
      )}
    </div>
  );
}
