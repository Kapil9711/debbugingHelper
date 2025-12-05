import { useThemeContext } from '@renderer/layout/mainLayout'
import { useLocation, useNavigate } from 'react-router-dom'

// icons
import { IoIosSettings } from 'react-icons/io'
import { memo } from 'react'
import clsx from 'clsx'

const FooterContentPrimary = () => {
  const { isSidebarExpanded, setActivePage } = useThemeContext()
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  const sidebarItemClass = clsx(
    'relative  shrink-0 h-7.5 w-full rounded-sm cursor-pointer flex items-center gap-2 transition-all duration-100 ease-in select-none text-base-content',
    // Active item styles
    {
      'bg-neutral text-neutral-content!': path === '/settings'
    },

    // Justify based on sidebar state
    isSidebarExpanded ? 'justify-start' : 'justify-center',
    // Padding adjustment
    !isSidebarExpanded ? '!pl-0' : '!pl-[10px]',
    // Hover styles
    'hover:bg-neutral hover:text-neutral-content'
  )

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
        className={sidebarItemClass}
      >
        <span className="text-[20px] ">
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
