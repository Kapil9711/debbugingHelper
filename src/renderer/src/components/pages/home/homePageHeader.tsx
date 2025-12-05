import { useHomePageContext } from '@renderer/screen/homePage'
import Header from '../../header'
import { FaPauseCircle, FaPlay } from 'react-icons/fa'

const HomePageHeader = () => {
  const { logs, autoClearLength, setAutoClearLength, setLogs, pauseConsole, setPauseConsole } =
    useHomePageContext()
  const { theme } = useHomePageContext()

  return (
    <Header>
      <div className="text-center font-bold py-2.5   flex items-center justify-between gap-2.5 px-[30px]! border-b border-neutral  h-full">
        <div className=" flex flex-col justify-center gap-2">
          <p className=" capitalize text-[13px] tracking-[.5px]">http://localhost:5600/debugging</p>
          <div className="flex item-center gap-5 ">
            {/* <div className="flex items-center gap-2.5">
              <p className="text-[13px] tracking-[.8px] font-medium uppercase">as console</p>
              <input
                className="h-4 w-4 bg-green-500"
                type="checkbox"
                checked={allLogsMode}
                onChange={() => setAllLogsMode((prev) => !prev)}
              />
            </div> */}
            <button
              onClick={() => {
                setPauseConsole((prev) => !prev)
                window.api.console.setPause(!pauseConsole)
              }}
              className=" h-[30px] w-[50px] bg-green-400 rounded-md uppercase text-xs cursor-pointer flex justify-center items-center"
            >
              {pauseConsole ? (
                <FaPlay className="text-gray-900" size={18} />
              ) : (
                <FaPauseCircle className="text-gray-900" size={22} />
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 mobile:hidden tabletS:hidden ">
          <p className="uppercase text-[13px] flex items-center gap-1">
            <span>Auto clear length - </span>
            <span className="text-[16px]">{autoClearLength}</span>
          </p>
          <input
            key={theme}
            className={`h-[30px] border-none px-2.5! rounded-lg w-40 bg-gray-200 text-black text-sm`}
            type="number"
            placeholder="Auto Clear Length"
            value={autoClearLength || ''}
            onChange={(e) => {
              if (Number(e.target.value)) {
                if (Number(e.target.value) >= 1 && e.target.value?.length < 4) {
                  setAutoClearLength(Number(e.target.value))
                  window.api.console.setAutoClearLength(Number(e.target.value))
                }
              } else {
                setAutoClearLength(0)
                window.api.console.setAutoClearLength(0)
              }
            }}
          />
        </div>

        <div className="mobile:hidden tabletS:hidden flex flex-col items-center gap-1">
          <div className="flex gap-2 items-center">
            <p className="text-[13px] tracking-[.8px] font-medium uppercase">Total Logs - </p>
            <p className="text-[18px] tracking-[.8px] font-medium uppercase">{logs?.length}</p>
          </div>
          <button
            onClick={async () => {
              setLogs([])
              window.api.console.clearLogs()
            }}
            className="bg-red-600 w-28 p-1.5! rounded-md leading-[1] py-2! uppercase text-xs cursor-pointer text-white"
          >
            Clear Now
          </button>
        </div>
      </div>
    </Header>
  )
}

export default HomePageHeader
