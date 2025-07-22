'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface Props {
  initialValue?: string
  onFilter: (name: string) => void
}

export default function FilterForm({ initialValue = '', onFilter }: Props) {
  const [value, setValue] = useState(initialValue)
  const t = useTranslations('categories')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onFilter(value.trim())
      }}
      className="flex items-center bg-white border border-[var(--color-secondary)] rounded-xl px-4 py-2 shadow-sm w-full max-w-md"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="flex-1 bg-transparent focus:outline-none text-black placeholder-gray-400"
      />
      <button type="submit" className="ml-2">
        <MagnifyingGlassIcon className="w-5 h-5 text-black" />
      </button>
    </form>
  )
}
