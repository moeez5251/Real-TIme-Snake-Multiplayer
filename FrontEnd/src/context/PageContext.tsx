import { useContext } from "react"
import { PageContext } from "./context"

export function usePage() {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error("usePage must be used within PageProvider")
  }
  return context
}
