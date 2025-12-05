import { useThemeContext } from '@renderer/layout/mainLayout'
import { useEffect, useState } from 'react'
import SidebarPrimaryHeader from './components/primaryContent/header'
import SidebarPrimaryContent from './components/primaryContent/content'
import FooterContentPrimary from './components/primaryContent/footer'
import { SidebarApiTestingContent } from './components/secondaryContent/apiTesting/content'
import clsx from 'clsx'

const SideBar = () => {
  const { isSidebarExpanded, activePage } = useThemeContext() || {}
  const [localActivePage, setLocalActivePage] = useState(activePage)
  useEffect(() => {
    setLocalActivePage(activePage)
  }, [activePage])

  // tailwind classes
  const sidebarClass = clsx(
    'transition-all duration-77 ease-in-out max-h-full h-full bg-base-100 border-r border-neutral text-base-content',
    {
      'w-full': isSidebarExpanded,
      'w-20': !isSidebarExpanded
    },
    'mobile:max-w-[250px] tabletS:max-w-[280px] tabletL:max-w-[300px] desktopL:max-w-[400px] desktopS:max-w-[300px]'
  )

  return (
    <div className={sidebarClass}>
      <SidebarPrimaryHeader
        localActivePage={localActivePage}
        setLocalActivePage={setLocalActivePage}
      />

      {localActivePage == '' && <SidebarPrimaryContent />}

      {localActivePage == 'api-testing' && <SidebarApiTestingContent />}

      <FooterContentPrimary />
    </div>
  )
}

export default SideBar
