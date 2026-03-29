import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/app-layout';
import NotMatch from './pages/NotMatch';
import Sample from './pages/Sample';
import ComingSoon from './pages/ComingSoon';
import TaskBoard from './pages/TaskBoard';
import StartupPage from './pages/Startup';
import TaskCreation from './pages/TaskCreation';
import TaskReview from './pages/TaskReview';
import ManageTeam from './pages/ManageTeam';
import Dashboard from './pages/Dashboard';
import AssignReview from './pages/AssignReview';

export default function Router() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="" element={<StartupPage />} />
        <Route path="pages">
<Route path="taskcreation" element={<TaskCreation />} />
          <Route path="taskreview" element={<TaskReview />} />
          <Route path="taskboard" element={<TaskBoard />} />
          <Route path="sample" element={<Sample />} />
          <Route path="feature" element={<ComingSoon />} />
          <Route path="taskboard" element={<TaskBoard />} />
          <Route path="manage-team" element={<ManageTeam />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="assignreview" element={<AssignReview />} />
        </Route>
        <Route path="*" element={<NotMatch />} />
      </Route>
    </Routes>
  );
}
