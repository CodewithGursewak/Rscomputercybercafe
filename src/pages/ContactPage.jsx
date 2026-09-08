import React, { useState } from 'react';
import { 
  IconWhatsApp, 
  IconCheck, 
  IconChevronRight 
} from '../components/Icons';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'PAN Card',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // WhatsApp direct fallback
    const msg = `Inquiry from Website:\nName: ${formData.name}\nPhone: ${formData.phone}\nService: ${formData.service}\nNotes: ${formData.message}`;
    setTimeout(() => {
      window.open(`https://wa.me/919023060244?text=${encodeURIComponent(msg)}`, '_blank');
    }, 1200);
  };

  const faqs = [
    {
      q: "What documents do I need to bring for a new PAN Card?",
      a: "You only need your original Aadhaar Card (linked to an active mobile number for OTP) and two passport-size photographs. If you need a physical card, we will register your postal address."
    },
    {
      q: "Can I send documents on WhatsApp or Email for printing before I arrive?",
      a: "Yes! You can directly send your PDFs, images, or documents to our WhatsApp (+91 98765 43210) or email (rscomputercafe@gmail.com). Tell us if you want B/W or Color, and your prints will be ready when you walk in."
    },
    {
      q: "What should I do if my Aadhaar OTP is not coming?",
      a: "If your registered mobile number is lost or changed, visit our center. We will help book an official UIDAI biometric update slot to link your new mobile number."
    },
    {
      q: "Do you fill urgent government job forms on the last date?",
      a: "Yes, our high-speed optical fiber lines and experienced operators can submit forms even during peak portal traffic. We recommend coming at least 4-5 hours before server cutoff time."
    },
    {
      q: "Do you provide PVC plastic Smart Card printing?",
      a: "Yes, we print high-resolution, waterproof, ATM-style PVC plastic cards with barcode and QR code for Aadhaar, PAN, Voter ID, and Ayushman Bharat health cards within 10 minutes."
    }
  ];

  return (
    <div className="min-h-screen bg-[#040817] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 text-sky-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider mb-4">
            Get In Touch
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Contact & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Center Location</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Have questions or need assistance with government forms? Send us a message or visit our center during operating hours.
          </p>
        </div>

        {/* Contact Grid: Left Form, Right Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-[#09122c] border border-blue-900/40 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Send an Online Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Fill the form below and our operator will contact you via phone or WhatsApp immediately.
            </p>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <IconCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-emerald-300">Inquiry Sent Successfully!</h3>
                <p className="text-xs text-slate-300">
                  Opening WhatsApp to connect you directly with our shop operator...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. rs computer.exe"
                    className="w-full px-4 py-3 rounded-xl bg-[#060c20] border border-blue-900/50 text-white text-sm focus:outline-none focus:border-sky-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9023060244"
                      className="w-full px-4 py-3 rounded-xl bg-[#060c20] border border-blue-900/50 text-white text-sm focus:outline-none focus:border-sky-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Service Needed
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#060c20] border border-blue-900/50 text-white text-sm focus:outline-none focus:border-sky-400 transition-colors cursor-pointer"
                    >
                      <option value="PAN Card">PAN Card (New / Correction)</option>
                      <option value="Aadhaar Services">Aadhaar Correction / PVC</option>
                      <option value="Voter ID">Voter ID Registration</option>
                      <option value="Passport">Passport Seva Application</option>
                      <option value="Online Exam Form">Government / University Form</option>
                      <option value="Printing & Xerox">Bulk Printing / Xerox</option>
                      <option value="Passport Photos">Instant Passport Photos</option>
                      <option value="PC Workstation">PC Workstation Booking</option>
                      <option value="Other">Other Custom Service</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Requirements / Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide any details, deadline, or questions you have..."
                    className="w-full px-4 py-3 rounded-xl bg-[#060c20] border border-blue-900/50 text-white text-sm focus:outline-none focus:border-sky-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Submit Inquiry & Connect Operator
                </button>
              </form>
            )}
          </div>

          {/* Right: Store Information & Hours */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Cards */}
            <div className="bg-[#09122c] border border-blue-900/40 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
              <h3 className="text-lg font-bold text-white mb-2">
                Direct Contact Channels
              </h3>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/919023060244"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-700/40 hover:border-emerald-500 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                  <IconWhatsApp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-400">Instant Chat</div>
                  <div className="text-sm font-bold text-white">+91 90230 60244</div>
                  <div className="text-[11px] text-slate-400">Replies usually within 2 mins</div>
                </div>
              </a>

              {/* Phone Calling */}
              <a
                href="tel:9023060244"
                className="flex items-center gap-4 p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/40 hover:border-sky-400 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                  📞
                </div>
                <div>
                  <div className="text-xs font-semibold text-sky-400">Direct Phone Call</div>
                  <div className="text-sm font-bold text-white">+91 90230 60244 / </div>
                  <div className="text-[11px] text-slate-400">Speak with our desk manager</div>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-[#060c20] border border-blue-950">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  📍
                </div>
                <div>
                  <div className="text-xs font-semibold text-indigo-300">Center Address</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
                    Bhore, nabha, Punjab 147201
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="pt-2 border-t border-blue-950">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Operating Hours
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Monday – Saturday:</span>
                    <span className="font-semibold text-sky-400">8:00 AM – 10:00 PM</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Sunday:</span>
                    <span className="font-semibold text-sky-400">9:00 AM – 8:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Power backup and internet active 24/7
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Location Map Interactive Mock */}
        <div className="mb-16 bg-[#09122c] border border-blue-900/40 rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Find Us On The Map</h3>
              <p className="text-xs text-slate-400">Conveniently located in the center of the market with two-wheeler and car parking.</p>
            </div>
            <a
              href="https://maps.app.goo.gl/VaS77moE5QRgzdtf7"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-blue-600/30 border border-blue-500/40 text-xs font-semibold text-sky-300 hover:bg-blue-600/50"
            >
              Get GPS Directions ↗
            </a>
          </div>

          <div className="w-full h-64 sm:h-80 rounded-2xl bg-[#060c20] border border-blue-950 relative overflow-hidden flex items-center justify-center">
            {/* Map Grid Pattern Graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            
            {/* Center Pin Marker */}
            <div className="relative z-10 flex flex-col items-center animate-bounce">
              <div className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xl shadow-blue-500/50 flex items-center gap-1.5">
                <span>📍</span> RS Computer Cyber Cafe
              </div>
              <div className="w-2.5 h-2.5 bg-blue-600 rotate-45 -mt-1.5" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-[#070e28]/90 backdrop-blur-md p-3 rounded-xl border border-blue-900/60 flex items-center justify-between text-xs text-slate-300">
              <span>Main Market Road Bhore,  </span>
              <span className="text-sky-400 font-bold hidden sm:inline">Parking Available</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear answers to common questions about our services and process.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#09122c] border border-blue-900/40 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-200 hover:text-sky-300 transition-colors">
                      {faq.q}
                    </span>
                    <span className={`text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-90 text-sky-400' : ''}`}>
                      <IconChevronRight className="w-4 h-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-blue-950/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
