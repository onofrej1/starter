"use client";
import React, { useEffect, useState } from "react";
import Form from "@/components/form/form";
//import { useRelationFields } from "@/hooks/resources/use-relation-fields";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
//import { createResource, getResource, updateResource } from "@/api";
import { ResourceContext, useContext } from "@/resource-context";
import { useSubmitForm } from "@/hooks/resources/use-submit-form";
//import { useRichtextFields } from "@/hooks/resources/use-richtext-fields";
import { create, get, update } from "@/actions/resources";
import { FormField } from "@/types/resources";

interface ResourceFormDialogProps {
  id?: number;
  open: boolean;
  onOpenChange?(open: boolean): void;
}

export default function ResourceFormDialog(props: ResourceFormDialogProps) {
  const { id, open: isOpen, onOpenChange } = props;

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    console.log('set is open', isOpen);
    setOpen(isOpen);
  }, [isOpen]);
  
  const { resource: { form, /*relations,*/ resource, rules, renderForm } } = useContext(ResourceContext);

  const { data = {} } = useQuery({
    //initialData: {},
    gcTime: 0,
    queryKey: ["getResource", resource, id],
    queryFn: () => get(resource, id!),
    enabled: !!id,
  });

  //const { fields, data: updatedData } = useRelationFields(form, data);
  //const { data: formData } = useRichtextFields(form, data /*updatedData*/);
  const { submitForm, status } = useSubmitForm(resource, form /*fields*/, !!id ? update : create);
  console.log(submitForm);
  
  useEffect(() => {
    if (status === 'success') {
      onOpenChange?.(false);
    }
  }, [onOpenChange, status]);

  const idField: FormField = { name: "id", type: "hidden" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-scroll max-h-[calc(100vh-30px)] my-auto min-w-fitXXX min-w-[700px]">
        <DialogHeader>
          <DialogTitle>{id ? "Update" : "Add new"} item</DialogTitle>
        </DialogHeader>
        <Form
          fields={id ? [idField, ...form] : form}
          validation={rules}
          data={data}
          render={renderForm}
          //action={submitForm}
        />
      </DialogContent>
    </Dialog>
  );
}
