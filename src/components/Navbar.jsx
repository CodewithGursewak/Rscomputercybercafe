import React, { useState } from 'react';
import { IconWhatsApp } from './Icons';

export default function Navbar({ activePage, setActivePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Hello RS Computer Cyber Cafe! I would like to inquire about your online and cyber cafe services.");
    window.open(`https://wa.me/919023060244?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#060b1d]/90 backdrop-blur-md border-b border-blue-900/30 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-600 p-[1.5px] shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-shadow">
                <div className="w-full h-full bg-[#070e24] rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 text-xl tracking-tighter">
                    RS
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-white text-lg tracking-wide leading-tight group-hover:text-sky-300 transition-colors">
                RS COMPUTER
              </span>
              <span className="text-xs font-bold tracking-widest text-sky-400 uppercase leading-tight">
                CYBER CAFE
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-gradient-to-r from-sky-400 to-blue-500 rounded-full shadow-[0_0_8px_#38bdf8]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Top Right Action: Sirf WhatsApp Us Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={openWhatsApp}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <IconWhatsApp className="w-4 h-4 text-white" />
              <span>WhatsApp Us</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openWhatsApp}
              className="p-2 rounded-lg bg-blue-600/30 text-sky-400 border border-blue-500/30"
              title="WhatsApp Us"
            >
              <IconWhatsApp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070e24] border-b border-blue-900/50 px-4 pt-2 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-blue-950/40 hover:text-white"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold shadow-md"
            >
              <IconWhatsApp className="w-4 h-4" />
              <span>WhatsApp Us Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}