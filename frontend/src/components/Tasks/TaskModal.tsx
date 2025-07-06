import { useState, useEffect } from 'react'
import { XMarkIcon, CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Task } from '@/types/Task'
import { UUID } from 'node:crypto'
import { ExclamationCircleIcon } from '@heroicons/react/16/solid'

type Category = {
  id: UUID
  name: string
}

type TaskModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (
    formData: {
      title: string
      description?: string
      dueDate: string
      categoryId?: UUID | null
      priority: 'LOW' | 'MEDIUM' | 'HIGH'
    },
    taskId?: UUID
  ) => void
  task?: Task
  categories?: Category[]
}

type DropdownType = 'date' | 'priority' | 'category' | null

const priorities = {
  LOW: 'Niski',
  MEDIUM: 'Średni',
  HIGH: 'Wysoki',
}

function TaskModal({ isOpen, onClose, onSave, task, categories = [] }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    categoryId: null as UUID | null,
  })

  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: task?.title || '',
        description: task?.description || '',
        dueDate: task?.dueDate || new Date().toISOString().split('T')[0],
        priority: task?.priority || 'MEDIUM',
        categoryId: task?.categoryId || null,
      })
    }
  }, [isOpen, task])

  const handleInputChange = <T extends keyof typeof formData>(
    field: T,
    value: (typeof formData)[T]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleDropdown = (name: DropdownType) => {
    setActiveDropdown((prev) => (prev === name ? null : name))
  }

  const handleSave = () => {
    if (formData.title.trim()) {
      onSave(formData, task?.id)
      setActiveDropdown(null)
      onClose()
    }
  }

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (!isOpen) return null

  const isEditMode = !!task

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-background)] rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[var(--color-text)]">
            {isEditMode ? 'Edytuj zadanie' : 'Dodaj zadanie'}
          </h2>
          <button
            onClick={() => {
              setActiveDropdown(null)
              onClose()
            }}
            className="p-2 hover:bg-[var(--color-hover)] rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-[var(--color-text)]" />
          </button>
        </div>
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Tytuł zadania"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)] bg-[var(--color-primary)] text-[var(--color-text)]"
          />
          <textarea
            placeholder="Opis zadania"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)] bg-[var(--color-primary)] text-[var(--color-text)] resize-none"
          />
          <div className="relative pt-8">
            <button
              onClick={() => toggleDropdown('date')}
              className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-xl flex justify-between items-center bg-[var(--color-primary)] text-[var(--color-text)]"
            >
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 text-[var(--color-chosen)] mr-3" />
                <span>{formatDateForDisplay(formData.dueDate)}</span>
              </div>
              <ChevronDownIcon className="w-5 h-5 text-[var(--color-text)]" />
            </button>
            {activeDropdown === 'date' && (
              <div className="absolute w-full mt-2 bg-[var(--color-primary)] border border-[var(--color-secondary)] rounded-xl shadow-lg z-10">
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => {
                    handleInputChange('dueDate', e.target.value)
                    setActiveDropdown(null)
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-text)]"
                />
              </div>
            )}
          </div>
          <div className="relative pt-8">
            <button
              onClick={() => toggleDropdown('priority')}
              className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-xl flex justify-between items-center bg-[var(--color-primary)] text-[var(--color-text)]"
            >
              <div className="flex items-center">
                <ExclamationCircleIcon className="w-5 h-5 fill-[var(--color-hover)] mr-3" />
                <span>{priorities[formData.priority]}</span>
              </div>
              <ChevronDownIcon className="w-5 h-5 text-[var(--color-text)]" />
            </button>
            {activeDropdown === 'priority' && (
              <div className="absolute w-full mt-2 bg-[var(--color-primary)] border border-[var(--color-secondary)] rounded-xl shadow-lg z-10">
                {Object.entries(priorities).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      handleInputChange('priority', key as 'LOW' | 'MEDIUM' | 'HIGH')
                      setActiveDropdown(null)
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-[var(--color-hover)] text-[var(--color-text)] rounded-xl"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {categories.length > 0 && (
            <div className="relative pt-8">
              <button
                onClick={() => toggleDropdown('category')}
                className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-xl flex justify-between items-center bg-[var(--color-primary)] text-[var(--color-text)]"
              >
                <div className="flex items-center">
                  <span className="mr-3">Kategoria</span>
                  <span>
                    {categories.find((c) => c.id === formData.categoryId)?.name || 'Brak'}
                  </span>
                </div>
                <ChevronDownIcon className="w-5 h-5 text-[var(--color-text)]" />
              </button>
              {activeDropdown === 'category' && (
                <div className="absolute w-full mt-2 bg-[var(--color-primary)] border border-[var(--color-secondary)] rounded-xl shadow-lg z-10">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        handleInputChange('categoryId', category.id)
                        setActiveDropdown(null)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[var(--color-hover)] text-[var(--color-text)]"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={!formData.title.trim()}
            className="w-full bg-[var(--color-chosen)] text-white py-3 px-6 rounded-xl font-medium hover:bg-[var(--color-hover)] disabled:bg-gray-300 transition-colors"
          >
            {isEditMode ? 'Zapisz zmiany' : 'Zapisz'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskModal
