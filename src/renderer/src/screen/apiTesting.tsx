import ApiTestingContent from '@renderer/components/pages/apiTesting/apiTestingContent'
import ApiTestingHeader from '@renderer/components/pages/apiTesting/apiTestingHeader'
import { ApiTestingEventType, RequestEventType } from '@shared/eventType'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const ApiTestingContext = createContext(null as any)
export const useApiTestingContext = () => useContext(ApiTestingContext)

const ApiTesting = () => {
  const [environments, setEnvironments] = useState([])
  const [collections, setCollections] = useState([])
  const [selectedEnvironment, setSelectedEnvironment] = useState('GET')
  const [selectedCollection, setSelectedCollection] = useState('GET')
  const [requests, setRequests] = useState([] as any)
  const [request, setRequest] = useState({})

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

  const handleRequestEvent = useCallback((event: any) => {
    if (!event) return
    switch (event.type) {
      case RequestEventType.NewRequest:
        setRequests((prev: any) => [event.payload, ...prev])
        setRequest(event.payload)

        break
      case RequestEventType.UpdateRequest:
        setRequests(event.payload || [])
        setRequest(event.payload[0] || {})
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
      const requestArr = await window.api.request.getRequest('')
      setRequests(requestArr)
      setRequest(requestArr[0] || {})
      const environmentFilterData = environmentData?.filter((item) => item?.type != 'global')
      setEnvironments(environmentFilterData)
      setCollections(collectionData)
    }
    loadInitial()
    const unsubscribe =
      window.api.apiTesting.onUpdated?.((payload) => {
        handleApiTestingEvent(payload)
      }) ?? (() => {})

    const unsubscribeRequest =
      window.api.request.onUpdated?.((payload) => {
        handleRequestEvent(payload)
      }) ?? (() => {})
    return () => {
      unsubscribe()
      unsubscribeRequest()
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

  useEffect(() => {
    setRequest(requests[0] || {})
  }, [requests])

  console.log(environments, 'environements')

  return (
    <ApiTestingContext.Provider
      value={{
        selectedEnvironment,
        setSelectedEnvironment,
        environments,
        collections,
        selectedCollection,
        setSelectedCollection,
        requests,
        request,
        setRequest
      }}
    >
      <ApiTestingHeader />
      <ApiTestingContent />
    </ApiTestingContext.Provider>
  )
}

export default ApiTesting
