import { FormRender } from "@/components/form/form";
import { RepeaterRenderFunc } from "@/components/form/repeater";
import { Rules } from "@/validation";
import { JSX } from "react";
//import { Option } from "@/components/multiple-selector";
import { QueryClient } from "@tanstack/react-query";
import { DrizzleResource } from "@/actions/resources";

interface BaseFormType {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  onChange?: any;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface MultiSelectOption {
  label: string;
  value: string;
  icon?: any;
}

export interface TableData {
  [key: string]: any;
}

export interface TableHeader {
  name: string;
  header: string;
  filter?: any; //todo
  enableSort?: boolean;
  enableHide?: boolean;
  render?: (renderProps: {
    row: TableData;
    queryClient: QueryClient;
  }) => JSX.Element;
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
  resource: DrizzleModel;
  relation: string;
  renderLabel: (data: Record<string, any>) => string | JSX.Element;
  options?: SelectOption[] | MultiSelectOption[];
}

/*export interface MultiSelectType extends BaseFormType {
  type: "m2m-notused";
  options?: SelectOption[] | MultiSelectOption[];
  resource: PrismaModel;
  renderLabel: (data: Record<string, any>) => string | JSX.Element;
}*/

export interface MultipleSelectorType extends BaseFormType {
  type: "manyToMany";
  options?: Option[];
  resource: DrizzleModel;
  renderLabel: (data: Record<string, any>) => string | JSX.Element;
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

interface BaseFilterType {
  name: string;
  label: string;
}

interface TextFilterType extends BaseFilterType {
  type: "text";
}

interface NumberFilterType extends BaseFilterType {
  type: "number";
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
  resource: string;
  renderOption?: any;
  options?: { label: string; value: string }[];
}

export interface MultiSelectFilterType extends BaseFilterType {
  type: "multi-select";
  search: string;
  resource: string;
  renderOption?: any;
  options?: { label: string; value: string }[];
}

export type FilterField =
  | BooleanFilterType
  | SelectFilterType
  | MultiSelectFilterType
  | DateFilterType
  | TextFilterType
  | NumberFilterType;

type Resource = {
  name: string;
  name_plural: string;
  model: DrizzleModel;
  resource: DrizzleResource;
  relations?: string[];
  rules: Rules;
  menuIcon: string;
  form: FormField[];
  renderForm?: FormRender;
  list: TableHeader[];
  filter: FilterField[];
  advancedFilter?: boolean;
  floatingBar?: boolean;
  // permissions
  canAddItem?: boolean;
  canEditItem?: boolean;
  canRemoveItem?: boolean;
};

type DrizzleModel = any; // TODO

export type { Resource, FormField };
