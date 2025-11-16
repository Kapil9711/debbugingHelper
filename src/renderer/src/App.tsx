// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'

import { useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
import MainLayout from './layout/mainLayout'
import Header from './components/header'

function App(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [logs, setLogs] = useState([] as any)
  const [allLogsMode, setAllLogsMode] = useState(false)
  const [autoClearLength, setAutoClearLength] = useState(301)
  const loadData = async () => {
    const data = await window.debugApi.getDebugData()
    setLogs([...data].reverse())
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

  return (
    <>
      <MainLayout>
        <ConsolePage
          {...{
            allLogsMode,
            setAllLogsMode,
            logs,
            autoClearLength,
            setAutoClearLength,
            setLogs
          }}
        />
      </MainLayout>
    </>
  )
}

const ConsolePage = ({
  allLogsMode,
  setAllLogsMode,
  logs,
  autoClearLength,
  setAutoClearLength,
  setLogs
}: any) => {
  return (
    <div className="w-full ">
      <Header>
        <div className="text-center font-bold py-2.5   flex items-center justify-between gap-2.5 px-[30px]">
          <div className="mobile:hidden flex items-center gap-[5px]">
            <input
              type="checkbox"
              checked={allLogsMode}
              onChange={() => setAllLogsMode((prev) => !prev)}
            />
            <p className="underline">Show All Logs</p>
          </div>
          <p className="">Listening on 'http://localhost:5600/debugging'</p>

          <div className="mobile:hidden flex items-center gap-5">
            <div className="flex items-center gap-[5px]">
              <p>( {logs?.length} ) Auto Clear Length - </p>
              <input
                className="h-[30px] border-none px-2.5 rounded-2 w-20"
                type="number"
                placeholder="Auto Clear Length"
                value={autoClearLength || ''}
                onChange={(e) => {
                  if (Number(e.target.value)) {
                    if (Number(e.target.value) >= 1) {
                      setAutoClearLength(Number(e.target.value))
                    }
                  } else {
                    setAutoClearLength(0)
                  }
                }}
              />
            </div>
            <button
              onClick={async () => {
                await window.debugApi.clearLogs()
                setLogs([]) // Clear UI immediately
              }}
              style={{
                padding: '8px 14px',
                border: 'none',
                background: 'red',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Clear Now
            </button>
          </div>
        </div>
      </Header>

      <div className="flex flex-col items-center justify-center gap-2.5 my-10 py-5">
        {logs.map((item: any, index: any) => {
          return (
            <div key={index} className="flex flex-col justify-center w-full gap-[1px] my-2.5">
              <p className="text-white border-b border-white w-fit" key={index}>
                {item?.time}
              </p>
              <ReactJson
                style={{
                  width: '100%',
                  paddingBlock: '10px',
                  background: 'rgb(16, 15, 15)',
                  height: 'fit-content'
                }}
                src={item?.data}
                theme="summerfruit"
                name={item?.type}
                collapsed={1}
                enableClipboard={true}
                displayDataTypes={true}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
