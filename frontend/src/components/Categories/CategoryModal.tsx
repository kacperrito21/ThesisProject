'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'
import IconButton from '@/components/IconButton'

type Category = { id: string; name: string; color: string }

interface Props {
  isOpen: boolean
  mode: 'add' | 'edit'
  initial?: Category
  onClose: () => void
  onSave: (data: { name: string; color: string }) => void
}

export default function CategoryModal({ isOpen, mode, initial, onClose, onSave }: Props) {
  const t = useTranslations('categories')
  const [name, setName] = useState('')
  const [color, setColor] = useState('#4caf50')

  const [shouldRender, setShouldRender] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setTimeout(() => setIsAnimating(true), 10)
      if (mode === 'edit' && initial) {
        setName(initial.name)
        setColor(initial.color)
      }
    } else {
      setIsAnimating(false)
      setTimeout(() => setShouldRender(false), 500)
    }
  }, [isOpen, mode, initial])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(onClose, 500)
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    onSave({ name: name.trim(), color })
    handleClose()
  }
  if (!shouldRender) return null

  return (
    <div
      className={`
        fixed inset-0 bg-black/20 flex items-center justify-center z-50
        transition-opacity duration-500
        ${isAnimating ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div
        className={`
          bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-sm mx-4
          transition-all duration-500 ease-out
          ${
            isAnimating
              ? 'translate-y-0 opacity-100 scale-100'
              : '-translate-y-8 opacity-0 scale-95'
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">
            {mode === 'add' ? t('addCategory') : t('editCategory')}
          </h2>
          <IconButton onClick={handleClose}>
            <XMarkIcon className="w-5 h-5" />
          </IconButton>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder={t('namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--color-secondary)] rounded-xl bg-[var(--color-primary)] text-[var(--color-text)] focus:outline-none"
          />
          <div>
            <label className="block mb-1 text-[var(--color-text)] text-sm">{t('color')}</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="appearance-none w-10 h-10 p-0 border-0 rounded-full cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-[var(--color-chosen)] text-white py-2 rounded-xl hover:bg-[var(--color-hover)] transition"
          >
            {mode === 'add' ? t('add') : t('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  )
}
