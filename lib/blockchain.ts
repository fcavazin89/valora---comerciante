import { createWalletClient, createPublicClient, http, parseUnits, formatUnits } from "viem"
import { sepolia } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.infura.io/v3/SEU_PROJECT_ID"
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"

export const CONTRACT_ADDRESS_RAW = CONTRACT_ADDRESS

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL),
})

function getWalletClient() {
  const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`)
  return createWalletClient({
    account,
    chain: sepolia,
    transport: http(RPC_URL),
  })
}

export const VOUCHER_ABI = [
  {
    name: "createCharge",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "chargeId", type: "bytes32" },
      { name: "merchant", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "currency", type: "string" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "approveCharge",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "chargeId", type: "bytes32" },
      { name: "beneficiary", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "getCharge",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "chargeId", type: "bytes32" }],
    outputs: [
      { name: "merchant", type: "address" },
      { name: "beneficiary", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "currency", type: "string" },
      { name: "status", type: "uint8" },
      { name: "createdAt", type: "uint256" },
    ],
  },
  {
    name: "cancelCharge",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "chargeId", type: "bytes32" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "ChargeApproved",
    type: "event",
    inputs: [
      { name: "chargeId", type: "bytes32", indexed: true },
      { name: "merchant", type: "address", indexed: true },
      { name: "beneficiary", type: "address", indexed: true },
      { name: "amount", type: "uint256" },
    ],
  },
  {
    name: "ChargeCreated",
    type: "event",
    inputs: [
      { name: "chargeId", type: "bytes32", indexed: true },
      { name: "merchant", type: "address", indexed: true },
      { name: "amount", type: "uint256" },
      { name: "currency", type: "string" },
    ],
  },
] as const

export enum ChargeStatus {
  Pending = 0,
  Approved = 1,
  Cancelled = 2,
  Expired = 3,
}

export interface ChargeData {
  merchant: string
  beneficiary: string
  amount: bigint
  currency: string
  status: number
  createdAt: bigint
}

function stringToBytes32(str: string): `0x${string}` {
  const hex = Buffer.from(str.padEnd(32, "\0")).toString("hex")
  return `0x${hex}` as `0x${string}`
}

export async function createChargeOnChain(
  chargeId: string,
  merchantAddress: `0x${string}`,
  amount: number
) {
  const walletClient = getWalletClient()
  const amountWei = parseUnits(amount.toFixed(6), 6)
  const chargeIdBytes = stringToBytes32(chargeId)

  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: VOUCHER_ABI,
    functionName: "createCharge",
    args: [chargeIdBytes, merchantAddress, amountWei, "BRL"],
  })

  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  return { hash, receipt }
}

export async function approveChargeOnChain(
  chargeId: string,
  beneficiaryAddress: `0x${string}`
) {
  const walletClient = getWalletClient()
  const chargeIdBytes = stringToBytes32(chargeId)

  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: VOUCHER_ABI,
    functionName: "approveCharge",
    args: [chargeIdBytes, beneficiaryAddress],
  })

  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  return { hash, receipt }
}

export async function cancelChargeOnChain(chargeId: string) {
  const walletClient = getWalletClient()
  const chargeIdBytes = stringToBytes32(chargeId)

  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: VOUCHER_ABI,
    functionName: "cancelCharge",
    args: [chargeIdBytes],
  })

  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  return { hash, receipt }
}

export async function getChargeFromChain(chargeId: string): Promise<ChargeData | null> {
  try {
    const chargeIdBytes = stringToBytes32(chargeId)
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: VOUCHER_ABI,
      functionName: "getCharge",
      args: [chargeIdBytes],
    })
    return {
      merchant: data[0],
      beneficiary: data[1],
      amount: data[2],
      currency: data[3],
      status: Number(data[4]),
      createdAt: data[5],
    }
  } catch {
    return null
  }
}

export function formatChargeAmount(amount: bigint): number {
  return Number(formatUnits(amount, 6))
}
