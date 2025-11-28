import { MdDarkMode, MdDelete, MdOutlineLightMode } from 'react-icons/md'
import Header from '../header'
import { useThemeContext } from '@renderer/layout/mainLayout'
import profileImage from '@renderer/assets/kapil.png'
import { TbDots, TbDotsVertical, TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb'
import { VscDebugConsole } from 'react-icons/vsc'
import { IoIosSettings } from 'react-icons/io'
import { useNavigate, useLocation } from 'react-router-dom'
import { GiNetworkBars } from 'react-icons/gi'
import { GrRevert, GrTest } from 'react-icons/gr'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CiEdit } from 'react-icons/ci'
import GlassBlurModal from '../glassBodyModal'
import { convertId } from '@renderer/utlis/dbHelper'
import { ApiTestingEventType } from '@shared/eventType'
import toast from 'react-hot-toast'
import { FaAngleDown, FaPlus } from 'react-icons/fa'

const SideBar = () => {
  const { isSidebarExpanded, activePage } = useThemeContext() || {}
  const [localActivePage, setLocalActivePage] = useState(activePage)
  useEffect(() => {
    setLocalActivePage(activePage)
  }, [activePage])

  return (
    <div
      className={` transition-all duration-77 ease-in-out ${isSidebarExpanded ? 'w-full' : 'w-20'} max-h-full   h-full mobile:max-w-[250px] tabletS:max-w-[280px] tabletL:max-w-[300px]  desktopL:max-w-[400px] desktopS:max-w-[300px] bg-[var(--bg-sidebar)] border-r-[.5px] border-gray-400`}
    >
      <SidebarHeader localActivePage={localActivePage} setLocalActivePage={setLocalActivePage} />

      {localActivePage == '' && <SidebarMainContent />}

      {localActivePage == 'api-testing' && <SidebarApiTestingContent />}

      <BottomContent />
    </div>
  )
}

// main side bar

const sidebarData = [
  { title: 'Console', icon: <VscDebugConsole />, url: '/' },
  { title: 'Network', icon: <GiNetworkBars />, url: '/network' },
  { title: 'Api Testing', icon: <GrTest />, url: '/api-testing' }
]

const SidebarHeader = ({ localActivePage, setLocalActivePage }: any) => {
  const { theme, toggleTheme, isSidebarExpanded, setIsSidebarExpanded, activePage } =
    useThemeContext() || {}

  return (
    <Header>
      <div className="w-full border-b-[.5px] border-gray-400 h-full  flex justify-between items-center relative  px-4! ">
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
            onClick={() => {
              if (!isSidebarExpanded) {
                setLocalActivePage(activePage)
              } else {
                setLocalActivePage('')
              }

              setIsSidebarExpanded(!isSidebarExpanded)
            }}
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

        {isSidebarExpanded && activePage && (
          <>
            <p
              onClick={() => {
                if (localActivePage == activePage) {
                  setLocalActivePage('')
                } else setLocalActivePage(activePage)
              }}
              className="absolute bottom-1.5 right-5 cursor-pointer select-none"
            >
              <GrRevert />
            </p>
          </>
        )}
      </div>
    </Header>
  )
}

