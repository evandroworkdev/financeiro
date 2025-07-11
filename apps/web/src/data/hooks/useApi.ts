"use client";
import { useCallback, useContext } from "react";
import RespostaApi from "../model/RespostaApi";
import { getAuth } from "firebase/auth";
import { transformarDatas } from "../utils/transformarDate";

export default function useApi() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!;

  const getToken = async () => {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;
    return firebaseUser ? await firebaseUser.getIdToken() : null;
  };

  const httpGet = useCallback(
    async function (path: string, customToken?: string): Promise<RespostaApi> {
      const url = `${baseUrl}${path}`;
      const token = customToken ?? (await getToken());
      let res: Response;

      try {
        res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${customToken ?? token}`,
          },
          cache: "no-store",
          next: { revalidate: 0 },
        });
      } catch (error) {
        return {
          json: null,
          status: 0,
          sucesso: false,
          erros: ["Servidor inacessível."],
        };
      }

      let resJson;
      try {
        const json = await res.json();
        resJson = transformarDatas(json);
      } catch (error) {
        resJson = null;
      }
      const sucesso = calcularSucesso(res.status);
      const erros = sucesso ? [] : resJson?.errors ?? ["Tipo Erro desconhecido"];
      if (!sucesso) throw erros;

      return {
        json: resJson,
        status: res.status,
        sucesso,
        erros,
      };
    },
    [baseUrl],
  );

  const httpPost = useCallback(
    async function (path: string, body: any, customToken?: string): Promise<RespostaApi> {
      const url = `${baseUrl}${path}`;
      const token = customToken ?? (await getToken());
      let res: Response;

      try {
        res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customToken ?? token}`,
          },
          cache: "no-store",
          body: JSON.stringify(body),
          next: { revalidate: 0 },
        });
      } catch (error) {
        return {
          json: null,
          status: 0,
          sucesso: false,
          erros: ["Servidor inacessível."],
        };
      }

      let resJson;
      try {
        const json = await res.json();
        resJson = transformarDatas(json);
      } catch (error) {
        resJson = null;
      }
      const sucesso = calcularSucesso(res.status);
      const erros = sucesso ? [] : resJson?.errors ?? ["Tipo Erro desconhecido"];
      if (!sucesso) throw erros;

      return {
        json: resJson,
        status: res.status,
        sucesso,
        erros,
      };
    },
    [baseUrl],
  );
  const httpPut = useCallback(
    async function (path: string, body: any, customToken?: string): Promise<RespostaApi> {
      const url = `${baseUrl}${path}`;
      const token = customToken ?? (await getToken());
      let res: Response;

      try {
        res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customToken ?? token}`,
          },
          cache: "no-store",
          body: JSON.stringify(body),
          next: { revalidate: 0 },
        });
      } catch (error) {
        return {
          json: null,
          status: 0,
          sucesso: false,
          erros: ["Servidor inacessível."],
        };
      }

      let resJson;
      try {
        const json = await res.json();
        resJson = transformarDatas(json);
      } catch (error) {
        resJson = null;
      }
      const sucesso = calcularSucesso(res.status);
      const erros = sucesso ? [] : resJson?.errors ?? ["Tipo Erro desconhecido"];
      if (!sucesso) throw erros;

      return {
        json: resJson,
        status: res.status,
        sucesso,
        erros,
      };
    },
    [baseUrl],
  );
  const httpPatch = useCallback(
    async function (path: string, body: any, customToken?: string): Promise<RespostaApi> {
      const url = `${baseUrl}${path}`;
      const token = customToken ?? (await getToken());
      let res: Response;

      try {
        res = await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customToken ?? token}`,
          },
          cache: "no-store",
          body: JSON.stringify(body),
          next: { revalidate: 0 },
        });
      } catch (error) {
        return {
          json: null,
          status: 0,
          sucesso: false,
          erros: ["Servidor inacessível."],
        };
      }

      let resJson;
      try {
        const json = await res.json();
        resJson = transformarDatas(json);
      } catch (error) {
        resJson = null;
      }
      const sucesso = calcularSucesso(res.status);
      const erros = sucesso ? [] : resJson?.errors ?? ["Tipo Erro desconhecido"];

      return {
        json: resJson,
        status: res.status,
        sucesso,
        erros,
      };
    },
    [baseUrl],
  );

  const httpDelete = useCallback(
    async function (path: string, customToken?: string): Promise<RespostaApi> {
      const url = `${baseUrl}${path}`;
      const token = customToken ?? (await getToken());
      let res: Response;

      try {
        res = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customToken ?? token}`,
          },
          cache: "no-store",
          next: { revalidate: 0 },
        });
      } catch (error) {
        return {
          json: null,
          status: 0,
          sucesso: false,
          erros: ["Servidor inacessível."],
        };
      }

      let resJson;
      try {
        const json = await res.json();
        resJson = transformarDatas(json);
      } catch (error) {
        resJson = null;
      }
      const sucesso = calcularSucesso(res.status);
      const erros = sucesso ? [] : resJson?.errors ?? ["Tipo Erro desconhecido"];
      if (!sucesso) throw erros;

      return {
        json: resJson,
        status: res.status,
        sucesso,
        erros,
      };
    },
    [baseUrl],
  );

  function calcularSucesso(status: number): boolean {
    return status >= 200 && status < 300;
  }

  return { httpGet, httpPost, httpPut, httpDelete, httpPatch };
}
