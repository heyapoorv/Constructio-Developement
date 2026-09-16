import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';
import WhatsAppIcon from '../../components/public/WhatsAppIcon';
import { getPublishedProjects, getPublishedTestimonials, getSiteSettings, createEnquiry } from '../../firebase/firestore';

const processData = {
  1: {
    badge: 'Step 01 • Discovery & Feasibility',
    title: 'Initial Consultation & Geological Land Audit',
    desc: 'We conduct rigorous on-site topographical analysis, municipal code review, and patron requirement mapping. Every project begins with an unsparing evaluation of solar orientation, wind loads, and subsurface rock stability.',
    deliv: 'Geotechnical Dossier, Zoning Memorandum & Vision Manifesto',
    lead: 'Founding Partner & Principal Architect (2 Weeks)'
  },
  2: {
    badge: 'Step 02 • Conceptual & Structural Design',
    title: 'BIM Spatial Sculpting & Engineering Blueprint',
    desc: 'Architectural volumes are brought to life through Level-300 BIM modeling and virtual stress simulation. Structural cantilevers, solar path shading, and mechanical routing are unified before site work.',
    deliv: 'Architectural Blueprint Set, 3D Renderings & Engineering Calculation Pack',
    lead: 'Design Principal & Lead Structural Engineer (6 Weeks)'
  },
  3: {
    badge: 'Step 03 • Budget & Contracting',
    title: 'Guaranteed Maximum Price (GMP) & Cost Estimation',
    desc: 'Line-by-line open-book procurement breakdown. Materials are locked directly with stone quarries and steel fabricators to fix costs and establish complete patron fiscal certainty.',
    deliv: 'Binding Turnkey GMP Contract & CPM Master Schedule',
    lead: 'Chief Estimator & Commercial Director (3 Weeks)'
  },
  4: {
    badge: 'Step 04 • Construction & Craftsmanship',
    title: 'Groundbreak, Heavy Civil & Tectonic Execution',
    desc: 'Full-time master superintendent governance on-site. Daily telemetry updates, drone point-cloud tracking, and uncompromised craftsmanship on architectural concrete pours.',
    deliv: 'Subterranean Excavation, Superstructure & Weather-Tight Enclosure',
    lead: 'Senior General Superintendent (12-18 Months)'
  },
  5: {
    badge: 'Step 05 • Rigorous Quality Inspection',
    title: 'Zero-Defect Stress & Thermal Commissioning',
    desc: 'Laser LiDAR scanning validates that finished walls match digital CAD blueprints within 1mm. Pressurized blower-door tests verify thermal hermetic seal and acoustic dampening.',
    deliv: 'Certificate of Structural Tolerance & Acoustics Report',
    lead: 'Independent Quality Inspector & Engineering Auditor (3 Weeks)'
  },
  6: {
    badge: 'Step 06 • Final Handover & Stewardship',
    title: 'Key Delivery & Lifetime Archival Dossier',
    desc: 'Complete owner walkthrough, digital smart building calibration, and presentation of the physical bound leather project monograph with all warranties and subcontractor archives.',
    deliv: 'Patron Key Handover, As-Built BIM Archive & 10-Year Guarantee',
    lead: 'Managing Partner & Concierge Lead'
  }
};

