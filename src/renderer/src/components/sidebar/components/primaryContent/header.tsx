import Header from '@renderer/components/header'
// context
import { useThemeContext } from '@renderer/layout/mainLayout'
// icons
import { GrRevert } from 'react-icons/gr'
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md'
import { TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb'
// images
import profileImage from '@renderer/assets/kapil.png'

const SidebarPrimaryHeader = ({ localActivePage, setLocalActivePage }: any) => {
  const { isSidebarExpanded, activePage } = useThemeContext() || {}
  return (
    <Header>
      <div className="w-full border-b border-neutral h-full  flex justify-between items-center relative  px-4! ">
        <ProfileInfo isSidebarExpanded={isSidebarExpanded} />
        <ToggleSidebar setLocalActivePage={setLocalActivePage} />
        <RevertButton
          isSidebarExpanded={isSidebarExpanded}
          activePage={activePage}
          localActivePage={localActivePage}
          setLocalActivePage={setLocalActivePage}
        />
      </div>
    </Header>
  )
}

const ProfileInfo = ({ isSidebarExpanded }: any) => {
  if (!isSidebarExpanded) return null
  return (
    <div className="flex items-center gap-3">
      <img
        src={profileImage}
        alt="logo"
        className="h-8 w-8 block rounded-full bg-cover object-cover"
      />
      <p className="text-[14px]    tracking-[.4px]">Kapil's Production</p>
    </div>
  )
}

const ToggleSidebar = ({ setLocalActivePage }) => {
  const { isSidebarExpanded, setIsSidebarExpanded, activePage } = useThemeContext() || {}
  return (
    <div className="flex items-center gap-2">
      <span className="cursor-pointer text-base-content hover:text-neutral-content! hover:bg-neutral p-1! rounded-sm">
        <TbLayoutSidebarRightCollapseFilled
          onClick={() => {
            if (!isSidebarExpanded) {
              setLocalActivePage(activePage)
            } else {
              setLocalActivePage('')
            }
            setIsSidebarExpanded(!isSidebarExpanded)
          }}
          size={isSidebarExpanded ? 19 : 22}
        />
      </span>

      <ToggleTheme />
    </div>
  )
}

const ToggleTheme = () => {
  const { theme, toggleTheme, isSidebarExpanded } = useThemeContext() || {}
  if (!isSidebarExpanded) return null
  return (
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
  )
}

const RevertButton = ({
  isSidebarExpanded,
  activePage,
  localActivePage,
  setLocalActivePage
}: any) => {
  if (!isSidebarExpanded || !activePage) return null
  return (
    <p
      onClick={() => {
        if (localActivePage == activePage) {
          setLocalActivePage('')
        } else setLocalActivePage(activePage)
      }}
      className="absolute bottom-0.5 right-5 cursor-pointer select-none hover:bg-neutral p-1! rounded-sm"
    >
      <GrRevert size={13} />
    </p>
  )
}

export default SidebarPrimaryHeader
