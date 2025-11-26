import SideBar from '@renderer/components/sidebar'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'

const ThemeContext = createContext({} as any)
export const useThemeContext = () => useContext(ThemeContext)

const MainLayout = ({ children }: any) => {
  const [theme, setTheme] = useState('dark')
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [activePage, setActivePage] = useState('')

  const value = useMemo(() => {
    const toggleTheme = () => {
      if (theme == 'light') setTheme('dark')
      if (theme == 'dark') setTheme('light')
    }
    return {
      theme,
      setTheme,
      toggleTheme,
      isSidebarExpanded,
      setIsSidebarExpanded,
      activePage,
      setActivePage
    }
  }, [theme, isSidebarExpanded, activePage])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={value}>
      <div className="flex h-full w-full ">
        <SideBar />

        {/* //right page Content */}
        <div className="h-full transition-all duration-100 ease-in  flex-1   overflow-hidden bg-[var(--bg-content)]">
          <Outlet />
        </div>
      </div>
    </ThemeContext.Provider>
  )
}

export default MainLayout