const journeyPhases = [
  {
    tag: 'PHASE 01 // COMPUTATIONAL DESIGN',
    name: 'Parametric Solar & Tectonic Sculpting',
    desc: 'Before a single blade touches soil, the architectural volume is computationally modeled against 50 years of seasonal solar tracking and thermal dissipation. Laser LiDAR surveys establish exact rock formations for integrated foundations.',
    b1: '3D Ground Penetrating Radar terrain scan',
    b2: 'Microclimatic wind tunnel simulations',
    b3: 'Patron interactive VR spatial walkthrough',
    s1: '0.1 mm',
    s2: '6-8 Weeks'
  },
  {
    tag: 'PHASE 02 // SUBTERRANEAN FOUNDATION',
    name: 'Bedrock Anchoring & Civil Foundation',
    desc: 'Excavation to primordial rock. High-tensile steel rock anchors are grouted 12 meters into the earth, followed by continuous waterproof tanking concrete pours with embedded thermal break insulation.',
    b1: 'Micro-pile tie-backs into bedrock',
    b2: 'C35/45 waterproof hydro-structural concrete',
    b3: 'Earthquake damping seismic isolation pads',
    s1: '0.0 mm Defect',
    s2: '10-14 Weeks'
  },
  {
    tag: 'PHASE 03 // STRUCTURAL SUPERSTRUCTURE',
    name: 'Board-Formed Concrete & Steel Cantilevers',
    desc: 'Formwork crafted from planed alpine larch leaves its grain permanently etched into the concrete skin. Heavy structural steel beams are positioned via precision crane rigs under continuous laser alignment.',
    b1: 'Custom larch-plank board-formed concrete finishes',
    b2: 'Post-tensioned 12m suspended cantilever slabs',
    b3: 'Flush acoustic floor slab isolation layers',
    s1: '100% Load-Rated',
    s2: '20-28 Weeks'
  },
  {
    tag: 'PHASE 04 // ENVELOPE & INTERIOR VOLUMES',
    name: 'Curtain Glazing, Travertine & Joinery',
    desc: 'Installation of Swiss triple-pane motorized sliding glass profiles with zero-threshold tracks. Interior surfaces are dressed in bookmatched travertine and hand-troweled lime plasters.',
    b1: 'Sub-millimeter zero-threshold thermal glass doors',
    b2: 'Hand-troweled Venetian mineral lime plaster',
    b3: 'Concealed shadow gaps and recessed linear HVAC',
    s1: 'Passivhaus Tier',
    s2: '16-20 Weeks'
  },
  {
    tag: 'PHASE 05 // COMPLETION & HANDOVER',
    name: 'Tectonic Permanence & Commissioning',
    desc: 'Lighting scenes calibrated to natural dusk warmth. Water reflection pools filled and balanced. The client takes possession of an unrepeatable work of architectural art designed to stand for centuries.',
    b1: 'Complete mechanical and smart-home calibration',
    b2: 'Landscape integration and local flora re-wilding',
    b3: 'Delivery of bound monograph & archival blueprints',
    s1: '10-Year Warranty',
    s2: 'Final Delivery'
  }
];

