'use client'

import { useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Task } from '@/types/Task'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { FunnelIcon, PlusIcon } from '@heroicons/react/24/outline'

export type TaskFilters = {
  title: string
  categoryId: string
  priority: Task['priority'] | ''
  status: Task['status'] | ''
  description: string
}

interface Category {
  id: string
  name: string
  color: string
}

interface Props {
  initial: TaskFilters
  categories: Category[]
  onFilter: (filters: TaskFilters) => void
  onAdd: () => void
}

const PRIORITY_OPTIONS = [
  { value: '' as Task['priority'] | '', label: 'Priorytet' },
  { value: 'LOW', label: 'Niski' },
  { value: 'MEDIUM', label: 'Średni' },
  { value: 'HIGH', label: 'Wysoki' },
]

const STATUS_OPTIONS = [
  { value: '' as Task['status'] | '', label: 'Status' },
  { value: 'TODO', label: 'Do zrobienia' },
  { value: 'OVERDUE', label: 'Przeterminowane' },
  { value: 'COMPLETED', label: 'Ukończone' },
]

export default function FilterForm({ initial, categories, onFilter, onAdd }: Props) {
  const t = useTranslations('tasks')
  const [filters, setFilters] = useState<TaskFilters>(initial)

  const handleChange = <K extends keyof TaskFilters>(field: K, value: TaskFilters[K]) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onFilter(filters)
  }

  const btnClasses =
    'w-full h-12 flex items-center justify-center gap-2 bg-[var(--color-chosen)] hover:bg-[var(--color-hover)] text-white rounded-xl transition'

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 mb-6 grid grid-cols-5 grid-rows-2 gap-4 items-end text-[var(--color-text)]"
    >
      <input
        type="text"
        placeholder={t('filters.title') || 'Tytuł'}
        value={filters.title}
        onChange={e => handleChange('title', e.target.value)}
        className="row-start-1 col-start-1 h-12 px-4 border rounded-xl bg-[var(--color-primary)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)]"
      />

      <Listbox value={filters.categoryId} onChange={val => handleChange('categoryId', val)}>
        <div className="relative row-start-1 col-start-2">
          <ListboxButton className="w-full h-12 px-4 border rounded-xl bg-[var(--color-primary)] text-[var(--color-text)] flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)]">
            {filters.categoryId ? (
              <>
                <span
                  className="inline-block w-3 h-3 mr-2 rounded-full"
                  style={{ backgroundColor: categories.find(c => c.id === filters.categoryId)?.color }}
                />
                {categories.find(c => c.id === filters.categoryId)?.name}
              </>
            ) : (
              <span className="text-gray-400">{t('filters.category') || 'Kategoria'}</span>
            )}
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-1 w-full bg-[var(--color-primary)] border border-[var(--color-secondary)] rounded-xl shadow-lg max-h-60 overflow-auto">
            <ListboxOption value="">
              {({ focus, selected }) => (
                <div
                  className={`px-4 py-2 cursor-pointer ${focus ? 'bg-[var(--color-hover)]' : ''} ${
                    selected ? 'font-medium' : ''
                  }`}
                >
                  {t('filters.category') || 'Kategoria'}
                </div>
              )}
            </ListboxOption>
            <ListboxOption value="">
              {({ focus, selected }) => (
                <div
                  className={`
              px-4 py-2 cursor-pointer
              ${focus ? 'bg-[var(--color-hover)]' : ''}
              ${selected ? 'font-medium' : ''}
            `}
                >
                  Brak kategorii
                </div>
              )}
            </ListboxOption>
            {categories.map(cat => (
              <ListboxOption key={cat.id} value={cat.id}>
                {({ focus, selected }) => (
                  <div
                    className={`flex items-center px-4 py-2 cursor-pointer ${
                      focus ? 'bg-[var(--color-hover)]' : ''
                    } ${selected ? 'font-medium' : ''}`}
                  >
                    <span
                      className="inline-block w-3 h-3 mr-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>

      <Listbox value={filters.priority} onChange={val => handleChange('priority', val)}>
        <div className="relative row-start-1 col-start-3">
          <ListboxButton className="w-full h-12 px-4 border rounded-xl bg-[var(--color-primary)] text-[var(--color-text)] flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)]">
            <span className={filters.priority ? '' : 'text-gray-400'}>
              {PRIORITY_OPTIONS.find(o => o.value === filters.priority)?.label}
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-1 w-full bg-[var(--color-primary)] border border-[var(--color-secondary)] rounded-xl shadow-lg max-h-60 overflow-auto">
            {PRIORITY_OPTIONS.map(o => (
              <ListboxOption key={o.value} value={o.value}>
                {({ focus, selected }) => (
                  <div
                    className={`px-4 py-2 cursor-pointer ${
                      focus ? 'bg-[var(--color-hover)]' : ''
                    } ${selected ? 'font-medium' : ''}`}
                  >
                    {o.label}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>

      <button type="button" onClick={onAdd} className={`row-start-1 col-start-5 ${btnClasses}`}>
        <PlusIcon className="w-5 h-5" /> {t('addTask') || 'Dodaj zadanie'}
      </button>

      <button type="submit" className={`row-start-1 row-span-2 col-start-5 ${btnClasses}`}>
        <FunnelIcon className="w-5 h-5" /> {t('filters.apply') || 'Filtruj'}
      </button>

      <Listbox value={filters.status} onChange={val => handleChange('status', val)}>
        <div className="relative row-start-2 col-start-1">
          <ListboxButton className="w-full h-12 px-4 border rounded-xl bg-[var(--color-primary)] text-[var(--color-text)] flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)]">
            <span className={filters.status ? '' : 'text-gray-400'}>
              {STATUS_OPTIONS.find(o => o.value === filters.status)?.label}
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-1 w-full bg-[var(--color-primary)] border border-[var(--color-secondary)] rounded-xl shadow-lg max-h-60 overflow-auto">
            {STATUS_OPTIONS.map(o => (
              <ListboxOption key={o.value} value={o.value}>
                {({ focus, selected }) => (
                  <div
                    className={`px-4 py-2 cursor-pointer ${
                      focus ? 'bg-[var(--color-hover)]' : ''
                    } ${selected ? 'font-medium' : ''}`}
                  >
                    {o.label}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>

      <input
        type="text"
        placeholder={t('filters.description') || 'Opis'}
        value={filters.description}
        onChange={e => handleChange('description', e.target.value)}
        className="row-start-2 col-start-2 col-span-3 h-12 px-4 border rounded-xl bg-[var(--color-primary)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)]"
      />
    </form>
  )
}
