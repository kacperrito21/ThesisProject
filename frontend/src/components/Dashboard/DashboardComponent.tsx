import { useTranslations } from 'next-intl'
import Button from '@/components/Button'
import { PlusIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'
import TaskModal from '@/components/Tasks/TaskModal'
import { Task } from '@/types/Task'
import TaskCard from '@/components/Tasks/TaskCard'

type DashboardProps = {
  user: { email: string; firstName: string } | null
  handleLogout: () => void
  tasks: Task[]
  loading: boolean
  onSaveTask: (formData: Task, taskId?: string) => void
}

export default function DashboardComponent({
  user,
  handleLogout,
  tasks,
  loading,
  onSaveTask,
}: DashboardProps) {
  const t = useTranslations('common')
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const taskTranslation = useTranslations('tasks')

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
    setSelectedTask(undefined)
  }

  return (
    <div className="container flex-col pl-10 py-10 bg-[var(--color-primary)] text-[var(--color-text)] w-full h-full rounded-r-lg overflow-hidden">
      <div className="flex flex-row w-full">
        <div className="flex">
          {user ? (
            <p className="font-semibold text-[25px]">
              {t('greetings')}, {user.firstName}
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
      <div className="py-5">Tutaj ProgressBar</div>
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
                onDelete={() => {
                  console.log('Usuń', task.id)
                }}
              />
            ))
          )}
        </div>
        <div className="w-1/2 px-10">Tutaj Kalendarz</div>
      </div>
      {taskModalOpen && (
        <TaskModal
          isOpen={taskModalOpen}
          onClose={handleCloseModal}
          onSave={(formData, taskId) => onSaveTask(formData, taskId)}
          task={selectedTask}
        />
      )}
    </div>
  )
}
