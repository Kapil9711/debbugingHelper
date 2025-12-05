import { useHomePageContext } from '@renderer/screen/homePage'
import { clearExistingHighlights, highlightMatches } from '@renderer/utlis/jsonHelper'

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
  const RemoveDublicateRef = useRef(true)
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

  const containerRef = useRef<HTMLDivElement | null>(null)
  const matchIndexRef = useRef(0)

  const handleSearchHighlight = () => {
    const container = containerRef.current
    if (!container) return
    // get ALL react-json-view roots
    const roots = container.querySelectorAll('.react-json-view')
    if (!roots.length) return

    roots.forEach((root) => {
      // 1) remove old marks
      clearExistingHighlights(root)
      // 2) add new ones
      if (filterRef?.current.trim()) {
        highlightMatches(root, filterRef?.current.trim())
      }
    })
  }
  function scrollToFirstMatch(next = true) {
    const container = containerRef.current
    if (!container) return

    const marks = Array.from(container.querySelectorAll('mark.json-highlight')) as HTMLElement[]
    if (marks.length === 0) return

    // update index
    if (next) {
      matchIndexRef.current = (matchIndexRef.current + 1) % marks.length
    } else {
      matchIndexRef.current = (matchIndexRef.current - 1 + marks.length) % marks.length
    }

    const target = marks[matchIndexRef.current]
    const markRect = target.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const offsetInside = markRect.top - containerRect.top

    const offset = 150 // space from top
    container.scrollTo({
      top: container.scrollTop + offsetInside - offset,
      behavior: 'smooth'
    })

    // blink effect
    target.classList.add('blink-highlight')
    setTimeout(() => target.classList.remove('blink-highlight'), 1000)
  }

  // useEffect(() => {
  //   const container = containerRef.current
  //   if (!container) return

  //   const roots = container.querySelectorAll('.react-json-view')
  //   if (!roots.length) return

  //   roots.forEach((root) => {
  //     // 1) remove old marks
  //     clearExistingHighlights(root)
  //     // 2) add new ones
  //     if (filter.trim()) {
  //       highlightMatches(root, filter.trim())
  //     }
  //   })
  // }, [filterRef?.current, filterLogs])
  return (
    <div
      ref={containerRef}
      className=".logs-scroll flex flex-col gap-10!  h-[calc(100%-80px)]  p-5! overflow-auto scrollbar-hidden  relative"
    >
      <HomePageFilters
        count={filterLogs?.length}
        handleFilter={handleFilter}
        handleRemoveDuplicate={handleRemoveDuplicate}
        filterRef={filterRef}
        RemoveDublicateRef={RemoveDublicateRef}
        handleSearchHighlight={handleSearchHighlight}
        scrollToFirstMatch={scrollToFirstMatch}
        matchIndexRef={matchIndexRef}
      />
      <DataList
        logs={filterLogs}
        setIsHovered={setIsHovered}
        isHovered={isHovered}
        handleCopy={handleCopy}
        handleSearchHighlight={handleSearchHighlight}
      />
    </div>
  )
}

const HomePageFilters = ({
  handleFilter,
  count,
  filterRef,
  handleSearchHighlight,
  scrollToFirstMatch,
  matchIndexRef
}: any) => {
  return (
    <div className="fixed! top-[100px]! right-5!  w-[15%] mobile:hidden tabletS:hidden">
      <p className="text-sm mb-1! text-white">Found ({count})</p>
      <SearchInput
        handleFilter={handleFilter}
        filterRef={filterRef}
        handleSearchHighlight={handleSearchHighlight}
        scrollToFirstMatch={scrollToFirstMatch}
        matchIndexRef={matchIndexRef}
      />
      {/* <input
        onBlur={() => {
          filterRef.current = filter
          handleFilter(filter)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            filterRef.current = filter
            handleFilter(filter)
            handleSearchHighlight()
          }
        }}
        placeholder="Search"
        className="px-3! bg-gray-300 text-gray-900 text-sm font-bold h-8 w-full rounded-md"
        type="text"
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value)
          window.api.console.setSearchString(e.target.value)
        }}
      /> */}
      {/* <div className="flex items-center gap-2 mt-2!">
        <p className="text-sm text-white">Remove Duplicate</p>
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
      </div> */}
    </div>
  )
}

const SearchInput = ({
  handleFilter,
  filterRef,
  handleSearchHighlight,
  scrollToFirstMatch,
  matchIndexRef
}) => {
  const [filter, setFilter] = useState('')
  useEffect(() => {
    handleFilter(filter)
    filterRef.current = filter
    handleSearchHighlight()
    matchIndexRef.current = -1
  }, [filter])
  return (
    <input
      onBlur={() => {
        filterRef.current = filter
        handleFilter(filter)
        handleSearchHighlight(filter)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          filterRef.current = filter
          handleFilter(filter)
          handleSearchHighlight(filter)
          scrollToFirstMatch()
        }
      }}
      placeholder="Search"
      className="px-3! bg-gray-300 text-gray-900 text-sm font-bold h-8 w-full rounded-md"
      type="text"
      value={filter}
      onChange={(e) => {
        setFilter(e.target.value)
        window.api.console.setSearchString(e.target.value)
      }}
    />
  )
}

const DataList = ({ logs, setIsHovered, isHovered, handleCopy, handleSearchHighlight }) => {
  return (
    <>
      {logs.map((item: any, index: any) => {
        return (
          <div
            onClick={() => {
              setTimeout(handleSearchHighlight, 1000)
            }}
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered('')}
            key={index}
            className={`  hover:rounded-md flex flex-col justify-center w-fit p-2! $   gap-1.5 cursor-pointer hover:shadow-md relative break-all max-w-[80%] ${isHovered == index ? 'border border-gray-200' : ''} `}
          >
            <div className="flex items-center gap-5">
              <p
                className={`${item?.type?.includes('log') ? 'text-green-500' : item?.type?.includes('warn') ? 'text-yellow-500' : item?.type?.includes('error') ? 'text-red-500' : 'text-violet-500'}  font-semibold!  border-b  border-white w-fit`}
                key={index}
              >
                {index + 1} - {item?.time}
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
