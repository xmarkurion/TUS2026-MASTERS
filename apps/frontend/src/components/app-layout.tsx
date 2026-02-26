import { Outlet, useLocation } from 'react-router-dom';
import { SidebarTrigger } from './ui/sidebar';
import { AppFooter } from './app-footer';
import { AppSidebar } from './layout/sidebar';

/**
 * Function to determine if the current page is the main page ("/" or "" or "/pages/taskcreation")
 * @returns {boolean} True if the current page is the main page, false otherwise
 */
function isMainPage() :boolean {
  const location = useLocation();
  return location.pathname === '/' || 
        location.pathname === '' || 
        location.pathname === '/pages/taskcreation';
}

export function AppLayout() {

  return (
    <div className="min-h-screen flex w-full ~bg-muted/50">
      {!isMainPage() && <AppSidebar />}
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
