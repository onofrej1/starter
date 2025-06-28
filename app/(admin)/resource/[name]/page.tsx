"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import ResourceForm from "@/components/resources/form-dialog";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { ResourceContext, useContext } from "@/resource-context";
import { getAll } from "@/actions/resources";
import { Filter } from "@/lib/resources";
import { OrderBy, Search } from "@/services";
import { parseJson } from "@/lib/utils";
import { Table as DrizzleTable } from "drizzle-orm";
import { Table } from "@/components/resources/table/table";
import { getValidFilters } from "@/lib/filter-data";

export default function Resource() {
  const searchParams = useSearchParams();
  const [openAddItem, setOpenAddItem] = useState(false);

  const {
    resource: { list, resource, advancedFilter },
  } = useContext(ResourceContext);

  const {
    page,
    perPage,
    sort,
    joinOperator: operator = 'and',
    filters,
  } = Object.fromEntries(searchParams.entries());

  const baseFilters: Filter[] = [];
  if (!advancedFilter) {
    list.map(col => col.filter).filter(f => f !== undefined).forEach((field) => {
      const value = searchParams.get(field.name);
      const isMultiSelect = field.type === "multiSelect";

      if (value) {
        baseFilters.push({
          id: field.name as keyof DrizzleTable,
          variant: field.type,
          operator: isMultiSelect ? "eq" : "iLike",
          value: isMultiSelect ? value.split(',') : value, 
          search: isMultiSelect ? field.search : field.name,          
        });
      }
    });
  }

  const offset = (Number(page) || 1) - 1;
  const limit = Number(perPage) || 10;
  const pagination = {
    limit,
    offset: limit * offset,
  };
  const orderBy: OrderBy[] = parseJson(sort, []);

  const filterQuery = advancedFilter ? getValidFilters(parseJson(filters, [])) : baseFilters;
  const search: Search<DrizzleTable> = {
    filters: filterQuery,
    operator: operator as 'and' | 'or'
  };

  const { promise } = useQuery({
    experimental_prefetchInRender: true,
    initialData: [[], 0 ],
    queryKey: [
      "getAll",
      resource,
      limit,
      offset,
      operator,
      JSON.stringify(filterQuery),
      JSON.stringify(sort),
    ],    
    queryFn: () => getAll(
      resource,
      pagination,      
      search, 
      orderBy,
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
            {<DataTableSkeleton
              columnCount={6}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
              shrinkZero
            />}
            </div>
          }
        >
          <Table dataPromise={promise} />
        </React.Suspense>

        <ResourceForm
          key="addResource"
          open={openAddItem}
          onOpenChange={() => setOpenAddItem(false)}
        />      
      </div>
    </div>
  );
}
