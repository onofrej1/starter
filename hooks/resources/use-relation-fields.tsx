"use client";
import { getOptions } from "@/actions/resources";
import {
  ForeignKeyType,
  FormField,
  MultipleSelectorType,
} from "@/types/resources";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type RelationFormType = ForeignKeyType | MultipleSelectorType;

export function useRelations(formFields: FormField[], formData: Record<string, any>) {
  const [fields, setFields] = useState<FormField[]>(formFields);
  const [data, setData] = useState(formData);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function getFields() {
      const relations = formFields.filter((f) =>
        ["foreignKey", "manyToMany"].includes(f.type!)
      );

      for (const field of relations as RelationFormType[]) {
        field.options = await queryClient.fetchQuery({
          queryKey: ['getOptions', field.resource],
          queryFn: () => getOptions(field.resource),
        });

        if (field.type === 'manyToMany' && formData?.id && formData[field.name]) {
          const optionValues = formData[field.name].map(
            (value: { id: string }) => {
              const option = field.options?.find((o) => o.value === value.id);
              return { label: option?.label, value: value.id.toString() };
            }
          );
          formData[field.name] = optionValues;
        }        
      }
      const idField: FormField = { name: "id", type: "hidden" };

      if (formData?.id) {
        setData(formData);
      }

      setFields(formData?.id ? [idField, ...formFields] : formFields);
    }
    getFields();
  }, [formFields, formData, queryClient]);

  return { fields, data };
}
