import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import NetworkPageHeader from '@renderer/components/pages/network/networkPageHeader'
import NetworkPageContent from '@renderer/components/pages/network/networkPageContent'
import RequestTester from '@renderer/components/pages/network/testRequest'

const NetworkPageContext = createContext(null as any)
export const useNetworkPageContext = () => useContext(NetworkPageContext)
const NetworkPage = ({}) => {
  const [logs, setLogs] = useState([] as any)
  const [autoClearLength, setAutoClearLength] = useState(301)
  const [stopConsole, setStopConsole] = useState(false)
  const [testData, setTestData] = useState(null as any)
  const loadData = async () => {
    const data = await window.debugApiNetwork.getDebugData()
    setLogs([...data].reverse())
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    window.debugApiNetwork.setAutoClearLength(Number(autoClearLength) || 1)
  }, [autoClearLength])

  useEffect(() => {
    window.debugApiNetwork.setStopNetwork(stopConsole)
  }, [stopConsole])

  const value = useMemo(() => {
    return {
      autoClearLength,
      logs,
      setAutoClearLength,
      setLogs,
      stopConsole,
      setStopConsole,
      testData,
      setTestData
    }
  }, [autoClearLength, logs, stopConsole, testData])
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
