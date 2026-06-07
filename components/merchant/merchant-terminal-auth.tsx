"use client"

import { useState } from "react"
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react"
import { useAccount } from "wagmi"
import { MerchantHeader } from "./merchant-header"
import { DailySummaryCard } from "./daily-summary-card"
import { ScanButton } from "./scan-button"
import { RecentSalesList } from "./recent-sales-list"
import { GenerateChargeScreen } from "./generate-charge-screen"
import { LoginScreen } from "./login-screen"
import { SalesHistoryScreen } from "./sales-history-screen"
import { toast } from "sonner"

const MERCHANT_DATA = {
  merchantName: "Mercado do Silva",
  establishmentId: "CNPJ: 12.345.678/0001-99",
}

const DAILY_SUMMARY = {
  totalReceived: "R$ 1.420,00",
  transactionCount: 14,
  nextSettlementDate: "Próximo repasse automático: 02/06/2026",
}

const RECENT_TRANSACTIONS = [
  {
    id: "tx_merch_001",
    timestamp: "Hoje, 11:42",
    beneficiaryMasked: "O. Rhye",
    voucherType: "Auxílio Alimentação",
    amount: "R$ 45,50",
    status: { label: "Confirmado", color: "#10B981" },
  },
  {
    id: "tx_merch_002",
    timestamp: "Hoje, 09:15",
    beneficiaryMasked: "C. Augusto",
    voucherType: "Auxílio Alimentação",
    amount: "R$ 120,00",
    status: { label: "Confirmado", color: "#10B981" },
  },
]

type Screen = "home" | "generate_charge" | "history"

export function MerchantTerminalAuth() {
  const { isConnected } = useWeb3AuthConnect()
  const { disconnect } = useWeb3AuthDisconnect()
  const { userInfo } = useWeb3AuthUser()
  const { address } = useAccount()
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [hasGreeted, setHasGreeted] = useState(false)

  if (isConnected && !hasGreeted) {
    setHasGreeted(true)
    const name = userInfo?.name ?? userInfo?.email ?? "Comerciante"
    toast.success("Login realizado com sucesso!", {
      description: `Bem-vindo ao terminal, ${name}`,
    })
  }

  const handleLogout = async () => {
    await disconnect()
    setHasGreeted(false)
    setCurrentScreen("home")
    toast.info("Sessão encerrada com sucesso.")
  }

  const handlePaid = (amount: number) => {
    toast.success(
      `Pagamento recebido! R$ ${amount.toFixed(2).replace(".", ",")} serão repassados na sua conta.`,
      { description: "Transação registrada na blockchain com sucesso.", duration: 5000 }
    )
    setCurrentScreen("home")
  }

  if (!isConnected) {
    return <LoginScreen onLogin={() => {}} />
  }

  if (currentScreen === "history") {
    return <SalesHistoryScreen onBack={() => setCurrentScreen("home")} />
  }

  if (currentScreen === "generate_charge") {
    return (
      <GenerateChargeScreen
        merchantName={userInfo?.name ?? MERCHANT_DATA.merchantName}
        establishmentId={MERCHANT_DATA.establishmentId}
        merchantAddress={address}
        onBack={() => setCurrentScreen("home")}
        onPaid={handlePaid}
      />
    )
  }

  const displayName = userInfo?.name ?? userInfo?.email ?? MERCHANT_DATA.merchantName

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <MerchantHeader
        merchantName={displayName}
        establishmentId={MERCHANT_DATA.establishmentId}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-4 space-y-6">
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg">
          <button
            onClick={() => setCurrentScreen("home")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              currentScreen === "home" ? "bg-orange-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Terminal
          </button>
          <button
            onClick={() => setCurrentScreen("history")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              currentScreen === "history" ? "bg-orange-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Pagamentos Feitos
          </button>
        </div>

        <DailySummaryCard
          totalReceived={DAILY_SUMMARY.totalReceived}
          transactionCount={DAILY_SUMMARY.transactionCount}
          nextSettlementDate={DAILY_SUMMARY.nextSettlementDate}
        />
        <ScanButton onScan={() => setCurrentScreen("generate_charge")} />
        <RecentSalesList transactions={RECENT_TRANSACTIONS} />
      </main>
      <footer className="p-4 border-t border-slate-700/50">
        {address && (
          <p className="text-center text-xs text-slate-600 truncate mb-1">{address}</p>
        )}
        <p className="text-center text-xs text-slate-600">
          Terminal Voucher Social v1.0 • Conexão Blockchain Ativa
        </p>
      </footer>
    </div>
  )
}
