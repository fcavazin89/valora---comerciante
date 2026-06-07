"use client"

import { useEffect, useState } from "react"
import { MerchantTerminal } from "./merchant-terminal"

export function MerchantTerminalClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-slate-400 text-sm">Carregando terminal...</div>
      </div>
    )
  }

  return <MerchantTerminal />
}
