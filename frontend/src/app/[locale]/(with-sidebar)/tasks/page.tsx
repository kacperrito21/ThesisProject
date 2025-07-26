'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useToast } from '@/contexts/ToastContext'
import TaskComponent from '@/components/Tasks/TaskComponent'
import TaskModal from '@/components/Tasks/TaskModal'
import DeleteTaskModal from '@/components/Tasks/DeleteTaskModal'
import { Task } from '@/types/Task'
import { TaskFilters } from '@/components/Tasks/FilterForm'
import { UUID } from 'node:crypto'
import { useLoading } from '@/contexts/LoadingContext'
import { Category } from '@/app/[locale]/(with-sidebar)/categories/page'


export default function Page() {
  const t = useTranslations('tasks')
  const { showToast } = useToast()

  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const { showLoading, hideLoading, isLoading } = useLoading()

  const [filters, setFilters] = useState<TaskFilters>({
    title: '',
    categoryId: '',
    priority: '',
    status: '',
    description: '',
  })

  async function fetchTasksWithFilters(
    filters: TaskFilters,
  ): Promise<Task[]> {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tasks`)
    if (filters.title)       url.searchParams.set('title', filters.title)
    if (filters.categoryId)  url.searchParams.set('categoryId', filters.categoryId)
    if (filters.priority)    url.searchParams.set('priority', filters.priority)
    if (filters.status)      url.searchParams.set('status', filters.status)
    if (filters.description) url.searchParams.set('description', filters.description)

    const res = await fetch(url.toString(), {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Błąd pobierania zadań')
    return (await res.json()) as Task[]
  }

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const fetchCategories = async () => {
    try {
      showLoading()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Błąd pobierania kategorii')
      const data: Category[] = await res.json()
      setCategories(data)
    } catch (err) {
      console.error(err)
      showToast({ message: t('loadCategoriesError'), type: 'error' })
    } finally {
      hideLoading()
    }
  }

  const loadTasks = async () => {
    try {
      showLoading()
      const data = await fetchTasksWithFilters(filters)
      setTasks(data)
    } catch {
      showToast({ message: t('taskError'), type: 'error' })
    } finally {
      hideLoading()
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    loadTasks()
  }, [filters])

  const handleFilter = (f: TaskFilters) => {
    setFilters(f)
  }

  const handleCompletedTask = async (task: Task) => {
    const now = new Date().toISOString().split('T')[0]
    let updatedStatus: Task['status']
    let finishedDate: Task['finishedDate']

    if (task.status === 'COMPLETED') {
      if (task.dueDate && new Date(task.dueDate).toISOString().split('T')[0] < now) {
        updatedStatus = 'OVERDUE'
      } else {
        updatedStatus = 'TODO'
      }
      finishedDate = null
    } else {
      updatedStatus = 'COMPLETED'
      finishedDate = now
    }

    const updated = { ...task, status: updatedStatus, finishedDate }
    await handleSaveTask(updated, task.id)
  }

  const handleSaveTask = async (formData: Task, taskId?: string) => {
    try {
      showLoading()
      const method = taskId ? 'PATCH' : 'POST'
      const url = taskId
        ? `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/tasks`
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Błąd zapisu zadania')
      await loadTasks()
      showToast({
        message: taskId ? t('taskEditedSuccess') : t('taskSaveSuccess'),
        type: 'success',
      })
    } catch (err) {
      console.error(err)
      showToast({ message: t('saveError'), type: 'error' })
    } finally {
      hideLoading()
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      showLoading()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )
      if (!res.ok) throw new Error('Błąd usuwania zadania')
      await loadTasks()
      showToast({ message: t('taskDeletedSuccess'), type: 'success' })
    } catch (err) {
      console.error(err)
      showToast({ message: t('taskError'), type: 'error' })
    } finally {
      hideLoading()
    }
  }

  return (
    <div className="bg-[var(--color-primary)] w-full h-full rounded-r-lg">
      <TaskComponent
        tasks={tasks}
        categories={categories.map((c) => ({ id: c.id, name: c.name, color: c.color }))}
        loading={isLoading}
        onFilter={handleFilter}
        onEdit={(task) => {
          setSelectedTask(task)
          setTaskModalOpen(true)
        }}
        onDelete={(task) => {
          setSelectedTask(task)
          setDeleteModalOpen(true)
        }}
        onToggleComplete={handleCompletedTask}
        onAdd={() => {
          setSelectedTask(undefined)
          setTaskModalOpen(true)
        }}
      />

      {taskModalOpen && (
        <TaskModal
          isOpen={taskModalOpen}
          task={selectedTask}
          onClose={() => {
            setTaskModalOpen(false)
            setSelectedTask(undefined)
          }}
          onSave={(formData, id) => handleSaveTask(formData as Task, id)}
          categories={categories}
        />
      )}

      {deleteModalOpen && selectedTask && (
        <DeleteTaskModal
          isOpen={deleteModalOpen}
          selectedTaskId={selectedTask.id as UUID}
          onClose={() => {
            setDeleteModalOpen(false)
            setSelectedTask(undefined)
          }}
          onDelete={(id) => {
            handleDeleteTask(id)
            setDeleteModalOpen(false)
            setSelectedTask(undefined)
          }}
        />
      )}
    </div>
  )
}
