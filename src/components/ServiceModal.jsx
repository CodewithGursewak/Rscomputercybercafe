import React from 'react';
import { 
  IconClose, 
  IconWhatsApp, 
  IconCheck, 
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
} from './Icons';

export default function ServiceModal({ service, onClose }) {
  if (!service) return null;

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'pan': return <IconPanCard className="w-8 h-8 text-sky-400" />;
      case 'fingerprint': return <IconFingerprint className="w-8 h-8 text-amber-400" />;
      case 'voter': return <IconVoterId className="w-8 h-8 text-purple-400" />;
      case 'passport': return <IconPassport className="w-8 h-8 text-indigo-400" />;
      case 'forms': return <IconOnlineForms className="w-8 h-8 text-emerald-400" />;
      case 'printer': return <IconPrinter className="w-8 h-8 text-teal-400" />;
      case 'camera': return <IconCamera className="w-8 h-8 text-rose-400" />;
      case 'xerox': return <IconXerox className="w-8 h-8 text-green-400" />;
      case 'lamination': return <IconLamination className="w-8 h-8 text-yellow-400" />;
      case 'photo-edit': return <IconPhotoEdit className="w-8 h-8 text-sky-400" />;
      case 'resume': return <IconResume className="w-8 h-8 text-cyan-400" />;
      case 'pdf': return <IconPdf className="w-8 h-8 text-rose-400" />;
      case 'computer': return <IconComputer className="w-8 h-8 text-blue-400" />;
      default: return <IconPanCard className="w-8 h-8 text-sky-400" />;
    }
  };

  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(
      `Hello RS Computer Cyber Cafe! I need help with "${service.name}".\nPlease guide me on the documents and procedure.`
    );
    window.open(`https://wa.me/919023060244?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
      <div 
        className="relative w-full max-w-xl bg-[#09122c] border border-blue-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-sky-950/80 overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-blue-900/40 transition-colors"
        >
          <IconClose className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3.5 rounded-2xl bg-blue-950/80 border border-blue-800/40 shrink-0">
            {renderIcon(service.icon)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-600/20 text-sky-300 border border-blue-500/30">
                {service.category || "Cyber Cafe Service"}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {service.name}
            </h3>
            <div className="text-sm font-semibold text-emerald-400 mt-1">
              Estimated Rate: {service.pricing || service.price || "₹50 - ₹150"}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 text-sm text-slate-300 leading-relaxed bg-[#050a1c]/60 p-4 rounded-xl border border-blue-950">
          {service.description || "Fast and reliable processing at RS Computer Cyber Cafe with instant verification and guaranteed precision."}
        </div>

        {/* Required Documents Checklist */}
        {service.documents && (
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <span>Required Documents / Items</span>
            </h4>
            <div className="space-y-2">
              {service.documents.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 bg-blue-950/30 p-2.5 rounded-lg border border-blue-900/20">
                  <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <IconCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleWhatsAppInquiry}
            className="flex-1 inline-flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-700/30 transition-all cursor-pointer"
          >
            <IconWhatsApp className="w-4 h-4" />
            <span>Inquire on WhatsApp</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
