"use client";
import {
  ControllerRenderProps,  
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormItem, FormLabel, FormMessage, useFormField } from "../../ui/form";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  className?: string;
  field: ControllerRenderProps;
}

export default function FormSelect({
  label,
  options,
  field,
  className,
}: SelectProps) {
  const { error } = useFormField();
  
  const Element = (
    <Select
      name={field.name}
      onValueChange={field.onChange}
      defaultValue={field.value?.toString()}
      value={field.value?.toString()}
    >
      <SelectTrigger className={cn(error && "text-destructive border-destructive", className)} value={field.value?.toString()}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options &&
          options?.map((option) => (
            <SelectItem key={option.value} value={option.value?.toString()}>
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );

  if (!label) {
    return Element;
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{Element}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
