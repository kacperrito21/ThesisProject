import { startOfMonth, endOfMonth, getDay, format } from 'date-fns'
import { Task } from '@/types/Task'
import { JSX } from 'react'
import { useTranslations } from 'next-intl'

type CalendarProps = {
  tasks: Task[]
}

const getPriorityColor = (tasks: Task[]): string => {
  const order = ['HIGH', 'MEDIUM', 'LOW']
  const colors: Record<string, string> = {
    HIGH: 'bg-red-500',
    MEDIUM: 'bg-yellow-500',
    LOW: 'bg-green-500',
  }

  for (const level of order) {
    if (tasks.some((t) => t.priority === level)) {
      return colors[level]
    }
  }

  return ''
}

const groupTasksByDate = (tasks: Task[]) => {
  const grouped: Record<string, Task[]> = {}
  for (const task of tasks) {
    if (!task.dueDate) continue
    const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd')
    if (!grouped[dateKey]) grouped[dateKey] = []
    grouped[dateKey].push(task)
  }
  return grouped
}

export default function SmallCalendar({ tasks }: CalendarProps) {
  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  const startWeekDay = (getDay(monthStart) + 6) % 7
  const totalDays = monthEnd.getDate()
  const t = useTranslations('navigation')
  const groupedTasks = groupTasksByDate(tasks)

  const days: JSX.Element[] = []

  for (let i = 0; i < startWeekDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8 flex items-center justify-center" />)
  }

  for (let i = 1; i <= totalDays; i++) {
    const currentDate = new Date(today.getFullYear(), today.getMonth(), i)
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const dayTasks = groupedTasks[dateStr] || []
    const bgColor = getPriorityColor(dayTasks)

    days.push(
      <div
        key={dateStr}
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm cursor-pointer m-2 ${bgColor}`}
        title={dateStr}
        onClick={() => (window.location.href = '/calendar')}
      >
        {i}
      </div>
    )
  }

  return (
    <div className="w-full p-2 border border-gray-300 rounded-xl">
      <p className="text-lg font-semibold mb-2 mx-2">{t('calendar')}</p>
      <div className="grid grid-cols-7 gap-1 text-sm text-center text-gray-700 mb-1">
        {['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'So', 'Nd'].map((d) => (
          <div key={d} className="w-12 h-12 flex items-center justify-center">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  )
}
