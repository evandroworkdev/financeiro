"use client";
import { useMemo } from "react";
import FirebaseAuthProvider from "@/adapters/auth/FirebaseAuthProvider";
import useApi from "./useApi";
import { ClientFacade } from "adapters";
import { UsuarioProvedorDados } from "@/adapters/db/UsuarioProvedorDados";

export default function useClientFacade() {
  const api = useApi();

  const clientFacade = useMemo(() => {
    const usuarioProvedorDados = new UsuarioProvedorDados(api);
    const auth = new FirebaseAuthProvider();
    return new ClientFacade(auth, usuarioProvedorDados);
  }, [api]);

  return clientFacade;
}
