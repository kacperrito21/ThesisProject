import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

type DatePickerDropdownProps = {
  selectedDate: string
  onDateSelect: (date: string) => void
  closeDropdown: () => void
}

export default function DatePickerDropdown({
  selectedDate,
  onDateSelect,
  closeDropdown,
}: DatePickerDropdownProps) {
  const selected = selectedDate ? new Date(selectedDate) : undefined

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formatToLocalISODate = (date: Date) => {
        const tzOffset = date.getTimezoneOffset() * 60000
        return new Date(date.getTime() - tzOffset).toISOString().split('T')[0]
      }
      const isoDate = formatToLocalISODate(date)
      onDateSelect(isoDate)
      closeDropdown()
    }
  }

  return (
    <div className="absolute w-full mt-2 bg-[var(--color-primary)] border border-[var(--color-secondary)] rounded-2xl shadow-lg z-10 px-4 py-1">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        weekStartsOn={1}
        classNames={{
          chevron: `fill-[var(--color-chosen)] hover:fill-[var(--color-hover)]`,
          day: `rounded-full text-[var(--color-text)] hover:bg-[var(--color-hover)] transition duration-300 ease-in-out`,
          today: `text-[var(--color-chosen)]`,
          selected: `rounded-full bg-[var(--color-chosen)]`,
        }}
      />
    </div>
  )
}
