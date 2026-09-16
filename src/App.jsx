import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/public/Home';
import ProjectDetail from './pages/public/ProjectDetail';
import Login from './pages/admin/Login';
import AdminLayout from './layouts/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import ManageProjects from './pages/admin/ManageProjects';
import ProjectEditor from './pages/admin/ProjectEditor';
import ManageEnquiries from './pages/admin/ManageEnquiries';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import SiteSettings from './pages/admin/SiteSettings';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface text-primary font-label-caps tracking-widest uppercase">Loading Core...</div>;
  return currentUser ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<Navigate to="/" />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<DashboardOverview />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="projects/new" element={<ProjectEditor />} />
            <Route path="projects/:id/edit" element={<ProjectEditor />} />
            <Route path="enquiries" element={<ManageEnquiries />} />
            <Route path="testimonials" element={<ManageTestimonials />} />
            <Route path="settings" element={<SiteSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
