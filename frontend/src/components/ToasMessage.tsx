'use client'
import { useEffect, useState } from 'react'

interface ToastMessageProps {
  message: string
  type: 'success' | 'error'
  duration?: number
  onClose?: () => void
}

export default function ToastMessage({ message, type, duration = 5000, onClose }: ToastMessageProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)

    const timer = setTimeout(() => {
      setVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const backgroundClass = type === 'success' ? 'bg-green-500' : 'bg-red-500'

  return (
    <div
      className={`
        fixed top-4 right-4 text-white px-4 py-2 rounded shadow-lg z-50 transform transition-all duration-500 ease-in-out
        ${backgroundClass}
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      onTransitionEnd={() => {
        if (!visible && onClose) {
          onClose()
        }
      }}
    >
      {message}
    </div>
  )
}
