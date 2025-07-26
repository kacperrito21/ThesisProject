'use client'

import { useTranslations } from 'next-intl'
import { Task } from '@/types/Task'
import FilterForm, { TaskFilters } from './FilterForm'
import TaskGrid from './TaskGrid'

type Category = { id: string; name: string, color: string }

interface Props {
  tasks: Task[]
  categories: Category[] | []
  loading: boolean
  onFilter: (filters: TaskFilters) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onToggleComplete: (task: Task) => void
  onAdd: () => void
}

export default function TaskComponent({
                                        tasks,
                                        categories,
                                        loading,
                                        onFilter,
                                        onEdit,
                                        onDelete,
                                        onToggleComplete,
                                        onAdd
                                      }: Props) {
  const t = useTranslations('tasks')
  const initialFilters: TaskFilters = {
    title: '',
    categoryId: '',
    priority: '',
    status: '',
    description: '',
  }

  return (
    <div className="p-5 rounded-xl w-full">
      <FilterForm initial={initialFilters} categories={categories} onFilter={onFilter} onAdd={onAdd} />

      {loading ? (
        <p className="text-center py-10 text-gray-500">{t('loading')}</p>
      ) : tasks.length === 0 ? (
        <p className="text-center py-10 text-gray-500">{t('emptyState')}</p>
      ) : (
        <TaskGrid
          tasks={tasks}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      )}
    </div>
  )
}
