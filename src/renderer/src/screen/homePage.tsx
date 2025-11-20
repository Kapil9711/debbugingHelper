import HomePageHeader from '@renderer/components/pages/home/homePageHeader'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import HomePageContent from '@renderer/components/pages/home/homePageContent'
import { ConsoleEventType } from '@shared/eventType'
import toast from 'react-hot-toast'

const HomePageContext = createContext(null as any)
export const useHomePageContext = () => useContext(HomePageContext)
const HomePage = ({}) => {
  const [logs, setLogs] = useState([] as any)
  const [autoClearLength, setAutoClearLength] = useState(301)
  const [pauseConsole, setPauseConsole] = useState(false)
  const [filter, setFilter] = useState('')

  const handleConsoleEvent = useCallback((event: any) => {
    if (!event) return
    switch (event.type) {
      case ConsoleEventType.NewLog:
        setLogs((prev) => [event.payload, ...prev])
        break

      case ConsoleEventType.Length:
        setAutoClearLength(event.payload as number)
        toast.success('Length Updated Successfully')
        break

      case ConsoleEventType.Pause:
        setPauseConsole(Boolean(event.payload))
        toast.success(event.payload ? 'Console Paused' : 'Console Started')
        break

      case ConsoleEventType.ClearLog:
        setLogs(Array.isArray(event.payload) ? (event.payload as any[]) : [])
        toast.success('Log Clear Successfully')
        break

      case ConsoleEventType.AutoClear:
        // payload is trimmed logs array
        setLogs(Array.isArray(event.payload) ? (event.payload as any[]) : [])
        break

      // case ConsoleEventType.searchString:
      //   setFilter(event.payload)
      //   break

      default:
        console.warn('Unknown network event type', event)
    }
  }, [])

  useEffect(() => {
    const loadInitial = async () => {
      const data = await window.api.console.getLogs()
      const pause = await window.api.console.getPause()
      const autoLength = await window.api.console.getAutoLength()
      const searchString = await window.api.console.getSearchString()
      setFilter(searchString)
      setLogs(data.reverse())
      setAutoClearLength(autoLength)
      setPauseConsole(pause)
    }
    loadInitial()
    const unsubscribe =
      window.api.console.onUpdated?.((payload) => {
        handleConsoleEvent(payload)
      }) ?? (() => {})
    return () => unsubscribe()
  }, [])

  const value = useMemo(() => {
    return {
      autoClearLength,
      logs,
      setAutoClearLength,
      setLogs,
      pauseConsole,
      setPauseConsole,
      filter,
      setFilter
    }
  }, [autoClearLength, logs, pauseConsole, filter])
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
