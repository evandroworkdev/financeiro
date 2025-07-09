"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Carregando from "../components/template/shared/Carregando";
import useCentralDeAcesso from "../data/hooks/useCentralDeAcesso";

export default function Home() {
  const { pronto, usuario } = useCentralDeAcesso();
  const router = useRouter();

  useEffect(() => {
    if (pronto) {
      router.push(usuario ? "/dashboard" : "/entrar");
    }
  }, [pronto, usuario, router]);

  return <Carregando telaCheia />;
}
