'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
  categoryId: string
}

export default function DeleteCategoryModal({ isOpen, onClose, onDelete, categoryId }: Props) {
  const t = useTranslations('categories')
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
      setTimeout(() => setShouldRender(false), 300)
    }
  }, [isOpen])

  const handleDelete = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onDelete(categoryId)
      onClose()
    }, 300)
  }

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black/50 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-[var(--color-background)] rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl transition-all duration-300 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'
        }`}
      >
        <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">
          {t('deleteCategory')}
        </h2>
        <p className="text-[var(--color-text)] mb-6">{t('deleteCategoryConfirm')}</p>

        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            className="flex-1 bg-[var(--color-chosen)] text-white py-3 rounded-xl font-medium hover:bg-[var(--color-hover)] transition-colors"
          >
            {t('delete')}
          </button>
          <button
            onClick={() => {
              setIsAnimating(false)
              setTimeout(onClose, 300)
            }}
            className="flex-1 bg-[var(--second-button)] text-white py-3 rounded-xl font-medium hover:bg-[var(--second-button-hover)] transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
