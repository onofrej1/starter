"use client";
import { Table } from "@/components/resources/table/table";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import ResourceForm from "@/components/resources/form-dialog";
//import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { ResourceContext, useContext } from "@/resource-context";
import { getAll } from "@/actions/resources";

export default function Resource() {
  const searchParams = useSearchParams();
  const [openAddItem, setOpenAddItem] = useState(false);

  const {
    resource: { list, relations = [], resource, advancedFilter = false },
  } = useContext(ResourceContext);  

  const {
    page,
    perPage,
    sort = "",
    joinOperator = 'AND',
    filters,
  } = Object.fromEntries(searchParams.entries());

  const baseFilters: any[] = [];
  if (!advancedFilter) {
    list.map(col => col.filter).filter(Boolean).forEach((field) => {
      const value = searchParams.get(field.name);
      const isMultiSelect = field.variant === "multiSelect";
      if (value) {
        baseFilters.push({
          id: field.name,
          variant: field.variant,
          operator: isMultiSelect ? "eq" : "ilike",
          value: isMultiSelect ? value.split(',') : value,          
          search: isMultiSelect ? field.search : field.name,          
        });
      }
    });
  }

  const skip = (Number(page) || 1) - 1;
  const take = Number(perPage) || 10;

  let filtersParsed: any[] = [];
  try { 
    filtersParsed = JSON.parse(filters);
  } catch {}

  let sortParsed: any[] = [];
  try {
    sortParsed = JSON.parse(sort);
  } catch {}

  const filters_ = advancedFilter ? filtersParsed : baseFilters;

  const { promise } = useQuery({
    experimental_prefetchInRender: true,
    initialData: { data: [], numPages: 0 },
    queryKey: [
      "getAll",
      resource,
      JSON.stringify(filters_),
      skip,
      take,
      JSON.stringify(sort),
      joinOperator
    ],
    queryFn: () => getAll(
      resource,
      take,
      skip * take,
      sortParsed,
      filters_,
      relations,
      joinOperator,
     ),
  });
  
  return (
    <div className="w-full">
      <div className="flex flex-row justify-end">
        <form action={() => setOpenAddItem(true)}>
          <Button variant="outline" type="submit">
            <Plus className="h-5 w-5" /> Add item
          </Button>
        </form>
      </div>
      <div>
        <React.Suspense
          fallback={
            <div>Loading...
            {/*<DataTableSkeleton
              columnCount={6}
              searchableColumnCount={1}
              filterablecolumncount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
              shrinkZero
            />*/}
            </div>
          }
        >
          <Table dataPromise={promise as any} />
        </React.Suspense>

        {/*<ResourceForm
          key="addResource"
          open={openAddItem}
          onOpenChange={() => setOpenAddItem(false)}
        />*/}
      </div>
    </div>
  );
}
