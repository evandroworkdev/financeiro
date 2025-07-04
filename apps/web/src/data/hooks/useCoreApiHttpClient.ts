"use client";
import { useMemo } from "react";
import useApi from "./useApi";
import CoreApiHttpClient from "@/adapters/client/CoreApiHttpClient";

export default function useCoreApiHttpClient() {
  const api = useApi();

  const coreClient = useMemo(() => {
    const clientCategoria = new CoreApiHttpClient(api);
    return clientCategoria;
  }, [api]);

  return coreClient;
}
