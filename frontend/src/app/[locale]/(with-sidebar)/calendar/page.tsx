'use client'

import { useEffect, useMemo, useState } from 'react'
import CalendarComponent from '@/components/Calendar/CalendarComponent'
import { Task } from '@/types/Task'
import { useToast } from '@/contexts/ToastContext'
import { useTranslations } from 'next-intl'
import { useLoading } from '@/contexts/LoadingContext'
import { Category } from '@/app/[locale]/(with-sidebar)/categories/page'
import { addMonths, subMonths } from 'date-fns'

export default function Page() {
  const [tasksCache, setTasksCache] = useState<Record<string, Task[]>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const { showToast } = useToast()
  const t = useTranslations('tasks')
  const { showLoading, hideLoading, isLoading } = useLoading()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthKey = useMemo(
    () => `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`,
    [currentMonth]
  )


  const loadTasks = async (date: Date) => {
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`
    if (tasksCache[key]) return
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    try {
      showLoading()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks?month=${month}&year=${year}&includeCompleted=true`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Błąd pobierania zadań')
      const data: Task[] = await res.json()
      setTasksCache(prev => ({ ...prev, [key]: data }))
    } catch (err) {
      console.error(err)
      showToast({ message: 'Nie udało się pobrać zadań', type: 'error' })
    } finally {
      hideLoading()
    }
  }

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
  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    loadTasks(currentMonth)
  }, [currentMonth])

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
      await loadTasks(currentMonth)
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
      await loadTasks(currentMonth)
      showToast({ message: t('taskDeletedSuccess'), type: 'success' })
    } catch (err) {
      console.error(err)
      showToast({ message: t('taskError'), type: 'error' })
    } finally {
      hideLoading()
    }
  }

  const tasksForMonth = useMemo(
    () => tasksCache[monthKey] ?? [],
    [tasksCache, monthKey]
  )

  if (isLoading) {
    return (
      <div className="bg-[var(--color-primary)] w-full h-full rounded-r-lg">
        <p>Ładowanie kalendarza…</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-primary)] w-full h-full rounded-r-lg py-20 px-10">
      <CalendarComponent
        tasks={tasksForMonth}
        handleEditTask={handleSaveTask}
        handleDeleteTask={handleDeleteTask}
        handleCompletedTask={handleCompletedTask}
        categories={categories}
        currentMonth={currentMonth}
        onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
        onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
      />
    </div>
  )
}
