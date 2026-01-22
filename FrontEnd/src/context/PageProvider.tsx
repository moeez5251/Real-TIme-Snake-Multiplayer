import { useState } from "react"
import type { ReactNode } from "react"
import { PageContext } from "./context"
import type { Page } from "./type"

export default function PageProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("lobby")

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  )
}
