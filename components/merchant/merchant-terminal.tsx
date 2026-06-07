"use client"

import { LoginScreen } from "./login-screen"
import { MerchantTerminalAuth } from "./merchant-terminal-auth"

const hasClientId = !!process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID

export function MerchantTerminal() {
  if (!hasClientId) {
    return <LoginScreen onLogin={() => {}} />
  }

  return <MerchantTerminalAuth />
}
