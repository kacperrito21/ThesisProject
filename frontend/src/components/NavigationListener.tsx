'use client'

import { useEffect } from 'react'
import { useLinkStatus } from 'next/link'
import { useLoading } from '@/contexts/LoadingContext'


export default function NavigationListener() {
  const { showLoading, hideLoading } = useLoading()
  const { pending } = useLinkStatus()

  useEffect(() => {
    if (pending) {
      showLoading()
    } else {
      hideLoading()
    }
  }, [pending, showLoading, hideLoading])

  return null
}
