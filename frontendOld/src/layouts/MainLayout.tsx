import { Outlet } from 'react-router-dom';
import { SideBar } from '../components/SideBar';

export const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
