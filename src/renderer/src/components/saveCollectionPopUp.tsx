import { useCallback, useEffect, useState } from 'react'
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

const SaveCollectionPopUp = ({ trigger, requestPayload }: any) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger ? trigger : 'open'}</div>
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

export const SidebarApiTestingContent = ({ requestPayload, setIsOpen }: any) => {
  const [collections, setCollections] = useState([])
  const [selectedCollection, setSelectedCollection] = useState({})

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

  return (
    <div className="flex flex-col px-5! py-4! gap-4 overflow-auto h-[calc(100%-160px)] scrollbar-hidden">
      {/* <div className="flex items-center justify-between gap-2 select-none">
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
      </div> */}

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
                <div className="flex items-center gap-2"></div>
              </p>
              {collection && (
                <ShowSelectedCollections
                  requestPayload={requestPayload}
                  key={collection?.docs?.length}
                  selectedCollections={collection}
                  setSelectedCollection={setSelectedCollection}
                  level={0}
                  setIsOpen={setIsOpen}
                />
              )}
            </div>
          )
        })}
      </div>
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
          <div className="flex items-center gap-2">
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
          <span className="ml-2 lowercase text-[#9d9d9d] text-[11px]">
            {item?.title || item?.url}
          </span>
        </span>
        <span className="p-[3px]!  rounded-sm hover:bg-[#393939]"></span>
      </p>
    </div>
  )
}

export default SaveCollectionPopUp
