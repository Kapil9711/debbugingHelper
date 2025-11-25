import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md'
import Header from '../header'
import { useThemeContext } from '@renderer/layout/mainLayout'
import profileImage from '@renderer/assets/kapil.png'
import { TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb'
import { VscDebugConsole } from 'react-icons/vsc'
import { IoIosSettings } from 'react-icons/io'
import { useNavigate, useLocation } from 'react-router-dom'
import { GiNetworkBars } from 'react-icons/gi'
import { GrTest } from 'react-icons/gr'

const SideBar = () => {
  const { theme, toggleTheme, isSidebarExpanded, setIsSidebarExpanded } = useThemeContext()

  return (
    <div
      className={` transition-all duration-77 ease-in-out ${isSidebarExpanded ? 'w-full' : 'w-20'} max-h-full   h-full mobile:max-w-[250px] tabletS:max-w-[280px] tabletL:max-w-[300px]  desktopL:max-w-[400px] desktopS:max-w-[300px] bg-[var(--bg-sidebar)] border-r-[.5px] border-gray-400`}
    >
      <Header>
        <div className="w-full border-b-[.5px] border-gray-400 h-full  flex justify-between items-center   px-4! ">
          {isSidebarExpanded && (
            <div className="flex items-center gap-3">
              <img
                src={profileImage}
                alt="logo"
                className="h-8 w-8 block rounded-full bg-cover object-cover "
              />
              <p className="text-[13px] tracking-[.9px] font-medium">Kapil's Production</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <TbLayoutSidebarRightCollapseFilled
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="cursor-pointer"
              size={isSidebarExpanded ? 19 : 22}
              color={theme == 'light' ? 'black' : 'white'}
            />

            {isSidebarExpanded && (
              <p
                onClick={toggleTheme}
                className={`h-6 w-6  rounded-full flex justify-center items-center ${theme == 'dark' ? 'bg-[#dddcdc]' : 'bg-[#323131]'}  cursor-pointer`}
              >
                {theme == 'dark' && (
                  <span>
                    <MdOutlineLightMode color={'black'} size={14} />
                  </span>
                )}
                {theme == 'light' && (
                  <span className="">
                    <MdDarkMode size={14} color="white" />
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </Header>
      <SidebarContent />
      <BottomContent />
    </div>
  )
}

const sidebarData = [
  { title: 'Console', icon: <VscDebugConsole />, url: '/' },
  { title: 'Network', icon: <GiNetworkBars />, url: '/network' },
  { title: 'Api Testing', icon: <GrTest />, url: '/api-testing' }
]

const SidebarContent = () => {
  const { isSidebarExpanded } = useThemeContext()
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname
  // const [isHovered, setIsHovered] = useState('')

  return (
    <div className="flex flex-col px-5! py-8! gap-4 overflow-auto h-[calc(100%-160px)] scrollbar-hidden">
      {sidebarData?.map((item: any, index: any) => {
        return (
          <p
            // onMouseEnter={() => setIsHovered(index)}
            // onMouseLeave={() => setIsHovered('')}
            onClick={() => {
              navigate(item?.url)
            }}
            key={index}
            className={`relative hover:scale-[1.02] shrink-0 h-9!  ${path == item?.url ? 'bg-[var(--rev-bg-sidebar)] text-[var(--rev-text)]' : ''} w-full border-l-4 border-r-4 border-t-1 border-b-1 border-[var(--rev-bg-sidebar)] rounded-lg cursor-pointer flex ${isSidebarExpanded ? 'justify-start' : 'justify-center'} items-center gap-2 hover:bg-[var(--rev-bg-sidebar)] hover:text-[var(--rev-text)] transition-all duration-100 ease-in select-none ${!isSidebarExpanded ? '!pl-0' : '!pl-[10px]'} `}
          >
            <span className="text-[20px] hover:text-[var(--rev-bg-sidebar)] hover:text-[var(--rev-text)]">
              {item?.icon}
            </span>

            {/* {!isSidebarExpanded && isHovered === index && (
              <span className="absolute text-white left-[110%] top-[-50%] z-[99]">
                {item?.title}
              </span>
            )} */}
            {isSidebarExpanded && (
              <span className="uppercase font-[450] text-[15px] tracking-[.8px]">
                {item?.title}
              </span>
            )}
          </p>
        )
      })}
    </div>
  )
}

const BottomContent = () => {
  const { isSidebarExpanded } = useThemeContext()
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  return (
    <div
      className={`h-20 px-5!  w-full flex ${isSidebarExpanded ? 'justify-start' : 'justify-center'}  items-center`}
    >
      <p
        onClick={() => {
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

export default SideBar
