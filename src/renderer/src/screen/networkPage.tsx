import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import NetworkPageHeader from '@renderer/components/pages/network/networkPageHeader'
import NetworkPageContent from '@renderer/components/pages/network/networkPageContent'
import RequestTester from '@renderer/components/pages/network/testRequest'
import toast from 'react-hot-toast'
import { NetworkEventType } from '../../../shared/eventType'

const NetworkPageContext = createContext(null as any)
export const useNetworkPageContext = () => useContext(NetworkPageContext)
const NetworkPage = ({}) => {
  const [logs, setLogs] = useState([] as any)
  const [autoClearLength, setAutoClearLength] = useState(301)
  const [pauseNetwork, setPauseNetwork] = useState(false)
  const [testData, setTestData] = useState(null as any)
  const handleNetworkEvent = useCallback((event: any) => {
    if (!event) return

    switch (event.type) {
      case NetworkEventType.NewLog:
        setLogs((prev) => [event.payload, ...prev])
        break

      case NetworkEventType.Length:
        setAutoClearLength(event.payload as number)
        toast.success('Length Updated Successfully')
        break

      case NetworkEventType.Pause:
        setPauseNetwork(Boolean(event.payload))
        toast.success(event.payload ? 'Network Paused' : 'Network Started')
        break

      case NetworkEventType.ClearLog:
        setLogs(Array.isArray(event.payload) ? (event.payload as any[]) : [])
        toast.success('Log Clear Successfully')
        break

      case NetworkEventType.AutoClear:
        // payload is trimmed logs array
        setLogs(Array.isArray(event.payload) ? (event.payload as any[]) : [])
        break

      default:
        console.warn('Unknown network event type', event)
    }
  }, [])

  useEffect(() => {
    const loadInitial = async () => {
      const data = await window.api.network.getLogs()
      const pause = await window.api.network.getPause()
      const autoLength = await window.api.network.getAutoLength()
      setLogs(data.reverse())
      setAutoClearLength(autoLength)
      setPauseNetwork(pause)
    }
    loadInitial()
    const unsubscribe =
      window.api.network.onUpdated?.((payload) => {
        handleNetworkEvent(payload)
      }) ?? (() => {})
    return () => unsubscribe()
  }, [])

  const value = useMemo(() => {
    return {
      autoClearLength,
      logs,
      setAutoClearLength,
      setLogs,
      pauseNetwork,
      setPauseNetwork,
      testData,
      setTestData
    }
  }, [autoClearLength, logs, pauseNetwork, testData])
  return (
    <NetworkPageContext.Provider value={value}>
      <div className="w-full h-full">
        {testData ? (
          <RequestTester request={testData} />
        ) : (
          <>
            <NetworkPageHeader />
            <NetworkPageContent />
          </>
        )}
      </div>
    </NetworkPageContext.Provider>
  )
}

export default NetworkPage
