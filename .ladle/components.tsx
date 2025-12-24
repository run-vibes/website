import type { GlobalProvider } from '@ladle/react'
import '../src/styles/global.css'

export const Provider: GlobalProvider = ({ children }) => {
  return <div className="min-h-screen bg-background text-foreground p-8">{children}</div>
}
