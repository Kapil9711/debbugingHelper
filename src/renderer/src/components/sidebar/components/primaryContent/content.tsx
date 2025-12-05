import { useThemeContext } from '@renderer/layout/mainLayout'
import { useLocation, useNavigate } from 'react-router-dom'

// icons
import { GiNetworkBars } from 'react-icons/gi'
import { GrTest } from 'react-icons/gr'
import { VscDebugConsole } from 'react-icons/vsc'
import clsx from 'clsx'

// sidebar static data
const sidebarData = [
  { title: 'Console', icon: <VscDebugConsole />, url: '/' },
  { title: 'Network', icon: <GiNetworkBars />, url: '/network' },
  { title: 'Api Testing', icon: <GrTest />, url: '/api-testing' }
]

const SidebarPrimaryContent = () => {
  const { isSidebarExpanded, setActivePage } = useThemeContext() || {}
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  // tailwind classes

  return (
    <div className="flex flex-col px-5! py-8! gap-2 overflow-auto h-[calc(100%-160px)] scrollbar-hidden">
      {sidebarData?.map((item: any, index: any) => {
        const sidebarItemClass = clsx(
          'relative  shrink-0 h-8 w-full rounded-sm cursor-pointer flex items-center gap-2 transition-all duration-100 ease-in select-none text-neutral-content',
          // Active item styles
          {
            'bg-neutral text-base-content!': path === item?.url
          },

          // Justify based on sidebar state
          isSidebarExpanded ? 'justify-start' : 'justify-center',
          // Padding adjustment
          !isSidebarExpanded ? '!pl-0' : '!pl-[10px]',
          // Hover styles
          'hover:bg-neutral hover:text-base-content'
        )
        return (
          <p
            // onMouseEnter={() => setIsHovered(index)}
            // onMouseLeave={() => setIsHovered('')}
            onClick={() => {
              if (item?.url == '/api-testing') {
                setActivePage('api-testing')
              } else {
                setActivePage('')
              }
              navigate(item?.url)
            }}
            key={index}
            className={sidebarItemClass}
          >
            <span className="text-[15px]">{item?.icon}</span>

            {isSidebarExpanded && (
              <span className="uppercase  text-[14px] tracking-[.8px]">{item?.title}</span>
            )}
          </p>
        )
      })}
    </div>
  )
}

export default SidebarPrimaryContent
