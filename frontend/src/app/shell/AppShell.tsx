import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'
import { Toaster } from 'sonner'
import { LeftSidebar } from './LeftSidebar'
import { RightPanel } from './RightPanel'

export function AppShell() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="flex items-start gap-4">
          <LeftSidebar />
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
          <RightPanel />
        </div>
      </div>
      <Toaster richColors theme="system" position="top-center" />
    </div>
  )
}

