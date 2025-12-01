import { useCallback, useEffect, useRef, useState } from 'react'
import GlassBlurModal from './glassBodyModal'
import { ApiTestingEventType } from '@shared/eventType'
import toast from 'react-hot-toast'
import { convertId } from '@renderer/utlis/dbHelper'

import {
  folderPayload,
  handleAddToCollection,
  handleDeleteCollectionDoc,
  updateCollectionById
} from '@renderer/utlis/collectionHelper'
import { IoIosFolderOpen } from 'react-icons/io'
import GlassDropdown from './glassDropDown'
import { TbDots } from 'react-icons/tb'
import { AddEditFolderModal, AddEditTitleModal } from './sidebar'
import { MdDelete } from 'react-icons/md'

const SaveCollectionPopUp = ({ initialOpen, trigger, requestPayload, setTopOpen }: any) => {
  const [isOpen, setIsOpen] = useState(initialOpen || false)
  useEffect(() => {
    return () => {
      if (typeof setTopOpen == 'function' && isOpen) {
        setTopOpen(false)
      }
    }
  }, [isOpen])
  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger ? trigger : 'open'}</div>

      <div></div>
      <GlassBlurModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
      >
        <div className="py-8!">
          <SidebarApiTestingContent requestPayload={requestPayload} setIsOpen={setIsOpen} />
        </div>
      </GlassBlurModal>
    </>
  )
}

export const SidebarApiTestingContent = ({ requestPayload, setIsOpen: setIsOpenModal }: any) => {
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

  const handleAddRequest = async (e, item, id) => {
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

  const handleAddFolder = async (collection, rootId) => {
    const { docs, _id } = collection || {}
    const collectionId = convertId(_id)
    if (collectionId == rootId) {
      const folderPayload = { title: 'NEW FOLDER', docs: [], id: Date.now() }
      const updatedDocs = [...docs, folderPayload]
      await window.api.apiTesting.updateCollection({
        id: collectionId,
        payload: { ...collection, docs: updatedDocs, isDocs: true }
      })
    }
  }

  const editCollection = useRef({} as any)

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
            <div key={id} className={collection ? 'border-l-1 border-[#333333]' : ''}>
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
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="flex items-center gap-2"
                >
                  {/* <span
                    onClick={async (e) => {
                      e.stopPropagation()
                      handleAddRequest(e, item, id)
                    }}
                    className="p-[5px]! rounded-sm hover:bg-[#393939]"
                  >
                    <FaPlus />
                  </span> */}
                  <GlassDropdown
                    trigger={
                      <span className="p-[5px]! block   rounded-sm hover:bg-[#393939] relative">
                        <TbDots />
                      </span>
                    }
                  >
                    <div className="w-fit px-3! py-2! flex flex-col gap-0.5">
                      <p
                        onClick={async (e) => {
                          handleAddFolder(item, id)
                        }}
                        className="text-xs p-2! py-1! rounded-sm hover:bg-[#333333] cursor-pointer text-[#cecece] uppercase"
                      >
                        New Folder
                      </p>
                      {/* <p
                        onClick={async (e) => {
                          handleAddRequest(e, item, id)
                        }}
                        className="text-xs p-2! py-1! rounded-sm hover:bg-[#333333] cursor-pointer text-[#cecece] uppercase"
                      >
                        New Request
                      </p> */}
                      <p
                        onClick={() => {
                          window.api.apiTesting.deleteCollection(id)
                        }}
                        className="text-xs p-2! py-1! rounded-sm hover:bg-[#333333] cursor-pointer text-[#cecece] hover:text-red-400 uppercase"
                      >
                        Delete
                      </p>
                      <p
                        onClick={() => {
                          editCollection.current = item
                          typeRef.current = 'Edit'
                          setIsOpen(true)
                        }}
                        className="text-xs p-2! py-1! rounded-sm hover:bg-[#333333] cursor-pointer text-[#cecece] uppercase"
                      >
                        Rename
                      </p>
                    </div>
                  </GlassDropdown>
                </div>
              </p>
              {collection && (
                <ShowSelectedCollections
                  requestPayload={requestPayload}
                  key={collection?.docs?.length}
                  selectedCollections={collection}
                  setSelectedCollection={setSelectedCollection}
                  level={0}
                  setIsOpen={setIsOpenModal}
                />
              )}
            </div>
          )
        })}
      </div>

      <GlassBlurModal isOpen={isOpen} onClose={() => setIsOpen(false)} maxWidth="max-w-md">
        <AddEditTitleModal
          setIsOpen={setIsOpen}
          onAdd={(title) => {
            window.api.apiTesting.setCollection({ title })
          }}
          onEdit={(id, payload) => {
            window.api.apiTesting.updateCollection({ id, payload })
          }}
          type={typeRef.current}
          initalTitle={typeRef.current == 'Add' ? '' : editCollection?.current?.title}
          selectedData={typeRef.current == 'Add' ? {} : editCollection?.current}
        />
      </GlassBlurModal>
    </div>
  )
}

const ShowSelectedCollections = ({ selectedCollections, requestPayload, setIsOpen }: any) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const { docs, _id } = selectedCollections
  const id = convertId(_id)
  const handleDeleteDoc = handleDeleteCollectionDoc.bind(null, id)
  const handleAddRequest = handleAddToCollection.bind(null, id, requestPayload)
  const handleAddFolder = handleAddToCollection.bind(null, id, folderPayload)
  const pushRequest = async (collectionId, payload) => {
    payload.collectionId = collectionId
    try {
      window.api.request.setRequest(payload)
    } catch (error) {
      toast.error('Enalble to add to Request')
    }
  }
  const handlePushRequest = pushRequest.bind(null, id)
  function toggleFolder(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const openFolder = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (!next.has(id)) next.add(id)
      return next
    })
  }

  const handleUpdatedCollection = useCallback(updateCollectionById.bind(null, id), [id])

  return (
    <div key={id} className="pl-1.5!">
      {docs.map((item, index: any) => {
        return (
          <RenderNodeItem
            key={item?.id}
            item={item}
            level={0}
            expandedIds={expandedIds}
            toggleFolder={toggleFolder}
            handleAddRequest={handleAddRequest}
            handleDeleteDoc={handleDeleteDoc}
            handleAddFolder={handleAddFolder}
            handlePushRequest={handlePushRequest}
            openFolder={openFolder}
            handleUpdatedCollection={handleUpdatedCollection}
            setIsOpen={setIsOpen}
          />
        )
      })}
    </div>
  )
}

export const RenderNodeItem = ({
  item,
  level,
  expandedIds,
  toggleFolder,
  handleAddRequest,
  handleDeleteDoc,
  handleAddFolder,
  handlePushRequest,
  openFolder,
  handleUpdatedCollection,
  setIsOpen
}) => {
  const [editDoc, setEditDoc] = useState(null as any)
  const { docs, id } = item
  const isFolder = Array.isArray(docs)
  const folderId = isFolder ? id : ''
  const paddingInline = 8 + level
  if (folderId) {
    const isOpen = expandedIds.has(folderId)
    return (
      <div
        style={{ paddingLeft: paddingInline }}
        key={folderId}
        className={isOpen ? 'border-l-1 border-[#505050]' : ''}
      >
        <p
          onClick={() => toggleFolder(folderId)}
          className="text-sm uppercase text-gray-300 cursor-pointer p-[3px]! px-2! rounded-md hover:bg-[#191919] flex items-center justify-between select-none"
        >
          <span className={`truncate flex items-center gap-2`}>
            <IoIosFolderOpen />
            <span className="ml-2 uppercase text-[#9d9d9d] text-[11px]">{item?.title}</span>
          </span>

          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="flex items-center gap-2"
          >
            {/* <span
              onClick={async (e) => {
                e.stopPropagation()
                handleAddRequest(folderId)
                openFolder(folderId)
              }}
              className="p-[5px]! rounded-sm hover:bg-[#393939]"
            >
              <FaPlus />
            </span> */}
            <span
              onClick={async () => {
                try {
                  handleAddRequest(folderId)
                  toast.success('Saved Successfully')
                  setIsOpen(false)
                } catch (error) {
                  toast.error('Error saving request')
                }
              }}
              className="p-[5px]! rounded-sm text-xs hover:bg-[#393939]"
            >
              save
            </span>
            <GlassDropdown
              trigger={
                <span className="p-[5px]! block   rounded-sm hover:bg-[#393939] relative">
                  <TbDots />
                </span>
              }
            >
              <div className="w-fit px-3! py-2! flex flex-col gap-0.5">
                <p
                  onClick={async () => {
                    handleAddFolder(folderId)
                    openFolder(folderId)
                  }}
                  className="text-xs p-2! py-1! rounded-sm hover:bg-[#333333] cursor-pointer text-[#cecece] uppercase"
                >
                  New Folder
                </p>
                {/* <p
                  onClick={async () => {
                    handleAddRequest(folderId)
                    openFolder(folderId)
                  }}
                  className="text-xs p-2! py-1! rounded-sm hover:bg-[#333333] cursor-pointer text-[#cecece] uppercase"
                >
                  New Request
                </p> */}
                <p
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteDoc(id)
                  }}
                  className="text-xs p-2! py-1! rounded-sm hover:bg-[#333333] cursor-pointer text-[#cecece] uppercase hover:text-red-400"
                >
                  Delete
                </p>
                <p
                  onClick={() => {
                    setEditDoc(item)
                  }}
                  className="text-xs p-2! py-1! rounded-sm hover:bg-[#333333] cursor-pointer text-[#cecece] uppercase"
                >
                  Rename
                </p>
              </div>
            </GlassDropdown>
          </div>
        </p>

        {isOpen &&
          docs?.map((item) => {
            return (
              <RenderNodeItem
                key={id}
                handleAddRequest={handleAddRequest}
                item={item}
                level={level + 1}
                expandedIds={expandedIds}
                toggleFolder={toggleFolder}
                handleDeleteDoc={handleDeleteDoc}
                handleAddFolder={handleAddFolder}
                handlePushRequest={handlePushRequest}
                openFolder={openFolder}
                handleUpdatedCollection={handleUpdatedCollection}
                setIsOpen={setIsOpen}
              />
            )
          })}

        <GlassBlurModal isOpen={!!editDoc} onClose={() => setEditDoc(null)} maxWidth="max-w-md">
          <AddEditFolderModal
            type={'Edit'}
            initalTitle={editDoc?.title}
            selectedData={editDoc}
            setEditDoc={setEditDoc}
            handleUpdatedCollection={handleUpdatedCollection}
          />
        </GlassBlurModal>
      </div>
    )
  }
  return (
    <div style={{ paddingLeft: paddingInline }} className="border-l-1 border-[#505050]">
      <p
        key={id}
        className="text-[13px] uppercase flex items-center justify-between px-[8px]!  py-[4px]! hover:bg-[#151515] rounded-sm cursor-pointer! select-none"
      >
        <span
          className={`truncate text-[12px] ${
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
          <span className="ml-2 lowercase text-[#9d9d9d] text-[11px] max-w-[90%] truncate">
            {item?.title || item?.url}
          </span>
        </span>
        <span
          onClick={async (e) => {
            e.stopPropagation()
            handleDeleteDoc(id)
          }}
          className="p-[3px]!  rounded-sm hover:bg-[#393939]"
        >
          <MdDelete className="" />
        </span>
      </p>
    </div>
  )
}

export default SaveCollectionPopUp
