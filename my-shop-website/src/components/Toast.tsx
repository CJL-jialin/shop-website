import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  message: string
  onClose: () => void
  duration?: number
}

export default function Toast({ message, onClose, duration = 2000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-lg shadow-lg text-sm font-medium pointer-events-auto">
        {message}
      </div>
    </div>,
    document.body
  )
}
