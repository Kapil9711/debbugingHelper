import { useState } from 'react'
import { MdOutlineDelete } from 'react-icons/md'

const ApiTestingContent = () => {
  const { request } = useApiTestingContext()
  let id = ''
  if (request?._id) {
    id = convertId(request?._id)
  }

  return (
    <div key={id} className="p-5! py-3! relative h-full">
      <SearchHeader />
      <RequestData />
      <ResponseData />
    </div>
  )
}

const SearchHeader = () => {
  const [inputMethod, setInputMethod] = useState('GET')
  const [inputValue, setInputValue] = useState('')
  const { request } = useApiTestingContext()
  const [collections, setCollections] = useState([])
  const [requestLoading, setRequestLoading] = useState(false)
  useEffect(() => {
    const loadInitial = async () => {
      const collectionData = await window.api.apiTesting.getCollections('')
      setCollections(collectionData)
    }
    loadInitial()
  }, [])
  useEffect(() => {
    setInputMethod(request?.method || 'GET')
    setInputValue(request?.url || '')
  }, [request])

  let id = ''
  let collectionId = request?.collectionId
  if (request?._id) {
    id = convertId(request?._id)
  }

  async function runTest() {
    try {
      setRequestLoading(true)
      const safeRequest = {
        url: inputValue,
        method: inputMethod,
        body: String(request?.method).toLowerCase() == 'get' ? undefined : request?.body,
        headers: request?.headers ?? {}
      }
      const res = await window.api.network.runRequest(safeRequest)
      const idString = convertId(request?._id)
      const payload = {
        ...request,
        url: inputValue,
        method: inputMethod,
        response: res
      }
      handleUpdatedCollection(request?.id, { response: res })
      window.api.request.updateRequest({ id: idString, payload })
    } catch (err: any) {
      toast.error(String(err?.message ?? err))
    } finally {
      setRequestLoading(false)
    }
  }

  const handleUpdatedCollection = useCallback(
    updateCollectionById.bind(null, request?.collectionId),
    [request]
  )

  const methodColor =
    inputMethod === 'GET'
      ? 'bg-green-600 text-white'
      : inputMethod === 'POST'
        ? 'bg-orange-500 text-white'
        : inputMethod === 'PUT'
          ? 'bg-blue-600 text-white'
          : inputMethod === 'DELETE'
            ? 'bg-red-600 text-white'
            : 'bg-gray-700 text-white'

  return (
    <div className="h-[50px]  flex items-center  gap-5">
      <select
        value={inputMethod}
        onChange={(e) => {
          setInputMethod(e.target.value)
          const payload = {
            ...request,
            method: e.target.value
          }
          window.api.request.updateRequest({ id: id, payload })
          const updateValue: any = { method: e.target.value }
          handleUpdatedCollection(request?.id, updateValue)
        }}
        className={`
    px-3! py-2! rounded font-semibold text-sm shadow-sm cursor-pointer outline-none
    ${methodColor}
  `}
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
        <option value="PATCH">PATCH</option>
      </select>
      <input
        onKeyDown={(e) => {
          if (e.key == 'Enter') {
            runTest()
          }
        }}
        value={inputValue}
        onChange={(e) => {
          const value = e.target.value
          setInputValue(value)
          const payload = {
            ...request,
            url: e.target.value
          }
          window.api.request.updateRequest({ id: id, payload })
          const updateValue: any = { url: e.target.value }
          handleUpdatedCollection(request?.id, updateValue)
        }}
        type="text"
        className="h-[38px] shadow-sm tracking-[.5px] w-[75%] border border-gray-400 rounded-md px-3! outline-none  text-xs"
      />

      <button
        onClick={() => {
          runTest()
        }}
        className="bg-blue-600 rounded-md px-7! py-[9px]! text-sm cursor-pointer flex items-center gap-2"
      >
        {requestLoading && <FaSpinner className="animate-spin" />}
        SEND
      </button>
      <TopBarLoader color={methodColor} loading={requestLoading} />
    </div>
  )
}

