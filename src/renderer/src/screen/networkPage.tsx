import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import NetworkPageHeader from '@renderer/components/pages/network/networkPageHeader'
import NetworkPageContent from '@renderer/components/pages/network/networkPageContent'
import RequestTester from '@renderer/components/pages/network/testRequest'
import toast from 'react-hot-toast'

const NetworkPageContext = createContext(null as any)
export const useNetworkPageContext = () => useContext(NetworkPageContext)
const NetworkPage = ({}) => {
  const [logs, setLogs] = useState([] as any)
  const [autoClearLength, setAutoClearLength] = useState(301)
  const [pauseNetwork, setPauseNetwork] = useState(false)
  const [testData, setTestData] = useState(null as any)

  useEffect(() => {
    const loadInitial = async () => {
      const data = await window.api.network.getLogs()
      setLogs(data.reverse())
    }
    loadInitial()
    const unsubscribe =
      window.api.network.onUpdated?.(({ type, payload }) => {
        if (type == 'newLog') {
          setLogs((prev) => [payload, ...prev])
        }
        if (type == 'length') {
          toast.success('Length Updated Successfully')
          setAutoClearLength(payload)
        }
        if (type == 'pause') {
          if (payload) {
            toast.success('Network Paused')
          } else {
            toast.success('Network Started')
          }
          setPauseNetwork(payload)
        }
        if (type == 'clearLog') {
          toast.success('Log Clear Successfully')
          setLogs(payload)
        }
        if (type == 'autoClear') {
          // toast.success('Auto Clear Successfully')
          setLogs(payload)
        }
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
