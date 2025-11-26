import { useEffect, useRef, ReactNode } from 'react'
import { createPortal } from 'react-dom'

// GlassBlurModal.jsx
// Single-file React modal component using a React Portal + TailwindCSS glass blur backdrop.
// Usage: import GlassBlurModal from './GlassBlurModal'
// <GlassBlurModal isOpen={open} onClose={() => setOpen(false)}>
//   <YourContent />
// </GlassBlurModal>

interface GlassBlurModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  closeOnBackdropClick?: boolean
  ariaLabel?: string
  maxWidth?: string
}

export default function GlassBlurModal({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true,
  ariaLabel = 'Dialog',
  maxWidth = 'max-w-lg'
}: GlassBlurModalProps) {
  const elRef = useRef(null as any)
  const previouslyFocused = useRef(null as any)

  if (!elRef.current) {
    elRef.current = document.createElement('div')
  }

  useEffect(() => {
    const portalRoot = document.body
    portalRoot.appendChild(elRef.current)
    return () => {
      try {
        portalRoot.removeChild(elRef.current)
      } catch (e) {
        /* ignore */
      }
    }
    // run once
  }, [])

  useEffect(() => {
    if (!isOpen) return

    // save focus
    previouslyFocused.current = document.activeElement

    // lock scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose && onClose()
      }
      if (e.key === 'Tab') {
        // simple focus trap
        const focusable = elRef.current.querySelectorAll(
          "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex='-1'])"
        )
        if (focusable.length === 0) {
          e.preventDefault()
          return
        }
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown, true)

    // focus first focusable element or the modal itself
    requestAnimationFrame(() => {
      const focusable = elRef.current.querySelectorAll(
        "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex='-1'])"
      )
      if (focusable.length) focusable[0].focus()
      else {
        const dialog = elRef.current.querySelector("[role='dialog']")
        if (dialog) dialog.focus()
      }
    })

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = originalOverflow
      // restore focus
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center " aria-hidden="false">
      {/* Backdrop: glass blur + subtle tint */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-white/05 dark:bg-black/10"
        onMouseDown={(e) => {
          // close on backdrop click only if enabled
          if (!closeOnBackdropClick) return
          // ensure click was on backdrop, not inside the panel
          if (e.target === e.currentTarget) onClose && onClose()
        }}
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`relative w-full ${maxWidth} mx-4`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl p-6 shadow-2xl border border-white/10 bg-white/20 backdrop-blur-lg backdrop-filter dark:bg-gray-900/20">
          {/* Close button (top-right) */}
          <div className="absolute top-3 right-3">
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="inline-flex items-center justify-center rounded-full p-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              {/* simple X */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Modal body */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  )

  return createPortal(content, elRef.current)
}

/*
Example usage:

import React, { useState } from 'react'
import GlassBlurModal from './GlassBlurModal'

function App(){
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">Open modal</button>

      <GlassBlurModal isOpen={open} onClose={() => setOpen(false)}>
        <h2 className="text-xl font-semibold mb-2">Hello</h2>
        <p className="mb-4">This is a glass-blur modal using React Portal.</p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setOpen(false)} className="px-4 py-2 rounded bg-gray-200">Close</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white">Action</button>
        </div>
      </GlassBlurModal>
    </div>
  )
}

*/