const ResponseData = () => {
  const { request } = useApiTestingContext()
  const { response = null } = request || {}

  function copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Copy failed'))
  }
  return (
    <ResizableBottomPanel initialHeight={320}>
      <div className="py-1!">
        <p className="text-sm font-light">Response</p>
        <div className="flex items-center min-h-[300px]! overflow-auto scrollbar-hidden">
          {!response ? (
            <p className="text-sm text-gray-500 ">Click Send To Get A Response</p>
          ) : response?.error ? (
            <div className="text-red-400">{response.error}</div>
          ) : response?.bodyIsBase64 ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-300">Binary response (base64)</div>
              <div className="flex gap-2">
                <button
                  className="px-3! py-2! rounded bg-[#0ea5a4] text-black"
                  // onClick={() =>
                  //   downloadBase64AsFile(
                  //     response.body,
                  //     `response-${Date.now()}.bin`,
                  //     response.headers?.['content-type'] ?? 'application/octet-stream'
                  //   )
                  // }
                >
                  Download Binary
                </button>
                <button
                  className="px-3! py-2! rounded border border-[#24303a] hover:bg-[#0b1220]"
                  onClick={() => {
                    copyToClipboard(response.body)
                    toast.success('Base64 copied')
                  }}
                >
                  Copy Base64
                </button>
                <div className="text-sm text-gray-400 flex items-center">
                  Size: {response.bodySize ?? '—'} bytes
                </div>
              </div>
            </div>
          ) : isSafeToParse(response.body) ? (
            <div className=" p-4! rounded text-sm text-yellow-200 overflow-auto h-fit">
              <ReactJson
                style={{
                  width: 'fit-content',
                  paddingBlock: '10px',
                  background: 'transparent',
                  height: 'fit-content'
                }}
                src={safeParseJSON(response.body)}
                theme="summerfruit"
                name={'Response'}
                collapsed={1}
                enableClipboard={true}
                displayDataTypes={true}
              />
              {/* {prettyJSON(response.body)} */}
            </div>
          ) : (
            <div className=" p-4! rounded text-sm text-yellow-200 overflow-auto max-h-[550px]">
              <pre className="text-red-400">{response.body}</pre>
            </div>
          )}
        </div>
      </div>
    </ResizableBottomPanel>
  )
}

import { useCallback, useEffect, useRef } from 'react'
import JsonBodyEditor from '@renderer/components/jsonBodyEditor'
import toast from 'react-hot-toast'
import { useApiTestingContext } from '@renderer/screen/apiTesting'
import { convertId } from '@renderer/utlis/dbHelper'
import { isSafeToParse, safeParseJSON } from '../network/testRequest'
import ReactJson from 'react-json-view'
import { FaSpinner } from 'react-icons/fa'
import TopBarLoader from '@renderer/components/topLoaderBar'
import { handleUpdateCollectionById, updateCollectionById } from '@renderer/utlis/collectionHelper'

