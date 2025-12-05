import { useThemeContext } from '@renderer/layout/mainLayout'
import { useLocation, useNavigate } from 'react-router-dom'

// icons
import { IoIosSettings } from 'react-icons/io'
import { memo } from 'react'

const FooterContentPrimary = () => {
  const { isSidebarExpanded, setActivePage } = useThemeContext()
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  return (
    <div
      className={`h-20 px-5!  w-full flex ${isSidebarExpanded ? 'justify-start' : 'justify-center'}  items-center`}
    >
      <p
        onClick={() => {
          setActivePage('')
          navigate('/settings')
        }}
        // key={index}
        className={` shrink-0 h-9!  ${path == '/settings' ? 'bg-[var(--rev-bg-sidebar)] text-[var(--rev-text)]' : ''} w-full border-l-4 border-r-4 border-t-1 border-b-1 border-[var(--rev-bg-sidebar)] rounded-lg cursor-pointer flex ${isSidebarExpanded ? 'justify-start' : 'justify-center'} items-center gap-2 hover:bg-[var(--rev-bg-sidebar)] hover:text-[var(--rev-text)] transition-all duration-100 ease-in select-none ${!isSidebarExpanded ? '!pl-0' : '!pl-[10px]'} `}
      >
        <span className="text-[20px] hover:text-[var(--rev-bg-sidebar)] hover:text-[var(--rev-text)]">
          <IoIosSettings />
        </span>
        {isSidebarExpanded && (
          <span className="uppercase font-[450] text-[15px] tracking-[.8px]">Settings</span>
        )}
      </p>
      {/* <p className="flex items-center gap-4 ">
        <span>
          <IoIosSettings size={20} color={theme == 'light' ? 'black' : 'white'} />
        </span>
        {isSidebarExpanded && <span>Settings</span>}
      </p> */}
    </div>
  )
}

export default memo(FooterContentPrimary)
