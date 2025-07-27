import React, { useState, useMemo, useEffect } from 'react'
import {
  startOfMonth,
  endOfMonth,
  getDay,
  format
} from 'date-fns'
import { Task } from '@/types/Task'
import TaskCard from '@/components/Tasks/TaskCard'
import TaskModal from '@/components/Tasks/TaskModal'
import DeleteTaskModal from '@/components/Tasks/DeleteTaskModal'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import { UUID } from 'node:crypto'
import { useTranslations } from 'next-intl'
import { Category } from '@/app/[locale]/(with-sidebar)/categories/page'
import IconButton from '../IconButton'

type Props = {
  tasks: Task[]
  categories: Category[] | []
  handleEditTask: (formData: Task, taskId?: string) => void
  handleDeleteTask: (taskId: string) => void
  handleCompletedTask: (task: Task) => void
  currentMonth: Date,
  onPrevMonth: () => void,
  onNextMonth: () => void,
}

const priorityColors: Record<Task['priority'], string> = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-green-500',
}

export default function CalendarComponent({
                                            tasks,
                                            handleEditTask,
                                            handleDeleteTask,
                                            handleCompletedTask,
                                            categories, currentMonth, onPrevMonth, onNextMonth,
                                          }: Props) {

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)

  const [shouldRenderDayModal, setShouldRenderDayModal] = useState(false)
  const [isDayModalAnimating, setIsDayModalAnimating] = useState(false)

  const tW = useTranslations('weekdays')
  const tM = useTranslations('months')
  const t = useTranslations('calendar')


  useEffect(() => {
    if (selectedDate !== null) {
      setShouldRenderDayModal(true)
      setTimeout(() => setIsDayModalAnimating(true), 10)
    } else {
      setIsDayModalAnimating(false)
      setTimeout(() => setShouldRenderDayModal(false), 500)
    }
  }, [selectedDate])

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {}
    tasks.forEach((t) => {
      if (!t.dueDate) return
      const key = format(new Date(t.dueDate), 'yyyy-MM-dd')
      map[key] = map[key] ? [...map[key], t] : [t]
    })
    return map
  }, [tasks])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startWeekDay = (getDay(monthStart) + 6) % 7
  const totalDays = monthEnd.getDate()

  const cells: (number | null)[] = [
    ...Array(startWeekDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  const openDayModal = (day: number) => {
    setSelectedDate(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ))
  }
  const closeDayModal = () => setSelectedDate(null)

  const openEditModal = (task: Task) => {
    setSelectedTask(task)
    setTaskModalOpen(true)
  }
  const openDeleteModal = (task: Task) => {
    setSelectedTask(task)
    setDeleteModalOpen(true)
  }
  const closeAllModals = () => {
    setTaskModalOpen(false)
    setDeleteModalOpen(false)
    setSelectedTask(undefined)
  }

  const weekdayKeys = [
    'Mon','Tue','Wed','Thu','Fri','Sat','Sun'
  ]

  const monthKeys = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ]

  return (
    <div className="bg-[var(--color-background)] rounded-2xl h-full p-10 shadow-sm text-[var(--color-text)]">
      <div className="flex items-center justify-between mb-20">
        <IconButton onClick={onPrevMonth}>
          <ChevronLeftIcon className="w-8 h-8" />
        </IconButton>
        <h2 className="text-2xl font-semibold">
          {tM(monthKeys[currentMonth.getMonth()])} {currentMonth.getFullYear()}
        </h2>
        <IconButton onClick={onNextMonth}>
          <ChevronRightIcon className="w-8 h-8" />
        </IconButton>
      </div>

      <div className="grid grid-cols-7 gap-3 text-center mb-5">
        {weekdayKeys.map((key) => (
          <div key={key}>
            {tW(key)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-12 gap-3">
        {cells.map((day, idx) => {
          if (day === null) {
            const emptyKey = `empty-${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${idx}`
            return <div key={emptyKey} />
          }

          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          )
          const dateKey = format(date, 'yyyy-MM-dd')
          const isSelected =
            selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateKey

          return (
            <div
              key={dateKey}
              className={`flex flex-col items-center p-2 rounded-lg cursor-pointer ${
                isSelected ? 'bg-[var(--color-chosen)]' : 'hover:bg-[var(--color-hover)]'
              }`}
              onClick={() => openDayModal(day)}
            >
              <span className="text-sm">{day}</span>
              <div className="mt-1 space-y-0.5">
                {(tasksByDate[dateKey] || []).slice(0, 3).map((t) => (
                  <span
                    key={t.id}
                    className={`block w-4 h-0.5 ${priorityColors[t.priority]}`}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {shouldRenderDayModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 ease-out ${
            isDayModalAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeDayModal}
        >
          <div
            className={`bg-[var(--color-sidebar)] rounded-xl shadow-lg w-[480px] max-h-[80vh] overflow-auto p-6 transition-all duration-500 ease-out transform ${
              isDayModalAnimating
                ? 'translate-y-0 opacity-100 scale-100'
                : '-translate-y-8 opacity-0 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {t('tasksFor')} {format(selectedDate!, 'dd/MM/yyyy')}
              </h3>
              <IconButton onClick={closeDayModal}>
                <XMarkIcon className="w-6 h-6" />
              </IconButton>
            </div>
            {(tasksByDate[format(selectedDate!, 'yyyy-MM-dd')] || []).length === 0 ? (
              <p className="text-gray-600">{t('noTasksForTheDay')}</p>
            ) : (
              tasksByDate[format(selectedDate!, 'yyyy-MM-dd')]!.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => openEditModal(task)}
                  onDelete={() => openDeleteModal(task)}
                  handleCompletedTask={() => handleCompletedTask(task)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {taskModalOpen && selectedTask && (
        <TaskModal
          isOpen={taskModalOpen}
          onClose={closeAllModals}
          onSave={(formData, id) => { handleEditTask(formData, id); closeAllModals() }}
          task={selectedTask}
          categories={categories}
        />
      )}

      {deleteModalOpen && selectedTask && (
        <DeleteTaskModal
          isOpen={deleteModalOpen}
          onClose={closeAllModals}
          onDelete={(id) => { handleDeleteTask(id); closeAllModals() }}
          selectedTaskId={selectedTask.id as UUID}
        />
      )}
    </div>
  )
}
