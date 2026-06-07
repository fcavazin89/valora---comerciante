"use client"

import dynamic from "next/dynamic"
import { WagmiProvider } from "@web3auth/modal/react/wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import web3AuthContextConfig from "@/lib/web3auth"
import { suppressKnownWarnings } from "@/lib/suppress-warnings"

suppressKnownWarnings()

const Web3AuthProvider = dynamic(
  () => import("@web3auth/modal/react").then((m) => m.Web3AuthProvider),
  { ssr: false }
)

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [clientId, setClientId] = useState("")

  useEffect(() => {
    // Lê em runtime para garantir que pega o valor mesmo no Vercel
    setClientId(process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? "")
    setMounted(true)
  }, [])

  // Antes de montar no browser: renderiza sem provider (SSR safe)
  if (!mounted) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  // Sem clientId configurado: não inicializa o Web3Auth para evitar crash
  if (!clientId) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  return (
    <Web3AuthProvider config={web3AuthContextConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  )
}
