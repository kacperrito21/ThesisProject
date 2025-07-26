import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

type TaskModalProps = {
  isOpen: boolean
  onClose: () => void
  onDelete: (selectedTaskId: string) => void
  selectedTaskId: string
}

export default function DeleteTaskModal({
  isOpen,
  onClose,
  onDelete,
  selectedTaskId,
}: TaskModalProps) {
  const t = useTranslations('tasks')
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
      setTimeout(() => setShouldRender(false), 500)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 500)
  }

  const handleDelete = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onDelete(selectedTaskId)
    }, 500)
  }

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-[var(--color-background)] rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl transition-all duration-500 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[var(--color-text)] py-8 mr-auto">
            {t('deleteTask')}
          </h2>
          <p className="text-[var(--color-text)] self-start">{t('deleteTaskInfo')}</p>
        </div>
        <div className="flex flex-row gap-5">
          <button
            onClick={handleDelete}
            className="w-full bg-[var(--color-chosen)] text-white py-3 px-3 rounded-xl font-medium hover:bg-[var(--color-hover)] disabled:bg-gray-300 transition-colors"
          >
            {t('delete')}
          </button>
          <button
            onClick={handleClose}
            className="w-full bg-[var(--second-button)] text-white py-3 px-3 rounded-xl font-medium hover:bg-[var(--second-button-hover)] disabled:bg-gray-300 transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
