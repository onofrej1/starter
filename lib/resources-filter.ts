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
    const value = filter.value;
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
      } else if (
        operator === "isBetween" &&
        Array.isArray(filter.value) &&
        filter.value.length === 2
      ) {
        const startDate = new Date(Number(filter.value[0]));
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(Number(filter.value[1]));
        endDate.setHours(23, 59, 59, 999);

        (where["AND"] as Record<string, unknown>)[filter.id] = {
          gte: startDate,
          lte: endDate,
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

    if (
      filter.variant === "date" &&
      operator === "isBetween" &&
      Array.isArray(filter.value) &&
      filter.value.length === 2
    ) {
      const date = new Date(Number(filter.value[0]));
      date.setHours(0, 0, 0, 0);
      const dateEnd = new Date(Number(filter.value[1]));
      dateEnd.setHours(23, 59, 59, 999);
      (where["AND"] as Record<string, unknown>)[filter.id] = {
        gte: date,
        lte: dateEnd,
      };
    }

    if (["multiSelect", "select"].includes(filter.variant)) {
      console.log('f', filter);
      const [key, op] = 'categories_'.split('_'); //filter.search.split("_");
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

      if (["inArray", "notInArray", "eq", "ne"].includes(operator)) {
        const arrayValue = Array.isArray(value)
          ? value.map((v) => parseFloat(v) || v)
          : value
          ? [parseFloat(value) || value]
          : [];

        if (isManyRelation) {
          const columnFilter = ['inArray', 'eq'].includes(filter.operator) ? "some" : "none";
          where[key] = {
            [columnFilter]: {
              id: {
                ["in"]: arrayValue,
              },
            },
          };
        } else {
          const columnFilter = ['inArray', 'eq'].includes(filter.operator) ? "in" : "notIn";
          where[key] = {
            id: {
              [columnFilter]: arrayValue,
            },
          };
        }
      }
    }
  });

  return where;
}
