import { TableData } from "@/types/resources";
import { Filter } from "./resources";

export function getWhereQuery(input: string) {
    if (!input) {
      return [];
    }
    const filters: Filter<TableData>[] = JSON.parse(input);
    const query: any[] = [];
  
    filters.forEach((filter) => {
      const where: Record<string, any> = {};
      let value = filter.value;
      const operator = filter.operator;
  
      if (["text"].includes(filter.type)) {
        if (["isEmpty", "isNotEmpty"].includes(operator)) {
          where[filter.id] = operator === "isEmpty" ? "" : { not: "" };
        } else {
          const op: any = {
            eq: "equals",
            ne: "not",
            iLike: "contains",
          };
          where[filter.id] = { [op[filter.operator]]: value };
        }
      }
  
      if (["date"].includes(filter.type)) {
        if (["isEmpty", "isNotEmpty"].includes(operator)) {
          where[filter.id] = operator === "isEmpty" ? null : { not: null };
        } else {
          if (value === null || value === undefined || value === "") return;
          const op: any = {
            eq: "equals",
            ne: "not",
            lt: "lt",
            lte: "lte",
            gt: "gt",
            gte: "gte",
          };
          where[filter.id] = {
            [op[filter.operator]]: new Date(value as string).toISOString(),
          };
        }
      }
  
      if (["number"].includes(filter.type)) {
        if (["isEmpty", "isNotEmpty"].includes(operator)) {
          where[filter.id] = operator === "isEmpty" ? "" : { not: "" };
        } else {
          if (value === null || value === undefined || value === "") return;
          const op: any = {
            eq: "equals",
            ne: "not",
            lt: "lt",
            lte: "lte",
            gt: "gt",
            gte: "gte",
          };
          where[filter.id] = { [op[filter.operator]]: Number(value) };
        }
      }
  
      if (["boolean"].includes(filter.type)) {
        const op: any = {
          eq: "equals",
          ne: "not",
        };
        where[filter.id] = {
          [op[filter.operator]]: value === "false" ? false : !!value,
        };
      }
  
      if (filter.type === "multi-select") {
        const [key, op] = filter.search.split("_");
        const isManyRelation = op !== undefined;
  
        if (["isEmpty", "isNotEmpty"].includes(operator)) {
          if (isManyRelation) {
            where[key] = {
              [filter.operator === "isEmpty" ? "none" : "some"]: {},
            };
          } else {
            where[key] = {
              [filter.operator === "isEmpty" ? "isNot" : "is"]: {},
            };
          }
        }
  
        if (["eq", "ne"].includes(operator)) {
          value = Array.isArray(value)
            ? value.filter(Boolean).map((v: any) => parseFloat(v) || v)
            : value
            ? [parseFloat(value) || value]
            : [];
          if (!value.length) return;
  
          if (isManyRelation) {
            where[key] = {
              [filter.operator === "eq" ? "some" : "none"]: {
                id: {
                  ["in"]: value,
                },
              },
            };
          } else {
            where[key] = {
              id: {
                [filter.operator === "eq" ? "in" : "notIn"]: value,
              },
            };
          }
        }
      }
  
      if (filter.type === "select") {
        const [key, op] = filter.search.split("_");
        const isManyRelation = op !== undefined;
  
        if (["isEmpty", "isNotEmpty"].includes(operator)) {
          if (isManyRelation) {
            where[key] = {
              [filter.operator === "isEmpty" ? "none" : "some"]: {},
            };
          } else {
            where[key] = {
              [filter.operator === "isEmpty" ? "isNot" : "is"]: {},
            };
          }
        }
  
        if (["eq", "ne"].includes(operator)) {
          value = Array.isArray(value)
            ? value.filter(Boolean).map((v: any) => parseFloat(v) || v)
            : value
            ? [parseFloat(value) || value]
            : [];
          if (!value.length) return;
  
          if (isManyRelation) {
            where[key] = {
              [filter.operator === "eq" ? "some" : "none"]: {
                id: {
                  ["in"]: value,
                },
              },
            };
          } else {
            where[key] = {
              id: {
                [filter.operator === "eq" ? "in" : "notIn"]: value,
              },
            };
          }
        }
      }
      query.push(where);
    });
    return query;
  }
  