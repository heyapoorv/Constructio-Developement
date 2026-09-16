import React, { useState, useEffect } from 'react';
import { getSiteSettings, updateSiteSettings } from '../../firebase/firestore';

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    companyName: 'Monolith Atelier & Build',
    phone: '+41 44 210 00 12',
    whatsapp: '41442100012',
    email: 'contact@monolith.ch',
    address: 'Bahnhofstrasse 42, 8001 Zürich, CH',
    tagline: 'We Build What Lasts.',
    projectsCompleted: '25+',
    yearsExperience: '10+',
    happyClients: '50+'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const data = await getSiteSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      alert("Settings saved successfully.");
    } catch (error) {
      console.error("Error saving settings", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-outline font-label-caps uppercase tracking-widest animate-pulse">Loading Settings...</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary">Site Settings</h1>
        <p className="font-body-md text-on-surface-variant mt-2">Manage global contact information and public metrics.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-surface border border-outline-variant/40 p-8 shadow-sm">
        
        {/* Core Info */}
        <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4 mb-2">
          <span className="w-6 h-px bg-secondary"></span>
          <h2 className="font-label-caps text-label-caps uppercase tracking-widest text-primary">Identity & Contact</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              required type="text" name="companyName" id="companyName" value={settings.companyName} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Company Name" 
            />
            <label htmlFor="companyName" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Company Name *</label>
          </div>
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              required type="text" name="tagline" id="tagline" value={settings.tagline} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Tagline" 
            />
            <label htmlFor="tagline" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Hero Tagline *</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              required type="text" name="phone" id="phone" value={settings.phone} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Phone" 
            />
            <label htmlFor="phone" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Phone (Display) *</label>
          </div>
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              required type="text" name="whatsapp" id="whatsapp" value={settings.whatsapp} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="WhatsApp" 
            />
            <label htmlFor="whatsapp" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">WhatsApp (Number only) *</label>
          </div>
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              required type="email" name="email" id="email" value={settings.email} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Email" 
            />
            <label htmlFor="email" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Email Address *</label>
          </div>
        </div>

        <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
          <input 
            required type="text" name="address" id="address" value={settings.address} onChange={handleChange}
            className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Address" 
          />
          <label htmlFor="address" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">HQ Address *</label>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4 mt-8 mb-2">
          <span className="w-6 h-px bg-secondary"></span>
          <h2 className="font-label-caps text-label-caps uppercase tracking-widest text-primary">Public Metrics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              required type="text" name="projectsCompleted" id="projectsCompleted" value={settings.projectsCompleted} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Projects" 
            />
            <label htmlFor="projectsCompleted" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Projects Completed *</label>
          </div>
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              required type="text" name="yearsExperience" id="yearsExperience" value={settings.yearsExperience} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Years" 
            />
            <label htmlFor="yearsExperience" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Years Experience *</label>
          </div>
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              required type="text" name="happyClients" id="happyClients" value={settings.happyClients} onChange={handleChange}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Clients" 
            />
            <label htmlFor="happyClients" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Happy Patrons *</label>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="px-8 py-4 bg-primary text-surface hover:bg-secondary hover:text-primary transition-colors font-label-caps text-label-caps uppercase tracking-widest disabled:opacity-50 flex items-center gap-2 shadow-md"
          >
            {saving ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : <span className="material-symbols-outlined text-[18px]">save</span>}
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SiteSettings;
