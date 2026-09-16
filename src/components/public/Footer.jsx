import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WhatsAppIcon from './WhatsAppIcon';
import { getSiteSettings } from '../../firebase/firestore';

const Footer = () => {
  const [settings, setSettings] = useState({
    companyName: 'Monolith',
    phone: '+41 44 210 00 12',
    email: 'contact@monolith.ch',
    address: 'Bahnhofstrasse 42, 8001 Zürich, CH'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const s = await getSiteSettings();
      if (s) setSettings(s);
    };
    fetchSettings();
  }, []);

  return (
    <>
      {/* ASIDE & MOBILE NAV */}
      <aside className="fixed bottom-24 md:bottom-8 right-6 md:right-10 z-40 flex items-center group">
        <div className="hidden md:flex items-center mr-3 px-3 py-1.5 bg-[#25D366] text-surface shadow-sm font-label-caps text-label-caps uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Direct Architect Desk</div>
        <a aria-label="Open WhatsApp Consultation" className="relative w-14 h-14 bg-[#25D366] text-surface shadow-[0_8px_32px_rgba(37,211,102,0.3)] flex items-center justify-center hover:bg-[#128C7E] transition-colors" href="https://wa.me/41442100012" rel="noopener noreferrer" target="_blank">
          <span className="absolute top-0 right-0 flex h-3 w-3 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-surface opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-surface border-2 border-[#25D366]"></span>
          </span>
          <WhatsAppIcon className="w-7 h-7 text-surface" />
        </a>
      </aside>

      <nav className="fixed md:hidden bottom-0 left-0 w-full z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 grid grid-cols-3 h-16">
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary gap-1" href="tel:+41442100012">
          <span className="material-symbols-outlined text-[20px]">call</span>
          <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-[9px]">Call</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#25D366] hover:text-[#128C7E] gap-1 bg-surface-container-low" href="https://wa.me/41442100012" rel="noopener noreferrer" target="_blank">
          <WhatsAppIcon className="w-5 h-5" />
          <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-[9px]">WhatsApp</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-primary text-surface hover:bg-secondary hover:text-primary gap-1" href="/#contact">
          <span className="material-symbols-outlined text-[20px]">edit_note</span>
          <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-[9px]">Enquire</span>
        </a>
      </nav>

      {/* FOOTER */}
      <footer className="w-full bg-primary text-surface pt-space-2xl pb-space-lg mb-16 md:mb-0">
        <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-desktop mb-space-xl pb-space-xl border-b border-surface/20">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <img alt="Monolith Architecture & Build Logo" className="h-8 w-auto object-contain brightness-200 invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe5AYFHbM5gZlQiaXjNgyQrugej9B6JVkQfej4yD54U4Cvd_bFRhnSUcI_YcWS_31Pa6J2UjsAgTInY0LxrZsp3GMDOj7NX1OFjd7kktmwltExp7NKlSNPOtOcVj9V7eI3mJgVzYmhyl8yxZrx2_idbJhL-JY4FKHtCd1uTUcW3oya-qzALgtoHLoCjETu1nR9hTwdp5WemgoXaqkZqDMeop-DEml-BovxK0EH7kvvAw4U71YnD1Wj"/>
                <span className="font-headline-sm text-headline-sm uppercase tracking-wider text-surface">{settings.companyName}</span>
              </div>
              <p className="font-body-md text-body-md text-surface/70 max-w-sm">Crafting tectonic permanence and bespoke luxury architecture. We engineer living spaces with monumental clarity, mineral honesty, and precision craftsmanship.</p>
              <div className="flex items-center gap-4 text-surface/70 pt-2">
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">RIBA Chartered</span>
                <span className="font-label-caps text-label-caps text-surface/30">/</span>
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">SIA Registered</span>
                <span className="font-label-caps text-label-caps text-surface/30">/</span>
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">AIA Global</span>
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex flex-col gap-3">
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">Zurich Studio</span>
                <p className="font-body-sm text-body-sm text-surface/70 leading-relaxed">{settings.address}<br/>{settings.phone}</p>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">Milan Studio</span>
                <p className="font-body-sm text-body-sm text-surface/70 leading-relaxed">Via Montenapoleone 18<br/>20121 Milano, IT<br/>+39 02 873 990</p>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">New York Studio</span>
                <p className="font-body-sm text-body-sm text-surface/70 leading-relaxed">532 West 26th St<br/>Chelsea, NY 10001, US<br/>+1 212 940 3200</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-surface/50">
            <p className="font-body-sm text-body-sm">© {new Date().getFullYear()} Monolith Architecture & Construction Group AG. All rights reserved.</p>
            <div className="flex items-center gap-6 font-label-caps text-label-caps uppercase">
              <Link className="hover:text-surface transition-colors" to="/privacy">Privacy Manifesto</Link>
              <Link className="hover:text-surface transition-colors" to="/terms">Terms of Commission</Link>
              <Link className="hover:text-surface transition-colors" to="/admin/login">Architectural Registry (Admin)</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