const faqs = [
  { q: 'How do I start an architecture project with Monolith?', a: 'Contact our architectural desk directly via WhatsApp or submit a formal enquiry via our contact portal. A founding partner will schedule a preliminary site visit and feasibility consultation.' },
  { q: 'Do you provide turnkey construction and fixed-price contracts?', a: 'Yes. We offer Guaranteed Maximum Price (GMP) contracts upon completion of Level-300 BIM planning, securing all structural and material costs before excavation.' },
  { q: 'What types and scales of project do you handle?', a: 'We specialize in ultra-prime residential villas, boutique commercial headquarters, and historically significant seismic retrofits. We do not accept high-volume multi-family developments.' },
  { q: 'How is project cost and contingency estimated?', a: 'We utilize open-book sub-contractor bidding and direct quarry sourcing. Contingencies are held transparently and returned to the patron if unspent.' },
  { q: 'How long does a luxury residential build typically take?', a: 'Depending on subterranean complexity and scale, architectural planning requires 3-6 months, while tectonic construction spans 12-24 months.' },
  { q: 'Do you provide on-site consultations and feasibility studies?', a: 'Yes. Every commission begins with an unsparing geological, zoning, and solar feasibility audit conducted on the project site.' }
];

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({
    companyName: 'Monolith',
    tagline: 'We Build What Lasts.',
    projectsCompleted: '25+',
    yearsExperience: '10+',
    happyClients: '50+',
    whatsapp: '41442100012'
  });

  const [activeProjectFilter, setActiveProjectFilter] = useState('all');
  const [activeProcessStep, setActiveProcessStep] = useState(1);
  const [journeyPhase, setJourneyPhase] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [p, t, s] = await Promise.all([
        getPublishedProjects(),
        getPublishedTestimonials(),
        getSiteSettings()
      ]);
      setProjects(p);
      setTestimonials(t);
      if (s) setSettings(s);
    };
    fetchData();
  }, []);

  const selectProcessStep = (step) => setActiveProcessStep(step);
  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? null : index);
  
  const currentProcess = processData[activeProcessStep];
  const currentPhase = journeyPhases[journeyPhase];

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      projectType: form.type.value,
      budget: form.budget.value,
      message: form.message.value,
    };

    try {
      await createEnquiry(data);
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        form.reset();
      }, 5000);
    } catch (error) {
      console.error("Error submitting", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="w-full pt-20 bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          
          {/* 1. HERO SECTION */}
          <section className="relative w-full min-h-[92vh] flex flex-col justify-between -mt-20 pt-24 pb-12 overflow-hidden bg-primary-container text-surface">
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 ease-out scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDyAKK8baBpQbAQrEnY7_tGu59RcKw5fUu19vlP7RxJ9AcY45sl4qyidQvKHxcIjher6xaK3ow_VJQ9f-QZQyWbwo8Tu2zXMkPMDSQzq0hDXMAQVMk0Uo9EDY7J3VxcrOAX69dSkJ5GMHeJZeifxWGX4uMItWcQZlpGiahFxVuvCpQsPhav8iHZNW4ODA7zM0plEE0l4jxGyNvGFOkSS3jIlrp9rwlw-5PTB15ab3n1Klz0DT14pZbm')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/40 to-primary-container/60"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-container/70 via-transparent to-primary-container/40"></div>
            </div>
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop relative z-10 pt-8">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-surface/10 backdrop-blur-md border border-surface/20 text-surface text-label-caps font-label-caps uppercase tracking-[0.18em]">
                <span className="w-2 h-2 bg-secondary animate-pulse"></span>
                EST. 2014 — Architecture & General Contracting
              </div>
            </div>
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop relative z-10 my-auto py-12">
              <div className="max-w-4xl flex flex-col gap-6">
                <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero uppercase text-surface drop-shadow-sm">
                  {settings.tagline.split('.')[0]}. <br/><span className="italic font-light text-secondary">{settings.tagline.split('.')[1] || ''}.</span>
                </h1>
                <p className="font-body-lg text-body-lg md:text-headline-sm max-w-2xl text-surface/90 font-light">
                  From vision to structure, we create spaces built with precision, quality, and enduring architectural integrity.
                </p>
                <div className="flex flex-wrap items-center gap-5 pt-4">
                  <a className="group inline-flex items-center gap-3 px-8 py-4 bg-surface text-primary hover:bg-secondary hover:text-primary transition-all duration-300 font-label-caps text-label-caps uppercase tracking-[0.18em] shadow-xl" href="#projects">
                    <span>Explore Projects</span>
                    <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1.5">arrow_forward</span>
                  </a>
                  <a className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-surface/40 hover:border-secondary hover:text-secondary text-surface font-label-caps text-label-caps uppercase tracking-[0.18em] transition-colors duration-300 backdrop-blur-sm" href="#contact">
                    Start Your Project
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-t border-surface/20 pt-6">
              <div className="flex items-center gap-4 text-surface/80 font-label-caps text-label-caps uppercase tracking-[0.18em]">
                <span>Headquartered in Zurich & New York</span>
                <span className="text-surface/30">•</span>
                <span className="text-secondary">14 Global Honors</span>
              </div>
              <div className="flex items-center gap-4 text-surface/70">
                <span className="font-label-caps text-label-caps uppercase tracking-[0.18em]">Tectonic Dossier</span>
                <div className="w-24 h-px bg-surface/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-secondary -translate-x-full animate-[shimmer_2.5s_infinite]"></div>
                </div>
                <span className="font-label-caps text-label-caps uppercase tracking-[0.18em]">2025 Ed.</span>
              </div>
            </div>
          </section>

          {/* 2. TRUST / STATS STRIP */}
          <section className="w-full bg-surface border-b border-outline-variant/30 py-12">
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                <div className="flex flex-col gap-1 border-l border-outline/30 pl-6">
                  <span className="font-headline-xl text-headline-xl text-primary font-normal tracking-tight">{settings.projectsCompleted}</span>
                  <span className="font-headline-sm text-headline-sm text-primary">Projects Completed</span>
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-[0.18em] mt-1">Flawless On-Site Delivery</span>
                </div>
                <div className="flex flex-col gap-1 border-l border-outline/30 pl-6">
                  <span className="font-headline-xl text-headline-xl text-secondary font-normal tracking-tight">{settings.yearsExperience}</span>
                  <span className="font-headline-sm text-headline-sm text-primary">Years Experience</span>
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-[0.18em] mt-1">Swiss & International Standards</span>
                </div>
                <div className="flex flex-col gap-1 border-l border-outline/30 pl-6">
                  <span className="font-headline-xl text-headline-xl text-primary font-normal tracking-tight">{settings.happyClients}</span>
                  <span className="font-headline-sm text-headline-sm text-primary">Patrons & Clients</span>
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-[0.18em] mt-1">Institutional & Private Estates</span>
                </div>
                <div className="flex flex-col gap-1 border-l border-outline/30 pl-6">
                  <span className="font-headline-xl text-headline-xl text-secondary font-normal tracking-tight">100%</span>
                  <span className="font-headline-sm text-headline-sm text-primary">Commitment to Quality</span>
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-[0.18em] mt-1">Zero-Compromise Engineering</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. ABOUT SECTION */}
          <section id="about" className="w-full py-space-xl lg:py-space-2xl bg-surface-container-low border-b border-outline-variant/30">
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter-desktop items-center">
                <div className="lg:col-span-6 relative">
                  <div className="relative overflow-hidden bg-surface-container aspect-[4/3] border border-outline-variant/30">
                    <img alt="Architect and construction superintendent" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH_cVg9meCoow1VP0ao6jvqyEmlhKBgtC38zq39N5F5NoMFMBNMaN1C4usyB5YR8QEWk13Q6Qh5NirGuroo3E4t1TMX2Mw2iQ_fudZ24gN0WYhOM2sScgJPx8MP5bLfdU4npNym0_04ZSa3cgwP85Ybyam4qKcJQ9WgLtRCrvZNhzq1WNxCAZMLHw6iVFyk7_lfpLntML5tgSREbQ1kizZeZWD-VmqDyktoT0HqPoI64EAtlmAgX7H"/>
                  </div>
                  <div className="absolute -bottom-6 -right-4 md:right-8 bg-surface border border-outline-variant/40 p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] max-w-xs backdrop-blur-md">
                    <div className="flex items-center gap-2 text-secondary mb-2">
                      <span className="material-symbols-outlined text-[20px]">verified</span>
                      <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] font-semibold">Tectonic Tolerance</span>
                    </div>
                    <p className="font-headline-lg text-headline-lg font-normal text-primary leading-none">0.00%</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Structural defect tolerance rating across 1.4M total constructed square meters.</p>
                  </div>
                </div>
                <div className="lg:col-span-6 flex flex-col gap-6 lg:pl-6">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-px bg-secondary"></span>
                    <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-secondary font-semibold">Who We Are</span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-normal leading-tight">
                    Building with purpose.<br/>
                    <span className="italic font-light">Delivering with precision.</span>
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant font-light">
                    At Monolith, we dismantle the traditional friction between conceptual architecture and master contracting. Founded in Zurich with studios expanding to New York, our practice unites visionary architects, structural civil engineers, and master artisans into a single unyielding execution engine.
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Every foundation we lay and every cantilevered beam we hoist is subjected to extreme geological stress analysis and hyper-accurate cost transparency. We deliver permanent landmarks that honor natural topography, utilizing exposed architectural board-formed concrete, thermal-broken structural steel, and reclaimed alpine stone.
                  </p>
                  <div className="pt-4 flex items-center gap-8">
                    <a className="inline-flex items-center gap-3 font-label-caps text-label-caps uppercase tracking-[0.18em] text-primary hover:text-secondary group transition-colors" href="#process">
                      <span>Discover Our Story</span>
                      <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-2">east</span>
                    </a>
                    <div className="h-6 w-px bg-outline-variant"></div>
                    <span className="font-label-caps text-label-caps text-outline uppercase tracking-[0.18em]">CH-CHE-249.190.11</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. SELECTED PROJECTS */}
          <section className="w-full py-space-xl lg:py-space-2xl bg-surface border-b border-outline-variant/30" id="projects">
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-px bg-secondary"></span>
                    <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-secondary font-semibold">Portfolio Showcase</span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary">Selected Projects</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">A glimpse into the monumental spaces we have brought to life across continents.</p>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  {['all', 'residential', 'commercial', 'renovation', 'civil'].map(filter => (
                    <button key={filter} className={`px-4 py-2 border font-label-caps text-label-caps uppercase tracking-[0.18em] transition-all duration-300 ${activeProjectFilter === filter ? 'bg-primary text-surface border-primary' : 'bg-transparent text-primary border-outline-variant/50 hover:border-primary'}`} onClick={() => setActiveProjectFilter(filter)}>
                      {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {projects.filter(p => activeProjectFilter === 'all' || p.category === activeProjectFilter).map((project, i) => (
                  <Link to={`/projects/${project.id}`} key={project.id} className={`${i % 3 === 0 ? 'md:col-span-8' : 'md:col-span-4'} group relative overflow-hidden bg-primary cursor-pointer border border-outline-variant/20 block`}>
                    <div className={`w-full overflow-hidden relative ${i % 3 === 0 ? 'aspect-[16/10]' : 'aspect-[4/5] md:aspect-auto md:h-full'}`}>
                      <div className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]" style={{ backgroundImage: `url('${project.coverImage || ''}')` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                      {project.year && <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md px-3 py-1 text-label-caps font-label-caps uppercase tracking-[0.18em] text-primary border border-outline-variant/30">{project.year}</div>}
                      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end text-surface">
                        <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-secondary mb-1">{project.category} • {project.location}</span>
                        <div className="flex items-center justify-between">
                          <h3 className="font-headline-lg text-headline-md md:text-headline-lg text-surface group-hover:text-secondary transition-colors">{project.title}</h3>
                          <span className="material-symbols-outlined text-3xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">arrow_forward</span>
                        </div>
                        {project.description && <p className="font-body-sm text-body-sm text-surface/80 mt-2 line-clamp-1">{project.description}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* 5. SERVICES */}
          <section id="services" className="w-full py-space-xl lg:py-space-2xl bg-surface-container-low border-b border-outline-variant/30">
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="max-w-3xl mb-16">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-px bg-secondary"></span>
                  <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-secondary font-semibold">Tectonic Capabilities</span>
                </div>
                <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary">What We Build</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant font-light mt-4">
                  Integrated architectural design, precision engineering, and turnkey general contracting. We govern the complete lifecycle from municipal entitlement to key handover.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { id: '01', icon: 'villa', title: 'Residential Construction', desc: 'Ultra-prime custom single-family residences, alpine estates, and seaside compounds engineered with uncompromising mineral purity.', footer: 'Cantilever & Monolith' },
                  { id: '02', icon: 'apartment', title: 'Commercial Construction', desc: 'Boutique corporate headquarters, art foundations, and flagship showrooms engineered for acoustic silence, spatial authority, and permanence.', footer: 'Institutional Grade' },
                  { id: '03', icon: 'history_edu', title: 'Renovation & Remodeling', desc: 'Surgical historic preservation, structural seismic retrofits, and radical interior transformations honoring ancestral geometry.', footer: 'Heritage Protection' },
                  { id: '04', icon: 'architecture', title: 'Civil & Structural Work', desc: 'Subterranean rock anchoring, retaining walls, post-tensioned architectural concrete, and complex seismic cantilevered engineering.', footer: 'Geotechnical Rigor' },
                  { id: '05', icon: 'vpn_key', title: 'Turnkey Projects', desc: 'Guaranteed maximum price (GMP) design-build engagements with singular liability, bespoke millwork, and full custom procurement.', footer: 'Guaranteed Cost' },
                  { id: '06', icon: 'contract', title: 'Planning & Execution', desc: 'Level-300 BIM clash detection, automated trade scheduling, full municipal zoning variances, and daily on-site architectural oversight.', footer: 'BIM / Daily Superintending' }
                ].map((service) => (
                  <div key={service.id} className="group p-8 bg-surface border border-outline-variant/40 hover:border-primary transition-all duration-300 flex flex-col justify-between relative shadow-sm">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between text-outline">
                        <span className="font-headline-sm text-headline-sm font-light text-outline">{service.id}</span>
                        <span className="material-symbols-outlined text-2xl text-secondary">{service.icon}</span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-primary">{service.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{service.desc}</p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-outline-variant/40 flex items-center justify-between font-label-caps text-label-caps uppercase tracking-[0.18em] text-primary group-hover:text-secondary transition-colors">
                      <span>{service.footer}</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. CONSTRUCTION PROCESS */}
          <section className="w-full py-space-xl lg:py-space-2xl bg-surface border-b border-outline-variant/30" id="process">
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="max-w-3xl mb-12">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-px bg-secondary"></span>
                  <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-secondary font-semibold">Tectonic Discipline</span>
                </div>
                <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary">From Blueprint to Reality</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Our six-stage sequential project roadmap ensures complete financial predictability and zero structural discrepancy.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-6 gap-0 border-b border-outline-variant/30 mb-10">
                {[
                  { step: 1, label: 'Stage 01', title: 'Consultation' },
                  { step: 2, label: 'Stage 02', title: 'Planning' },
                  { step: 3, label: 'Stage 03', title: 'Estimation' },
                  { step: 4, label: 'Stage 04', title: 'Construction' },
                  { step: 5, label: 'Stage 05', title: 'Quality Insp.' },
                  { step: 6, label: 'Stage 06', title: 'Handover' }
                ].map((s) => (
                  <button key={s.step} onClick={() => selectProcessStep(s.step)} className={`text-left py-4 px-2 border-b-2 transition-all duration-300 ${activeProcessStep === s.step ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-primary hover:border-outline-variant'}`} type="button">
                    <span className={`font-label-caps text-label-caps block uppercase font-semibold ${activeProcessStep === s.step ? 'text-secondary' : 'text-outline'}`}>{s.label}</span>
                    <span className="font-headline-sm text-sm md:text-headline-sm font-normal mt-1 block">{s.title}</span>
                  </button>
                ))}
              </div>
              
              <div className="bg-surface border border-outline-variant/40 p-8 md:p-12 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <span className="inline-block w-fit px-3 py-1 border border-outline-variant/50 bg-surface-container-low font-label-caps text-label-caps uppercase tracking-[0.18em] text-primary">
                      {currentProcess.badge}
                    </span>
                    <h3 className="font-headline-lg text-headline-lg text-primary font-normal">
                      {currentProcess.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {currentProcess.desc}
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/30">
                      <div>
                        <span className="font-label-caps text-label-caps uppercase text-outline">Key Deliverables</span>
                        <p className="font-body-sm text-body-sm font-medium text-primary mt-1">{currentProcess.deliv}</p>
                      </div>
                      <div>
                        <span className="font-label-caps text-label-caps uppercase text-outline">Lead Superintendent</span>
                        <p className="font-body-sm text-body-sm font-medium text-primary mt-1">{currentProcess.lead}</p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5 bg-surface-container aspect-[4/3] relative overflow-hidden border border-outline-variant/20">
                    <div className="w-full h-full bg-cover bg-center transition-all duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDEVpV0-OQ6Aw_9qIoB7Hqh6rLGjYYOoWMpUQ94MHCUgPj50wREl6lGeMz3bsn_efHiuY4zV8S0-K1rAp_nX23sXIwBW2TFhe7MeVLIccjjTdsp9Lc2KKRGwsSKOYeyE5w3gpuQcxZYyQ5sqEvUN9_zFEmiSgwiWbUSrztOQYK-VKgTxLUJaGTy9uhf-s_9HwA9s7Xz_vIsGCX2GuM3SdxG0vpw-6mQT79QSlhHpidzEvrgFkWHr-0x')" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. WHY CHOOSE US */}
          <section className="w-full py-space-xl lg:py-space-2xl bg-primary text-surface">
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-px bg-secondary"></span>
                    <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-secondary font-semibold">Tectonic Supremacy</span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-surface">Built on Trust.<br/><span className="italic font-light text-secondary">Defined by Quality.</span></h2>
                </div>
                <p className="font-body-md text-body-md text-surface/70 max-w-md">
                  In an industry burdened by delays and subcontracted compromises, Monolith operates with absolute discipline, single-source accountability, and Swiss precision.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-outline-variant/20">
                {[
                  { icon: 'diamond', title: 'Quality Materials', desc: 'Direct quarry extraction rights for Valser quartzite, bespoke bronze extrusions, and certified low-carbon architectural concrete batches tested per pour.' },
                  { icon: 'engineering', title: 'Experienced Master Team', desc: 'Chartered RIBA and SIA architects paired on-site with veterans holding 20+ years of heavy civil and luxury residential project execution.' },
                  { icon: 'visibility', title: 'Transparent Process', desc: 'Patrons receive 24/7 access to our cloud construction ledger, on-site live telemetry cams, and itemized sub-contractor open-book billing.' },
                  { icon: 'schedule', title: 'Timely Delivery Guarantee', desc: 'Strict critical-path CPM scheduling with liquidated damage covenants backing every milestone schedule we formally present.' },
                  { icon: 'straighten', title: 'Millimeter Attention', desc: 'Shadow gaps, flush baseboards, and concealed MEP systems crafted with hairline joint alignments to deliver serene architectural silence.' },
                  { icon: 'handshake', title: 'Client-First Approach', desc: 'A boutique maximum of four major active builds annually guarantees direct weekly involvement of the studio founding partners.' }
                ].map((feature, i) => (
                  <div key={i} className="p-8 border border-outline-variant/20 bg-primary-container hover:bg-primary-container/80 transition-colors flex flex-col gap-4">
                    <span className="material-symbols-outlined text-3xl text-secondary">{feature.icon}</span>
                    <h3 className="font-headline-md text-headline-sm text-surface">{feature.title}</h3>
                    <p className="font-body-md text-body-md text-surface/70 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 8. CONSTRUCTION JOURNEY */}
          <section className="w-full py-space-xl lg:py-space-2xl bg-surface-container-low border-b border-outline-variant/30">
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="max-w-3xl mb-12">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-px bg-secondary"></span>
                  <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-secondary font-semibold">Tectonic Metamorphosis</span>
                </div>
                <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary">The Construction Journey</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Observe the evolution from unshaped raw geology to sculptural habitable monolith. Click each phase to inspect technical documentation.
                </p>
              </div>
              
              <div className="flex items-center justify-between border-b border-outline-variant/30 mb-8 overflow-x-auto">
                {['01. Vision', '02. Foundation', '03. Structure', '04. Finishing', '05. Handover'].map((phase, i) => (
                  <button key={i} onClick={() => setJourneyPhase(i)} className={`px-6 py-4 font-label-caps text-label-caps uppercase tracking-[0.18em] transition-all whitespace-nowrap border-b-2 ${journeyPhase === i ? 'text-primary border-primary' : 'text-outline border-transparent hover:text-primary'}`} type="button">{phase}</button>
                ))}
              </div>
              
              <div className="bg-surface border border-outline-variant/40 p-8 md:p-12 text-on-surface-variant grid grid-cols-1 md:grid-cols-12 gap-8 shadow-sm">
                <div className="md:col-span-7 flex flex-col gap-4">
                  <span className="font-label-caps text-label-caps text-secondary tracking-[0.18em] uppercase">{currentPhase.tag}</span>
                  <h3 className="font-headline-md text-headline-md text-primary">{currentPhase.name}</h3>
                  <p className="font-body-md text-body-md leading-relaxed">{currentPhase.desc}</p>
                  <ul className="mt-4 flex flex-col gap-3 font-body-sm text-body-sm text-primary">
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> {currentPhase.b1}</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> {currentPhase.b2}</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> {currentPhase.b3}</li>
                  </ul>
                </div>
                <div className="md:col-span-5 grid grid-cols-1 gap-6 content-center border-l border-outline-variant/30 pl-8">
                  <div>
                    <span className="font-label-caps text-label-caps text-outline uppercase tracking-[0.18em]">Tolerance / Rating</span>
                    <p className="font-headline-sm text-headline-sm text-primary">{currentPhase.s1}</p>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps text-outline uppercase tracking-[0.18em]">Phase Duration</span>
                    <p className="font-headline-sm text-headline-sm text-primary">{currentPhase.s2}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 9. TESTIMONIALS (ENDURING TESTIMONY) */}
          <section className="w-full py-space-xl lg:py-space-2xl bg-surface border-b border-outline-variant/30">
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="flex items-center gap-3 mb-2 justify-center">
                <span className="w-8 h-px bg-secondary"></span>
                <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-secondary font-semibold">Patron Feedback</span>
                <span className="w-8 h-px bg-secondary"></span>
              </div>
              <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary text-center mb-16">Enduring Testimony</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, i) => (
                  <div key={i} className="p-8 border border-outline-variant/40 bg-surface-container-low flex flex-col gap-6 hover:border-primary transition-colors">
                    <div className="flex items-center gap-1 text-secondary">
                      {[1,2,3,4,5].map(star => <span key={star} className="material-symbols-outlined text-[16px] text-fill">star</span>)}
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant italic">"{testimonial.text}"</p>
                    <div className="mt-auto pt-6 border-t border-outline-variant/30">
                      <p className="font-label-caps text-label-caps text-primary uppercase tracking-widest">{testimonial.author}</p>
                      <p className="font-body-sm text-body-sm text-outline mt-1">{testimonial.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 10. FAQ */}
          <section className="w-full py-space-xl lg:py-space-2xl bg-surface-container-low border-b border-outline-variant/30">
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-px bg-secondary"></span>
                    <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-secondary font-semibold">Inquiries & Protocols</span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary">Frequently Asked Questions</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                    Consult our protocol guidelines regarding our commission intake process, timelines, and contractual partnerships.
                  </p>
                  <a className="inline-flex items-center gap-3 font-label-caps text-label-caps uppercase tracking-[0.18em] text-primary hover:text-secondary group transition-colors mt-6" href="#contact">
                    <span>Contact The Studio Directly</span>
                    <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-2">east</span>
                  </a>
                </div>
                <div className="lg:col-span-8 flex flex-col border-t border-outline-variant/40">
                  {faqs.map((faq, i) => (
                    <div key={i} className="border-b border-outline-variant/40 faq-item">
                      <button onClick={() => toggleFaq(i)} className="w-full py-6 flex items-center justify-between text-left group">
                        <span className={`font-headline-sm text-headline-sm transition-colors ${activeFaq === i ? 'text-secondary' : 'text-primary group-hover:text-secondary'}`}>{faq.q}</span>
                        <span className={`material-symbols-outlined transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-secondary' : 'text-outline'}`}>expand_more</span>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${activeFaq === i ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">{faq.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 11. CONTACT */}
          <section id="contact" className="w-full py-space-xl lg:py-space-2xl bg-surface">
            <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter-desktop">
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-px bg-secondary"></span>
                    <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-secondary font-semibold">Commission Inquiries</span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary leading-tight">Let's Build Something Great.</h2>
                  <p className="font-headline-sm text-headline-sm text-primary font-light italic">Have a project in mind? Let's discuss your vision.</p>
                  
                  <div className="mt-8 flex flex-col gap-8">
                    <div>
                      <span className="font-label-caps text-label-caps text-outline uppercase tracking-[0.18em] block mb-2">Direct Architect Desk</span>
                      <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-headline-md text-headline-md text-primary hover:text-[#25D366] transition-colors group">
                        <WhatsAppIcon className="w-8 h-8 text-primary group-hover:text-[#25D366] transition-colors" />
                        {settings.phone}
                      </a>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Chat directly via WhatsApp for VIP inquiries.</p>
                    </div>
                    <div>
                      <span className="font-label-caps text-label-caps text-outline uppercase tracking-[0.18em] block mb-2">Monograph Dispatch</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mb-4">Quarterly architectural dossier, private project monographs, and private commissions.</p>
                      <div className="flex flex-col gap-3 max-w-sm">
                        <input className="w-full bg-transparent border-b border-outline/40 py-2.5 font-label-caps text-label-caps text-primary placeholder-outline focus:outline-none focus:border-primary transition-colors" placeholder="PATRON EMAIL" type="email"/>
                        <button className="w-full py-3 bg-primary text-surface hover:bg-secondary hover:text-primary font-label-caps text-label-caps uppercase tracking-[0.18em] transition-colors" type="button">Subscribe</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-7 bg-surface-container-low p-8 md:p-12 border border-outline-variant/30">
                  <form onSubmit={handleEnquirySubmit} className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
                        <input required type="text" id="name" className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Name" />
                        <label htmlFor="name" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Patron Name *</label>
                      </div>
                      <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
                        <input required type="email" id="email" className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" placeholder="Email" />
                        <label htmlFor="email" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Email Address *</label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
                        <select required name="type" id="type" defaultValue="" className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none appearance-none">
                          <option value="" disabled className="text-outline">Select Project Type</option>
                          <option value="residential">Private Residential</option>
                          <option value="commercial">Commercial Flagship</option>
                          <option value="renovation">Heritage Restoration</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-0 top-4 text-outline pointer-events-none">expand_more</span>
                        <label htmlFor="type" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest text-primary">Commission Type *</label>
                      </div>
                      <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
                        <select required name="budget" id="budget" defaultValue="" className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none appearance-none">
                          <option value="" disabled>Select Budget Scale</option>
                          <option value="3m">€3M - €5M</option>
                          <option value="5m">€5M - €10M</option>
                          <option value="10m+">€10M+</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-0 top-4 text-outline pointer-events-none">expand_more</span>
                        <label htmlFor="budget" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest text-primary">Capital Allocation *</label>
                      </div>
                    </div>
                    <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors mt-4">
                      <textarea required name="message" id="message" rows="4" className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent resize-none" placeholder="Message"></textarea>
                      <label htmlFor="message" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Brief Vision Description *</label>
                    </div>
                    
                    {formSubmitted ? (
                      <div className="p-4 bg-secondary-container/20 border border-secondary text-secondary font-label-caps text-label-caps uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined">check_circle</span>
                        Dossier Transmitted Successfully. We will be in touch.
                      </div>
                    ) : (
                      <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-8 py-4 bg-primary text-surface hover:bg-secondary hover:text-primary font-label-caps text-label-caps uppercase tracking-[0.18em] transition-colors self-start shadow-md disabled:opacity-50">
                        {isSubmitting ? 'Transmitting...' : 'Transmit Enquiry'}
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Home;
