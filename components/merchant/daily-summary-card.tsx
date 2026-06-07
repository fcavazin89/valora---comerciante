"use client"

import { TrendingUp, Receipt, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DailySummaryCardProps {
  totalReceived: string
  transactionCount: number
  nextSettlementDate: string
}

export function DailySummaryCard({ 
  totalReceived, 
  transactionCount, 
  nextSettlementDate 
}: DailySummaryCardProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Vendas com Voucher Hoje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-slate-50 tracking-tight">{totalReceived}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Receipt className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-sm text-slate-400">{transactionCount} transações</span>
            </div>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <span className="text-2xl font-bold text-emerald-400">{transactionCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
          <Calendar className="h-4 w-4 text-slate-500" />
          <p className="text-xs text-slate-500">{nextSettlementDate}</p>
        </div>
      </CardContent>
    </Card>
  )
}
