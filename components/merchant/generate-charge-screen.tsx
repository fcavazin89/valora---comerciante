"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowLeft, Loader2, RefreshCw, CheckCircle2, Store, ExternalLink, XCircle } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface GenerateChargeScreenProps {
  merchantName: string
  establishmentId: string
  merchantAddress?: string
  onBack: () => void
  onPaid: (amount: number) => void
}

export function GenerateChargeScreen({
  merchantName,
  establishmentId,
  merchantAddress,
  onBack,
  onPaid,
}: GenerateChargeScreenProps) {
  const [inputValue, setInputValue] = useState("")
  const [chargeId, setChargeId] = useState<string | null>(null)
  const [amount, setAmount] = useState(0)
  const [isWaiting, setIsWaiting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval>>(null)

  const numericValue = Number.parseFloat(inputValue.replace(",", ".")) || 0
  const isValidAmount = numericValue > 0

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (!numbers) return ""
    const cents = Number.parseInt(numbers) / 100
    return cents.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(formatCurrency(e.target.value))
  }

  const handleGenerate = async () => {
    if (!isValidAmount) return
    setIsCreating(true)
    setError("")

    const id = `chg_${Date.now().toString(36)}`
    setChargeId(id)
    setAmount(numericValue)

    try {
      const res = await fetch("/api/charges/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chargeId: id,
          merchantAddress: merchantAddress || "0x0000000000000000000000000000000000000000",
          amount: numericValue,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar cobrança")
      }

      setTxHash(data.transactionHash)
      setIsWaiting(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao conectar com a blockchain")
      setChargeId(null)
      setAmount(0)
    } finally {
      setIsCreating(false)
    }
  }

  const checkStatus = useCallback(async () => {
    if (!chargeId) return

    try {
      const res = await fetch(`/api/charges/${chargeId}/status`)
      if (!res.ok) return

      const data = await res.json()
      setStatus(data.status)

      if (data.status === "approved") {
        if (pollingRef.current) clearInterval(pollingRef.current)
        onPaid(amount)
      }
    } catch {
      // silent fail no polling
    }
  }, [chargeId, amount, onPaid])

  useEffect(() => {
    if (!isWaiting) return

    pollingRef.current = setInterval(checkStatus, 3000)

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [isWaiting, checkStatus])

  const handleReset = () => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    setChargeId(null)
    setIsWaiting(false)
    setInputValue("")
    setAmount(0)
    setError("")
    setTxHash(null)
    setStatus(null)
  }

  const qrPayload = chargeId
    ? JSON.stringify({
        type: "VOUCHER_CHARGE",
        chargeId,
        merchantName,
        establishmentId,
        amount,
        currency: "BRL",
        createdAt: new Date().toISOString(),
        apiUrl: `${window.location.origin}/api/charges/approve`,
      })
    : ""

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <header className="flex items-center gap-3 p-4 border-b border-slate-700/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Cobrança por QR Code</h1>
          <p className="text-xs text-slate-400">
            {chargeId ? "Aguardando pagamento do beneficiário" : "Informe o valor da venda"}
          </p>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {!chargeId ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="charge-value" className="text-slate-200 text-base">
                Valor Total da Compra (R$)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-medium">
                  R$
                </span>
                <Input
                  id="charge-value"
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="h-16 pl-12 text-2xl font-semibold bg-slate-900/50 border-slate-700 text-slate-50 placeholder:text-slate-600 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>
              <p className="text-sm text-slate-500">
                Ao gerar, será exibido um QR Code para o beneficiário escanear no app dele e autorizar o pagamento via
                blockchain.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center gap-5">
                <div className="flex items-center gap-2 text-slate-300">
                  <Store className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-medium">{merchantName}</span>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-lg">
                  <QRCodeSVG
                    value={qrPayload}
                    size={220}
                    level="M"
                    marginSize={0}
                    fgColor="#0F172A"
                    bgColor="#FFFFFF"
                  />
                </div>

                <div className="text-center space-y-1">
                  <p className="text-sm text-slate-400">Valor da cobrança</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    R$ {amount.toFixed(2).replace(".", ",")}
                  </p>
                </div>

                {status === "approved" ? (
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Pagamento confirmado na blockchain!</span>
                  </div>
                ) : status === "cancelled" ? (
                  <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-red-400">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Cobrança cancelada</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-orange-300">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Aguardando o beneficiário escanear...</span>
                  </div>
                )}

                {txHash && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER || "https://sepolia.etherscan.io"}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-orange-400 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ver transação no explorador
                  </a>
                )}
              </CardContent>
            </Card>

            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
              <p className="text-sm text-slate-400 leading-relaxed">
                Peça ao beneficiário para abrir o app de vouchers e escanear o código acima. O saldo será debitado
                automaticamente após a confirmação na blockchain.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700/50">
        {!chargeId ? (
          <Button
            onClick={handleGenerate}
            disabled={!isValidAmount || isCreating}
            className="w-full h-14 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold text-lg rounded-xl transition-all duration-200 hover:shadow-orange-600/25 hover:shadow-lg"
          >
            <span className="flex items-center gap-2">
              {isCreating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Criando cobrança na blockchain...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Gerar QR Code de Cobrança
                </>
              )}
            </span>
          </Button>
        ) : (
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full h-14 border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-800 hover:text-slate-50 font-semibold text-lg rounded-xl"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Cancelar e Gerar Nova Cobrança
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}
