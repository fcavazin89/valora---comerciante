import { NextResponse } from "next/server"
import { publicClient, CONTRACT_ADDRESS_RAW as CONTRACT_ADDRESS, VOUCHER_ABI } from "@/lib/blockchain"
import { transacaoApi, comercioApi } from "@/lib/valora-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const merchantAddress = searchParams.get("merchantAddress")

    if (!merchantAddress) {
      return NextResponse.json(
        { error: "merchantAddress é obrigatório" },
        { status: 400 }
      )
    }

    // 1. Tenta buscar transações da valora-api primeiro
    try {
      const comercio = await comercioApi.getByWallet(merchantAddress)
      if (comercio?.id) {
        const apiData = await transacaoApi.getByComercio(comercio.id)
        if (apiData?.data?.length > 0) {
          return NextResponse.json({ transactions: apiData.data, source: "api" })
        }
      }
    } catch {
      // Valora-api indisponível, cai para blockchain
    }

    // 2. Fallback: busca eventos na blockchain
    const latestBlock = await publicClient.getBlockNumber()
    const fromBlock = latestBlock - BigInt(10000)

    const logs = await publicClient.getLogs({
      address: CONTRACT_ADDRESS,
      event: {
        type: "event",
        name: "ChargeApproved",
        inputs: [
          { type: "bytes32", name: "chargeId", indexed: true },
          { type: "address", name: "merchant", indexed: true },
          { type: "address", name: "beneficiary", indexed: true },
          { type: "uint256", name: "amount" },
        ],
      },
      args: { merchant: merchantAddress as `0x${string}` },
      fromBlock,
      toBlock: "latest",
    })

    const transactions = logs.map((log) => ({
      chargeId: log.args.chargeId,
      beneficiary: log.args.beneficiary,
      amount: log.args.amount?.toString(),
      transactionHash: log.transactionHash,
      blockNumber: log.blockNumber?.toString(),
    }))

    return NextResponse.json({ transactions, source: "blockchain" })
  } catch (error) {
    console.error("Erro ao buscar transações:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
