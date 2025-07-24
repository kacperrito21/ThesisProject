'use client'

import { useEffect, useState } from 'react'
import CalendarComponent from '@/components/Calendar/CalendarComponent'
import { Task } from '@/types/Task'
import { useToast } from '@/contexts/ToastContext'
import { useTranslations } from 'next-intl'
import { useLoading } from '@/contexts/LoadingContext'

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([])
  const { showToast } = useToast()
  const t = useTranslations('tasks')
  const { showLoading, hideLoading, isLoading } = useLoading()


  const loadTasks = async () => {
    try {
      showLoading()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks?includeCompleted=true`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Błąd pobierania zadań')
      const data: Task[] = await res.json()
      setTasks(data)
    } catch (err) {
      console.error(err)
      showToast({ message: 'Nie udało się pobrać zadań', type: 'error' })
    } finally {
      hideLoading()
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

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
        message: taskId ? t('taskEditedSuccess') : t('taskAddSuccess'),
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
        tasks={tasks}
        handleEditTask={handleSaveTask}
        handleDeleteTask={handleDeleteTask}
        handleCompletedTask={handleCompletedTask}
      />
    </div>
  )
}
