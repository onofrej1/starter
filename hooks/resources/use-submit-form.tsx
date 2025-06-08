"use client";
import {
  FormField,
} from "@/types/resources";
import { useState } from "react";
import { deleteFile, uploadFiles } from "@/actions/files";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DrizzleResource, saveData } from "@/actions/resources";
//import { MutationFunction } from "@/api";

type MutationFunction = typeof saveData;

export function useSubmitForm(resource: DrizzleResource, fields: FormField[], mutationFn: MutationFunction) {
  const queryClient = useQueryClient();
  type Status = 'success' | 'error' | 'idle';

  const [status, setStatus] = useState<Status>("idle");
  const [responseData, setResponseData] = useState<Awaited<ReturnType<typeof saveData>>>();

  const { mutate } = useMutation({
    mutationFn,
    onSuccess: (data) => {
      setStatus('success');
      setResponseData(data);
      queryClient.invalidateQueries({
        queryKey: ["getResourceData", resource],
      });
    },
    onError: () => {
      setStatus('error');
    }
  });

  const submitForm = async (data: Record<string, any>) => {
    const uploadData = new FormData();
      const uploadFields = fields.filter((f) => f.type === "upload");

      for (const field of uploadFields) {
        const { file, previousFile, isDirty } = data[field.name];
        if (!isDirty) {
          delete data[field.name];
          continue;
        }
        if (previousFile) {
          await deleteFile(previousFile.name);
        }
        if (file) {
          uploadData.append(field.name, file, file.name);
          data[field.name] = file.name;
        } else if (data[field.name]) {
          data[field.name] = null;
        }
      }
  
      if (!uploadData.entries().next().done) {
        await uploadFiles(uploadData);
      }

      mutate({ resource, data });
  };

  return { submitForm, status, responseData };
}
