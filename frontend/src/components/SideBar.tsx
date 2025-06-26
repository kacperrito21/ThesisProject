import Link from 'next/link'

export const SideBar = () => (
  <aside className="ml-10 my-10 w-75 rounded-l-lg bg-gray-200 shadow-md h-1000 p-8">
    <h1 className="text-2xl font-bold mb-8">To-Do List</h1>
    <nav className="space-y-4">
      <Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-600">
        Strona Główna
      </Link>
      <Link href="/calendar" className="flex items-center gap-2 hover:text-blue-600">
        Kalendarz
      </Link>
      <Link href="/settings" className="flex items-center gap-2 hover:text-blue-600">
        Ustawienia
      </Link>
    </nav>
  </aside>
)
