import { useTranslations } from 'next-intl'

export default function Brand() {
  const ct = useTranslations('common')
  return (
    <div className="flex flex-col justify-center top-10 md:top-5 pb-5 text-center select-none">
      <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)]">
        Tackly<span className="text-[var(--color-chosen)]">.</span>
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text)]">{ct('appDescription')}</p>
    </div>
  )
}
