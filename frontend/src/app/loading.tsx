'use client'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[var(--color-chosen)]"></div>
    </div>
  )
}
