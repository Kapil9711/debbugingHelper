import HomePageHeader from '@renderer/components/pages/home/homePageHeader'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import HomePageContent from '@renderer/components/pages/home/homePageContent'
import { useLocation } from 'react-router-dom'

const HomePageContext = createContext(null as any)
export const useHomePageContext = () => useContext(HomePageContext)

const HomePage = ({}) => {
  const [logs, setLogs] = useState([] as any)
  const [allLogsMode, setAllLogsMode] = useState(true)
  const [autoClearLength, setAutoClearLength] = useState(301)
  const [stopConsole, setStopConsole] = useState(false)
  const location = useLocation()
  const loadData = async () => {
    const data = await window.debugApi.getDebugData()
    const consoleData: any = []
    const networkData: any = []
    data?.forEach((item) => {
      if (item?.type == 'networkRequest' || item?.type == 'networkResponse') {
        networkData?.push(item)
      } else {
        consoleData.push(item)
      }
    })

    if (location.pathname == '/') {
      setLogs([...consoleData].reverse())
    }
    if (location.pathname?.includes('/network')) {
      setLogs([...networkData].reverse())
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    window.debugApi.setAllLogsMode(allLogsMode)
  }, [allLogsMode])

  useEffect(() => {
    window.debugApi.setAutoClearLength(Number(autoClearLength) || 1)
  }, [autoClearLength])

  useEffect(() => {
    window.debugApi.setStopConsole(stopConsole)
  }, [stopConsole])

  const value = useMemo(() => {
    return {
      allLogsMode,
      autoClearLength,
      logs,
      setAllLogsMode,
      setAutoClearLength,
      setLogs,
      stopConsole,
      setStopConsole
    }
  }, [allLogsMode, autoClearLength, logs, stopConsole])
  return (
    <HomePageContext.Provider value={value}>
      <div className="w-full h-full">
        <HomePageHeader />
        <HomePageContent />
      </div>
    </HomePageContext.Provider>
  )
}

export default HomePage
