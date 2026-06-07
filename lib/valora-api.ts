/**
 * Cliente para a Valora API (valora-api — Express/Node)
 * Base: process.env.NEXT_PUBLIC_API_URL (ex: http://localhost:4000)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}/api/v1${path}`
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erro desconhecido" }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// ── Transações ────────────────────────────────────────────────────────────────
export const transacaoApi = {
  getAll: (params?: string) => apiFetch<any>(`/transacoes${params ? `?${params}` : ""}`),
  getByComercio: (comercioId: number) =>
    apiFetch<any>(`/transacoes?comercio_id=${comercioId}`),
  create: (body: {
    cartao_id: number
    comercio_id: number
    valor: number
    tipo: string
    tx_hash?: string
  }) =>
    apiFetch<any>("/transacoes", {
      method: "POST",
      body: JSON.stringify(body),
    }),
}

// ── Comércios ─────────────────────────────────────────────────────────────────
export const comercioApi = {
  getAll: () => apiFetch<any>("/comercios"),
  getById: (id: number) => apiFetch<any>(`/comercios/${id}`),
  getByWallet: async (walletAddress: string) => {
    const data = await apiFetch<any>(`/comercios?wallet_address=${walletAddress}`)
    return data?.data?.[0] ?? null
  },
}

// ── Credenciamentos ───────────────────────────────────────────────────────────
export const credenciamentoApi = {
  getByComercio: (comercioId: number) =>
    apiFetch<any>(`/credenciamentos?comercio_id=${comercioId}`),
}

// ── Saques ────────────────────────────────────────────────────────────────────
export const saqueApi = {
  getByComercio: (comercioId: number) =>
    apiFetch<any>(`/saques?comercio_id=${comercioId}`),
  create: (body: { comercio_id: number; valor: number; tx_hash?: string }) =>
    apiFetch<any>("/saques", {
      method: "POST",
      body: JSON.stringify(body),
    }),
}

// ── Saúde da API ──────────────────────────────────────────────────────────────
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`)
    return res.ok
  } catch {
    return false
  }
}
