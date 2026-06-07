import { Toaster } from "@/components/ui/sonner"
import { MerchantTerminalClient } from "@/components/merchant/merchant-terminal-client"

export default function Page() {
  return (
    <>
      <MerchantTerminalClient />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: "#1E293B",
            border: "1px solid #334155",
            color: "#F8FAFC",
          },
        }}
      />
    </>
  )
}
