import { useTranslations } from 'next-intl'
import Button from '@/components/Button'
import { PlusIcon } from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react'
import TaskModal from '@/components/Tasks/TaskModal'
import { Task } from '@/types/Task'
import TaskCard from '@/components/Tasks/TaskCard'
import DeleteTaskModal from '@/components/Tasks/DeleteTaskModal'
import SmallCalendar from '@/components/Calendar/SmallCalendar'

type DashboardProps = {
  user: string
  handleLogout: () => void
  tasks: Task[]
  loading: boolean
  onSaveTask: (formData: Task, taskId?: string) => void
  onDeleteTask: (id: string) => void
  showCompleted: boolean
  handleChangeShowCompleted: () => void
}

export default function DashboardComponent({
  user,
  handleLogout,
  tasks,
  loading,
  onSaveTask,
  onDeleteTask,
  showCompleted,
  handleChangeShowCompleted,
}: DashboardProps) {
  const t = useTranslations('common')
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const taskTranslation = useTranslations('tasks')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [completionProgress, setCompletionProgress] = useState(0)

  useEffect(() => {
    if (tasks.length === 0) {
      setCompletionProgress(0)
      return
    }

    const completedCount = tasks.filter((task) => task.status === 'COMPLETED').length
    const percentage = Math.round((completedCount / tasks.length) * 100)

    setCompletionProgress(percentage)
  }, [tasks])

  const handleAddTask = () => {
    setSelectedTask(undefined)
    setTaskModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setTaskModalOpen(true)
  }

  const handleCloseModal = () => {
    setTaskModalOpen(false)
    setDeleteModalOpen(false)
    setSelectedTask(undefined)
  }
  const handleDeleteTask = (task: Task) => {
    setDeleteModalOpen(true)
    setSelectedTask(task)
  }
  const handleCompletedTask = async (task: Task) => {
    const now = new Date().toISOString().split('T')[0]
    let updatedStatus: Task['status']
    let finishedDate: Task['finishedDate']
    if (task.status === 'COMPLETED') {
      if (task.dueDate && new Date(task.dueDate).toISOString().split('T')[0] < now) {
        updatedStatus = 'OVERDUE'
        finishedDate = null
      } else {
        updatedStatus = 'TODO'
        finishedDate = null
      }
    } else {
      updatedStatus = 'COMPLETED'
      finishedDate = new Date().toISOString().split('T')[0]
    }

    const updatedTask = { ...task, status: updatedStatus, finishedDate: finishedDate }
    onSaveTask(updatedTask, task.id)
  }

  return (
    <div className="container flex-col pl-10 py-10 bg-[var(--color-primary)] text-[var(--color-text)] w-full h-full rounded-r-lg overflow-hidden">
      <div className="flex flex-row w-full">
        <div className="flex">
          {user ? (
            <p className="font-semibold text-[25px]">
              {t('greetings')}, {user}
            </p>
          ) : null}
        </div>
        <div className="flex ml-auto px-10">
          <Button
            title={taskTranslation('addTask')}
            onClick={handleAddTask}
            variant="primary"
            icon={<PlusIcon className="w-6 h-6" />}
          />
        </div>
        <div className="flex ml-1 pr-10">
          <Button title={t('logout')} onClick={handleLogout} variant="primary" />
        </div>
      </div>
      <div className="w-3/5 h-6 bg-gray-200 rounded-lg overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500 ease-in-out"
          style={{ width: `${completionProgress}%` }}
        ></div>
      </div>
      <p className="text-sm mt-1">
        {completionProgress}% {taskTranslation('completed')}
      </p>
      <div className="flex flex-row">
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={handleChangeShowCompleted}
          className="w-5 h-5 mt-1 appearance-none border-2 border-green-500 rounded-sm checked:bg-green-500 checked:border-green-500 checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:block checked:after:translate-x-[2px] checked:after:translate-y-[-2px]"
        />
        <p className="pl-3">{taskTranslation('showCompleted')}</p>
      </div>
      <div className="flex flex-row w-full py-5">
        <div className="w-1/2 max-h-[70vh] overflow-y-auto pr-3">
          {loading ? (
            <p className="text-gray-500">Ładowanie zadań...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">Brak zadań do wyświetlenia</p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => handleEditTask(task)}
                onDelete={() => handleDeleteTask(task)}
                handleCompletedTask={() => handleCompletedTask(task)}
              />
            ))
          )}
        </div>
        <div className="w-1/2 px-10">
          <SmallCalendar tasks={tasks} />
        </div>
      </div>
      {taskModalOpen && (
        <TaskModal
          isOpen={taskModalOpen}
          onClose={handleCloseModal}
          onSave={(formData, taskId) => onSaveTask(formData, taskId)}
          task={selectedTask}
        />
      )}
      {deleteModalOpen && selectedTask && (
        <DeleteTaskModal
          isOpen={deleteModalOpen}
          onClose={handleCloseModal}
          onDelete={(taskId) => {
            onDeleteTask(taskId)
            handleCloseModal()
          }}
          selectedTaskId={selectedTask.id!}
        />
      )}
    </div>
  )
}
