import Lobby from './components/lobby'
import SkinStore from './components/skinstore'
import Settings from './components/Settings'
import { usePage } from './context/PageContext'
import { AnimatePresence } from 'framer-motion'
import PageProvider from './context/PageProvider'
function AppContent() {
  const { currentPage } = usePage()

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'lobby' && <Lobby key="lobby" />}
      {currentPage === 'skinstore' && <SkinStore key="skinstore" />}
      {currentPage === 'settings' && <Settings key="settings" />}
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <PageProvider>
      
      <AppContent />
    </PageProvider>
  )
}