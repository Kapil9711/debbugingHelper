import React, { useEffect, useMemo, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { sublime } from '@uiw/codemirror-theme-sublime'

type JsonBodyEditorProps = {
  value?: string | object | null
  onChange?: (text: string) => void // emits raw editor text
  onApply?: (value: any) => void // emits parsed object if valid JSON, else raw string
  defaultMode?: 'pretty' | 'raw'
  height?: string // editor height (e.g. "260px")
}

export default function JsonBodyEditor({
  value,
  onChange = () => {},
  onApply = () => {},
  defaultMode = 'pretty',
  height = '260px'
}: JsonBodyEditorProps) {
  // Normalize initial value -> pretty string if possible
  const initialText = useMemo(() => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') {
      const trimmed = value.trim()
      try {
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          const parsed = JSON.parse(trimmed)
          return JSON.stringify(parsed, null, 2)
        }
        return value
      } catch {
        return value
      }
    }
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }, [value])

  const [text, setText] = useState<string>(initialText)
  const [mode, setMode] = useState<'pretty' | 'raw'>(defaultMode)
  const [isValidJson, setIsValidJson] = useState<boolean>(true)
  const [themeDark, setThemeDark] = useState<boolean>(true)

  useEffect(() => {
    setText(initialText)
    try {
      JSON.parse(initialText)
      setIsValidJson(true)
    } catch {
      setIsValidJson(false)
    }
  }, [initialText])

  const extensions = useMemo(() => [json()], [])

  function handleTextChange(value: string) {
    setText(value)
    try {
      JSON.parse(value)
      setIsValidJson(true)
    } catch {
      setIsValidJson(false)
    }
    try {
      onChange(value)
    } catch (e) {
      // ignore parent errors
      // eslint-disable-next-line no-console
      console.warn('JsonBodyEditor onChange threw', e)
    }
  }

  function formatJson() {
    try {
      const parsed = JSON.parse(text)
      const pretty = JSON.stringify(parsed, null, 2)
      setText(pretty)
      setIsValidJson(true)
      onChange(pretty)
    } catch {
      setIsValidJson(false)
    }
  }

  function minifyJson() {
    try {
      const parsed = JSON.parse(text)
      const min = JSON.stringify(parsed)
      setText(min)
      setIsValidJson(true)
      onChange(min)
    } catch {
      setIsValidJson(false)
    }
  }

  function applyValue() {
    if (isValidJson) {
      try {
        const parsed = JSON.parse(text)
        onApply(parsed)
        return
      } catch {
        // fallthrough to send raw text
      }
    }
    onApply(null)
  }

  function copyToClipboard() {
    if (!text) return
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopy(text)
      })
    } else {
      fallbackCopy(text)
    }
  }

  function fallbackCopy(t: string) {
    const ta = document.createElement('textarea')
    ta.value = t
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {
      // ignore
    }
    ta.remove()
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold">(Raw JSON)</div>
          <div className="text-xs text-gray-400">(paste / edit)</div>
          <div className="ml-3! text-xs">
            <span
              className={`px-2! py-0.5! rounded text-white ${
                isValidJson ? 'bg-emerald-600' : 'bg-red-500'
              }`}
            >
              {isValidJson ? 'Valid JSON' : 'Invalid JSON'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2!">
          <button
            className="px-2! py-1! text-xs border rounded hover:bg-gray-800"
            onClick={() => setMode('raw')}
            title="Raw mode"
            type="button"
          >
            Raw
          </button>

          <button
            className="px-2! py-1! text-xs border rounded hover:bg-gray-800"
            onClick={() => {
              setMode('pretty')
              formatJson()
            }}
            title="Pretty format (JSON)"
            type="button"
          >
            Pretty
          </button>

          <button
            className="px-2! py-1! text-xs border rounded hover:bg-gray-800"
            onClick={formatJson}
            title="Format JSON"
            type="button"
          >
            Format
          </button>

          <button
            className="px-2! py-1! text-xs border rounded hover:bg-gray-800"
            onClick={minifyJson}
            title="Minify JSON"
            type="button"
          >
            Minify
          </button>

          <button
            className="px-2! py-1! text-xs border rounded hover:bg-gray-800"
            onClick={copyToClipboard}
            type="button"
          >
            Copy
          </button>

          {/* <button
            className="px-2! py-1! text-xs border rounded hover:bg-gray-800"
            onClick={() => setThemeDark((s) => !s)}
            title="Toggle theme"
            type="button"
          >
            {themeDark ? 'Dark' : 'Light'}
          </button> */}

          <button
            className="px-3! py-1! text-sm bg-emerald-500 rounded text-black font-semibold"
            onClick={applyValue}
            title="Apply / Save"
            type="button"
          >
            Save
          </button>
        </div>
      </div>

      <div className=" rounded overflow-hidden">
        <CodeMirror
          //   style={{ backgroundColor: 'black' }}
          value={text}
          height={height}
          extensions={extensions}
          onChange={(value: string) => handleTextChange(value)}
          theme={themeDark ? sublime : 'light'}
          basicSetup={
            {
              // keep default basicSetup, you can customize if needed
            }
          }
          editable
        />
      </div>
    </div>
  )
}
