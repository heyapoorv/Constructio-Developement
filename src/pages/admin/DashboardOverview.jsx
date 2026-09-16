import React, { useEffect, useState } from 'react';
import { getEnquiries, createProject, createTestimonial, getPublishedProjects } from '../../firebase/firestore';

const DashboardOverview = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedComplete, setSeedComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedEnquiries = await getEnquiries();
        setEnquiries(fetchedEnquiries);
        const p = await getPublishedProjects();
        setProjectCount(p.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      // Seed Projects
      await createProject({
        title: "Villa Solstice",
        slug: "villa-solstice",
        category: "residential",
        location: "Engadin Valley, CH",
        year: "2025",
        status: "completed",
        area: "850 sqm",
        client: "Private Client",
        description: "Cantilevered Alpine residence perched on granite bedrock with zero-tolerance pre-cast concrete facade.",
        published: true,
        displayOrder: 1,
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlMitqk3xBoxQGCeNJ6mYdKQBzLkeTSa59ThkavOCZWwmq2R04KRuub2mAQ7nLwAQ3g0GJAYoYMLhrtussTq2UNk0GmYDZ7ENNL17L0ZnvUk083zRRUmP-37qEDbNtrh-sEQzci0MtSu7Kdx-swq5Kuz7Egl7Qc6O1WHTpLa4QPyMyDbx7bDk-iaEJMIcBct1Jb8DDQRZ7ITYrYTXl_t4U6jvM8UlDHIxY84_tJ4gL-G9Ub4XPcnk5"
      });
      await createProject({
        title: "The Obsidian Pavilion",
        slug: "obsidian-pavilion",
        category: "commercial",
        location: "Aspen, CO",
        year: "2024",
        status: "completed",
        area: "1200 sqm",
        client: "Obsidian Foundation",
        description: "Private collector gallery structured in Shou Sugi Ban timber and custom folded black zinc cladding.",
        published: true,
        displayOrder: 2,
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp_gvMTr8Fh_S4VPtHs_ujJd17aKV0RbI_Ds3s5byIAbUJDaDmw7uE707DcSZTouurLwZ6QuBeC5GkuF7UJ5QIRbqcb562rDRjMyVULhzNy2DRpg2zJndM6rCxYRBJinyC5g05KxTx5XL4fJy2u1UKUe0aTbWt3ueSA0dZykmh_anJ540TYp55hz38HGHYC7Zwg0e34TXMbiylhRgSgC3HRutD1MnpmAyVXlg4899U0wVZLwCgzNS5"
      });

      // Seed Testimonials
      await createTestimonial({
        author: "Sarah Harding",
        title: "Patron, Villa Solstice",
        text: "Monolith exceeded our highest conditions with their flawless technical execution. Their ability to fuse raw brutalist concrete with fine joinery is nothing short of breathtaking.",
        published: true,
        displayOrder: 1
      });
      await createTestimonial({
        author: "Dr. Allen Chen",
        title: "Director, Obsidian Pavilion",
        text: "An unsparingly disciplined aesthetic combined with structural rigor. We required absolute silence for our private gallery, and they delivered perfect acoustic isolation.",
        published: true,
        displayOrder: 2
      });

      setSeedComplete(true);
      setTimeout(() => setSeedComplete(false), 3000);
      
      const p = await getPublishedProjects();
      setProjectCount(p.length);
    } catch (e) {
      console.error(e);
      alert("Failed to seed data");
    } finally {
      setIsSeeding(false);
    }
  };

  const statCards = [
    { label: 'Total Enquiries', value: enquiries.length, icon: 'inbox' },
    { label: 'New Enquiries', value: enquiries.filter(e => e.status === 'new').length, icon: 'mark_email_unread' },
    { label: 'Total Projects', value: projectCount, icon: 'architecture' },
  ];

  if (loading) {
    return <div className="text-outline font-label-caps uppercase tracking-widest animate-pulse">Loading Metrics...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Overview</h1>
          <p className="font-body-md text-on-surface-variant mt-2">Monolith CMS Metrics & Activity</p>
        </div>
        <button 
          onClick={handleSeedData}
          disabled={isSeeding || seedComplete}
          className="px-6 py-2 border border-primary text-primary hover:bg-primary/10 transition-colors font-label-caps uppercase tracking-widest disabled:opacity-50"
        >
          {isSeeding ? 'Seeding...' : seedComplete ? 'Data Seeded!' : 'Seed Demo Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="p-6 bg-surface border border-outline-variant/40 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-primary-container text-primary">
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps uppercase tracking-widest text-outline">{stat.label}</p>
              <p className="font-headline-lg text-headline-lg text-primary">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-md text-headline-md text-primary">Recent Enquiries</h2>
          <a href="/admin/enquiries" className="font-label-caps text-label-caps uppercase tracking-widest text-secondary hover:text-primary transition-colors">View All &rarr;</a>
        </div>
        <div className="bg-surface border border-outline-variant/40 overflow-hidden">
          {enquiries.length === 0 ? (
            <div className="p-8 text-center text-outline font-body-md">No recent enquiries found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                  <th className="py-4 px-6 font-label-caps text-label-caps uppercase tracking-widest text-outline">Date</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps uppercase tracking-widest text-outline">Patron</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps uppercase tracking-widest text-outline">Type</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps uppercase tracking-widest text-outline">Status</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.slice(0, 5).map(enq => (
                  <tr key={enq.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4 px-6 font-body-sm text-primary">
                      {enq.createdAt ? new Date(enq.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 font-body-md text-primary">{enq.name}</td>
                    <td className="py-4 px-6 font-body-sm text-on-surface-variant capitalize">{enq.projectType}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 font-label-caps text-[10px] uppercase tracking-widest ${
                        enq.status === 'new' ? 'bg-secondary/10 text-secondary border border-secondary/20' : 
                        enq.status === 'converted' ? 'bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20' : 
                        'bg-outline-variant/30 text-outline'
                      }`}>
                        {enq.status || 'new'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
