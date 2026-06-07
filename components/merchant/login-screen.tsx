"use client"

import { useWeb3AuthConnect } from "@web3auth/modal/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Shield, Loader2, Wallet, AlertTriangle } from "lucide-react"

interface LoginScreenProps {
  onLogin: (address: string) => void
  missingConfig?: boolean
}

function LoginScreenContent({ onLogin }: { onLogin: (address: string) => void }) {
  const { connect, isConnecting, error } = useWeb3AuthConnect()

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-white">Acesso ao Terminal</CardTitle>
        <CardDescription className="text-slate-400">
          Entre com sua carteira digital ou rede social para acessar o terminal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => connect()}
          disabled={isConnecting}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-base font-medium"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Conectando...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Entrar com Web3Auth
            </>
          )}
        </Button>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function LoginScreenMissingConfig() {
  return (
    <Card className="bg-slate-800 border-orange-500/40">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Configuração Necessária
        </CardTitle>
        <CardDescription className="text-slate-400">
          O Client ID do Web3Auth não está configurado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 space-y-3">
          <p className="text-sm text-orange-300 font-medium">
            Configure a variável de ambiente no Vercel:
          </p>
          <pre className="text-xs text-slate-300 bg-slate-900 p-3 rounded overflow-x-auto">
{`NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=sua_chave_aqui`}
          </pre>
          <p className="text-xs text-slate-400">
            Obtenha seu Client ID gratuito em{" "}
            <a
              href="https://dashboard.web3auth.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 underline"
            >
              dashboard.web3auth.io
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function LoginScreen({ onLogin, missingConfig }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-600 mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Terminal do Comerciante</h1>
          <p className="text-slate-400">Voucher Social NFT</p>
        </div>

        {missingConfig ? (
          <LoginScreenMissingConfig />
        ) : (
          <LoginScreenContent onLogin={onLogin} />
        )}

        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
          <Shield className="w-4 h-4" />
          <span>Login seguro via Web3Auth • Blockchain ativa</span>
        </div>

      </div>
    </div>
  )
}
