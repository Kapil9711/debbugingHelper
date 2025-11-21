import React, { useEffect, useState } from 'react'
import { useNetworkPageContext } from '@renderer/screen/networkPage'
import toast from 'react-hot-toast'
import ReactJson from 'react-json-view'
import Header from '@renderer/components/header'

type Req = {
  url: string
  method?: string
  body?: any
  headers?: Record<string, string>
}

export default function RequestTester({ request, requestData }: any) {
  const [response, setResponse] = useState<any | null>(null)
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
        url: request?.url,
        method: request?.method,
        body: request?.body,
        headers: request?.headers ?? {}
      }

      const res = await window.api.network.runRequest(safeRequest)
      // expected shape: { ok, status, statusText, url, headers, body, bodyIsBase64, durationMs, bodySize, error }
      setResponse(res)
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
          <span className="px-2 py-1 rounded bg-red-900/40 text-sm font-semibold">
            {response.status ?? 'ERR'}
          </span>
          <span className="text-sm opacity-80">{response.statusText ?? 'Request failed'}</span>
        </div>
      )
    }
    return (
      <div className="inline-flex items-center gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-green-800/60 text-green-200 font-semibold text-sm">
            {response.status}
          </span>
          <span className="text-sm opacity-80">{response.statusText}</span>
        </div>
        <div className="text-sm text-gray-300">• {response.durationMs ?? 0} ms</div>
        <div className="text-sm text-gray-300">
          • {response.bodySize ? `${response.bodySize} bytes` : '—'}
        </div>
      </div>
    )
  }

  console.log(requestData, 'requestData')

  return (
    <>
      <Header>
        <div className="border-b border-gray-400 h-full w-full flex items-center px-6! gap-4 overflow-auto scrollbar-hidden">
          <div className="w-[140px] cursor-pointer select-none hover:bg-[var(--rev-bg-header)] hover:text-[var(--rev-text)] h-[45px] border p-1! px-2! rounded-md text-[var(--text)]">
            <p className="text-sm leading-[1.2]">Post</p>
            <p className="text-xs">customer_review</p>
          </div>
        </div>
      </Header>

      <div className="min-h-screen bg-[#0f1724] text-white p-6! flex flex-col gap-6!">
        {/* Header */}
        <div className="flex items-start justify-between gap-4!">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`px-3! py-1! rounded font-semibold text-sm shadow-sm ${
                  method === 'GET'
                    ? 'bg-green-600 text-white'
                    : method === 'POST'
                      ? 'bg-orange-500 text-white'
                      : method === 'PUT'
                        ? 'bg-blue-600 text-white'
                        : method === 'DELETE'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 text-white'
                }`}
              >
                {method}
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="px-4! py-2! rounded-md bg-[#0b1220] border border-[#1f2937] w-[480px] text-sm"
                  readOnly
                  value={request?.url ?? ''}
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
          <div className="col-span-5 space-y-6">
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
          </div>

          {/* Right: Response */}
          <div className="col-span-7">
            <div className="bg-[#071025] p-4! rounded-lg border border-[#11202b] shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-4!">
                <div className="flex items-start  flex-col gap-3">
                  <div className="text-lg font-semibold">Response</div>
                  {response && (
                    <div className="text-sm text-gray-300 max-w-[80%]  truncate">
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
