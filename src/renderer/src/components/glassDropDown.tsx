import React, { useEffect, useRef, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
}

export default function GlassDropdown({ trigger, children, align = 'left' }: Props) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  // Create portal mounting point
  const portal = useRef(document.getElementById('dropdown-portal'))
  if (!portal.current) {
    const div = document.createElement('div')
    div.id = 'dropdown-portal'
    document.body.appendChild(div)
    portal.current = div
  }

  // Position dropdown under trigger
  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return

    const left = align === 'left' ? rect.left : rect.right - (panelRef.current?.offsetWidth || 200)

    setPos({
      top: rect.bottom + 6,
      left
    })
  }

  // Recalculate position when opened or resized
  useEffect(() => {
    if (open) {
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
    }
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <>
      {/* Trigger */}
      <div ref={triggerRef} className="cursor-pointer inline-block" onClick={() => setOpen(!open)}>
        {trigger}
      </div>

      {/* Dropdown Panel in Portal */}
      {open &&
        portal.current &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              zIndex: 9999
            }}
          >
            <div
              className="
                rounded-xl 
                p-3 
                shadow-xl 
                border border-white/10 
                bg-white/20 
                backdrop-blur-xl 
                text-white
              "
            >
              {children}
            </div>
          </div>,
          portal.current
        )}
    </>
  )
}