const BottomContent = () => {
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

// sidebar content
const SidebarMainContent = () => {
  const { isSidebarExpanded, setActivePage } = useThemeContext() || {}
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
              if (item?.url == '/api-testing') {
                setActivePage('api-testing')
              } else {
                setActivePage('')
              }
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

const SidebarApiTestingContent = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [collections, setCollections] = useState([])
  const [selectedCollection, setSelectedCollection] = useState({})
  const typeRef = useRef('')
  const handleApiTestingEvent = useCallback(
    (event: any) => {
      if (!event) return
      switch (event.type) {
        case ApiTestingEventType.UpdateCollection:
          setCollections(event.payload)

          break
        case ApiTestingEventType.Message:
          toast.success(event.payload)
          break
        default:
          console.warn('Unknown network event type', event)
      }
    },
    [selectedCollection]
  )
  useEffect(() => {
    const loadInitial = async () => {
      // environment
      const collectionData = await window.api.apiTesting.getCollections('')
      setCollections(collectionData)
    }
    loadInitial()
    const unsubscribe =
      window.api.apiTesting.onUpdated?.((payload) => {
        handleApiTestingEvent(payload)
      }) ?? (() => {})

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (collections?.length) {
      const updatedSelectedCollection = {}
      collections?.forEach((collection: any) => {
        const id = convertId(collection?._id)
        if (selectedCollection[id]) {
          updatedSelectedCollection[id] = collection
        }
      })
      setSelectedCollection(updatedSelectedCollection)
    }
  }, [collections])

  const handleAdd = async (e, item, id) => {
    e.stopPropagation()
    const requestPayload = {
      id: Date.now(),
      method: 'GET',
      title: '',
      url: ''
    }
    const docs = [...item?.docs, requestPayload]
    const updatedItem = { ...item, docs }
    try {
      await window.api.apiTesting.updateCollection({
        id,
        payload: { ...updatedItem, isDocs: true }
      })
      setSelectedCollection({ ...selectedCollection, [id]: updatedItem })
    } catch (error) {
      setSelectedCollection({ ...selectedCollection, [id]: item })
    }
  }

  console.log(selectedCollection, 'selectedCollection')

  return (
    <div className="flex flex-col px-5! py-4! gap-4 overflow-auto h-[calc(100%-160px)] scrollbar-hidden">
      <div className="flex items-center justify-between gap-2 select-none">
        <p className="text-sm text-[#e7e7e7] uppercase">Collections</p>
        <button
          onClick={() => {
            typeRef.current = 'Add'
            setIsOpen(true)
          }}
          className="bg-[#2d2d2d] px-3! py-1! rounded-md text-sm text-[#e8e8e8] cursor-pointer"
        >
          + Add
        </button>
      </div>

      <div>
        {collections.map((item: any) => {
          const id = convertId(item?._id)
          const collection = selectedCollection[id]

          return (
            <div key={id}>
              <p
                onClick={() => {
                  if (collection) {
                    setSelectedCollection({ ...selectedCollection, [id]: null })
                  }
                  if (!collection) {
                    setSelectedCollection({ ...selectedCollection, [id]: item })
                  }
                }}
                className="text-sm uppercase text-gray-300 cursor-pointer p-1.5! px-2! rounded-md hover:bg-[#191919] flex items-center justify-between select-none"
              >
                <span>{item?.title}</span>
                <div className="flex items-center gap-2">
                  <span
                    onClick={async (e) => {
                      handleAdd(e, item, id)
                    }}
                    className="p-[5px]! rounded-sm hover:bg-[#393939]"
                  >
                    <FaPlus />
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="p-[5px]!  rounded-sm hover:bg-[#393939]"
                  >
                    <TbDots />
                  </span>
                </div>
              </p>
              {collection && (
                <ShowSelectedCollections
                  key={collection?.docs?.length}
                  selectedCollections={collection}
                  setSelectedCollection={setSelectedCollection}
                />
              )}
            </div>
          )
        })}
      </div>

      <GlassBlurModal isOpen={isOpen} onClose={() => setIsOpen(false)} maxWidth="max-w-md">
        <AddEditModal
          setIsOpen={setIsOpen}
          type={typeRef.current}
          initalTitle={typeRef.current == 'Add' ? '' : ''}
          selectedData={{}}
        />
      </GlassBlurModal>
    </div>
  )
}

const ShowSelectedCollections = ({ selectedCollections, setSelectedCollection }: any) => {
  const { docs, _id } = selectedCollections
  const id = convertId(_id)
  const handleDelete = async (e, item) => {
    e.stopPropagation()
    const filterDocs = docs?.filter((itm) => {
      return itm?.id != item?.id
    })
    const updatedCollection = { ...selectedCollections, docs: filterDocs }
    await window.api.apiTesting.updateCollection({
      id,
      payload: { ...updatedCollection, isDocs: true }
    })
    setSelectedCollection({ ...selectedCollections, [id]: updatedCollection })
  }
  console.log(docs, 'docs')
  return (
    <div key={id} className="pl-1.5!">
      {docs.map((item, index) => {
        return (
          <p
            onClick={() => {
              console.log(item, 'item')
              window.api.request.setRequest({ ...item, collectionId: id })
            }}
            key={item?.id || index}
            className="text-[13px] uppercase flex items-center justify-between p-2! py-[4px]! hover:bg-[#151515] rounded-sm cursor-pointer!"
          >
            <span
              className={`truncate ${
                item?.method === 'GET'
                  ? 'text-green-600'
                  : item?.method === 'POST'
                    ? 'text-orange-500 '
                    : item?.method === 'PUT'
                      ? 'text-blue-600 '
                      : item?.method === 'DELETE'
                        ? 'text-red-600 '
                        : 'text-gray-700 '
              }`}
            >
              {item?.method}{' '}
              <span className="ml-2 lowercase text-[#9d9d9d] text-[11px]">{item?.url}</span>
            </span>
            <span
              onClick={async (e) => {
                handleDelete(e, item)
              }}
              className="p-[5px]!  rounded-sm hover:bg-[#393939]"
            >
              <MdDelete className="" />
            </span>
          </p>
        )
      })}
    </div>
  )
}

const AddEditModal = ({ type, initalTitle, selectedData, setIsOpen }) => {
  const [title, setTitle] = useState(initalTitle)
  return (
    <div className="flex items-center justify-center flex-col gap-5 py-3!">
      <p className="text-center text-[#b5b5b5] text-sm ">{type} Collection</p>
      <div className="flex  gap-2">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
          placeholder="Enter Title"
          type="text"
          className="bg-[#232323] px-3! py-1! text-sm rounded-md outline-none border border-[#3b3a3a]"
        />
        <button
          onClick={() => {
            if (type == 'Add') {
              window.api.apiTesting.setCollection({ title })
              setIsOpen(false)
            }
            if (type == 'Edit') {
              const id = convertId(selectedData?._id)
              const payload = { ...selectedData, title }
              window.api.apiTesting.updateCollection({ id, payload })
              setIsOpen(false)
            }
          }}
          className="bg-[#2d2d2d] px-3! py-1! rounded-md text-sm text-[#e8e8e8] cursor-pointer flex items-center gap-2 max-w-[50%] mx-auto!"
        >
          {type == 'Add' ? 'Create' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

export default SideBar
