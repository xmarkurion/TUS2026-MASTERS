import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/app-layout';
import NotMatch from './pages/NotMatch';
import Sample from './pages/Sample';
import ComingSoon from './pages/ComingSoon';
import TaskBoard from './pages/TaskBoard';

export default function Router() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="" element={<TaskBoard />} />
        <Route path="pages">
          <Route path="sample" element={<Sample />} />
          <Route path="feature" element={<ComingSoon />} />
          <Route path="taskboard" element={<TaskBoard />} />
        </Route>
        <Route path="*" element={<NotMatch />} />
      </Route>
    </Routes>
  );
}
