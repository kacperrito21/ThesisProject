import React, { JSX } from 'react'

type IconButtonProps = {
  onClick: () => void
  children: React.ReactNode
}

export default function IconButton({ onClick, children, }: IconButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-full text-[var(--color-text)] hover:text-[var(--color-hover)]"
    >
      {children}
    </button>
  )
}