function ResizableBottomPanel({
  initialHeight = 320,
  minHeight = 120,
  maxHeight = null,
  storageKey = 'resizable-bottom-panel-height',
  children
}) {
  const containerRef = useRef(null)
  const draggingRef = useRef(false)
  const startYRef = useRef(0)
  const startHeightRef = useRef(initialHeight)

  // restore from storage or use initial height
  const [height, setHeight] = useState(() => {
    try {
      if (storageKey) {
        const v = localStorage.getItem(storageKey)
        if (v) return Math.max(minHeight, Number(v))
      }
    } catch (e) {}
    return initialHeight
  })

  // ensure maxHeight default uses viewport height minus bottom offset (80)
  const clamp = useCallback(
    (h) => {
      const viewportMax = maxHeight ?? Math.max(200, window.innerHeight - 80)
      return Math.min(Math.max(h, minHeight), viewportMax)
    },
    [minHeight, maxHeight]
  )

  useEffect(() => {
    // Persist height on change
    try {
      if (storageKey) localStorage.setItem(storageKey, String(height))
    } catch (e) {}
  }, [height, storageKey])

  // Pointer down on the handle
  const onPointerDown = (ev) => {
    ev.preventDefault()
    // capture pointer
    const el: any = containerRef.current
    if (el && ev.pointerId !== undefined) {
      el.setPointerCapture(ev.pointerId)
    }

    draggingRef.current = true
    startYRef.current = ev.clientY
    startHeightRef.current = height

    // add class to prevent selection
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ns-resize'
  }

  const onPointerMove = (ev) => {
    if (!draggingRef.current) return
    ev.preventDefault()
    const dy = startYRef.current - ev.clientY // dragging up should increase height
    const next = clamp(startHeightRef.current + dy)
    setHeight(next)
  }

  const onPointerUp = (ev) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    // release pointer capture
    try {
      const el: any = containerRef.current
      if (el && ev.pointerId !== undefined) el.releasePointerCapture(ev.pointerId)
    } catch (e) {}
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }

  useEffect(() => {
    // global listeners for move/up so dragging works even outside handle
    const move = (e) => onPointerMove(e)
    const up = (e) => onPointerUp(e)

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [onPointerMove, onPointerUp])

  // Keyboard accessibility: up/down arrow changes height
  const onHandleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHeight((h) => clamp(h + 10))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHeight((h) => clamp(h - 10))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setHeight((h) => clamp(window.innerHeight - 80))
    } else if (e.key === 'End') {
      e.preventDefault()
      setHeight(minHeight)
    }
  }

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 bottom-[80px]  z-90 w-[calc(100%-40px)] mx-auto!"
      style={{
        height: `${height}px`
        // optional extra styling
        // boxShadow: '0 -6px 18px rgba(2,6,23,0.6)'
      }}
    >
      {/* Top handle (drag here) */}
      <div
        role="separator"
        tabIndex={0}
        aria-orientation="vertical"
        onPointerDown={onPointerDown}
        onKeyDown={onHandleKeyDown}
        className="flex items-center justify-center cursor-row-resize select-none"
        style={{
          height: '10px',
          // visually show handle: thin bar and center dot
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))'
        }}
      >
        <div
          className="w-12 h-1 rounded-full"
          style={{ background: 'rgba(245, 245, 245, 0.06)' }}
        />
      </div>

      {/* Panel content */}
      <div className="h-[calc(100%-10px)] overflow-auto rounded-b-lg !bg-[var(--bg-content)]  p-3">
        {children}
      </div>
    </div>
  )
}

