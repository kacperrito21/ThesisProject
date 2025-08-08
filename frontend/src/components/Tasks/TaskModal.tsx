import { useState, useEffect, useRef } from 'react'
import { XMarkIcon, CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Task } from '@/types/Task'
import { UUID } from 'node:crypto'
import { ExclamationCircleIcon } from '@heroicons/react/16/solid'
import DatePickerDropdown from '@/components/Calendar/DatePickerDropdown'
import parseDateFromText from '@/helpers/parseDateFromText'
import { useTranslations } from 'next-intl'
import { Category } from '@/app/[locale]/(with-sidebar)/categories/page'

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
      status?: 'TODO' | 'OVERDUE' | 'COMPLETED'
    },
    taskId?: UUID
  ) => void
  task?: Task
  categories: Category[] | []
}

type DropdownType = 'date' | 'priority' | 'category' | null

function TaskModal({ isOpen, onClose, onSave, task, categories }: TaskModalProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    categoryId: null as UUID | null,
    status: 'TODO' as 'TODO' | 'OVERDUE' | 'COMPLETED',
  })

  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const t = useTranslations('common')
  const tTasks = useTranslations('tasks')
  const selected = categories.find((c) => c.id === formData.categoryId)

  const priorities = {
    LOW: tTasks('priority.LOW'),
    MEDIUM: tTasks('priority.MEDIUM'),
    HIGH: tTasks('priority.HIGH'),
  }

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setTimeout(() => setIsAnimating(true), 10)

      setFormData({
        title: task?.title || '',
        description: task?.description || '',
        dueDate: task?.dueDate || new Date().toISOString().split('T')[0],
        priority: task?.priority || 'MEDIUM',
        categoryId: task?.categoryId || null,
        status: task?.status || 'TODO',
      })

      const id = setTimeout(() => {
        titleInputRef.current?.focus()
        titleInputRef.current?.select()
      }, 0)

      return () => clearTimeout(id)
    } else {
      setIsAnimating(false)
      setTimeout(() => setShouldRender(false), 500)
    }
  }, [isOpen, task])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.shiftKey) {
        return
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        if (!formData.title.trim()) {
          e.preventDefault()
          return
        }
        e.preventDefault()
        handleSave()
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, formData])

  const handleInputChange = <T extends keyof typeof formData>(
    field: T,
    value: (typeof formData)[T]
  ) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value }

      if (field === 'description' && typeof value === 'string') {
        const parsedDate = parseDateFromText(value)
        if (parsedDate) {
          newFormData.dueDate = parsedDate
        }
      }

      return newFormData
    })
  }

  const toggleDropdown = (name: DropdownType) => {
    setActiveDropdown((prev) => (prev === name ? null : name))
  }

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 500)
  }

  const handleSave = () => {
    if (formData.title.trim()) {
      setIsAnimating(false)
      setTimeout(() => {
        onSave(formData, task?.id)
        setActiveDropdown(null)
        onClose()
      }, 500)
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

  if (!shouldRender) return null

  const isEditMode = !!task
  return (
    <div
      className={`fixed inset-0 bg bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-500 ${
        isAnimating ? 'opacity-100' : 'opacity-50'
      }`}
    >
      <div
        className={`bg-[var(--color-background)] rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl transition-all duration-500 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[var(--color-text)]">
            {isEditMode ? tTasks('editTask') : tTasks('addTask')}
          </h2>
          <button onClick={handleClose} className="p-2 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6 text-[var(--color-text)] hover:text-[var(--color-chosen)]" />
          </button>
        </div>
        <div className="space-y-5">
          <input
            ref={titleInputRef}
            type="text"
            placeholder={t('taskTitle')}
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)] bg-[var(--color-primary)] text-[var(--color-text)]"
          />
          <textarea
            placeholder={t('taskDescription')}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-hover)] bg-[var(--color-primary)] text-[var(--color-text)] resize-none"
          />
          {categories.length > 0 && (
            <div className="relative py-3">
              <button
                onClick={() => toggleDropdown('category')}
                className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-xl flex justify-between items-center bg-[var(--color-primary)] text-[var(--color-text)]"
              >
                <div className="flex items-center">
                  <span
                    className="w-4 h-4 rounded-full mr-3"
                    style={{
                      backgroundColor: selected?.color ?? 'rgba(128,128,128,0.5)',
                    }}
                  />
                  <span>{selected?.name ?? t('category')}</span>
                </div>
                <ChevronDownIcon className="w-5 h-5 text-[var(--color-text)]" />
              </button>
              {activeDropdown === 'category' && (
                <div className="absolute overflow-y-auto max-h-60 w-full mt-2 bg-[var(--color-primary)] border border-[var(--color-secondary)] rounded-xl shadow-lg z-10 animate-in slide-in-from-top-2 duration-200">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        handleInputChange('categoryId', category.id)
                        setActiveDropdown(null)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[var(--color-hover)] hover:rounded-xl text-[var(--color-text)] flex items-center"
                    >
                      <span
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="relative">
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
              <DatePickerDropdown
                selectedDate={formData.dueDate}
                onDateSelect={(date) => handleInputChange('dueDate', date)}
                closeDropdown={() => setActiveDropdown(null)}
              />
            )}
          </div>
          <div className="relative pt-3">
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
              <div className="absolute w-full bg-[var(--color-primary)] border border-[var(--color-secondary)] rounded-xl shadow-lg animate-in slide-in-from-top-2 duration-200">
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
          <button
            onClick={handleSave}
            disabled={!formData.title.trim()}
            className="w-full bg-[var(--color-chosen)] text-white py-3 px-6 rounded-xl font-medium hover:bg-[var(--color-hover)] disabled:bg-gray-300 transition-colors"
          >
            {isEditMode ? t('saveChanges') : t('save')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskModal
