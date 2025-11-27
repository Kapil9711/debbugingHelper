import Header from '@renderer/components/header'
import { useApiTestingContext } from '@renderer/screen/apiTesting'
import { FaEdit } from 'react-icons/fa'
import { CiEdit } from 'react-icons/ci'
import { useRef, useState } from 'react'
import GlassBlurModal from '@renderer/components/glassBodyModal'
import { convertId } from '@renderer/utlis/dbHelper'
import { IoMdClose } from 'react-icons/io'

const ApiTestingHeader = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    selectedEnvironment,
    setSelectedEnvironment,
    environments,
    requests,
    request,
    setRequest,
    collections,
    selectedCollection,
    setSelectedCollection
  } = useApiTestingContext()
  const typeRef = useRef('Add')

  const methodColor =
    request?.method === 'GET'
      ? 'text-green-600'
      : request?.method === 'POST'
        ? 'text-orange-500'
        : request?.method === 'PUT'
          ? 'text-blue-600'
          : request?.method === 'DELETE'
            ? 'text-red-600'
            : 'text-gray-700'

  return (
    <Header>
      <div className="h-full w-full border-b border-gray-400">
        <div className="h-[45%] w-full flex items-end ">
          <RequestHeader requestData={requests} request={request} setRequest={setRequest} />
        </div>
        <div className="h-[55%]   w-full flex justify-between  items-center px-5!">
          {/* <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsOpen(true)
                typeRef.current = 'Add'
              }}
              className="bg-[#2d2d2d] px-3! py-1! rounded-md text-sm text-[#e8e8e8] cursor-pointer"
            >
              + Add
            </button>

            {selectedEnvironment?.title != '' && (
              <button
                onClick={() => {
                  setIsOpen(true)
                  typeRef.current = 'Edit'
                }}
                className="bg-[#2d2d2d] px-3! py-1! rounded-md text-sm text-[#e8e8e8] cursor-pointer flex items-center gap-2"
              >
                <CiEdit /> Edit
              </button>
            )}
          </div> */}

          <div className="w-[80%] flex items-center gap-1 relative ">
            <button
              className={` rounded-md px-2! h-[90%] text-sm cursor-pointer flex items-center gap-2 ${methodColor} absolute left-[2px]`}
            >
              {request?.method}
            </button>
            <input
              value={request?.title || request?.url}
              // onChange={(e) => {
              //   const value = e.target.value
              //   setInputValue(value)
              //   const payload = {
              //     ...request,
              //     url: e.target.value
              //   }
              //   window.api.request.updateRequest({ id: id, payload })
              //   handleUpdateCollection(e, 'url')
              // }}
              type="text"
              className="h-[30px] shadow-sm w-[65%] border-[.5px] border-[#3c3c3c] rounded-md px-3! outline-none text-sm pl-[65px]! bg-[#131313]"
            />
          </div>

          <div className="flex items-center justify-center gap-5">
            <select
              value={selectedEnvironment?.title || 'No Environment'}
              onChange={(e) => {
                let titleValue = e.target.value
                if (titleValue == 'No Environment') {
                  titleValue = ''
                }

                console.log(e.target.value, 'selectedEnvironemnt')
                const obj = environments.find((item) => item.title == titleValue)
                if (obj) {
                  console.log(obj, 'selectedEnvironemnt1')
                  setSelectedEnvironment(obj)
                }
              }}
              className={`px-3! py-1! rounded font-semibold text-sm shadow-sm cursor-pointer border outline-none `}
            >
              {environments?.map((environment) => {
                let { type, title } = environment
                title = title || 'No Environment'
                if (type == 'global') return null
                return <option value={title}>{title}</option>
              })}
            </select>
            <button className="py-1! px-1! rounded-lg cursor-pointer  text-sm">
              <FaEdit size={15} />
            </button>
          </div>
        </div>
      </div>

      <GlassBlurModal isOpen={isOpen} onClose={() => setIsOpen(false)} maxWidth="max-w-md">
        <AddEditModal
          setIsOpen={setIsOpen}
          type={typeRef.current}
          initalTitle={typeRef.current == 'Add' ? '' : selectedEnvironment?.title}
          selectedData={selectedEnvironment}
        />
      </GlassBlurModal>
    </Header>
  )
}

const AddEditModal = ({ type, initalTitle, selectedData, setIsOpen }) => {
  const [title, setTitle] = useState(initalTitle)
  return (
    <div className="flex items-center justify-center flex-col gap-5 py-3!">
      <p className="text-center text-[#b5b5b5] text-sm ">{type} Environment</p>
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
              window.api.apiTesting.setEnvironment({ title })
              setIsOpen(false)
            }
            if (type == 'Edit') {
              const id = convertId(selectedData?._id)
              const payload = { ...selectedData, title }
              window.api.apiTesting.updateEnvironment({ id, payload })
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

const RequestHeader = ({ requestData, request, setRequest }: any) => {
  const [hoveredId, setHoveredId] = useState('')

  // console.log(requestData, request, 'requests')

  return (
    <div className=" h-full w-full flex items-center px-6! gap-4 overflow-auto scrollbar-hidden">
      {requestData?.map((item: any) => {
        const itemId = convertId(item?._id)
        const dataId = convertId(request?._id)
        const isSelectedItem = itemId === dataId
        const isHoveredItem = hoveredId == convertId(item?._id)
        const url = item?.url
        let path = item?.url

        if (url) {
          try {
            path = new URL(url, 'http://dummy.com').pathname
          } catch (error) {}
        }

        return (
          <div
            key={itemId}
            onClick={() => {
              setRequest(item)
            }}
            onMouseEnter={() => {
              const id = convertId(item?._id)
              setHoveredId(id)
            }}
            onMouseLeave={() => {
              setHoveredId('')
            }}
            className={`w-[140px] relative cursor-pointer select-none hover:bg-[var(--rev-bg-header)] hover:text-[var(--rev-text)] h-[30px] border p-1! px-2! rounded-md  ${isSelectedItem ? 'bg-[var(--rev-bg-header)]  text-[var(--rev-text)]' : 'text-[var(--text)]'} flex items-center  gap-1`}
          >
            <p className="text-sm leading-[1.2]">{item?.method}</p>
            <p className="text-xs truncate">{path}</p>

            {(isHoveredItem || isSelectedItem) && (
              <>
                <p
                  onClick={async () => {
                    await window.api.request.deleteRequest(itemId)
                  }}
                  className="absolute right-1 top-[1px] "
                >
                  <IoMdClose size={14} />
                </p>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ApiTestingHeader
