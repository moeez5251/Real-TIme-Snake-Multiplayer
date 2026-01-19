
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type Page = 'lobby' | 'skinstore' | 'settings' | 'play'

interface PageContextType {
  currentPage: Page
  setCurrentPage: (page: Page) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export function PageProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('lobby')

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  )
}

export function usePage() {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePage must be used within PageProvider')
  }
  return context
}