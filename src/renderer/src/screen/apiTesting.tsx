import ApiTestingContent from '@renderer/components/pages/apiTesting/apiTestingContent'
import ApiTestingHeader from '@renderer/components/pages/apiTesting/apiTestingHeader'
import { ApiTestingEventType } from '@shared/eventType'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const ApiTestingContext = createContext(null as any)
export const useApiTestingContext = () => useContext(ApiTestingContext)

const ApiTesting = () => {
  const [environments, setEnvironments] = useState([])
  const [collections, setCollections] = useState([])
  const [selectedEnvironment, setSelectedEnvironment] = useState('GET')
  const [selectedCollection, setSelectedCollection] = useState('GET')

  const handleApiTestingEvent = useCallback((event: any) => {
    if (!event) return
    switch (event.type) {
      case ApiTestingEventType.UpdateEnvironment:
        setEnvironments(event.payload)
        break
      case ApiTestingEventType.UpdateCollection:
        setCollections(event.payload)
        break
      case ApiTestingEventType.Message:
        toast.success(event.payload)
        break
      default:
        console.warn('Unknown network event type', event)
    }
  }, [])

  useEffect(() => {
    const loadInitial = async () => {
      // environment
      const environmentData = await window.api.apiTesting.getEnvironments('')
      const collectionData = await window.api.apiTesting.getCollections('')
      setEnvironments(environmentData)
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
    if (collections[0]) {
      setSelectedCollection(collections[0])
    }
  }, [collections])

  useEffect(() => {
    if (environments[0]) {
      setSelectedEnvironment(environments[0])
    }
  }, [environments])

  return (
    <ApiTestingContext.Provider
      value={{
        selectedEnvironment,
        setSelectedEnvironment,
        environments,
        collections,
        selectedCollection,
        setSelectedCollection
      }}
    >
      <ApiTestingHeader />
      <ApiTestingContent />
    </ApiTestingContext.Provider>
  )
}

export default ApiTesting
