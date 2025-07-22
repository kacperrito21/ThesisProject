'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import FilterForm from './FilterForm'
import CategoriesGrid from './CategoriesGrid'
import CategoryModal from './CategoryModal'
import DeleteCategoryModal from './DeleteCategoryModal'

type Category = { id: string; name: string; color: string }

interface Props {
  categories: Category[]
  loading: boolean
  isPending: boolean
  filterName: string
  onFilter: (name: string) => void
  onSave: (cat: { name: string; color: string }, id?: string) => void
  onDelete: (id: string) => void
}

export default function CategoriesComponent({
  categories,
  loading,
  isPending,
  filterName,
  onFilter,
  onSave,
  onDelete,
}: Props) {
  const t = useTranslations('categories')
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null)
  const [editedCat, setEditedCat] = useState<Category | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [toDeleteId, setToDeleteId] = useState<string>('')

  const openDelete = (id: string) => {
    setToDeleteId(id)
    setDeleteModalOpen(true)
  }

  return (
    <div className="container flex flex-col pl-10 py-10 bg-[var(--color-primary)] text-[var(--color-text)] w-full h-full rounded-r-lg overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <FilterForm initialValue={filterName} onFilter={onFilter} />
        <div className="pr-10">
          <button
            onClick={() => {
              setEditedCat(null)
              setModalMode('add')
            }}
            className="bg-[var(--color-chosen)] hover:bg-[var(--color-hover)] text-white px-4 py-2 rounded-lg"
          >
            + {t('addCategory')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading || isPending ? (
          <p className="text-[var(--color-text)] py-10">{t('loading')}</p>
        ) : categories.length === 0 ? (
          <p className="text-[var(--color-text)] py-10">{t('emptyState')}</p>
        ) : (
          <CategoriesGrid
            categories={categories}
            onEdit={(cat) => {
              setEditedCat(cat)
              setModalMode('edit')
            }}
            onDelete={(cat) => openDelete(cat.id)}
          />
        )}
      </div>

      <CategoryModal
        isOpen={modalMode !== null}
        mode={modalMode!}
        initial={editedCat ?? undefined}
        onClose={() => setModalMode(null)}
        onSave={async (cat) => {
          await onSave(cat, editedCat?.id)
          setModalMode(null)
        }}
      />

      <DeleteCategoryModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={onDelete}
        categoryId={toDeleteId}
      />
    </div>
  )
}
