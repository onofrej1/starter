"use client";
import React, { useEffect, useState } from "react";
import Form from "@/components/form/form";
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
import { get } from "@/actions/resources";
import { FormField } from "@/types/resources";
import { useRelations } from "@/hooks/resources/use-relation-fields";

interface ResourceFormDialogProps {
  id?: number;
  open: boolean;
  onOpenChange?(open: boolean): void;
}

export default function ResourceFormDialog(props: ResourceFormDialogProps) {
  const { id, open: isOpen, onOpenChange } = props;

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  
  const { resource: { form, /*relations,*/ resource, rules, renderForm } } = useContext(ResourceContext);

  const { data = {} } = useQuery<ReturnType<typeof get>>({
    gcTime: 0,
    queryKey: ["getResource", resource, id],
    queryFn: () => get(resource, id!),
    enabled: !!id,
  });

  const { fields, data: updatedData } = useRelations(form, data);
  //const { data: formData } = useRichtextFields(form, data /*updatedData*/);
  const { submitForm, status } = useSubmitForm(resource, fields);  

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
          data={updatedData}
          render={renderForm}
          action={submitForm}
        />
      </DialogContent>
    </Dialog>
  );
}
