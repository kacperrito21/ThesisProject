import { UUID } from 'node:crypto'

export type Task = {
  id?: UUID
  categoryId?: UUID | null
  title: string
  description?: string
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
  priority: 'LOW' | 'HIGH' | 'MEDIUM'
  dueDate: string
  finishDate?: string
}
