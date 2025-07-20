'use client'

import CategoryCard from './CategoryCard'

type Category = { id: string; name: string; color: string }

interface Props {
  categories: Category[]
  onEdit: (cat: Category) => void
  onDelete: (cat: Category) => void
}

export default function CategoriesGrid({ categories, onEdit, onDelete }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6 pt-10 pr-10">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          onEdit={() => onEdit(cat)}
          onDelete={() => onDelete(cat)}
        />
      ))}
    </div>
  )
}
