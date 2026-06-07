"use client"

import { Clock, User, CreditCard, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  timestamp: string
  beneficiaryMasked: string
  voucherType: string
  amount: string
  status: {
    label: string
    color: string
  }
}

interface RecentSalesListProps {
  transactions: Transaction[]
  onViewAll?: () => void
}

export function RecentSalesList({ transactions, onViewAll }: RecentSalesListProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">
          Últimos Recebimentos Social
        </CardTitle>
        {onViewAll && (
          <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 h-8 px-2 text-xs">
            Ver todos
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-700/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                <CreditCard className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-slate-500" />
                  <span className="text-sm font-medium text-slate-200">{tx.beneficiaryMasked}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>{tx.timestamp}</span>
                  <span className="text-slate-600">•</span>
                  <span>{tx.voucherType}</span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm font-semibold text-slate-50">{tx.amount}</p>
              <Badge 
                className="text-[10px] px-1.5 py-0 h-5 gap-1"
                style={{ 
                  backgroundColor: `${tx.status.color}20`, 
                  color: tx.status.color,
                  borderColor: `${tx.status.color}40`
                }}
              >
                <CheckCircle2 className="h-2.5 w-2.5" />
                {tx.status.label}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
