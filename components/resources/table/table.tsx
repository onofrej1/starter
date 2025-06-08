"use client";

import { DataTableRowAction } from "@/types/data-table";
import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "./table-columns";
import { useQueryClient } from "@tanstack/react-query";
import ResourceFormDialog from "../form-dialog";
import { TableData } from "@/types/resources";
import { ResourceContext, useContext } from "@/resource-context";
import { use, useCallback, useEffect, useState } from "react";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

interface TableProps {
  dataPromise: Promise<{ data: any; numPages: number }>;
}

export function Table(props: TableProps) {
  const {
    resource: { resource, advancedFilter },
  } = useContext(ResourceContext);

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { data, numPages: pageCount } = use(props.dataPromise);
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


  useEffect(() => {
    if (rowAction?.variant === 'update') {
      setOpen(true);
    }
  }, [rowAction?.variant]);

  const { table } = useDataTable({
    data,
    columns: tableColumns,
    pageCount,
    enableAdvancedFilter: advancedFilter,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id.toString(),
    shallow: false,
    clearOnDefault: true,
  });
  const onOpenChange = useCallback(() => setRowAction(null), [rowAction?.variant]);

  //const open = useMemo(() => rowAction?.variant === "update", [rowAction?.variant]);
  
  if (!initialized) return null;

  return (
    <div className="mt-2">
      <DataTable table={table}>
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
        <ResourceFormDialog
          key="updateResource"
          open={open}
          onOpenChange={onOpenChange}
          //onOpenChange={() => setRowAction(null)}
          id={rowAction?.row.original.id}
        />
      
    </div>
  );
}
