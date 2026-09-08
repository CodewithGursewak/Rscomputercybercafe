import React, { useState } from 'react';
import { allServices } from '../data/serviceData';
import { 
  IconSearch, 
  IconCheck, 
  IconWhatsApp, 
  IconPanCard, 
  IconFingerprint, 
  IconVoterId, 
  IconPassport, 
  IconOnlineForms, 
  IconPrinter, 
  IconCamera,
  IconXerox,
  IconLamination,
  IconPhotoEdit,
  IconResume,
  IconPdf,
  IconComputer
} from '../components/Icons';

export default function ServicesPage({ onSelectService }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Government IDs',
    'Online Applications',
    'Printing & Docs',
    'Photo & Design',
    'Cyber Cafe'
  ];

  const getServiceIcon = (icon) => {
    switch (icon) {
      case 'pan': return <IconPanCard className="w-6 h-6 text-sky-400" />;
      case 'fingerprint': return <IconFingerprint className="w-6 h-6 text-amber-400" />;
      case 'voter': return <IconVoterId className="w-6 h-6 text-purple-400" />;
      case 'passport': return <IconPassport className="w-6 h-6 text-indigo-400" />;
      case 'forms': return <IconOnlineForms className="w-6 h-6 text-emerald-400" />;
      case 'printer': return <IconPrinter className="w-6 h-6 text-teal-400" />;
      case 'xerox': return <IconXerox className="w-6 h-6 text-green-400" />;
      case 'lamination': return <IconLamination className="w-6 h-6 text-yellow-400" />;
      case 'photo-edit': return <IconPhotoEdit className="w-6 h-6 text-sky-400" />;
      case 'resume': return <IconResume className="w-6 h-6 text-cyan-400" />;
      case 'pdf': return <IconPdf className="w-6 h-6 text-rose-400" />;
      case 'computer': return <IconComputer className="w-6 h-6 text-blue-400" />;
      default: return <IconPanCard className="w-6 h-6 text-sky-400" />;
    }
  };

  const filteredServices = allServices.filter((svc) => {
    const matchesCategory = selectedCategory === 'All' || svc.category === selectedCategory;
    const matchesSearch = svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          svc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          svc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleWhatsAppBooking = (serviceName) => {
    const text = encodeURIComponent(`Hello RS Computer Cafe! I want to apply for "${serviceName}". Please guide me on procedure and documents.`);
    window.open(`https://wa.me/919023060244?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#040817] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-sky-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider mb-4">
            Catalog & Assistance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Complete Digital & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Cyber Cafe Services</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Browse our full catalog of government portal services, documentation, laser printing, and high-speed internet workstation facilities.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-[#09122e]/90 p-4 rounded-2xl border border-blue-900/40 backdrop-blur-md">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IconSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search service (e.g., PAN, Xerox, Exam)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#060c20] border border-blue-900/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-[#060c20] text-slate-400 hover:text-white hover:bg-blue-950/40 border border-blue-900/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-[#09122c]/90 hover:bg-[#0e1b40] border border-blue-900/40 hover:border-sky-500/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-950/70 hover:-translate-y-1"
            >
              <div>
                {/* Card Top: Icon & Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-blue-950/80 border border-blue-900/40 group-hover:bg-blue-900/40 transition-colors">
                    {getServiceIcon(service.icon)}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-600/10 text-sky-400 border border-blue-500/20">
                    {service.category}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors mb-2">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Required Documents List */}
                <div className="space-y-1.5 mb-5 bg-[#050a1b]/60 p-3 rounded-xl border border-blue-950">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Documents Needed:
                  </div>
                  {service.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="text-emerald-400 shrink-0">
                        <IconCheck className="w-3 h-3" />
                      </div>
                      <span className="line-clamp-1">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Bottom: Pricing & Actions */}
              <div className="pt-4 border-t border-blue-950/80 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Estimated Fee</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {service.pricing}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectService(service.id)}
                    className="px-3 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900/60 border border-blue-800/40 text-xs font-semibold text-sky-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleWhatsAppBooking(service.name)}
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                    title="Inquire on WhatsApp"
                  >
                    <IconWhatsApp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Empty Search Fallback */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-[#09122e]/40 rounded-2xl border border-blue-900/30">
            <p className="text-slate-400 text-base mb-2">No services found matching "{searchQuery}".</p>
            <p className="text-xs text-slate-500 mb-4">Feel free to contact our shop operator directly for custom requests.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
            >
              Reset Filter
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
