'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardComponent from '@/components/Dashboard/DashboardComponent'
import { Task } from '@/types/Task'
import { useTranslations } from 'next-intl'
import { useToast } from '@/contexts/ToastContext'
import { useUser } from '@/contexts/UserContext'
import { useLoading } from '@/contexts/LoadingContext'
import { Category } from '@/app/[locale]/(with-sidebar)/categories/page'

export default function Page() {
  const router = useRouter()
  const { user } = useUser()
  const [tasks, setTasks] = useState<Task[]>([])
  const [monthDues, setMonthDues] = useState<{ dueDate: Date; priority: Task['priority'] }[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showCompleted, setShowCompleted] = useState(true)
  const t = useTranslations('tasks')
  const { showToast } = useToast()
  const { showLoading, hideLoading, isLoading } = useLoading()

  const handleChangeShowCompleted = async () => {
    const newValue = !showCompleted
    setShowCompleted(newValue)
    await fetchRecentTasks(newValue)
  }

  const handleLogout = async () => {
    try {
      showLoading()
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/login')
      sessionStorage.clear()
    } catch (error) {
      console.error('Błąd wylogowywania', error)
    } finally {
      hideLoading()
    }
  }

  const fetchRecentTasks = async (includeCompleted = showCompleted) => {
    try {
      showLoading()
      let res: Response
      if (includeCompleted) {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tasks/recent?amount=5&includeCompleted=${showCompleted}`,
          {
            credentials: 'include',
          }
        )
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/recent?amount=5`, {
          credentials: 'include',
        })
      }
      if (!res.ok) throw new Error('Błąd pobierania zadań')
      const data = await res.json()
      console.log(data)
      setTasks(data.items)
      setMonthDues(data.monthDue)
    } catch (err) {
      console.error('Błąd zadań:', err)
    } finally {
      hideLoading()
    }
  }

  async function handleSaveTask(formData: Task, taskId?: string) {
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
        body: JSON.stringify({ ...formData, status: formData.status ? formData.status : 'TODO' }),
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }

      await fetchRecentTasks()

      showToast({
        message: taskId ? t('taskEditedSuccess') : t('taskSaveSuccess'),
        type: 'success',
      })
    } catch (err) {
      console.error('Błąd zapisu zadania:', err)
      showToast({
        message: t('taskError'),
        type: 'error',
      })
    } finally {
      hideLoading()
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      showLoading()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }

      await fetchRecentTasks()

      showToast({
        message: t('taskDeletedSuccess'),
        type: 'success',
      })
    } catch (err) {
      console.error('Błąd usuwania zadania:', err)
      showToast({
        message: t('taskError'),
        type: 'error',
      })
    } finally {
      hideLoading()
    }
  }

  async function fetchUserCategories() {
    try {
      showLoading()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const categories = await res.json()
      setCategories(categories)
    } catch (err) {
      console.error('Błąd przy pobieraniu zadań:', err)
      showToast({
        message: t('categoriesError'),
        type: 'error',
      })
    } finally {
      hideLoading()
    }
  }

  useEffect(() => {
    fetchRecentTasks()
    fetchUserCategories()
  }, [])

  return (
    <DashboardComponent
      user={user}
      handleLogout={handleLogout}
      tasks={tasks}
      onSaveTask={handleSaveTask}
      onDeleteTask={handleDeleteTask}
      loading={isLoading}
      showCompleted={showCompleted}
      handleChangeShowCompleted={handleChangeShowCompleted}
      userCategories={categories}
      monthDues={monthDues}
    />
  )
}
