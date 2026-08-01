import { createContext, useContext, useState, useCallback } from 'react'

/* Lightweight layout context for the admin shell: sidebar collapse state,
   mobile drawer, notifications panel and the active module view. */
const AdminCtx = createContext(null)

export function AdminProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [activeModule, setActiveModule] = useState('dashboard')

  const openModule = useCallback((moduleId) => {
    setActiveModule(moduleId)
    setMobileOpen(false)
  }, [])

  const value = {
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
    notificationsOpen,
    setNotificationsOpen,
    activeModule,
    setActiveModule,
    openModule,
  }

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminCtx)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
