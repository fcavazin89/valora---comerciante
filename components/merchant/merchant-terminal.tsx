"use client"

import { useEffect, useState } from "react"
import { LoginScreen } from "./login-screen"
import { MerchantTerminalAuth } from "./merchant-terminal-auth"

export function MerchantTerminal() {
  const [clientId, setClientId] = useState<string | null>(null)

  useEffect(() => {
    setClientId(process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? "")
  }, [])

  // Ainda hidratando
  if (clientId === null) return null

  // Sem clientId: mostra aviso de configuração
  if (!clientId) {
    return <LoginScreen onLogin={() => {}} missingConfig />
  }

  return <MerchantTerminalAuth />
}
