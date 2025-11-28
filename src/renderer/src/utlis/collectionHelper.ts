import toast from 'react-hot-toast'
import { convertId } from './dbHelper'

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

export { handleUpdateCollectionById }
