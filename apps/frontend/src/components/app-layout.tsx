import { Outlet } from 'react-router-dom';
import { SidebarTrigger } from './ui/sidebar';
import { AppFooter } from './app-footer';
import { AppSidebar } from './layout/sidebar';

export function AppLayout() {
  return (
    <div className="min-h-screen flex w-full ~bg-muted/50">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-4 md:px-8 py-4 lg:hidden">
          <SidebarTrigger />
        </div>
        <div className="flex grow flex-col px-4 md:px-8 py-4">
          <Outlet />
        </div>
        <AppFooter />
      </div>
    </div>
  );
}