const RequestData = () => {
  const [activeTab, setActiveTab] = useState('params')
  const [queryParams, setQueryParams] = useState([{ key: '', value: '', active: false }])
  const [headers, setHeaders] = useState([{ key: '', value: '', active: false }])
  const title = activeTab == 'params' ? 'Query Params' : activeTab == 'headers' ? 'Headers' : 'Body'

  const [obj, setObj] = useState({
    pop_id: 'GSP-102025-4038',
    status: 'canceled',
    amount: '5000',
    isTWallet: true,
    isPWallet: false
  })

  return (
    <div className="">
      <RequestDataHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-4! max-h-[400px] overflow-auto scrollbar-hidden">
        <p className="text-[13px] font-[400] text-gray-400 mb-1.5!">{title}</p>
        {activeTab == 'params' && <CustomTable data={queryParams} setData={setQueryParams} />}
        {activeTab == 'headers' && <CustomTable data={headers} setData={setHeaders} />}
        {activeTab == 'body' && (
          <>
            <JsonBodyEditor
              value={obj}
              onChange={(txt) => console.log('live text', txt)}
              onApply={(final) => {
                if (final) {
                  setObj(final)
                } else {
                  toast.error('InValid Json')
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}

const RequestDataHeader = ({ activeTab, setActiveTab }: any) => {
  return (
    <div className="flex  items-center gap-8  cursor-pointer">
      <p
        onClick={() => {
          setActiveTab('params')
        }}
        className={`text-sm font-light py-1.5! px-1.5! ${activeTab == 'params' ? 'border-b border-pink-500' : ''} `}
      >
        Params
      </p>
      <p
        onClick={() => {
          setActiveTab('headers')
        }}
        className={`text-sm font-light py-1.5! px-1.5! ${activeTab == 'headers' ? 'border-b border-pink-500' : ''} `}
      >
        Headers
      </p>
      <p
        onClick={() => {
          setActiveTab('body')
        }}
        className={`text-sm font-light py-1.5! px-1.5! ${activeTab == 'body' ? 'border-b border-pink-500' : ''} `}
      >
        Body
      </p>
    </div>
  )
}

const CustomTable = ({ setData, data }) => {
  const [clickedRow, setClickedRow] = useState(0 as any)
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[0.2fr_1fr_1fr_1fr] border-[.5px] border-gray-500 h-[35px]">
        <div></div>
        <div className="border-l-[.5px] border-gray-500 text-gray-400 flex items-center px-4! text-[13px] font-[450]!">
          Key
        </div>
        <div className="border-l-[.5px] border-gray-500 text-gray-400 flex items-center px-4! text-[13px] font-[450]!">
          Value
        </div>
        <div className="border-l-[.5px] border-gray-500 text-gray-400 flex items-center px-4! text-[13px] font-[450]!"></div>
      </div>
      {data?.map((item: any, index) => {
        const { key, value, active }: any = item
        if (index == data?.length - 1) {
          if (key || value) {
            const initialData = JSON.parse(JSON.stringify(data))
            initialData.push({ key: '', url: '', active: false })
            setData(initialData)
          }
        }
        return (
          <div
            key={index}
            onClick={() => {
              setClickedRow(index)
            }}
            className={`grid grid-cols-[0.2fr_1fr_1fr_1fr] border-[.5px] border-t-0 border-gray-500 h-[35px] ${clickedRow == index ? 'bg-[#1e1e1e]' : ''} `}
          >
            <div className="flex items-center justify-center ">
              {key && value && (
                <input
                  checked={active}
                  onChange={() => {
                    const initialData = JSON.parse(JSON.stringify(data))
                    const targetObj = initialData[clickedRow]
                    targetObj.active = !targetObj.active
                    setData(initialData)
                  }}
                  type="checkbox"
                  className="h-5 w-5"
                />
              )}
            </div>
            <div className="border-l-[.5px] border-gray-500 text-gray-400 flex items-center px-4! text-[11px] font-light">
              <input
                value={key}
                onChange={(e) => {
                  const valueInput = e.target.value
                  const initialData = JSON.parse(JSON.stringify(data))
                  const targetObj = initialData[clickedRow]
                  targetObj.key = valueInput
                  if (key && valueInput) {
                    targetObj.active = true
                  } else {
                    targetObj.active = false
                  }
                  setData(initialData)
                }}
                type="text"
                placeholder="Key"
                className="focus:bg-[#0f0e0e] outline-none border-[.2px] px-1! py-[3px]! w-full border-[#3e3e3e] border-none text-white font-semibold tracking-[.6px]"
              />
            </div>
            <div className="border-l-[.5px]  focus:border-gray-500 text-gray-400 flex items-center px-4! text-[11px] font-light">
              <input
                key={key}
                value={value}
                onChange={(e) => {
                  const valueInput = e.target.value
                  const initialData = JSON.parse(JSON.stringify(data))
                  const targetObj = initialData[clickedRow]
                  targetObj.value = valueInput
                  if (key && valueInput) {
                    targetObj.active = true
                  } else {
                    targetObj.active = false
                  }
                  setData(initialData)
                }}
                type="text"
                placeholder="Value"
                className="focus:bg-[#0f0e0e]  outline-none border-[.2px] px-1! py-[3px]! w-full  border-none text-white font-semibold tracking-[.6px]"
              />
            </div>
            <div className="border-l-[.5px] border-gray-500 text-gray-400 flex items-center px-4! text-[11px] font-light justify-end">
              {clickedRow == index && index != data?.length - 1 && (
                <MdOutlineDelete
                  onClick={() => {
                    const initialData = JSON.parse(JSON.stringify(data))
                    const filteredData = initialData?.filter((_: any, idx: any) => index != idx)
                    setData(filteredData)
                  }}
                  className="w-[16px] h-[16px] hover:text-red-400 cursor-pointer"
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ApiTestingContent
