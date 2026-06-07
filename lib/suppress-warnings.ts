/**
 * Suprime warnings conhecidos de libs terceiras que não afetam o funcionamento.
 * Chamado uma vez no layout do cliente.
 */
export function suppressKnownWarnings() {
  if (typeof window === "undefined") return

  const originalError = console.error.bind(console)
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : ""
    // hCaptcha avisa sobre localhost — comportamento esperado em dev, sem impacto funcional
    if (msg.includes("[hCaptcha]") && msg.includes("localhost")) return
    originalError(...args)
  }

  const originalWarn = console.warn.bind(console)
  console.warn = (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : ""
    if (msg.includes("[hCaptcha]") && msg.includes("localhost")) return
    originalWarn(...args)
  }
}
