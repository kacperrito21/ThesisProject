import { useTranslations } from 'next-intl'
import Button from '@/components/Button'
import { PlusIcon } from '@heroicons/react/16/solid'

type DashboardProps = {
  user: { email: string; firstName: string } | null
  handleLogout: () => void
}

export default function DashboardComponent({ user, handleLogout }: DashboardProps) {
  const t = useTranslations('common')
  const taskTranslation = useTranslations('tasks')
  return (
    <div className="container pl-10 py-10 bg-[var(--color-primary)] text-[var(--color-text)] w-full h-full rounded-r-lg">
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
            onClick={handleLogout}
            variant="primary"
            icon={<PlusIcon className="w-6 h-6" />}
          />
        </div>
        <div className="flex ml-1 pr-10">
          <Button title={t('logout')} onClick={handleLogout} variant="primary" />
        </div>
      </div>
    </div>
  )
}
