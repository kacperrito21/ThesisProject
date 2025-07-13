import { useTranslations } from 'next-intl'

type TaskModalProps = {
  isOpen: boolean
  onClose: () => void
  onDelete: (selectedTaskId: string) => void
  selectedTaskId: string
}

export default function DeleteTaskModal({
  isOpen,
  onClose,
  onDelete,
  selectedTaskId,
}: TaskModalProps) {
  const t = useTranslations('tasks')
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-background)] rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex flex-col justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[var(--color-text)] py-8 mr-auto">
            {t('deleteTask')}
          </h2>
          <p>{t('deleteTaskInfo')}</p>
        </div>
        <div className="flex flex-row gap-5">
          <button
            onClick={() => onDelete(selectedTaskId)}
            className="w-full bg-[var(--color-chosen)] text-white py-3 px-3 rounded-xl font-medium hover:bg-[var(--color-hover)] disabled:bg-gray-300 transition-colors"
          >
            {t('delete')}
          </button>
          <button
            onClick={() => onClose()}
            className="w-full bg-[var(--second-button)] text-white py-3 px-3 rounded-xl font-medium hover:bg-[var(--second-button-hover)] disabled:bg-gray-300 transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
