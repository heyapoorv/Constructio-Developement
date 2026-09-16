import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProject } from '../../firebase/firestore';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait, the router gives us an ID or a slug. Let's assume we query by ID for simplicity now,
    // or we fetch all projects and find the slug.
    // Actually, I wrote getProject(id). I should probably fetch by ID or add a getProjectBySlug in firestore.js
    // Let's implement fetch by ID for now, assuming the route is /projects/:id
    const fetchProject = async () => {
      try {
        const data = await getProject(slug); // we'll use ID in the route /projects/:id
        if (data) {
          setProject(data);
        } else {
          // Fallback, maybe they passed a slug? If we wanted slug, we'd need a query.
          // Let's just assume we use ID for the detail page.
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching project", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center font-label-caps uppercase tracking-widest text-outline animate-pulse mt-20">
          Loading Tectonic Data...
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      
      <main className="flex-1 w-full pt-20">
        <article>
          {/* HERO */}
          <div className="relative w-full h-[60vh] md:h-[80vh] bg-surface-container">
            {project.coverImage ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${project.coverImage})` }}></div>
            ) : (
              <div className="absolute inset-0 bg-surface-container-low"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full px-margin md:px-margin-tablet lg:px-margin-desktop pb-12">
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-4 block">
                {project.category} • {project.location}
              </span>
              <h1 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary">{project.title}</h1>
            </div>
          </div>

          {/* CONTENT */}
          <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl lg:py-space-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter-desktop">
              {/* Sidebar Stats */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="flex flex-col gap-6 py-8 border-y border-outline-variant/30">
                  {project.client && (
                    <div>
                      <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline block mb-1">Patron</span>
                      <p className="font-body-md text-primary">{project.client}</p>
                    </div>
                  )}
                  {project.area && (
                    <div>
                      <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline block mb-1">Scale / Area</span>
                      <p className="font-body-md text-primary">{project.area}</p>
                    </div>
                  )}
                  {project.year && (
                    <div>
                      <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline block mb-1">Completion Year</span>
                      <p className="font-body-md text-primary">{project.year}</p>
                    </div>
                  )}
                  {project.status && (
                    <div>
                      <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline block mb-1">Status</span>
                      <p className="font-body-md text-primary capitalize">{project.status}</p>
                    </div>
                  )}
                </div>
                
                <Link to="/#contact" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-surface hover:bg-secondary hover:text-primary transition-colors font-label-caps text-label-caps uppercase tracking-widest shadow-md">
                  Inquire About Similar Commissions
                </Link>
              </div>

              {/* Main Description */}
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-px bg-secondary"></span>
                  <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-secondary font-semibold">Architectural Brief</span>
                </div>
                <div className="font-body-lg text-body-lg text-primary leading-relaxed whitespace-pre-wrap">
                  {project.description || "No description provided."}
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
