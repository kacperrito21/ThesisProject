'use client'

import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

type Category = { id: string; name: string; color: string }

interface Props {
  category: Category
  onEdit: () => void
  onDelete: () => void
}

export default function CategoryCard({ category, onEdit, onDelete }: Props) {
  const t = useTranslations('categories')

  return (
    <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
        <span className="text-[var(--color-text)] font-medium">{category.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onEdit} className="p-1 hover:bg-[var(--color-secondary)] rounded">
          <EllipsisVerticalIcon className="w-5 h-5 text-[var(--color-text)]" />
        </button>
        <button onClick={onDelete} className="p-1 hover:bg-red-100 rounded">
          <TrashIcon className="w-5 h-5 text-red-600" />
        </button>
      </div>
    </div>
  )
}
