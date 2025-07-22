'use client'

import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid'

type Category = { id: string; name: string; color: string }

interface Props {
  category: Category
  onEdit: () => void
  onDelete: () => void
}

export default function CategoryCard({ category, onEdit, onDelete }: Props) {

  return (
    <div className="flex justify-between items-center bg-[var(--color-background)] rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
        <span className="text-[var(--color-text)] font-medium">{category.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="p-1 text-[var(--color-text)] hover:text-gray-500"
        >
          <PencilIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-[var(--color-text)] hover:text-gray-500"
        >
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
