//import { FilterOperator } from "@/types/data-table";
import { Filter } from "./resources";

type OperatorMap = {
  eq: "equals";
  ne: "not";
  iLike: "contains";
  notILike: "contains";
  lt: "lt";
  lte: "lte";
  gt: "gt";
  gte: "gte";
  isEmpty: "";
  isBetween: "isBetween";
};

export function applyFilters(filters: Filter[]) {
  const where: Record<string, unknown> = {
    AND: {},
    NOT: {} as Record<string, unknown>,
  };

  filters.forEach((filter) => {
    let value = filter.value;
    const operator = filter.operator as keyof OperatorMap;

    if (filter.variant === "text") {
      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        where[filter.id] = operator === "isEmpty" ? "" : { not: "" };
      } else {
        const operators: Partial<OperatorMap> = {
          eq: "equals",
          ne: "not",
          iLike: "contains",
          notILike: "contains",
        };
        const key = operators[operator]!;
        if (operator === "notILike") {
          (where["NOT"] as Record<string, unknown>)[filter.id] = {
            [key]: value,
          };
        } else {
          where[filter.id] = { [key]: value };
        }
      }
    }

    if (filter.variant === "number") {
      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        where[filter.id] = operator === "isEmpty" ? null : { not: null };
      } else {
        const operators: Partial<OperatorMap> = {
          eq: "equals",
          ne: "not",
          lt: "lt",
          lte: "lte",
          gt: "gt",
          gte: "gte",
        };
        const key = operators[operator]!;
        where[filter.id] = { [key]: Number(value) };
      }
    }

    if (filter.variant === "range") {
      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        where[filter.id] = operator === "isEmpty" ? null : { not: null };
      } else if (operator === "isBetween") {
        console.log("v", value);
        const firstValue =
          filter.value[0] && filter.value[0].trim() !== ""
            ? Number(filter.value[0])
            : null;
        const secondValue =
          filter.value[1] && filter.value[1].trim() !== ""
            ? Number(filter.value[1])
            : null;
        if (firstValue === null && secondValue === null) {
          return;
        }
        if (firstValue !== null && secondValue === null) {
          where[filter.id] = { equals: Number(firstValue) };
        }
        if (firstValue === null && secondValue !== null) {
          where[filter.id] = { equals: Number(secondValue) };
        }
        (where["AND"] as Record<string, unknown>)[filter.id] = {
          gte: Number(firstValue),
          lte: Number(secondValue),
        };
      } else {
        const operators: Partial<OperatorMap> = {
          eq: "equals",
          ne: "not",
          lt: "lt",
          lte: "lte",
          gt: "gt",
          gte: "gte",
        };
        const key = operators[operator]!;
        where[filter.id] = { [key]: Number(value) };
      }
    }

    if (filter.variant === "boolean") {
      const operators: Partial<OperatorMap> = {
        eq: "equals",
        ne: "not",
      };
      const key = operators[operator]!;
      where[filter.id] = { [key]: value === "false" ? false : !!value };
    }

    if (filter.variant === "date") {
      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        //where[filter.id] = operator === "isEmpty" ? null : { not: null };
      } else {
        const operators: Partial<OperatorMap> = {
          eq: "equals",
          ne: "not",
          lt: "lt",
          lte: "lte",
          gt: "gt",
          gte: "gte",
        };
        const key = operators[operator]!;

        const date = new Date(Number(filter.value));

        if (["eq", "ne"].includes(operator)) {
          const end = new Date(date);
          end.setHours(23, 59, 59, 999);
          if (operator === "eq") {
            (where["AND"] as Record<string, unknown>)[filter.id] = {
              gte: date,
              lte: end,
            };
          } else {
            (where["OR"] as Record<string, unknown>)[filter.id] = {
              lt: date,
              gt: end,
            };
          }
        } else if (["gte", "lt"].includes(operator)) {
          date.setHours(0, 0, 0, 0);
          where[filter.id] = { [key]: date };
        } else if (["lte", "gt"].includes(operator)) {
          date.setHours(23, 59, 59, 999);
          where[filter.id] = { [key]: date };
        }
      }
    }

    if (filter.variant === "multiSelect") {
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

    if (filter.variant === "select") {
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
  });
  return where;
}
