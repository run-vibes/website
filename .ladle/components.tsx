import type { GlobalProvider } from '@ladle/react'
import '@/styles/global.css'

export const Provider: GlobalProvider = ({ children }) => {
  return <>{children}</>
}
