import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import NetworkPageHeader from '@renderer/components/pages/network/networkPageHeader'
import NetworkPageContent from '@renderer/components/pages/network/networkPageContent'

const NetworkPageContext = createContext(null as any)
export const useNetworkPageContext = () => useContext(NetworkPageContext)
const NetworkPage = ({}) => {
  const [logs, setLogs] = useState([] as any)
  const [autoClearLength, setAutoClearLength] = useState(301)
  const [stopConsole, setStopConsole] = useState(false)
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
      setStopConsole
    }
  }, [autoClearLength, logs, stopConsole])
  return (
    <NetworkPageContext.Provider value={value}>
      <div className="w-full h-full">
        <NetworkPageHeader />
        <NetworkPageContent />
      </div>
    </NetworkPageContext.Provider>
  )
}

export default NetworkPage
