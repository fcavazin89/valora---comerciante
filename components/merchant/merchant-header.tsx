"use client"

import { Store, CheckCircle2, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface MerchantHeaderProps {
  merchantName: string
  establishmentId: string
  onLogout?: () => void
}

export function MerchantHeader({ merchantName, establishmentId, onLogout }: MerchantHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-slate-700/50">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600/20">
          <Store className="h-6 w-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-50">{merchantName}</h1>
          <p className="text-xs text-slate-400">{establishmentId}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Credenciado
        </Badge>
        {onLogout && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  )
}
