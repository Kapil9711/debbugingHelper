import React, { useEffect, useState } from 'react'

interface TopBarLoaderProps {
  loading: boolean
}

export default function TopBarLoader({ loading, color = '' }: any) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let slowTimer: any
    let finishTimer: any

    if (loading) {
      setVisible(true)

      // Start going to 80% smoothly
      setProgress(80)

      // After reaching near 80%, move VERY slowly toward 95%
      slowTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev // never exceed 95%
          return prev + 0.3 // super slow creep
        })
      }, 150)
    } else {
      // Finish: go to 100%
      setProgress(100)

      // Wait for the bar to animate to 100%, then fade out
      finishTimer = setTimeout(() => {
        setVisible(false)

        // After fade-out, reset progress back to 0
        setTimeout(() => {
          setProgress(0)
        }, 300)
      }, 400)
    }

    return () => {
      clearInterval(slowTimer)
      clearTimeout(finishTimer)
    }
  }, [loading])

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999] overflow-hidden pointer-events-none">
      <div
        className={`h-full ${color ? color : 'bg-blue-500'}  transition-all ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          width: `${progress}%`,
          transition: `
            width 0.5s ease-out,
            opacity 0.3s ease-out
          `
        }}
      />
    </div>
  )
}
