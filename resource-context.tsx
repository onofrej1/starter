"use client";
import { resources } from "@/resources";
import { Resource } from "@/types/resources";
import { useParams } from "next/navigation";
import React, {
  Context,
  createContext,
  useContext as useReactContext,
  useState,
} from "react";
import { categories, posts, tags } from "./db/schema";

type AnyResource = 
| Resource <typeof categories> 
| Resource <typeof tags> 
| Resource<typeof posts>;

interface IResourceContext {
  resource: AnyResource;
  setResource: React.Dispatch<React.SetStateAction<IResourceContext['resource']>>;
}

const ResourceContext = createContext<IResourceContext | undefined>(undefined);

const ResourceProvider = ({ children }: React.PropsWithChildren) => {
  const { name } = useParams();
  const resourceConf = resources.find((r) => r.resource === name);

  const [resource, setResource] = useState(
    resourceConf!
  );

  return (
    <ResourceContext value={{ resource, setResource }}>
      {children}
    </ResourceContext>
  );
};

const useContext = <T extends IResourceContext>(
  context: Context<T | undefined>
): T => {
  const value = useReactContext(context);

  if (value == null) {
    throw new Error(
      'The "useContext" hook must be used within the corresponding context "Provider"'
    );
  }

  return value;
};

export { ResourceContext, ResourceProvider, useContext };
