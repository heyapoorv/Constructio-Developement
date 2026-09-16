import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-primary-container text-surface shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-transparent' : 'bg-surface/80 backdrop-blur-xl border-outline-variant/20'}`} 
      id="monolith-nav"
    >
      <div className="h-20 w-full px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-3 group" to="/">
            <img alt="Monolith Architecture & Build Logo" className={`h-8 w-auto object-contain ${isScrolled ? 'brightness-200 invert' : ''}`} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe5AYFHbM5gZlQiaXjNgyQrugej9B6JVkQfej4yD54U4Cvd_bFRhnSUcI_YcWS_31Pa6J2UjsAgTInY0LxrZsp3GMDOj7NX1OFjd7kktmwltExp7NKlSNPOtOcVj9V7eI3mJgVzYmhyl8yxZrx2_idbJhL-JY4FKHtCd1uTUcW3oya-qzALgtoHLoCjETu1nR9hTwdp5WemgoXaqkZqDMeop-DEml-BovxK0EH7kvvAw4U71YnD1Wj" />
            <div className="flex flex-col">
              <span className={`font-headline-sm text-headline-sm uppercase tracking-wider ${isScrolled ? 'text-surface' : 'text-primary'}`}>Monolith</span>
              <span className="font-label-caps text-label-caps uppercase text-outline tracking-[0.2em]">Atelier & Build</span>
            </div>
          </Link>
        </div>
        <nav className="hidden xl:flex items-center gap-8">
          <Link aria-current="page" className="font-label-caps uppercase tracking-[0.18em] transition-colors py-1 text-secondary border-b border-secondary" to="/">Home</Link>
          <a className={`font-label-caps text-label-caps uppercase tracking-[0.18em] transition-colors py-1 ${isScrolled ? 'text-surface/70 hover:text-surface' : 'text-on-surface-variant hover:text-primary'}`} href="/#about">About</a>
          <a className={`font-label-caps text-label-caps uppercase tracking-[0.18em] transition-colors py-1 ${isScrolled ? 'text-surface/70 hover:text-surface' : 'text-on-surface-variant hover:text-primary'}`} href="/#projects">Projects</a>
          <a className={`font-label-caps text-label-caps uppercase tracking-[0.18em] transition-colors py-1 ${isScrolled ? 'text-surface/70 hover:text-surface' : 'text-on-surface-variant hover:text-primary'}`} href="/#services">Services</a>
          <a className={`font-label-caps text-label-caps uppercase tracking-[0.18em] transition-colors py-1 ${isScrolled ? 'text-surface/70 hover:text-surface' : 'text-on-surface-variant hover:text-primary'}`} href="/#process">Process</a>
          <a className={`font-label-caps text-label-caps uppercase tracking-[0.18em] transition-colors py-1 ${isScrolled ? 'text-surface/70 hover:text-surface' : 'text-on-surface-variant hover:text-primary'}`} href="/#contact">Contact</a>
        </nav>
        <div className="flex items-center gap-6">
          <a className="hidden md:inline-flex items-center justify-center px-8 py-3.5 bg-primary text-surface hover:bg-secondary hover:text-primary font-label-caps text-label-caps uppercase tracking-[0.18em] transition-colors duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)]" href="/#contact">Start Project</a>
          <button onClick={() => setIsMobileMenuOpen(true)} className={`w-8 h-8 flex items-center justify-center border xl:hidden transition-colors ${isScrolled ? 'border-surface/20 hover:text-secondary text-surface' : 'border-outline/20 hover:text-secondary text-primary'}`}>
            <span className="material-symbols-outlined text-[18px]">menu</span>
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY MENU */}
      <div className={`fixed inset-0 z-50 bg-surface flex flex-col transition-transform duration-500 ease-in-out xl:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-20 w-full px-margin md:px-margin-tablet flex items-center justify-between border-b border-outline-variant/20">
          <Link className="flex items-center gap-3" to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img alt="Monolith Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe5AYFHbM5gZlQiaXjNgyQrugej9B6JVkQfej4yD54U4Cvd_bFRhnSUcI_YcWS_31Pa6J2UjsAgTInY0LxrZsp3GMDOj7NX1OFjd7kktmwltExp7NKlSNPOtOcVj9V7eI3mJgVzYmhyl8yxZrx2_idbJhL-JY4FKHtCd1uTUcW3oya-qzALgtoHLoCjETu1nR9hTwdp5WemgoXaqkZqDMeop-DEml-BovxK0EH7kvvAw4U71YnD1Wj" />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm uppercase tracking-wider text-primary">Monolith</span>
            </div>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center text-primary hover:text-secondary">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-margin py-8 flex flex-col gap-6">
          <Link className="font-headline-sm text-headline-sm text-primary uppercase tracking-widest border-b border-outline-variant/20 pb-4 hover:text-secondary transition-colors" to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <a className="font-headline-sm text-headline-sm text-primary uppercase tracking-widest border-b border-outline-variant/20 pb-4 hover:text-secondary transition-colors" href="/#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
          <a className="font-headline-sm text-headline-sm text-primary uppercase tracking-widest border-b border-outline-variant/20 pb-4 hover:text-secondary transition-colors" href="/#projects" onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
          <a className="font-headline-sm text-headline-sm text-primary uppercase tracking-widest border-b border-outline-variant/20 pb-4 hover:text-secondary transition-colors" href="/#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
          <a className="font-headline-sm text-headline-sm text-primary uppercase tracking-widest border-b border-outline-variant/20 pb-4 hover:text-secondary transition-colors" href="/#process" onClick={() => setIsMobileMenuOpen(false)}>Process</a>
          <a className="font-headline-sm text-headline-sm text-primary uppercase tracking-widest border-b border-outline-variant/20 pb-4 hover:text-secondary transition-colors" href="/#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
          
          <a className="mt-8 inline-flex items-center justify-center px-8 py-4 bg-primary text-surface font-label-caps uppercase tracking-[0.18em] hover:bg-secondary hover:text-primary transition-colors shadow-md" href="/#contact" onClick={() => setIsMobileMenuOpen(false)}>Start Project</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
