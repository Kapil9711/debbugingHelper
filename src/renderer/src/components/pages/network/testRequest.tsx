import React, { useEffect, useMemo, useState } from 'react'
import { useNetworkPageContext } from '@renderer/screen/networkPage'
import toast from 'react-hot-toast'
import ReactJson from 'react-json-view'
import Header from '@renderer/components/header'
import { convertId } from '@renderer/utlis/dbHelper'
import { a } from 'node_modules/tailwindcss/dist/types-WlZgYgM8.mjs'
import { IoMdClose } from 'react-icons/io'

type Req = {
  url: string
  method?: string
  body?: any
  headers?: Record<string, string>
}

export default function RequestTester({ requestData }: any) {
  const [request, setRequest] = useState(requestData[0])
  const [response, setResponse] = useState<any | null>(request?.response || null)

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'timeline'>('body')
  const { setTestData } = useNetworkPageContext()
  const method = (request?.method || 'GET').toUpperCase()
  function prettyJSON(obj: any) {
    try {
      return JSON.stringify(obj, null, 2)
    } catch {
      return String(obj ?? '')
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Copy failed'))
  }

  function downloadBase64AsFile(
    base64: string,
    filename = 'file.bin',
    mime = 'application/octet-stream'
  ) {
    try {
      const link = document.createElement('a')
      link.href = `data:${mime};base64,${base64}`
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (e) {
      toast.error('Download failed')
    }
  }

  async function runTest() {
    try {
      setLoading(true)
      setResponse(null)

      const safeRequest = {
        url: inputValue,
        method: inputMethod,
        body: String(request?.method).toLowerCase() == 'get' ? undefined : request?.body,
        headers: request?.headers ?? {}
      }

      const res = await window.api.network.runRequest(safeRequest)
      setResponse(res)

      const idString = convertId(request?._id)
      const payload = {
        ...request,
        url: inputValue,
        method: inputMethod,
        response: res
      }
      window.api.request.updateRequest({ id: idString, payload })

      setActiveTab('body')
    } catch (err: any) {
      toast.error(String(err?.message ?? err))
    } finally {
      setLoading(false)
    }
  }

  const renderStatus = () => {
    if (!response) return null
    if (!response.ok) {
      return (
        <div className="inline-flex items-center gap-2 text-red-400">
          <span className="px-2! py-1! rounded bg-red-900/40 text-sm font-semibold">
            {response.status ?? 'ERR'}
          </span>
          <span className="text-sm opacity-80">{response.statusText ?? 'Request failed'}</span>
        </div>
      )
    }
    return (
      <div className="inline-flex items-center gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="px-2! py-1! rounded bg-green-800/60 text-green-200 font-semibold text-sm">
            {response.status}
          </span>
          <span className="text-sm opacity-80">{response.statusText}</span>
        </div>
        <div className="text-sm text-gray-300">• {String(response.durationMs / 1000)} s</div>
        <div className="text-sm text-gray-300">
          • {response.bodySize ? `${response.bodySize} bytes` : '—'}
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (request?.response === undefined || request?.response === null) {
      runTest()
    }
    setInputMethod(String(request?.method)?.toUpperCase())
    setInputValue(request?.url)
    setResponse(request?.response)
  }, [request])

  useEffect(() => {
    setRequest(requestData[0])
  }, [requestData])

  console.log(request, 'requestData')

  const [inputValue, setInputValue] = useState(request?.url)
  const [inputMethod, setInputMethod] = useState(String(request?.method)?.toUpperCase())

  return (
    <>
      <Header>
        <RequestHeader requestData={requestData} request={request} setRequest={setRequest} />
      </Header>

      <div className="min-h-screen bg-[#0f1724] text-white p-6! flex flex-col gap-6!">
        {/* Header */}
        <div className="flex items-start justify-between gap-4!">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <select
                value={inputMethod}
                onChange={(e) => {
                  setInputMethod(e.target.value)
                  const idString = convertId(request?._id)
                  const payload = {
                    ...request,
                    method: e.target.value
                  }
                  window.api.request.updateRequest({ id: idString, payload })
                }}
                className={`
    px-3! py-1! rounded font-semibold text-sm shadow-sm cursor-pointer outline-none
    ${
      inputMethod === 'GET'
        ? 'bg-green-600 text-white'
        : inputMethod === 'POST'
          ? 'bg-orange-500 text-white'
          : inputMethod === 'PUT'
            ? 'bg-blue-600 text-white'
            : inputMethod === 'DELETE'
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-white'
    }
  `}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>

              <div className="flex items-center gap-2">
                <input
                  className="px-4! py-2! rounded-md bg-[#0b1220] border border-[#1f2937] w-[80vw] max-w-[700px] text-sm"
                  onChange={(e) => {
                    setInputValue(e.target.value)
                  }}
                  onBlur={() => {
                    const id = convertId(request?._id)
                    window.api.request.updateRequest({
                      id: id,
                      payload: { ...request, url: inputValue }
                    })
                  }}
                  value={inputValue ?? ''}
                />
                <button
                  className="px-4! py-2! rounded-md bg-[#0ea5a4] hover:bg-[#06b2b0] text-black font-semibold shadow"
                  onClick={runTest}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4! w-4! text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send'
                  )}
                </button>

                <button
                  className="px-3! py-2! rounded-md border border-[#2b3440] bg-[#0b1220] text-sm hover:bg-[#0e1622]"
                  onClick={() => {
                    copyToClipboard(request?.url ?? '')
                    // toast.success('URL copied')
                  }}
                >
                  Copy URL
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTestData(null)
                window.api.network.setSelecetedRequest(null)
              }}
              className="text-sm px-3! py-1! rounded border border-[#24303a] hover:bg-[#0b1220]"
            >
              Back
            </button>
          </div>
        </div>

        {/* status + info */}
        <div className="bg-[#071025] border border-[#11202b] rounded-lg p-3! flex items-center justify-between">
          <div>{renderStatus()}</div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">Mode: Manual</div>
            <div className="text-sm text-gray-400">Timeout: 30s</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left: Request and body */}
          {/* <div className="col-span-5 space-y-6">
            <div className="bg-[#071025] p-4! rounded-lg border border-[#11202b] shadow-sm">
              <div className="flex items-center justify-between mb-3!">
                <div className="font-semibold">Request</div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2! py-1! text-xs border border-[#24303a] rounded hover:bg-[#0b1220]"
                    onClick={() => copyToClipboard(prettyJSON(request?.body))}
                  >
                    Copy Body
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-300 mb-2">Headers</div>
              <div className="mb-3!">
                <pre className="bg-[#0b1220] p-3! rounded text-xs text-green-200 overflow-auto">
                  {prettyJSON(request?.headers ?? {})}
                </pre>
              </div>

              <div className="text-xs text-gray-300 mb-2!">Body</div>
              <div>
                <pre className="bg-[#001219] p-3! rounded text-sm text-green-200 overflow-auto max-h-60 whitespace-pre-wrap">
                  {prettyJSON(request?.body ?? '')}
                </pre>
              </div>
            </div>
          </div> */}

          <RequestEditor
            request={request}
            onChange={(updated) => {}}
            onApply={(finalRequest) => {
              const itemId = convertId(finalRequest?._id)
              window.api.request.updateRequest({ id: itemId, payload: finalRequest })
              toast.success('Updated Successfully...')
            }}
            copyToClipboard={copyToClipboard}
          />

          {/* Right: Response */}
          <div className="col-span-7">
            <div className="bg-[#071025] p-4! rounded-lg border border-[#11202b] shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-4!">
                <div className="flex items-start  flex-col gap-3">
                  <div className="text-lg font-semibold">Response</div>
                  {response && (
                    <div className="text-sm text-gray-300 max-w-[400px]   truncate">
                      {response.url && <span className="mr-2!">{response.url}</span>}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!response) return
                      if (response.bodyIsBase64 && typeof response.body === 'string') {
                        downloadBase64AsFile(
                          response.body,
                          'response.bin',
                          response.headers?.['content-type'] ?? 'application/octet-stream'
                        )
                      } else {
                        copyToClipboard(prettyJSON(response?.body ?? ''))
                        // toast.success('Response copied')
                      }
                    }}
                    className="px-3! py-1! text-sm rounded border border-[#24303a] hover:bg-[#0b1220]"
                  >
                    {response?.bodyIsBase64 ? 'Download' : 'Copy Response'}
                  </button>

                  <button
                    onClick={() => {
                      setResponse(null)
                      setActiveTab('body')
                    }}
                    className="px-3! py-1! text-sm rounded border border-[#24303a] hover:bg-[#0b1220]"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-3 border-b border-[#11202b] mb-3 pb-3">
                <button
                  onClick={() => setActiveTab('body')}
                  className={`px-3! py-1! rounded-t ${activeTab === 'body' ? 'bg-[#061323] border border-b-0 border-[#12313b] text-white' : 'text-gray-400'}`}
                >
                  Body
                </button>
                <button
                  onClick={() => setActiveTab('headers')}
                  className={`px-3! py-1! rounded-t ${activeTab === 'headers' ? 'bg-[#061323] border border-b-0 border-[#12313b] text-white' : 'text-gray-400'}`}
                >
                  Headers
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-3! py-1! rounded-t ${activeTab === 'timeline' ? 'bg-[#061323] border border-b-0 border-[#12313b] text-white' : 'text-gray-400'}`}
                >
                  Timeline
                </button>
              </div>

              <div className="flex-1 overflow-auto">
                {/* Body Tab */}
                {activeTab === 'body' && (
                  <div>
                    {!response ? (
                      <div className="text-gray-400 mt-4!">Click Send to see response...</div>
                    ) : response?.error ? (
                      <div className="text-red-400">{response.error}</div>
                    ) : response?.bodyIsBase64 ? (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-300">Binary response (base64)</div>
                        <div className="flex gap-2">
                          <button
                            className="px-3! py-2! rounded bg-[#0ea5a4] text-black"
                            onClick={() =>
                              downloadBase64AsFile(
                                response.body,
                                `response-${Date.now()}.bin`,
                                response.headers?.['content-type'] ?? 'application/octet-stream'
                              )
                            }
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
                    ) : typeof response.body === 'string' ? (
                      <pre className="bg-[#001219] p-4! rounded text-sm text-yellow-200 whitespace-pre-wrap overflow-auto">
                        {response.body}
                      </pre>
                    ) : (
                      <div className="bg-[#001219] p-4! rounded text-sm text-yellow-200 overflow-auto max-h-[550px]">
                        <ReactJson
                          style={{
                            width: 'fit-content',
                            paddingBlock: '10px',
                            background: 'transparent',
                            height: 'fit-content'
                          }}
                          src={response.body}
                          theme="summerfruit"
                          name={'Response'}
                          collapsed={1}
                          enableClipboard={true}
                          displayDataTypes={true}
                        />
                        {/* {prettyJSON(response.body)} */}
                      </div>
                    )}
                  </div>
                )}

                {/* Headers Tab */}
                {activeTab === 'headers' && (
                  <div className="text-sm">
                    {!response ? (
                      <div className="text-gray-400 mt-4!">No headers yet</div>
                    ) : (
                      <div className="overflow-auto max-h-80">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-gray-400 border-b border-[#12202a]">
                              <th className="py-2! px-2!">Header</th>
                              <th className="py-2! px-2!">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {response.headers &&
                              Object.entries(response.headers).map(([k, v]) => (
                                <tr key={k} className="border-b border-[#071425]">
                                  <td className="py-2! px-2! text-gray-200 font-mono">{k}</td>
                                  <td className="py-2! px-2! text-gray-300">{String(v)}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                  <div className="text-sm text-gray-300">
                    {!response ? (
                      <div className="text-gray-400 mt-4!">No timeline yet</div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>Request sent</div>
                          <div className="text-gray-400">{new Date().toLocaleString()}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>Response received</div>
                          <div className="text-gray-400">
                            {response.durationMs ? `${response.durationMs} ms` : '—'}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Status: {response.status ?? '—'}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const RequestHeader = ({ requestData, request, setRequest }: any) => {
  const [hoveredId, setHoveredId] = useState('')
  return (
    <div className="border-b border-gray-400 h-full w-full flex items-center px-6! gap-4 overflow-auto scrollbar-hidden">
      <p>{requestData?.length}</p>
      {requestData?.map((item: any) => {
        const itemId = convertId(item?._id)
        const dataId = convertId(request?._id)
        const isSelectedItem = itemId === dataId
        const isHoveredItem = hoveredId == convertId(item?._id)
        const url = item?.url
        let path = item?.url

        if (url) {
          try {
            path = new URL(url, 'http://dummy.com').pathname
          } catch (error) {}
        }

        return (
          <div
            key={itemId}
            onClick={() => {
              setRequest(item)
            }}
            onMouseEnter={() => {
              const id = convertId(item?._id)
              setHoveredId(id)
            }}
            onMouseLeave={() => {
              setHoveredId('')
            }}
            className={`w-[140px] relative cursor-pointer select-none hover:bg-[var(--rev-bg-header)] hover:text-[var(--rev-text)] h-[45px] border p-1! px-2! rounded-md  ${isSelectedItem ? 'bg-[var(--rev-bg-header)]  text-[var(--rev-text)]' : 'text-[var(--text)]'}`}
          >
            <p className="text-sm leading-[1.2]">{item?.method}</p>
            <p className="text-xs truncate">{path}</p>

            {(isHoveredItem || isSelectedItem) && (
              <>
                <p
                  onClick={async () => {
                    await window.api.request.deleteRequest(itemId)
                  }}
                  className="absolute right-2 top-[3px] "
                >
                  <IoMdClose />
                </p>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

function RequestEditor({
  request = {},
  onChange = (value: any) => {},
  onApply = (any: any) => {},
  copyToClipboard = (t) => {
    navigator.clipboard && navigator.clipboard.writeText(t)
    toast.success('Copied Successfullys')
  }
}: any) {
  // ---------- helpers ----------
  function formatBodyForDisplay(value) {
    if (value === null || value === undefined)
      return { text: '', kind: 'text', originalType: typeof value }

    // String -> try JSON parse
    if (typeof value === 'string') {
      const trimmed = value.trim()
      try {
        const parsed = JSON.parse(trimmed)
        return { text: JSON.stringify(parsed, null, 2), kind: 'json', originalType: 'string' }
      } catch {
        return { text: value, kind: 'text', originalType: 'string' }
      }
    }

    // FormData
    if (value instanceof FormData) {
      const entries: any = []
      for (const [k, v] of value.entries()) {
        if (v instanceof File) entries.push(`${k}: File(${v.name})`)
        else entries.push(`${k}: ${v}`)
      }
      return { text: entries.join('\n'), kind: 'form', originalType: 'FormData' }
    }

    // URLSearchParams
    if (value instanceof URLSearchParams) {
      return { text: value.toString(), kind: 'params', originalType: 'URLSearchParams' }
    }

    // ArrayBuffer / TypedArray / Blob / File
    if (
      value instanceof ArrayBuffer ||
      ArrayBuffer.isView(value) ||
      value instanceof Blob ||
      value instanceof File
    ) {
      return {
        text: `[binary ${value.constructor.name}]`,
        kind: 'binary',
        originalType: value.constructor.name
      }
    }

    // Plain object / array — pretty JSON
    if (typeof value === 'object') {
      try {
        return { text: JSON.stringify(value, null, 2), kind: 'json', originalType: 'object' }
      } catch {
        return { text: String(value), kind: 'unknown', originalType: 'object' }
      }
    }

    // fallback
    try {
      return { text: String(value), kind: 'text', originalType: typeof value }
    } catch {
      return { text: '', kind: 'unknown', originalType: typeof value }
    }
  }

  // Convert headers object to array rows for editing
  const initialHeaders = useMemo(() => {
    const h = request.headers || {}
    const entries = Object.entries(h || {})
    if (!entries.length) return [{ id: `h-${Date.now()}`, key: '', value: '' }]
    return entries.map(([k, v], i) => ({
      id: `${k}-${i}`,
      key: k,
      value: v == null ? '' : String(v)
    }))
  }, [request])

  // ---------- state ----------
  const [headers, setHeaders] = useState(initialHeaders)
  const formattedInitialBody = useMemo(() => formatBodyForDisplay(request?.body), [request?.body])
  const [bodyText, setBodyText] = useState(formattedInitialBody.text)
  const [originalBodyKind, setOriginalBodyKind] = useState(formattedInitialBody.kind)
  const [jsonValid, setJsonValid] = useState(
    formattedInitialBody.kind === 'json' || formattedInitialBody.kind === 'text'
  )
  const [dirty, setDirty] = useState(false)

  // keep local state in sync when `request` prop changes (e.g., selecting a different request)
  useEffect(() => {
    setHeaders(initialHeaders)
    const fb = formatBodyForDisplay(request?.body)
    setBodyText(fb.text)
    setOriginalBodyKind(fb.kind)
    setJsonValid(fb.kind === 'json' || fb.kind === 'text')
    setDirty(false)
  }, [initialHeaders, request?.body])

  // helper to convert header array -> object
  function headersToObject(arr) {
    const out = {}
    arr.forEach(({ key, value }) => {
      if (!key) return
      out[String(key).trim()] = value == null ? '' : String(value)
    })
    return out
  }

  // inform parent about changes (call onChange)
  function emitChange(nextHeaders = headers, nextBody = bodyText) {
    const obj = {
      ...request,
      headers: headersToObject(nextHeaders),
      body: nextBody
    }
    try {
      onChange(obj)
    } catch (e) {
      console.warn('RequestEditor onChange threw', e)
    }
  }

  // ---------- handlers ----------
  function handleHeaderChange(id, field, val) {
    const next = headers.map((h) => (h.id === id ? { ...h, [field]: val } : h))
    setHeaders(next)
    setDirty(true)
    emitChange(next, bodyText)
  }

  function addHeaderRow() {
    setHeaders((p) => {
      const next = [...p, { id: `h-${Date.now()}`, key: '', value: '' }]
      emitChange(next, bodyText)
      return next
    })
    setDirty(true)
  }

  function removeHeaderRow(id) {
    setHeaders((p) => {
      const next = p.filter((h) => h.id !== id)
      const safe = next.length ? next : [{ id: `h-${Date.now()}`, key: '', value: '' }]
      emitChange(safe, bodyText)
      return safe
    })
    setDirty(true)
  }

  function onBodyChange(val) {
    setBodyText(val)
    setDirty(true)
    // validate JSON quickly
    try {
      if (val && typeof val === 'string') JSON.parse(val)
      setJsonValid(true)
    } catch (e) {
      setJsonValid(false)
    }
    emitChange(headers, val)
  }

  function prettyFormatBody() {
    try {
      const parsed = JSON.parse(bodyText)
      const pretty = JSON.stringify(parsed, null, 2)
      setBodyText(pretty)
      setJsonValid(true)
      setDirty(true)
      emitChange(headers, pretty)
    } catch (e) {
      // not JSON — don't change but indicate invalid
      setJsonValid(false)
      // optionally notify user
    }
  }

  function resetToOriginal() {
    const fb = formatBodyForDisplay(request?.body)
    setHeaders(initialHeaders)
    setBodyText(fb.text)
    setOriginalBodyKind(fb.kind)
    setJsonValid(fb.kind === 'json' || fb.kind === 'text')
    setDirty(false)
    emitChange(initialHeaders, fb.text)
  }

  // When user clicks Save - convert bodyText back to a sensible body type:
  // - If originalBodyKind === 'json' -> try to JSON.parse(bodyText), fall back to string
  // - Otherwise return as string (safe)
  function applyChanges() {
    let finalBody = bodyText
    if (originalBodyKind === 'json') {
      try {
        finalBody = JSON.parse(bodyText)
      } catch (e) {
        // invalid JSON -> keep as string, but you might want to warn
        finalBody = bodyText
      }
    } else if (originalBodyKind === 'params') {
      // try to convert to URLSearchParams if input looks like params
      try {
        finalBody = new URLSearchParams(bodyText)
      } catch {
        finalBody = bodyText
      }
    } else if (originalBodyKind === 'form') {
      // we cannot reliably reconstruct FormData from a text representation; keep string
      finalBody = bodyText
    } else {
      // keep as string for text/binary/unknown
      finalBody = bodyText
    }

    const finalRequest = {
      ...request,
      headers: headersToObject(headers),
      body: finalBody
    }

    setDirty(false)
    try {
      onApply(finalRequest)
    } catch (e) {
      console.warn('RequestEditor onApply threw', e)
    }
  }

  // copy headers+body as pretty JSON
  function copyAllToClipboard() {
    const out = {
      headers: headersToObject(headers),
      body: (() => {
        // If JSON and parsable, copy parsed JSON; otherwise text
        if (originalBodyKind === 'json') {
          try {
            return JSON.parse(bodyText)
          } catch {
            return bodyText
          }
        }
        return bodyText
      })()
    }
    try {
      const txt = JSON.stringify(out, null, 2)
      return copyToClipboard(txt)
    } catch (e) {
      try {
        return copyToClipboard(String(out))
      } catch (err) {
        // ignore
      }
    }
  }

  // ---------- render ----------
  return (
    <div className="col-span-5 space-y-6!">
      <div className="bg-[#071025] p-4! rounded-lg border border-[#11202b] shadow-sm">
        <div className="flex items-center justify-between mb-3!">
          <div className="font-semibold">Request</div>

          <div className="flex items-center gap-2">
            <button
              className="px-2! py-1! text-xs border border-[#24303a] rounded hover:bg-[#0b1220]"
              onClick={() => copyAllToClipboard()}
            >
              Copy Body & Headers
            </button>
          </div>
        </div>

        {/* Headers Editor */}
        <div className="text-xs text-gray-300 mb-2!">Headers</div>
        <div className="mb-3!">
          <div className="space-y-2! max-h-[170px] overflow-auto scrollbar-hidden">
            {headers.map((h) => (
              <div key={h.id} className="flex gap-2! items-center">
                <input
                  className="flex-1 bg-[#0b1220] p-2! rounded border border-[#24303a] text-sm text-green-200"
                  placeholder="Header name"
                  value={h.key}
                  onChange={(e) => handleHeaderChange(h.id, 'key', e.target.value)}
                />
                <input
                  className="flex-2 bg-[#0b1220] p-2! rounded border border-[#24303a] text-sm text-green-200"
                  placeholder="Header value"
                  value={h.value}
                  onChange={(e) => handleHeaderChange(h.id, 'value', e.target.value)}
                />
                <button
                  title="Remove header"
                  onClick={() => removeHeaderRow(h.id)}
                  className="px-2! py-1! text-xs border border-[#24303a] rounded hover:bg-[#0b1220]"
                >
                  Remove
                </button>
              </div>
            ))}

            <div>
              <button
                onClick={addHeaderRow}
                className="px-3! py-1! text-xs border border-[#24303a] rounded hover:bg-[#0b1220]"
              >
                + Add Header
              </button>
            </div>
          </div>
        </div>

        {/* Body Editor */}
        <div className="text-xs text-gray-300 mb-2!">Body</div>
        <div className="mb-3">
          <textarea
            value={bodyText}
            onChange={(e) => onBodyChange(e.target.value)}
            className="w-full bg-[#001219] p-3! rounded text-sm text-green-200 overflow-auto max-h-60 whitespace-pre-wrap font-mono"
            rows={10}
            placeholder="Request body (JSON or text)"
          />
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between gap-3!">
          <div className="flex gap-2! items-center">
            <button
              className="px-3! py-1! text-xs border border-[#24303a] rounded hover:bg-[#0b1220]"
              onClick={prettyFormatBody}
            >
              Pretty JSON
            </button>

            <button
              className="px-3! py-1! text-xs border border-[#24303a] rounded hover:bg-[#0b1220]"
              onClick={() => copyToClipboard(bodyText ?? '')}
            >
              Copy Body
            </button>

            <button
              className="px-3! py-1! text-xs border border-[#24303a] rounded hover:bg-[#0b1220]"
              onClick={resetToOriginal}
            >
              Reset
            </button>
          </div>

          <div className="flex gap-2! items-center">
            <div className="text-xs text-gray-400 mr-2!">
              {jsonValid ? null : <span className="text-red-400">Invalid JSON</span>}
            </div>

            <button
              onClick={applyChanges}
              className={`px-3! py-1! text-xs rounded font-semibold ${dirty ? 'bg-emerald-400 text-black' : 'bg-gray-800 text-gray-300'}`}
              disabled={!dirty}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
