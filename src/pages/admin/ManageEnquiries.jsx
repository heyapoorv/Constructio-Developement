import React, { useEffect, useState } from 'react';
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from '../../firebase/firestore';

const ManageEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await getEnquiries();
      setEnquiries(data);
    } catch (error) {
      console.error("Error fetching enquiries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateEnquiryStatus(id, status);
      // Update local state
      setEnquiries(enquiries.map(enq => enq.id === id ? { ...enq, status } : enq));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this enquiry?")) {
      try {
        await deleteEnquiry(id);
        setEnquiries(enquiries.filter(enq => enq.id !== id));
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry(null);
        }
      } catch (error) {
        console.error("Error deleting enquiry", error);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[80vh]">
      <div className={`w-full ${selectedEnquiry ? 'hidden lg:block lg:w-1/2 xl:w-2/3' : 'w-full'}`}>
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Manage Enquiries</h1>
          <p className="font-body-md text-on-surface-variant mt-2 mb-8">Review incoming project briefs and patron communications.</p>
        </div>

        <div className="bg-surface border border-outline-variant/40 overflow-hidden h-[calc(100%-8rem)] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-outline animate-pulse font-label-caps uppercase tracking-widest">Loading Enquiries...</div>
          ) : enquiries.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-4 text-outline">
              <span className="material-symbols-outlined text-4xl">inbox</span>
              <p className="font-body-md">Inbox is empty.</p>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-outline-variant/30">
              {enquiries.map(enq => (
                <li 
                  key={enq.id} 
                  onClick={() => setSelectedEnquiry(enq)}
                  className={`p-6 cursor-pointer hover:bg-surface-container-low transition-colors ${selectedEnquiry?.id === enq.id ? 'bg-surface-container-low border-l-4 border-secondary' : 'border-l-4 border-transparent'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-headline-sm text-headline-sm text-primary">{enq.name}</span>
                    <span className={`px-2 py-0.5 font-label-caps text-[9px] uppercase tracking-widest border ${
                      enq.status === 'new' ? 'bg-secondary/10 text-secondary border-secondary/20' : 
                      enq.status === 'converted' ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20' : 
                      enq.status === 'contacted' ? 'bg-primary/10 text-primary border-primary/20' :
                      'bg-outline-variant/30 text-outline border-outline-variant'
                    }`}>
                      {enq.status || 'new'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
                    <span className="capitalize">{enq.projectType} • {enq.budget}</span>
                    <span className="text-[10px] uppercase tracking-wider">{enq.createdAt ? new Date(enq.createdAt.seconds * 1000).toLocaleDateString() : ''}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selectedEnquiry && (
        <div className="w-full lg:w-1/2 xl:w-1/3 bg-surface border border-outline-variant/40 flex flex-col shadow-xl">
          <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
            <h2 className="font-headline-md text-headline-md text-primary">Enquiry Details</h2>
            <button onClick={() => setSelectedEnquiry(null)} className="lg:hidden text-outline hover:text-primary">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-8">
            <div>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline block mb-1">Status</span>
              <select 
                value={selectedEnquiry.status || 'new'} 
                onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                className="w-full p-2 bg-transparent border border-outline-variant focus:border-primary focus:outline-none font-body-sm text-primary capitalize"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed / Declined</option>
              </select>
            </div>

            <div>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline block mb-1">Patron Information</span>
              <p className="font-headline-sm text-headline-sm text-primary">{selectedEnquiry.name}</p>
              <div className="flex flex-col gap-2 mt-3">
                <a href={`mailto:${selectedEnquiry.email}`} className="flex items-center gap-3 text-body-sm text-primary hover:text-secondary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">mail</span> {selectedEnquiry.email}
                </a>
                {selectedEnquiry.phone && (
                  <a href={`tel:${selectedEnquiry.phone}`} className="flex items-center gap-3 text-body-sm text-primary hover:text-secondary transition-colors">
                    <span className="material-symbols-outlined text-[16px]">call</span> {selectedEnquiry.phone}
                  </a>
                )}
                {selectedEnquiry.phone && (
                  <a href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-body-sm text-[#25D366] hover:opacity-80 transition-opacity">
                    <span className="material-symbols-outlined text-[16px]">chat</span> WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline block mb-1">Project Brief</span>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <span className="text-[10px] text-outline uppercase block">Type</span>
                  <p className="font-body-md text-primary capitalize">{selectedEnquiry.projectType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-outline uppercase block">Capital Allocation</span>
                  <p className="font-body-md text-primary">{selectedEnquiry.budget}</p>
                </div>
              </div>
            </div>

            <div>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline block mb-2">Vision / Message</span>
              <p className="font-body-md text-on-surface-variant bg-surface-container-low p-4 border border-outline-variant/30 rounded-sm whitespace-pre-wrap">
                {selectedEnquiry.message}
              </p>
            </div>
            
            <div className="mt-auto pt-6 border-t border-outline-variant/30 flex justify-end">
              <button 
                onClick={() => handleDelete(selectedEnquiry.id)}
                className="flex items-center gap-2 text-error hover:text-error/80 transition-colors font-label-caps text-label-caps uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span> Delete Enquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEnquiries;
