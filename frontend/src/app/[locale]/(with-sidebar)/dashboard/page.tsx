'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardComponent from '@/components/Dashboard/DashboardComponent'
import { Task } from '@/types/Task'
import { useTranslations } from 'next-intl'
import { useToast } from '@/contexts/ToastContext'

export default function Page() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; firstName: string } | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCompleted, setShowCompleted] = useState(true)
  const t = useTranslations('tasks')
  const { showToast } = useToast()

  const handleChangeShowCompleted = async () => {
    const newValue = !showCompleted
    setShowCompleted(newValue)
    await fetchRecentTasks(newValue)
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/login')
    } catch (error) {
      console.error('Błąd wylogowywania', error)
    }
  }

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Unauthorized')
      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.error('Błąd użytkownika:', err)
    }
  }

  const fetchRecentTasks = async (includeCompleted = showCompleted) => {
    try {
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
      setTasks(data)
    } catch (err) {
      console.error('Błąd zadań:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveTask(formData: Task, taskId?: string) {
    try {
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
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
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
    }
  }

  useEffect(() => {
    fetchUser()
    fetchRecentTasks()
  }, [])

    return (
      <DashboardComponent
        user={user}
        handleLogout={handleLogout}
        tasks={tasks}
        onSaveTask={handleSaveTask}
        onDeleteTask={handleDeleteTask}
        loading={loading}
        showCompleted={showCompleted}
        handleChangeShowCompleted={handleChangeShowCompleted}
      />
    )
}
