import Header from '@renderer/components/header'
import { useApiTestingContext } from '@renderer/screen/apiTesting'
import { FaEdit } from 'react-icons/fa'
import { CiEdit } from 'react-icons/ci'
import { useRef, useState } from 'react'
import GlassBlurModal from '@renderer/components/glassBodyModal'
import { convertId } from '@renderer/utlis/dbHelper'

const ApiTestingHeader = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    selectedEnvironment,
    setSelectedEnvironment,
    environments,
    collections,
    selectedCollection,
    setSelectedCollection
  } = useApiTestingContext()
  const typeRef = useRef('Add')

  return (
    <Header>
      <div className="h-full w-full border-b border-gray-400">
        <div className="h-[50%]  w-full flex justify-between items-center px-5!">
          <div className="flex items-center gap-2">
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
        <div className="h-[50%] w-full"></div>
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

export default ApiTestingHeader
