import React from 'react';
import { IconWhatsApp, IconLock } from './Icons';

export default function Footer({ setActivePage, onOpenAdminLogin, isAdminLoggedIn }) {
  const quickLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'All Services' },
    { id: 'pricing', label: 'Pricing Calculator' },
    { id: 'gallery', label: 'Photo Gallery' },
    { id: 'about', label: 'About Center' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const services = [
    "New PAN Card Application",
    "Aadhaar Correction & PVC",
    "Voter ID Registration",
    "Passport Seva Online",
    "Government Job Form Filling",
    "Color & B/W Laser Xerox",
    "Instant Passport Size Photos",
    "Air-Conditioned PC Workstations"
  ];

  return (
    <footer className="bg-[#030714] border-t border-blue-900/30 text-slate-400 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => setActivePage('home')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 p-[1.5px] shadow-lg shadow-sky-500/20">
                <div className="w-full h-full bg-[#070e24] rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400 text-lg tracking-tighter">
                    RS
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-wide">
                  RS COMPUTER
                </span>
                <span className="text-[11px] font-bold tracking-wider text-sky-400 uppercase">
                  CYBER CAFE
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Fast, reliable and trusted digital service center. Assisting citizens and students with official government portals, competitive exam forms, documentation, and high-speed cyber cafe workstation facilities.
            </p>
            <div className="text-xs text-sky-400 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Open Today: 8:00 AM – 10:00 PM
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setActivePage(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-sky-300 transition-colors text-slate-400 hover:translate-x-1 inline-block duration-150 cursor-pointer"
                  >
                    → {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Key Services
            </h4>
            <ul className="space-y-2 text-xs">
              {services.map((svc, i) => (
                <li key={i} className="text-slate-400">
                  • {svc}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Contact & Location
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">📍</span>
                <span>Bhore, nabha, Punjab 147201</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-sky-400 font-bold">📞</span>
                <span>+91 90230 60244 / +91</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-sky-400 font-bold">✉️</span>
                <span>rscomputerpb34@gmail.com</span>
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/919023060244"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/50 text-xs font-semibold transition-all"
                >
                  <IconWhatsApp className="w-3.5 h-3.5" />
                  <span>Direct WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright + Admin Button at the very end */}
        <div className="border-t border-blue-950/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RS Computer Cyber Cafe. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-500 hidden md:inline">Fast · Reliable · Trusted Government & Digital Hub</span>
            
            {/* Admin Button at the very end of Footer */}
            <button
              onClick={onOpenAdminLogin}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 hover:bg-sky-500/30'
                  : 'bg-[#08102a] text-slate-300 hover:text-amber-300 border-blue-900/60 hover:border-amber-500/50 hover:bg-[#0f1d47]'
              }`}
              title="Open Admin Login"
            >
              <IconLock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">{isAdminLoggedIn ? '⚡ Admin Dashboard' : '🔐 Admin Login'}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
