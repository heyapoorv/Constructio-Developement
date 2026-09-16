import React, { useEffect, useState } from 'react';
import { getAllTestimonials, deleteTestimonial, createTestimonial, updateTestimonial } from '../../firebase/firestore';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const initialForm = { author: '', title: '', text: '', published: true, displayOrder: 0 };
  const [formData, setFormData] = useState(initialForm);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEdit = (test) => {
    setFormData(test);
    setCurrentId(test.id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteTestimonial(id);
        fetchTestimonials();
      } catch (error) {
        console.error("Error deleting", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentId) {
        await updateTestimonial(currentId, formData);
      } else {
        await createTestimonial(formData);
      }
      setIsEditing(false);
      setCurrentId(null);
      setFormData(initialForm);
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimonial", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Manage Testimonials</h1>
          <p className="font-body-md text-on-surface-variant mt-2">Publish patron feedback and endorsements.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => { setFormData(initialForm); setCurrentId(null); setIsEditing(true); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-surface hover:bg-secondary hover:text-primary transition-colors font-label-caps text-label-caps uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Endorsement
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-surface border border-outline-variant/40 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline-md text-headline-md text-primary">{currentId ? 'Edit Endorsement' : 'New Endorsement'}</h2>
            <button onClick={() => setIsEditing(false)} className="text-outline hover:text-primary">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
                <input 
                  required type="text" name="author" id="author" value={formData.author} onChange={handleChange}
                  className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Author" 
                />
                <label htmlFor="author" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Patron Name *</label>
              </div>
              <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
                <input 
                  required type="text" name="title" id="title" value={formData.title} onChange={handleChange}
                  className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Title" 
                />
                <label htmlFor="title" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Context / Project *</label>
              </div>
            </div>

            <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
              <textarea 
                required name="text" id="text" rows="3" value={formData.text} onChange={handleChange}
                className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent resize-none" placeholder="Feedback"
              ></textarea>
              <label htmlFor="text" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Endorsement Text *</label>
            </div>

            <div className="flex items-center gap-8 border-t border-outline-variant/30 pt-6">
              <label className="flex items-center gap-4 cursor-pointer">
                <div className="relative flex items-center">
                  <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="sr-only peer" />
                  <div className="w-12 h-6 bg-outline-variant/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
                </div>
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary">Published</span>
              </label>
              
              <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors flex-1 max-w-xs">
                <input 
                  type="number" name="displayOrder" id="displayOrder" value={formData.displayOrder} onChange={handleChange}
                  className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="0" 
                />
                <label htmlFor="displayOrder" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Display Order</label>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 border border-outline-variant hover:border-primary text-primary transition-colors font-label-caps text-label-caps uppercase tracking-widest">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-surface hover:bg-secondary hover:text-primary transition-colors font-label-caps text-label-caps uppercase tracking-widest disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Endorsement'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full p-8 text-center text-outline animate-pulse font-label-caps uppercase tracking-widest">Loading Endorsements...</div>
          ) : testimonials.length === 0 ? (
            <div className="col-span-full p-12 text-center text-outline border border-outline-variant/40 bg-surface">
              No endorsements recorded yet.
            </div>
          ) : (
            testimonials.map(test => (
              <div key={test.id} className="p-6 bg-surface border border-outline-variant/40 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-0.5 font-label-caps text-[9px] uppercase tracking-widest border ${test.published ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20' : 'bg-outline-variant/30 text-outline border-outline-variant'}`}>
                      {test.published ? 'Published' : 'Draft'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(test)} className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                      <button onClick={() => handleDelete(test.id)} className="text-error/70 hover:text-error transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface-variant italic mb-6">"{test.text}"</p>
                </div>
                <div className="pt-4 border-t border-outline-variant/30">
                  <p className="font-label-caps text-label-caps uppercase tracking-widest text-primary">{test.author}</p>
                  <p className="font-body-sm text-outline mt-1">{test.title}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;
