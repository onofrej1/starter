import { FormRender } from "@/components/form/form";
import { RepeaterRenderFunc } from "@/components/form/repeater";
import { Rules } from "@/validation";
import { JSX } from "react";
import { Option } from "@/components/multiple-selector";
import { CellContext } from "@tanstack/react-table";
import { Category, Post, Tag, User } from "@/db/schema";
import { QueryClient } from "@tanstack/react-query";
import { Resource as ResourceName } from "@/lib/resources";

interface BaseFormType {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  onChange?: (e: string) => void;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface MultiSelectOption {
  label: string;
  value: string;
  icon?: string;
}

export type TableData = 
| Category
| Post
| Tag
| User;

export interface TableHeader {
  name: string;
  header: string;
  filter?: FilterField, //Filter; //todo
  enableSort?: boolean;
  enableHide?: boolean;
  render?: (props: CellContext<TableData, unknown>, queryClient: QueryClient) => JSX.Element,
}

export interface InputType extends BaseFormType {
  type:
    | "text"    
    | "email"
    | "hidden"
    | "password";
}

export interface NumberInputType extends BaseFormType {
  type: 'number';
  min?: number;
  max?: number;
}

export interface ColorInputType extends BaseFormType {
  type: "color";
  color: string;  
}

export interface RichtextType extends BaseFormType {
  type: "richtext";
  contentClassName?: string;
}

export interface TextAreaType extends BaseFormType {
  type: "textarea";
  rows?: number;
}

export interface SelectType extends BaseFormType {
  type: "select";
  options?: SelectOption[] | MultiSelectOption[];
}

export interface ForeignKeyType extends BaseFormType {
  type: "foreignKey";
  resource: ResourceName;
  relation: string;
  renderLabel: (data: Record<string, string>) => string | JSX.Element;
  options?: SelectOption[] | MultiSelectOption[];
}

/*export interface MultiSelectType extends BaseFormType {
  type: "m2m-notused";
  options?: SelectOption[] | MultiSelectOption[];
  resource: ResourceName;
  renderLabel: (data: Record<string, any>) => string | JSX.Element;
}*/

export interface MultipleSelectorType extends BaseFormType {
  type: "manyToMany";
  options?: Option[];
  resource: ResourceName;
  field: string;
  renderLabel: (data: Record<string, unknown>) => string | JSX.Element;
}

export interface DatePickerType extends BaseFormType {
  type: "date-picker";
  granularity?: "day" | "hour" | "minute" | "second";
  displayFormat?: { hour24?: string; hour12?: string };
}

export interface CheckboxType extends BaseFormType {
  type: "checkbox";
}

export interface SwitchType extends BaseFormType {
  type: "switch";
}

export interface DateTimePickerType extends BaseFormType {
  type: "datetime-picker";
}

export interface UploadType extends BaseFormType {
  type: "upload";
  allowedTypes?: string[];
  maxSize?: number;
  dir?: string;
}

/*export interface MediaUploadType extends BaseFormType {
  type: "media-upload";
  allowedTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
  uploadText?: string;
  onFileSelect?: (data: { file: File; thumbNail?: string }) => void;
}*/

export interface RepeaterType extends BaseFormType {
  type: "repeater";
  fields: FormField[];
  render?: RepeaterRenderFunc;
}

type FormField =
  | InputType
  | NumberInputType
  | ColorInputType
  | TextAreaType
  | SelectType
  | ForeignKeyType
  | CheckboxType
  | DatePickerType
  | RichtextType
  | UploadType
  | RepeaterType
  | DateTimePickerType
  | SwitchType
  | MultipleSelectorType;

type Resource = {
  name: string;
  name_plural: string;
  model: string;
  menuIcon: string;

  resource: ResourceName;
  relations?: string[];
  rules: Rules;

  form: FormField[];
  renderForm?: FormRender;
  list: TableHeader[];

  advancedFilter?: boolean;
  //floatingBar?: boolean;
  // permissions
  canAddItem?: boolean;
  canEditItem?: boolean;
  canRemoveItem?: boolean;
};

interface BaseFilterType {
  name: string;
  label: string;
  placeholder: string;
}

interface TextFilterType extends BaseFilterType {
  type: "text";
}

interface RangeFilterType extends BaseFilterType {
  type: "range";
}

interface DateFilterType extends BaseFilterType {
  type: "date";
}

interface BooleanFilterType extends BaseFilterType {
  type: "boolean";
}

export interface SelectFilterType extends BaseFilterType {
  type: "select";
  search: string;

  resource: ResourceName;
  renderOption?: (data: Record<string, string>) => string | JSX.Element;
  options?: { label: string; value: string }[];
}

export interface MultiSelectFilterType extends BaseFilterType {
  type: "multiSelect";
  search: string;

  resource: ResourceName;
  renderOption?: (data: Record<string, string>) => string | JSX.Element;
  options?: { label: string; value: string }[];
}

export type FilterField =
  | BooleanFilterType
  | SelectFilterType
  | MultiSelectFilterType
  | DateFilterType
  | TextFilterType
  | RangeFilterType;

//type DrizzleModel = any; // TODO

export type { Resource, FormField };
