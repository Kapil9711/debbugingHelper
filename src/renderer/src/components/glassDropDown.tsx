'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface GlassDropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
}

export default function GlassDropdown({ trigger, children, align = 'left' }: GlassDropdownProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  // ---- Close on outside click ----
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        triggerRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const openMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return

    setCoords({
      top: rect.bottom + 6,
      left: align === 'left' ? rect.left : rect.right
    })

    setOpen(true)
  }

  return (
    <>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation()
          openMenu()
        }}
        className="inline-block w-fit"
      >
        {trigger}
      </div>

      {/* Portal */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            onClick={() => {
              setOpen(false)
            }}
            style={{
              position: 'fixed',
              top: coords.top,
              left: align === 'left' ? coords.left : undefined,
              right: align === 'right' ? window.innerWidth - coords.left : undefined,
              zIndex: 999999
            }}
            className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl min-w-[180px]"
          >
            {children}
          </div>,
          document.body
        )}
    </>
  )
}
