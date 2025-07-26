import { SideBar } from '@/components/SideBar'

export default function SideBarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen drop-shadow-[-1px_8px_5px_rgba(0,0,0,0.2)]">
      <SideBar />
      <main className="h-full w-full py-10 pr-10">{children}</main>
    </div>
  )
}
