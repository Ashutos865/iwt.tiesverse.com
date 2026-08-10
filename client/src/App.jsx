import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Agenda from './pages/Agenda.jsx';
import Speakers from './pages/Speakers.jsx';
import Partners from './pages/Partners.jsx';
import Media from './pages/Media.jsx';
import Contact from './pages/Contact.jsx';
import CategoryPicker from './pages/CategoryPicker.jsx';
import RegisterWizard from './pages/RegisterWizard.jsx';
import Success from './pages/Success.jsx';
import StatusCheck from './pages/StatusCheck.jsx';
import Verify from './pages/Verify.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminList from './pages/admin/AdminList.jsx';
import AdminDetail from './pages/admin/AdminDetail.jsx';
import AdminCheckin from './pages/admin/AdminCheckin.jsx';
import AdminCheckins from './pages/admin/AdminCheckins.jsx';
import AdminContent from './pages/admin/AdminContent.jsx';
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
        <Route path="/about" element={<About />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/speakers" element={<Speakers />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/media" element={<Media />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<CategoryPicker />} />
        <Route path="/register/success" element={<Success />} />
        <Route path="/register/:category" element={<RegisterWizard />} />
        <Route path="/status" element={<StatusCheck />} />
        <Route path="/verify/:token" element={<Verify />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/checkin"
          element={
            <RequireAdmin>
              <AdminCheckin />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/content"
          element={
            <RequireAdmin>
              <AdminContent />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/checkins"
          element={
            <RequireAdmin>
              <AdminCheckins />
            </RequireAdmin>
          }
        />
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
