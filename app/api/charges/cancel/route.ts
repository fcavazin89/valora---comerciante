import { NextResponse } from "next/server"
import { cancelChargeOnChain } from "@/lib/blockchain"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { chargeId } = body

    if (!chargeId) {
      return NextResponse.json(
        { error: "chargeId é obrigatório" },
        { status: 400 }
      )
    }

    const result = await cancelChargeOnChain(chargeId)

    return NextResponse.json({
      success: true,
      chargeId,
      transactionHash: result.hash,
      blockNumber: result.receipt.blockNumber?.toString(),
      explorerUrl: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER || "https://sepolia.etherscan.io"}/tx/${result.hash}`,
    })
  } catch (error) {
    console.error("Erro ao cancelar cobrança:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
