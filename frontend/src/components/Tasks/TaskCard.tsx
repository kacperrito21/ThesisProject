import { Task } from '@/types/Task'
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid'
import { useTranslations } from 'next-intl'

type Props = {
  task: Task
  onEdit: () => void
  onDelete: () => void
  handleCompletedTask: () => void
}

export default function TaskCard({ task, onEdit, onDelete, handleCompletedTask }: Props) {
  const t = useTranslations('tasks')
  const baseClasses = 'px-8 py-1 rounded-xl text-xs font-semibold'
  const priorityClass =
    task.priority === 'HIGH'
      ? 'bg-red-500 text-white'
      : task.priority === 'LOW'
        ? 'bg-green-500 text-white'
        : 'bg-yellow-500 text-white'
  return (
    <div className="flex flex-col justify-between p-5 bg-[var(--color-background)] rounded-xl shadow mb-4">
      <div className="flex flex-row gap-3 items-center">
        <input
          type="checkbox"
          checked={task.status === 'COMPLETED'}
          onChange={handleCompletedTask}
          className="w-5 h-5 mt-1 appearance-none border-2 border-green-500 rounded-sm checked:bg-green-500 checked:border-green-500 checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:block checked:after:translate-x-[2px] checked:after:translate-y-[-2px]"
        />
        <h3 className="text-lg font-semibold w-5/12 text-[var(--color-text)]">{task.title}</h3>

        {task.status === 'OVERDUE' ? (
          <span
            className={`${baseClasses} ${priorityClass} inline-flex flex-row whitespace-nowrap`}
          >
            {t(`priority.${task.priority}`) + ' ' + t(`status.${task.status}`)}
          </span>
        ) : (
          <span className={`${baseClasses} ${priorityClass}`}>
            {t(`priority.${task.priority}`)}
          </span>
        )}
        <span className="text-sm text-[var(--color-text)] right-0 ml-auto">
          {' '}
          {task.dueDate.split('T')[0]}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-[var(--color-text)] text-sm line-clamp-1">{task.description}</p>
        <div className="flex gap-2 ml-auto">
          <button onClick={onEdit} className="p-1 text-[var(--color-text)] hover:text-gray-500">
            <PencilIcon className="w-6 h-6" />
          </button>
          <button onClick={onDelete} className="p-1 text-[var(--color-text)] hover:text-gray-500">
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
