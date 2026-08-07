import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import CategoryPicker from './pages/CategoryPicker.jsx';
import RegisterWizard from './pages/RegisterWizard.jsx';
import Success from './pages/Success.jsx';
import StatusCheck from './pages/StatusCheck.jsx';
import Verify from './pages/Verify.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminList from './pages/admin/AdminList.jsx';
import AdminDetail from './pages/admin/AdminDetail.jsx';
import { getAdminKey } from './lib/api.js';

/** Keeps unauthenticated eyes off admin screens; the API enforces it for real. */
function RequireAdmin({ children }) {
  return getAdminKey() ? children : <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<CategoryPicker />} />
        <Route path="/register/success" element={<Success />} />
        <Route path="/register/:category" element={<RegisterWizard />} />
        <Route path="/status" element={<StatusCheck />} />
        <Route path="/verify/:token" element={<Verify />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/applications"
          element={
            <RequireAdmin>
              <AdminList />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/applications/:registrationId"
          element={
            <RequireAdmin>
              <AdminDetail />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
