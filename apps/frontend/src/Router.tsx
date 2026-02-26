import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/app-layout';
import NotMatch from './pages/NotMatch';
import Sample from './pages/Sample';
import ComingSoon from './pages/ComingSoon';
import TaskBoard from './pages/TaskBoard';
import StartupPage from './pages/StartupPage';

export default function Router() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="" element={<StartupPage />} />
        <Route path="pages">
          <Route path="taskboard" element={<TaskBoard />} />
          <Route path="sample" element={<Sample />} />
          <Route path="feature" element={<ComingSoon />} />
          <Route path="taskboard" element={<TaskBoard />} />
        </Route>
        <Route path="*" element={<NotMatch />} />
      </Route>
    </Routes>
  );
}
