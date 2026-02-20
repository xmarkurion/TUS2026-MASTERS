import { BrowserRouter, HashRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider } from './components/ui/sidebar';
import Router from './Router';

const AppRouter =
  import.meta.env.VITE_USE_HASH_ROUTE === 'true' ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <ThemeProvider>
      <AppRouter>
        <SidebarProvider>
          <Router />
        </SidebarProvider>
      </AppRouter>
    </ThemeProvider>
  );
}
