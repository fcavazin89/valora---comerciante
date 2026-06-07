import { NextResponse } from "next/server"
import { getChargeFromChain, formatChargeAmount, ChargeStatus } from "@/lib/blockchain"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chargeId: string }> }
) {
  try {
    const { chargeId } = await params

    if (!chargeId) {
      return NextResponse.json(
        { error: "chargeId é obrigatório" },
        { status: 400 }
      )
    }

    const charge = await getChargeFromChain(chargeId)

    if (!charge) {
      return NextResponse.json(
        { error: "Cobrança não encontrada na blockchain" },
        { status: 404 }
      )
    }

    const statusMap: Record<number, string> = {
      [ChargeStatus.Pending]: "pending",
      [ChargeStatus.Approved]: "approved",
      [ChargeStatus.Cancelled]: "cancelled",
      [ChargeStatus.Expired]: "expired",
    }

    return NextResponse.json({
      chargeId,
      merchant: charge.merchant,
      beneficiary: charge.beneficiary,
      amount: formatChargeAmount(charge.amount),
      currency: charge.currency,
      status: statusMap[charge.status] || "unknown",
      statusCode: charge.status,
      createdAt: new Date(Number(charge.createdAt) * 1000).toISOString(),
    })
  } catch (error) {
    console.error("Erro ao verificar cobrança:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
