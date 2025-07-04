"use client";
import { ContaDTO, SaldoDTO } from "adapters";
import { fn } from "utils";
import { createContext, useEffect, useState } from "react";
import useCentralDeAcesso from "../hooks/useCentralDeAcesso";
import useDebounce from "../hooks/useDebounce";
import useDataRef from "../hooks/useDataRef";
import useCoreApiHttpClient from "../hooks/useCoreApiHttpClient";

export interface ContasContextProps {
  contas: ContaDTO[];
  contaEmProcessamento: string | null;
  adicionarConta: () => Promise<void>;
  salvarConta: (conta: ContaDTO) => Promise<void>;
  excluirConta: (conta: ContaDTO) => Promise<void>;
  contaPorId: (id: string) => ContaDTO | null;
  obterSaldos: (dataRef: Date) => SaldoDTO[];
  obterSaldo: (c: ContaDTO, dataRef: Date) => SaldoDTO;
}

const ContasContext = createContext<ContasContextProps>({} as any);

export function ContasProvider(props: any) {
  const [contaEmProcessamento, setContaEmProcessamento] = useState<string | null>(null);
  const [contas, setContas] = useState<ContaDTO[]>([]);
  const { usuario } = useCentralDeAcesso();
  const { dataRef } = useDataRef();
  const debounce = useDebounce();

  const coreApiHttpClient = useCoreApiHttpClient();

  useEffect(() => {
    consultarContas();
  }, [usuario, dataRef]);

  async function adicionarConta() {
    if (!usuario) return;
    const conta: ContaDTO = {
      banco: "Banco",
      descricao: "Descricao",
      cor: "",
      saldos: [],
    };

    await coreApiHttpClient.conta.salvar(usuario, conta);
    await consultarContas();
  }

  async function salvarConta(conta: ContaDTO) {
    if (!usuario || !contas || !conta) return;
    debounce(
      async () => {
        setContaEmProcessamento(conta.id ?? "salvarConta");
        await coreApiHttpClient.conta.salvar(usuario, conta);
        await consultarContas();
        setContaEmProcessamento(null);
      },
      2000,
      conta.id ?? "salvarConta",
    );
  }

  async function excluirConta(conta: ContaDTO) {
    if (!usuario || !contas || !conta.id) return;
    const encontrado = contas.find((c) => c.id === conta.id);

    encontrado && (await coreApiHttpClient.conta.excluir(usuario, encontrado));

    encontrado && setContas(contas.filter((c) => c.id !== encontrado.id));
  }

  async function consultarContas() {
    if (!usuario) return;
    const contas = await coreApiHttpClient.conta.consultar(usuario);
    setContas(contas);
  }

  function contaPorId(contaId: string) {
    return contas.find((c) => c.id === contaId) ?? null;
  }

  function obterSaldos(dataRef: Date): SaldoDTO[] {
    return contas.map((c) => obterSaldo(c, dataRef));
  }

  function obterSaldo(c: ContaDTO, dataRef: Date): SaldoDTO {
    const saldo = c.saldos?.find((f) => fn.dt.mesmoMes(f.data, dataRef));
    if (saldo) return saldo;

    const ultimoSaldo = c.saldos[c.saldos.length - 1];

    if (ultimoSaldo && dataRef > ultimoSaldo.data) {
      return {
        data: dataRef,
        creditos: 0,
        debitos: 0,
        acumulado:
          (ultimoSaldo.acumulado ?? 0) + (ultimoSaldo.creditos ?? 0) - (ultimoSaldo.debitos ?? 0),
      };
    }

    return { data: dataRef, creditos: 0, debitos: 0, acumulado: 0 };
  }

  return (
    <ContasContext.Provider
      value={{
        contas,
        contaEmProcessamento,
        adicionarConta,
        salvarConta,
        excluirConta,
        contaPorId,
        obterSaldos,
        obterSaldo,
      }}
    >
      {props.children}
    </ContasContext.Provider>
  );
}

export default ContasContext;
