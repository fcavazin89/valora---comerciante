"use client"

import { useState } from "react"
import { 
  ArrowLeft, 
  Calendar, 
  Download, 
  Filter, 
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Receipt,
  TrendingUp,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SalesHistoryScreenProps {
  onBack: () => void
}

interface Transaction {
  id: string
  date: string
  time: string
  beneficiaryName: string
  program: string
  tokenId: string
  amount: number
  status: "confirmed" | "pending" | "cancelled"
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-001",
    date: "2024-01-15",
    time: "14:32",
    beneficiaryName: "Maria S.",
    program: "Auxilio Alimentacao",
    tokenId: "NFT-2024-78432",
    amount: 87.50,
    status: "confirmed"
  },
  {
    id: "TXN-002",
    date: "2024-01-15",
    time: "11:15",
    beneficiaryName: "Jose P.",
    program: "Auxilio Alimentacao",
    tokenId: "NFT-2024-65219",
    amount: 156.30,
    status: "confirmed"
  },
  {
    id: "TXN-003",
    date: "2024-01-15",
    time: "09:47",
    beneficiaryName: "Ana C.",
    program: "Auxilio Alimentacao",
    tokenId: "NFT-2024-91823",
    amount: 234.00,
    status: "confirmed"
  },
  {
    id: "TXN-004",
    date: "2024-01-14",
    time: "16:22",
    beneficiaryName: "Carlos M.",
    program: "Auxilio Alimentacao",
    tokenId: "NFT-2024-45632",
    amount: 145.80,
    status: "confirmed"
  },
  {
    id: "TXN-005",
    date: "2024-01-14",
    time: "13:05",
    beneficiaryName: "Lucia R.",
    program: "Auxilio Alimentacao",
    tokenId: "NFT-2024-33218",
    amount: 78.90,
    status: "pending"
  },
  {
    id: "TXN-006",
    date: "2024-01-14",
    time: "10:30",
    beneficiaryName: "Pedro H.",
    program: "Auxilio Alimentacao",
    tokenId: "NFT-2024-22145",
    amount: 312.50,
    status: "confirmed"
  },
  {
    id: "TXN-007",
    date: "2024-01-13",
    time: "15:45",
    beneficiaryName: "Sandra L.",
    program: "Auxilio Alimentacao",
    tokenId: "NFT-2024-88921",
    amount: 95.00,
    status: "cancelled"
  },
  {
    id: "TXN-008",
    date: "2024-01-13",
    time: "11:20",
    beneficiaryName: "Roberto F.",
    program: "Auxilio Alimentacao",
    tokenId: "NFT-2024-77432",
    amount: 189.75,
    status: "confirmed"
  },
  {
    id: "TXN-009",
    date: "2024-01-12",
    time: "14:10",
    beneficiaryName: "Fernanda A.",
    program: "Auxilio Alimentacao",
    tokenId: "NFT-2024-55123",
    amount: 267.30,
    status: "confirmed"
  },
  {
    id: "TXN-010",
    date: "2024-01-12",
    time: "09:55",
    beneficiaryName: "Marcos V.",
    program: "Auxilio Alimentacao",
    tokenId: "NFT-2024-44287",
    amount: 123.45,
    status: "confirmed"
  },
]

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

function getStatusConfig(status: Transaction["status"]) {
  switch (status) {
    case "confirmed":
      return {
        label: "Confirmado",
        icon: CheckCircle2,
        className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      }
    case "pending":
      return {
        label: "Pendente",
        icon: Clock,
        className: "bg-amber-500/20 text-amber-400 border-amber-500/30"
      }
    case "cancelled":
      return {
        label: "Cancelado",
        icon: XCircle,
        className: "bg-red-500/20 text-red-400 border-red-500/30"
      }
  }
}

export function SalesHistoryScreen({ onBack }: SalesHistoryScreenProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [periodFilter, setPeriodFilter] = useState<string>("7days")

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => {
    const matchesSearch = 
      tx.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.tokenId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalConfirmed = MOCK_TRANSACTIONS
    .filter(tx => tx.status === "confirmed")
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalTransactions = MOCK_TRANSACTIONS.filter(tx => tx.status === "confirmed").length
  const uniqueBeneficiaries = new Set(MOCK_TRANSACTIONS.map(tx => tx.beneficiaryName)).size

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-slate-700/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-slate-50">Pagamentos Feitos</h1>
          <p className="text-xs text-slate-400">Historico de transacoes com voucher</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-600 text-slate-300 hover:bg-slate-800 gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </header>

      {/* Summary Cards */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Total</span>
            </div>
            <p className="text-lg font-bold text-emerald-400">{formatCurrency(totalConfirmed)}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Receipt className="h-4 w-4" />
              <span className="text-xs">Vendas</span>
            </div>
            <p className="text-lg font-bold text-orange-400">{totalTransactions}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Clientes</span>
            </div>
            <p className="text-lg font-bold text-purple-400">{uniqueBeneficiaries}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="px-4 pb-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar por nome, token ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-2">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="flex-1 bg-slate-800 border-slate-700 text-slate-200">
              <Calendar className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="7days">Ultimos 7 dias</SelectItem>
              <SelectItem value="30days">Ultimos 30 dias</SelectItem>
              <SelectItem value="all">Todo periodo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 bg-slate-800 border-slate-700 text-slate-200">
              <Filter className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="confirmed">Confirmados</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-2">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Nenhuma transacao encontrada</p>
              <p className="text-sm text-slate-500">Tente ajustar os filtros</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const statusConfig = getStatusConfig(tx.status)
              const StatusIcon = statusConfig.icon
              
              return (
                <Card key={tx.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-slate-100">{tx.beneficiaryName}</p>
                        <p className="text-xs text-slate-500">{tx.program}</p>
                      </div>
                      <Badge className={`${statusConfig.className} gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400">
                          <span className="text-slate-500">Token:</span> {tx.tokenId}
                        </p>
                        <p className="text-xs text-slate-400">
                          <span className="text-slate-500">ID:</span> {tx.id}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatDate(tx.date)} as {tx.time}
                        </p>
                      </div>
                      <p className={`text-xl font-bold ${tx.status === "cancelled" ? "text-slate-500 line-through" : "text-emerald-400"}`}>
                        {formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
