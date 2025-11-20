import HomePageHeader from '@renderer/components/pages/home/homePageHeader'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import HomePageContent from '@renderer/components/pages/home/homePageContent'

const HomePageContext = createContext(null as any)
export const useHomePageContext = () => useContext(HomePageContext)
const HomePage = ({}) => {
  const [logs, setLogs] = useState([] as any)
  const [allLogsMode, setAllLogsMode] = useState(true)
  const [autoClearLength, setAutoClearLength] = useState(301)
  const [stopConsole, setStopConsole] = useState(false)

  const loadData = async () => {
    const data = await window.api.console.getLogs()
    setLogs([...data].reverse())
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 1000)
    return () => clearInterval(interval)
  }, [])

  // useEffect(() => {
  //   window.debugApi.setAllLogsMode(allLogsMode)
  // }, [allLogsMode])

  // useEffect(() => {
  //   window.debugApi.setAutoClearLength(Number(autoClearLength) || 1)
  // }, [autoClearLength])

  // useEffect(() => {
  //   window.debugApi.setStopConsole(stopConsole)
  // }, [stopConsole])

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
