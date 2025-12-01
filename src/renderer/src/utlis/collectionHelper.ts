import toast from 'react-hot-toast'
import { convertId } from './dbHelper'

export const requestPayload = {
  method: 'GET',
  title: '',
  url: ''
}
export const folderPayload = {
  title: 'NEW FOLDER',
  docs: []
}

const handleUpdateCollectionById = async (collectionId: any, docId: any, updateValue: any) => {
  if (!collectionId) {
    return toast.error('CollectionId is Required')
  }
  const collections: any = await window.api.apiTesting.getCollections('')
  const targetCollection = collections?.find((item: any) => {
    const itemId = convertId(item?._id)
    return itemId == collectionId
  })
  if (!targetCollection) {
    return toast.error('Collection Not Found')
  }
  const { docs } = targetCollection
  const initialDoc = docs?.find((item) => item?.id == docId)
  if (!initialDoc) {
    return toast.error('Doc Not Find')
  }
  const updatedDoc = { ...initialDoc, ...updateValue }
  const filterDoc = docs?.filter((item: any) => item?.id != docId)
  const finalDocs = [...filterDoc, updatedDoc]
  window.api.apiTesting.updateCollection({
    id: collectionId,
    payload: { ...targetCollection, docs: finalDocs }
  })
}

const updateCollectionById = async (collectionId: string, targetId: string, payload: any) => {
  try {
    const collection = await window.api.apiTesting.getCollections(collectionId)
    if (!collection) {
      return toast.error('Collection Not Found')
    }
    const updateRequest = (nodes, targetId, payload) => {
      return nodes.map((node) => {
        const { id, docs } = node
        const isFolder = Array.isArray(docs)
        if (id == targetId) {
          return { ...node, ...payload }
        } else {
          if (isFolder) {
            return { ...node, docs: updateRequest(docs, targetId, payload) }
          }
        }
        return node
      })
    }

    const updatedDocs = updateRequest(collection?.docs, targetId, payload)
    const updatedCollection = { ...collection, docs: updatedDocs }
    await window.api.apiTesting.updateCollection({
      id: collectionId,
      payload: { ...updatedCollection, isDocs: true }
    })
  } catch (error) {}
}

const handleAddToCollection = async (collectionId: string, payload: any, folderId: string) => {
  try {
    const collection = await window.api.apiTesting.getCollections(collectionId)
    if (!collection) {
      return toast.error('Collection Not Found')
    }
    payload.id = Date.now()
    const addRequest = (nodes, targetId, payload) => {
      return nodes.map((node) => {
        const { docs, id } = node
        const isFolder = Array.isArray(docs)
        if (isFolder) {
          // if target folder found
          if (id == targetId) {
            return { ...node, docs: [...docs, payload] }
          }
          return { ...node, docs: addRequest(docs, targetId, payload) }
          // if not found that do recursive
        }
        //  return unchanged if request
        return node
      })
    }
    const updatedDocs = addRequest(collection?.docs, folderId, payload)
    const updatedCollection = { ...collection, docs: updatedDocs }
    await window.api.apiTesting.updateCollection({
      id: collectionId,
      payload: { ...updatedCollection, isDocs: true }
    })
  } catch (error) {}
}

const handleDeleteCollectionDoc = async (collectionId, targetId) => {
  try {
    console.log(collectionId, 'id')
    const collection = await window.api.apiTesting.getCollections(collectionId)
    if (!collection) {
      return toast.error('Collection Not Found')
    }
    const removeNodeById = (nodes, targetId) => {
      return nodes
        .filter((node) => node.id !== targetId)
        .map((node) => {
          if (Array.isArray(node.docs) && node.docs.length > 0) {
            return {
              ...node,
              docs: removeNodeById(node.docs, targetId)
            }
          }
          return node
        })
    }
    const updatedDocs = removeNodeById(collection?.docs, targetId)
    const updatedCollection = { ...collection, docs: updatedDocs }
    await window.api.apiTesting.updateCollection({
      id: collectionId,
      payload: { ...updatedCollection, isDocs: true }
    })
  } catch (error) {
    console.log(error)
    toast.error('Error deleting doc from collection')
  }
}

export {
  handleUpdateCollectionById,
  updateCollectionById,
  handleAddToCollection,
  handleDeleteCollectionDoc
}
