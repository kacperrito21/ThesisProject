'use client'
import { useEffect, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { useToast } from '@/contexts/ToastContext'
import CategoriesComponent from '@/components/Categories/CategoriesComponent'
import { useLoading } from '@/contexts/LoadingContext'

export type Category = { id: string; name: string; color: string }

export default function Page() {
  const t = useTranslations('categories')
  const { showToast } = useToast()

  const [categories, setCategories] = useState<Category[]>([])
  const [filterName, setFilterName] = useState('')
  const [isPending, startTransition] = useTransition()
  const { showLoading, hideLoading, isLoading } = useLoading()


  const fetchCategories = async (name = '') => {
    try {
      showLoading()
      const url = name
        ? `${process.env.NEXT_PUBLIC_API_URL}/categories?name=${encodeURIComponent(name)}`
        : `${process.env.NEXT_PUBLIC_API_URL}/categories`

      const res = await fetch(url, { credentials: 'include' })
      if (!res.ok) throw new Error('Błąd pobierania kategorii')
      const data: Category[] = await res.json()
      setCategories(data)
    } catch (err) {
      console.error(err)
      showToast({ message: t('loadError'), type: 'error' })
    } finally {
      hideLoading()
    }
  }

  const handleFilter = (name: string) => {
    setFilterName(name)
    startTransition(() => fetchCategories(name))
  }

  const handleSave = async (cat: { name: string; color: string }, id?: string) => {
    try {
      showLoading()
      const method = id ? 'PATCH' : 'POST'
      const url = id
        ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/categories`

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cat.name, color: cat.color }),
      })
      if (!res.ok) throw new Error('Błąd zapisu kategorii')

      await fetchCategories(filterName)
      showToast({
        message: id ? t('editSuccess') : t('addSuccess'),
        type: 'success',
      })
    } catch (err) {
      console.error(err)
      showToast({ message: t('saveError'), type: 'error' })
    } finally {
      hideLoading()
    }
  }

  const handleDelete = async (id: string) => {
    try {
      showLoading()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Błąd usuwania kategorii')
      await fetchCategories(filterName)
      showToast({ message: t('deleteSuccess'), type: 'success' })
    } catch (err) {
      console.error(err)
      showToast({ message: t('deleteError'), type: 'error' })
    } finally {
      hideLoading()
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <CategoriesComponent
      categories={categories}
      loading={isLoading}
      isPending={isPending}
      filterName={filterName}
      onFilter={handleFilter}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  )
}
