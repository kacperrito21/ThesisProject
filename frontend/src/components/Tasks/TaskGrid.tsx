'use client'

import { Task } from '@/types/Task'
import TaskCard from './TaskCard'

interface Props {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onToggleComplete: (task: Task) => void
}

export default function TaskGrid({ tasks,
                                   onEdit,
                                   onDelete,
                                   onToggleComplete,
                                 }: Props) {

  return (
    <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task)}
          handleCompletedTask={() => onToggleComplete(task)}
        />
      ))}
    </div>
  )
}
