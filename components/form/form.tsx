"use client";
import {
  FormState,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX, useEffect } from "react";
import { FormField as FormField_, SelectType } from "@/types/resources";
import { Rules } from "@/validation";
import FormInput from "@/components/form/base/input";
import FormSelect from "@/components/form/base/select";
import FormCheckbox from "@/components/form/base/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Textarea from "./base/textarea";
import RichEditor from "./richeditor";
import FileUploader from "./file-uploader";
import RepeaterInput from "./repeater";
import { Form, FormField } from "@/components/ui/form";
//import { DateTimePicker } from "./datetime-picker";
import Switch from "./base/switch";
//import { MultipleSelector } from "./multiple-selector";
import { z } from "zod";

export interface FormDataValue {
  //[key: string]: unknown;
  file: File,
  previousFile: File,
  isDirty: boolean,
}

export type DefaultFormData = {
  [key: string]: string | { file: File }
}

export type ActionResult = {
  redirect?: string;
  message?: string;
  error?: { path: string; message: string };
};

export type FormRenderProps = {
  fields: Record<string, JSX.Element>;
  formState: FormState<DefaultFormData>;
  getValues: UseFormGetValues<DefaultFormData>;
  setValue: UseFormSetValue<DefaultFormData>;
  trigger: UseFormTrigger<DefaultFormData>;
};

export type FormRender = (props: FormRenderProps) => JSX.Element;

interface FormProps<T> {
  fields: FormField_[];
  validation?: Rules;
  data?: DefaultFormData;
  action?: (data: T) => Promise<ActionResult>;
  buttons?: ((props: Partial<FormState<DefaultFormData>>) => JSX.Element)[];
  render?: FormRender;
  children?: FormRender;
}

export default function Form_<T = DefaultFormData>({
  fields,
  validation,
  data,
  action,
  buttons,
  render,
  children,
}: FormProps<T>) {
  const { replace } = useRouter();

  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver((validation) || z.any()),
    defaultValues: data,
  });

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  const { isValid, errors, isLoading } = form.formState;

  if (errors && Object.keys(errors).length > 0) {
    console.log("Validation errors:", errors);
  }

  const submitForm = async (data: T) => {
    console.log(data);
    if (!action) return;

    try {
      const response = await action(data);
      if (!response) {
        return;
      }
      if (response.message) {
        toast(response.message);
      }
      if (response.error) {
        form.setError(response.error.path, {
          message: response.error.message,
        });
      }
      if (response.redirect) {
        replace(response.redirect);
        return;
      }
    } catch (e) {
      console.log(e);
      return "An error occured";
    }
  };

  const renderField = (formField: FormField_) => {
    const { name, type, label, className } = formField;

    return (
      <>
        {["text", "number", "email", "hidden"].includes(type) && (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormInput
                field={field}
                label={label}
                className={className}
                type={type}
              />
            )}
          />
        )}

        {type === "textarea" && (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <Textarea
                field={field}
                label={label}
                className={className}
                rows={formField.rows}
              />
            )}
          />
        )}

        {type === "checkbox" && (
          <>
            <FormField
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormCheckbox
                  field={field}
                  label={label}
                  className={className}
                />
              )}
            />
          </>
        )}

        {type === "switch" && (
          <>
            <FormField
              control={form.control}
              name={name}
              render={({ field }) => (
                <Switch field={field} label={label} className={className} />
              )}
            />
          </>
        )}

        {type === "date-picker" && (
          <>
            {/*<FormField
              control={form.control}
              name={name}
              render={({ field }) => (
                <>
                  <DateTimePicker
                    displayFormat={formField.displayFormat}
                    granularity={formField.granularity || "day"}
                    label={label}
                    field={field}
                    className={className}
                  />
                </>
              )}
            />*/}
          </>
        )}

        {["select", "foreignKey"].includes(type) && (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormSelect
                label={label}
                field={field}
                className={className}
                options={(formField as SelectType).options!}
              />
            )}
          />
        )}

        {/*type === "manyToMany" && (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => {
              return (
                <>
                  {<MultipleSelector
                    field={field}
                    label={label}
                    className={className}
                    options={formField.options!}
                  />}
                </>
              );
            }}
          />
        )*/}

        {type === "richtext" && (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <RichEditor
                field={field}
                label={label}
                className={className}
                contentClassName={formField.contentClassName}
              />
            )}
          />
        )}

        {type === "upload" && (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FileUploader
                field={field}
                label={label}
                allowedTypes={formField.allowedTypes}
                maxSize={formField.maxSize}
              />
            )}
          />
        )}

        {/*type === "datetime-picker" && (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <DateTimePicker
                granularity="second"
                label={label}
                field={field}
                className={className}
              />
            )}
          />
        )*/}

        {type === "repeater" && (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <RepeaterInput
                control={form.control}
                field={field}
                label={label}
                unregister={form.unregister}
                fields={formField.fields}
                render={formField.render}
                renderField={renderField}
              />
            )}
          />
        )}
      </>
    );
  };

  const fieldsToRender = fields.reduce((acc, field) => {
    acc[field.name] = renderField(field);
    return acc;
  }, {} as Record<string, JSX.Element>);

  if (children) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)}>
          {children({
            fields: fieldsToRender,
            ...form,
          })}
        </form>
      </Form>
    );
  }

  if (render) {
    const Content = render({
      fields: fieldsToRender,
      ...form,
    });
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)}>{Content}</form>
      </Form>
    );
  }

  const fieldNames = fields.map((f) => f.name);
  const commonErrorMessages = Object.keys(errors).filter(
    (e) => !fieldNames.includes(e)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)}>
        {fields.map((field) => (
          <div className="mb-3" key={field.name}>
            {renderField(field)}
          </div>
        ))}

        {commonErrorMessages.map((e) => (
          <div className="my-4" key={e}>
            {errors[e]?.message?.toString()}
          </div>
        ))}

        {buttons?.length ? (
          <div className="flex space-x-2">
            {buttons.map((Button, index) => (
              <Button key={index} isValid={isValid} isLoading={isLoading} />
            ))}
          </div>
        ) : (
          <Button type="submit" className="mt-3">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
