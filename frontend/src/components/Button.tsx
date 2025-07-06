import { ReactNode } from 'react'

type ButtonProps = {
  title: string
  onClick: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  icon?: ReactNode
  className?: string
}

export default function Button({
  title,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'primary',
  icon,
  className = '',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-semibold pl-1 pr-4 py-2 text-sm transition-colors duration-200'

  let variantClasses = ''

  if (variant === 'primary') {
    variantClasses = 'bg-[var(--color-chosen)] text-white hover:bg-[var(--color-hover)]'
  } else if (variant === 'secondary') {
    variantClasses = 'bg-gray-200 text-gray-900 hover:bg-gray-300'
  } else if (variant === 'danger') {
    variantClasses = 'bg-red-600 text-white hover:bg-red-700'
  }
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variantClasses} ${disabledClasses} ${className}`}
    >
      {icon}
      {loading && (
        <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
      )}
      {title}
    </button>
  )
}
