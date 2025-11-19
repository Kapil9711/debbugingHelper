import { useNetworkPageContext } from '@renderer/screen/networkPage'
import { useState } from 'react'

// Reusable Postman-like Request Tester Component
export default function RequestTester({ request }) {
  const [response, setResponse] = useState(null as any)
  const [loading, setLoading] = useState(false)
  const { setTestData } = useNetworkPageContext()

  async function runTest() {
    const safeRequest = { body: request?.body, method: request?.method, url: request?.url }
    const result = await window.debugApiNetwork.testRequest(safeRequest)
    setResponse(result)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex gap-2 items-center">
        <h1 className="text-2xl font-bold">API Request Tester</h1>
        <button
          className="border rounded-md px-4! py-1! cursor-pointer border-gray-300"
          onClick={() => setTestData(null)}
        >
          Back
        </button>
      </div>

      {/* URL + Method + Send Button */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            disabled
            className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option>{request.method}</option>
          </select>

          <input
            disabled
            value={request.url}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
          />

          <button
            onClick={runTest}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium shadow-lg disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      {/* Body Section */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Body</h2>
        <pre className="bg-black/40 p-4 rounded-lg text-green-300 overflow-auto text-sm">
          {JSON.stringify(request.body, null, 2)}
        </pre>
      </div>

      {/* Response Section */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex-1">
        <h2 className="text-lg font-semibold mb-2">Response</h2>
        {response ? (
          <pre className="bg-black/40 p-4 rounded-lg text-yellow-200 overflow-auto text-sm whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-400">Click Send to see response...</p>
        )}
      </div>
    </div>
  )
}
