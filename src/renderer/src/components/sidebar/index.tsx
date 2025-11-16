import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md'
import Header from '../header'
import { useThemeContext } from '@renderer/layout/mainLayout'
import profileImage from '@renderer/assets/kapil.png'
import { TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb'
import { useState } from 'react'

const SideBar = () => {
  const { theme, toggleTheme, isSidebarExpanded, setIsSidebarExpanded } = useThemeContext()

  return (
    <div
      className={` transition-all duration-77 ease-in-out ${isSidebarExpanded ? 'w-full' : 'w-20'}   h-full  desktopL:max-w-[400px] desktopS:max-w-[300px] bg-[var(--bg-sidebar)]`}
    >
      <Header>
        <div className="w-full h-full  flex justify-between items-center   px-4! ">
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
    </div>
  )
}

export default SideBar
