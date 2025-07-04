"use client";
import { CategoriaDTO } from "adapters";
import { createContext, useEffect, useRef, useState } from "react";
import categoriasPadroes from "../constants/categorias";
import useCentralDeAcesso from "../hooks/useCentralDeAcesso";
import useCoreApiHttpClient from "../hooks/useCoreApiHttpClient";
import useClientFacade from "../hooks/useClientFacade";

export interface CategoriasContextProps {
  categoriasAgrupadas: CategoriaDTO[];
  categorias: CategoriaDTO[];
  salvarCategoria: (categoria: CategoriaDTO) => Promise<void>;
  excluirCategoria: (categoria: CategoriaDTO) => Promise<void>;
  preencherCategoriasPadroes: () => Promise<void>;
  filtrarCategorias: (filtro: string) => CategoriaDTO[];
  nomeCategoria: (categoriaId?: string | null) => string;
}

const CategoriasContext = createContext<CategoriasContextProps>({} as any);

export function CategoriasProvider(props: any) {
  const { usuario } = useCentralDeAcesso();
  const categoriasRef = useRef<CategoriaDTO[]>([]);
  const [categoriasAgrupadas, setCategoriasAgrupadas] = useState<CategoriaDTO[]>([]);

  const clientFacade = useClientFacade();
  const coreApiHttpClient = useCoreApiHttpClient();

  useEffect(() => {
    consultarCategorias();
  }, [usuario]);

  async function consultarCategorias() {
    if (!usuario) return;
    const categorias = await coreApiHttpClient.categoria.consultar(usuario);
    setCategoriasAgrupadas(categorias);
    categoriasRef.current = _categoriasFlat(categorias);
  }

  async function salvarCategoria(categoria: CategoriaDTO) {
    if (!usuario || !categoriasAgrupadas) return;
    await coreApiHttpClient.categoria.salvar(usuario, categoria);
    await consultarCategorias();
  }

  async function preencherCategoriasPadroes() {
    if (!usuario) return;
    await coreApiHttpClient.categoria.salvarTodas(usuario, categoriasPadroes);
    await consultarCategorias();
  }

  async function excluirCategoria(categoria: CategoriaDTO) {
    if (!usuario || !categoriasAgrupadas || !categoria.id) return;
    await coreApiHttpClient.categoria.excluir(usuario, categoria);
    await consultarCategorias();
  }

  function filtrarCategorias(pesquisa: string) {
    return clientFacade.categoria.filtrar(pesquisa, categoriasAgrupadas);
  }

  function nomeCategoria(categoriaId?: string | null) {
    if (!categoriaId) return "";
    const categoria = categoriasRef.current.find((cat) => cat.id === categoriaId);
    return categoria?.pai ? `${categoria.pai.nome}/${categoria.nome}` : categoria?.nome ?? "";
  }

  function _categoriasFlat(categoriasAgrupadas: CategoriaDTO[]) {
    return categoriasAgrupadas.reduce((todas: CategoriaDTO[], cat: CategoriaDTO) => {
      return [...todas, cat, ...(cat.subcategorias ?? [])];
    }, []);
  }

  return (
    <CategoriasContext.Provider
      value={{
        categoriasAgrupadas,
        get categorias() {
          return categoriasRef.current;
        },
        salvarCategoria,
        excluirCategoria,
        preencherCategoriasPadroes,
        filtrarCategorias,
        nomeCategoria,
      }}
    >
      {props.children}
    </CategoriasContext.Provider>
  );
}

export default CategoriasContext;
