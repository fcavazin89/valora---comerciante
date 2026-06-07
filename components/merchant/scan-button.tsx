"use client"

import { QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScanButtonProps {
  onScan: () => void
}

export function ScanButton({ onScan }: ScanButtonProps) {
  return (
    <Button
      onClick={onScan}
      className="w-full h-auto py-8 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl shadow-lg shadow-orange-600/25 transition-all duration-200 hover:shadow-orange-600/40 hover:scale-[1.02] active:scale-[0.98] group"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-white/20" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <QrCode className="h-8 w-8" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Gerar QR Code de Cobrança
          </p>
          <p className="text-sm text-orange-200 font-normal">
            Informe o valor e mostre o código para o beneficiário escanear
          </p>
        </div>
      </div>
    </Button>
  )
}
