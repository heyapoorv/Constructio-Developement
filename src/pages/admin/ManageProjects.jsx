import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProjects, deleteProject } from '../../firebase/firestore';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete the project "${title}"?`)) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project", error);
        alert("Failed to delete project.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Manage Projects</h1>
          <p className="font-body-md text-on-surface-variant mt-2">Create, edit, and organize portfolio projects.</p>
        </div>
        <Link 
          to="/admin/projects/new" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-surface hover:bg-secondary hover:text-primary transition-colors font-label-caps text-label-caps uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Project
        </Link>
      </div>

      <div className="bg-surface border border-outline-variant/40 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-outline animate-pulse font-label-caps uppercase tracking-widest">Loading Projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-4 text-outline">
            <span className="material-symbols-outlined text-4xl">architecture</span>
            <p className="font-body-md">No projects found in the registry.</p>
            <Link to="/admin/projects/new" className="text-secondary hover:text-primary transition-colors font-label-caps uppercase tracking-widest underline">Create your first project</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                  <th className="py-4 px-6 font-label-caps text-label-caps uppercase tracking-widest text-outline">Cover</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps uppercase tracking-widest text-outline">Project Name</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps uppercase tracking-widest text-outline">Category</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps uppercase tracking-widest text-outline">Status</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps uppercase tracking-widest text-outline text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4 px-6">
                      {project.coverImage ? (
                        <div className="w-16 h-12 bg-cover bg-center border border-outline-variant/30" style={{ backgroundImage: `url(${project.coverImage})` }}></div>
                      ) : (
                        <div className="w-16 h-12 bg-surface-container flex items-center justify-center text-outline/50 border border-outline-variant/30">
                          <span className="material-symbols-outlined text-[16px]">image</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-headline-sm text-headline-sm text-primary">{project.title}</p>
                      <p className="font-body-sm text-on-surface-variant mt-1">{project.location}</p>
                    </td>
                    <td className="py-4 px-6 font-body-sm text-on-surface-variant capitalize">
                      {project.category || 'Uncategorized'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 font-label-caps text-[10px] uppercase tracking-widest border ${
                        project.published ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20' : 'bg-outline-variant/30 text-outline border-outline-variant'
                      }`}>
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link to={`/admin/projects/${project.id}/edit`} className="w-8 h-8 flex items-center justify-center text-outline hover:text-primary transition-colors border border-outline-variant/30 hover:border-primary">
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </Link>
                        <button onClick={() => handleDelete(project.id, project.title)} className="w-8 h-8 flex items-center justify-center text-error/70 hover:text-error transition-colors border border-outline-variant/30 hover:border-error">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProjects;
