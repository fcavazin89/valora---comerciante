import type { Web3AuthContextConfig } from "@web3auth/modal/react"

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? ""

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: "sapphire_devnet",
  },
}

export default web3AuthContextConfig
