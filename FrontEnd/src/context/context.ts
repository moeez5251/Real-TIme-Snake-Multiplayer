import { createContext } from "react"

export type Page = "lobby" | "skinstore" | "settings" | "play"

export interface PageContextType {
  currentPage: Page
  setCurrentPage: (page: Page) => void
}

export const PageContext = createContext<PageContextType | undefined>(undefined)
