import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../firebase/auth';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard', end: true },
    { name: 'Projects', path: '/admin/projects', icon: 'architecture' },
    { name: 'Enquiries', path: '/admin/enquiries', icon: 'inbox' },
    { name: 'Testimonials', path: '/admin/testimonials', icon: 'reviews' },
    { name: 'Site Settings', path: '/admin/settings', icon: 'settings' }
  ];

  return (
    <div className="flex h-screen bg-surface-container-low text-primary overflow-hidden font-body-md">
      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-outline-variant/30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <img alt="Monolith Logo" className="h-6 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe5AYFHbM5gZlQiaXjNgyQrugej9B6JVkQfej4yD54U4Cvd_bFRhnSUcI_YcWS_31Pa6J2UjsAgTInY0LxrZsp3GMDOj7NX1OFjd7kktmwltExp7NKlSNPOtOcVj9V7eI3mJgVzYmhyl8yxZrx2_idbJhL-JY4FKHtCd1uTUcW3oya-qzALgtoHLoCjETu1nR9hTwdp5WemgoXaqkZqDMeop-DEml-BovxK0EH7kvvAw4U71YnD1Wj" />
            <span className="font-headline-sm text-headline-sm uppercase tracking-widest">CMS</span>
          </div>
          <button className="lg:hidden text-outline hover:text-primary" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 transition-colors font-label-caps text-label-caps uppercase tracking-widest
                ${isActive ? 'bg-primary text-surface' : 'text-outline hover:bg-surface-container hover:text-primary'}
              `}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-outline-variant/30">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/10 transition-colors font-label-caps text-label-caps uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-surface border-b border-outline-variant/30 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-outline hover:text-primary" onClick={() => setIsSidebarOpen(true)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="font-headline-sm text-headline-sm hidden sm:block">Administrative Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-outline hover:text-primary font-label-caps text-label-caps uppercase tracking-widest transition-colors">
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              <span className="hidden sm:inline">View Site</span>
            </a>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
