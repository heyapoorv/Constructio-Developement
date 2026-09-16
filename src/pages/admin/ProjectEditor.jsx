import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createProject, updateProject, getProject } from '../../firebase/firestore';
import { uploadImage } from '../../firebase/storage';

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'residential',
    location: '',
    year: new Date().getFullYear().toString(),
    status: 'completed',
    area: '',
    client: '',
    description: '',
    published: false,
    displayOrder: 0,
    coverImage: ''
  });

  const fetchProject = async () => {
    try {
      const data = await getProject(id);
      if (data) {
        setFormData(data);
      } else {
        navigate('/admin/projects');
      }
    } catch (error) {
      console.error("Error fetching project", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Auto-generate slug from title if it's a new project and slug is empty or user is typing title
    if (name === 'title' && !isEdit) {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Max 5MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const path = `projects/${Date.now()}_${file.name}`;
      const url = await uploadImage(file, path, (progress) => {
        setUploadProgress(progress);
      });
      
      setFormData(prev => ({ ...prev, coverImage: url }));
    } catch (error) {
      console.error("Upload error", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    // We could delete from storage here, but we'll just clear the reference for simplicity/safety
    // until a dedicated cleanup job runs. Or we could call deleteImage(path) if we extract the path.
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await updateProject(id, formData);
      } else {
        await createProject(formData);
      }
      navigate('/admin/projects');
    } catch (error) {
      console.error("Error saving project", error);
      alert("Failed to save project.");
      setSaving(false);
    }
  };

  if (loading) return <div className="text-outline font-label-caps uppercase tracking-widest animate-pulse">Loading Project...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center gap-4 text-outline font-label-caps text-label-caps uppercase tracking-widest mb-2">
        <Link to="/admin/projects" className="hover:text-primary transition-colors">Projects</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-primary">{isEdit ? 'Edit Project' : 'New Project'}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-headline-lg text-headline-lg text-primary">{isEdit ? 'Edit Project' : 'Create New Project'}</h1>
        <div className="flex items-center gap-4">
          <Link to="/admin/projects" className="px-6 py-3 border border-outline-variant hover:border-primary text-primary transition-colors font-label-caps text-label-caps uppercase tracking-widest">
            Cancel
          </Link>
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-3 bg-primary text-surface hover:bg-secondary hover:text-primary transition-colors font-label-caps text-label-caps uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : <span className="material-symbols-outlined text-[18px]">save</span>}
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>

      <form className="flex flex-col gap-8 bg-surface border border-outline-variant/40 p-8 shadow-sm">
        
        {/* Core Info */}
        <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4 mb-4">
          <span className="w-6 h-px bg-secondary"></span>
          <h2 className="font-label-caps text-label-caps uppercase tracking-widest text-primary">Core Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              required type="text" name="title" id="title" value={formData.title} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Title" 
            />
            <label htmlFor="title" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Project Title *</label>
          </div>
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              required type="text" name="slug" id="slug" value={formData.slug} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Slug" 
            />
            <label htmlFor="slug" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">URL Slug *</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <select name="category" id="category" value={formData.category} onChange={handleChange} className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none appearance-none">
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="renovation">Renovation</option>
              <option value="civil">Civil & Structural</option>
            </select>
            <span className="material-symbols-outlined absolute right-0 top-4 text-outline pointer-events-none">expand_more</span>
            <label htmlFor="category" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest text-primary">Category *</label>
          </div>
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              type="text" name="location" id="location" value={formData.location} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Location" 
            />
            <label htmlFor="location" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Location</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              type="text" name="year" id="year" value={formData.year} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Year" 
            />
            <label htmlFor="year" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Completion Year</label>
          </div>
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              type="text" name="area" id="area" value={formData.area} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Area" 
            />
            <label htmlFor="area" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Area (sqm/sqft)</label>
          </div>
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none appearance-none">
              <option value="completed">Completed</option>
              <option value="ongoing">In Progress</option>
              <option value="concept">Concept/Planning</option>
            </select>
            <span className="material-symbols-outlined absolute right-0 top-4 text-outline pointer-events-none">expand_more</span>
            <label htmlFor="status" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest text-primary">Status</label>
          </div>
        </div>

        <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors mt-4">
          <textarea 
            name="description" id="description" rows="4" value={formData.description} onChange={handleChange}
            className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent resize-y" placeholder="Description"
          ></textarea>
          <label htmlFor="description" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Project Description</label>
        </div>

        {/* Media & Options */}
        <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4 mt-8 mb-4">
          <span className="w-6 h-px bg-secondary"></span>
          <h2 className="font-label-caps text-label-caps uppercase tracking-widest text-primary">Media & Publishing</h2>
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-label-caps text-label-caps uppercase tracking-widest text-outline">Cover Image</label>
          
          {formData.coverImage ? (
            <div className="relative w-full max-w-md aspect-[16/9] border border-outline-variant/30 overflow-hidden group">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${formData.coverImage})` }}></div>
              <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={removeImage} className="px-4 py-2 border border-surface text-surface hover:bg-error hover:border-error transition-colors font-label-caps text-label-caps uppercase tracking-widest">
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <input type="file" id="coverUpload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              <label htmlFor="coverUpload" className={`flex flex-col items-center justify-center w-full aspect-[16/9] border-2 border-dashed ${uploading ? 'border-primary cursor-wait' : 'border-outline-variant/50 hover:border-primary cursor-pointer'} transition-colors bg-surface-container-low`}>
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-3xl text-secondary">sync</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary mt-2">Uploading {Math.round(uploadProgress)}%</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-outline group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-widest mt-2">Upload Cover Image</span>
                    <span className="font-body-sm text-[10px] mt-1">JPEG, PNG, WEBP (Max 5MB)</span>
                  </div>
                )}
              </label>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 pt-8 border-t border-outline-variant/30">
          <label className="flex items-center gap-4 cursor-pointer">
            <div className="relative flex items-center">
              <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="sr-only peer" />
              <div className="w-12 h-6 bg-outline-variant/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
            </div>
            <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary">Published (Visible to public)</span>
          </label>
          
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              type="number" name="displayOrder" id="displayOrder" value={formData.displayOrder} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="0" 
            />
            <label htmlFor="displayOrder" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Display Order (Lower is higher)</label>
          </div>
        </div>

      </form>
    </div>
  );
};

export default ProjectEditor;
