import { useHomePageContext } from '@renderer/screen/homePage'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import ReactJson from 'react-json-view'

const HomePageContent = () => {
  const { logs } = useHomePageContext()
  const [filterLogs, setFilterLogs] = useState(logs)
  const handleCopy = async (textToCopy) => {
    await navigator.clipboard.writeText(textToCopy)
    toast.success('Copied To Clipboard')
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  const filterRef = useRef('' as any)
  const RemoveDublicateRef = useRef(false)
  const handleFilter = (filter: string) => {
    const userInput = filter
    const pattern = new RegExp(escapeRegex(userInput), 'i')
    const obj = logs?.filter((item: any) => {
      const obj = JSON.stringify(item, null, 2)
      return pattern.test(obj)
    })
    if (RemoveDublicateRef.current) {
      handleRemoveDuplicate(true, obj)
    } else {
      setFilterLogs(obj)
    }
  }

  const handleRemoveDuplicate = (flag, logs: any) => {
    if (flag) {
      const arr: any = []
      const actualArr: any = []
      let filterArr = logs || filterLogs
      filterArr.forEach((item: any) => {
        const obj = JSON.stringify(item.data, null, 2)
        if (!arr.includes(obj)) {
          arr.push(obj)
          actualArr.push(item)
        }
      })
      setFilterLogs(actualArr)
    }
    if (!flag) {
      handleFilter(filterRef?.current)
    }
  }

  const [isHovered, setIsHovered] = useState('')

  useEffect(() => {
    handleFilter(filterRef?.current)
  }, [logs])
  return (
    <div className="flex flex-col gap-10!  h-[calc(100%-80px)]  p-5! overflow-auto scrollbar-hidden bg-[#101111] relative">
      <HomePageFilters
        count={filterLogs?.length}
        handleFilter={handleFilter}
        handleRemoveDuplicate={handleRemoveDuplicate}
        filterRef={filterRef}
        RemoveDublicateRef={RemoveDublicateRef}
      />
      <DataList
        logs={filterLogs}
        setIsHovered={setIsHovered}
        isHovered={isHovered}
        handleCopy={handleCopy}
      />
    </div>
  )
}

const HomePageFilters = ({
  handleFilter,
  count,
  handleRemoveDuplicate,
  filterRef,
  RemoveDublicateRef
}: any) => {
  const [filter, setFilter] = useState('')
  const [removeDuplicate, setRemoveDubplicate] = useState(false)
  useEffect(() => {
    handleFilter(filter)
    filterRef.current = filter
  }, [filter])
  return (
    <div className="fixed! top-[100px]! right-5!  w-[15%] mobile:hidden tabletS:hidden">
      <p className="text-sm mb-1!">Found ({count})</p>
      <input
        onBlur={() => {
          handleFilter(filter)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleFilter(filter)
          }
        }}
        placeholder="Search"
        className="px-3! bg-gray-300 text-gray-900 text-sm font-bold h-8 w-full rounded-md"
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="flex items-center gap-2 mt-2!">
        <p className="text-sm">Remove Duplicate</p>
        <input
          className="h-4 w-4"
          type="checkbox"
          checked={removeDuplicate}
          onChange={() => {
            RemoveDublicateRef.current = !removeDuplicate
            setRemoveDubplicate(!removeDuplicate)
            handleRemoveDuplicate(!removeDuplicate)
          }}
        />
      </div>
    </div>
  )
}

const DataList = ({ logs, setIsHovered, isHovered, handleCopy }) => {
  return (
    <>
      {logs.map((item: any, index: any) => {
        return (
          <div
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered('')}
            key={index}
            className={`  hover:rounded-md flex flex-col justify-center w-fit p-2! $   gap-1.5 cursor-pointer hover:shadow-md relative`}
          >
            <div className="flex items-center gap-5">
              <p className="text-indigo-400! border-b  border-white w-fit" key={index}>
                {item?.time}
              </p>
              <button
                style={{ display: isHovered == index ? 'block' : 'none' }}
                onClick={() => {
                  const obj = JSON.stringify(item?.data, null, 2)
                  handleCopy(obj)
                }}
                className="border border-gray-200 h-[25px] w-[60px] bg-gray-300 text-black text-xs rounded-md cursor-pointer uppercase"
              >
                Copy
              </button>
            </div>

            <ReactJson
              style={{
                width: 'fit-content',
                paddingBlock: '10px',
                background: 'transparent',
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
    </>
  )
}

export default HomePageContent
