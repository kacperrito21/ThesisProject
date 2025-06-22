import { NavLink } from 'react-router-dom';

export const SideBar = () => (
  <aside className="w-64 bg-gray-100 h-screen p-6 shadow-md">
    <h2 className="text-xl font-bold mb-6">ToDo List</h2>
    <nav className="flex flex-col gap-4">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => (isActive ? 'font-bold text-blue-600' : '')}
      >
        📋 Strona Główna
      </NavLink>
      <NavLink
        to="/calendar"
        className={({ isActive }) => (isActive ? 'font-bold text-blue-600' : '')}
      >
        📅 Kalendarz
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) => (isActive ? 'font-bold text-blue-600' : '')}
      >
        ⚙️ Ustawienia
      </NavLink>
    </nav>
  </aside>
);
