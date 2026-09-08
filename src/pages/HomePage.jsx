import React from 'react';
import QuickServicesBar from '../components/QuickServicesBar';
import StatsBanner from "../components/StatsBanner";
import { allServices } from '../data/serviceData';
import {
  IconArrowRight,
  IconChevronRight,
  IconGlobe,
  IconPrinter,
  IconScanner,
  IconCamera,
  IconDocument,
  IconSpeed,
  IconShield,
  IconSupport,
  IconPricing,
  IconPanCard,
  IconFingerprint,
  IconVoterId,
  IconPassport,
  IconOnlineForms,
  IconXerox,
  IconLamination,
  IconPhotoEdit,
  IconResume,
  IconPdf,
  IconComputer
} from '../components/Icons';

export default function HomePage({ setActivePage, onSelectService }) {
  // Service icon resolver
  const getServiceIcon = (icon) => {
    switch (icon) {
      case 'pan': return <IconPanCard className="w-5 h-5 text-sky-400" />;
      case 'fingerprint': return <IconFingerprint className="w-5 h-5 text-amber-400" />;
      case 'voter': return <IconVoterId className="w-5 h-5 text-purple-400" />;
      case 'passport': return <IconPassport className="w-5 h-5 text-indigo-400" />;
      case 'forms': return <IconOnlineForms className="w-5 h-5 text-emerald-400" />;
      case 'printer': return <IconPrinter className="w-5 h-5 text-teal-400" />;
      case 'xerox': return <IconXerox className="w-5 h-5 text-green-400" />;
      case 'lamination': return <IconLamination className="w-5 h-5 text-yellow-400" />;
      case 'photo-edit': return <IconPhotoEdit className="w-5 h-5 text-sky-400" />;
      case 'resume': return <IconResume className="w-5 h-5 text-cyan-400" />;
      case 'pdf': return <IconPdf className="w-5 h-5 text-rose-400" />;
      case 'computer': return <IconComputer className="w-5 h-5 text-blue-400" />;
      default: return <IconDocument className="w-5 h-5 text-sky-400" />;
    }
  };

  // Group 12 services into 3 columns of 4
  const col1 = allServices.slice(0, 4);
  const col2 = allServices.slice(4, 8);
  const col3 = allServices.slice(8, 12);

  return (
    <div className="min-h-screen bg-[#040817] text-white">
      
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative pt-6 pb-20 sm:pb-28 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Tagline */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-sky-400">
                <span>Fast</span>
                <span className="text-slate-500">•</span>
                <span>Reliable</span>
                <span className="text-slate-500">•</span>
                <span>Trusted</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1 sm:space-y-2">
                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-white uppercase leading-[1.08]">
                  RS COMPUTER
                </h1>
                <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight uppercase leading-[1.08] text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.35)]">
                  CYBER CAFE
                </h2>
              </div>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-300 font-medium">
                Your One Stop Digital & Online Service Center
              </p>

              {/* 5 Feature Pill Badges */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1738]/90 border border-blue-900/50 text-xs font-semibold text-slate-200">
                  <IconGlobe className="w-3.5 h-3.5 text-sky-400" />
                  <span>Online Services</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1738]/90 border border-blue-900/50 text-xs font-semibold text-slate-200">
                  <IconPrinter className="w-3.5 h-3.5 text-sky-400" />
                  <span>Printing</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1738]/90 border border-blue-900/50 text-xs font-semibold text-slate-200">
                  <IconScanner className="w-3.5 h-3.5 text-sky-400" />
                  <span>Scanning</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1738]/90 border border-blue-900/50 text-xs font-semibold text-slate-200">
                  <IconCamera className="w-3.5 h-3.5 text-sky-400" />
                  <span>Photo</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1738]/90 border border-blue-900/50 text-xs font-semibold text-slate-200">
                  <IconDocument className="w-3.5 h-3.5 text-sky-400" />
                  <span>Documents</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-3">
                <button
                  onClick={() => {
                    setActivePage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  <span>Our Services</span>
                  <IconArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setActivePage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center px-7 py-3.5 rounded-full bg-[#0d1738]/80 hover:bg-[#142354] border border-blue-900/60 hover:border-blue-700 text-slate-200 hover:text-white font-semibold text-sm transition-all duration-200 cursor-pointer"
                >
                  Contact Us
                </button>
              </div>

            </div>

            {/* Right Column: High-Tech Cyber Cafe Setup Visual */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-blue-800/40 shadow-2xl shadow-blue-950/80 group">
                
                {/* Visual Image */}
                <img
                  src="https://res.cloudinary.com/e8wyohlx/image/upload/v1788781360/Screenshot_2026-09-07_171017_xrgdtl.png"
                  alt="RS Computer Cyber Cafe Interior"
                  className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark & Neon Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050a1b] via-[#050a1b]/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050a1b]/70 via-transparent to-transparent pointer-events-none" />

                {/* Cyber Neon Sign Overlay */}
                <div className="absolute top-4 right-4 bg-[#050a1c]/80 backdrop-blur-md border border-sky-500/30 px-3.5 py-1.5 rounded-xl shadow-lg shadow-sky-500/20">
                  <div className="text-[11px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                    Work · Learn · Grow
                  </div>
                </div>

                {/* Cyber Station Badge at Bottom */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-[#070e26]/85 backdrop-blur-md border border-blue-900/50 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    <span className="text-xs font-semibold text-slate-200">
                      High-Speed Optical Fiber Workstations Active
                    </span>
                  </div>
                  <span className="text-xs font-bold text-sky-400">
                    300 Mbps
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================== QUICK SERVICES FLOATING STRIP ===================== */}
      <QuickServicesBar onSelectService={onSelectService} />

      {/* ===================== OUR SERVICES SECTION ===================== */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Services</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl">
              We provide a wide range of digital and physical services to make your life easier.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setActivePage('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0d1738]/80 hover:bg-[#142354] border border-blue-900/60 hover:border-sky-500/50 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              <span>View All Services</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Column Grid with 12 Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          
          {/* Column 1 */}
          <div className="space-y-3.5">
            {col1.map((svc) => (
              <div
                key={svc.id}
                onClick={() => onSelectService(svc.id)}
                className="group cursor-pointer flex items-center justify-between p-4 rounded-xl bg-[#0a122e]/80 hover:bg-[#101e4a] border border-blue-900/30 hover:border-sky-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/10"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-900/40 group-hover:bg-blue-900/40 transition-colors">
                    {getServiceIcon(svc.icon)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                      {svc.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {svc.shortDesc}
                    </p>
                  </div>
                </div>
                <div className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all duration-200">
                  <IconChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-3.5">
            {col2.map((svc) => (
              <div
                key={svc.id}
                onClick={() => onSelectService(svc.id)}
                className="group cursor-pointer flex items-center justify-between p-4 rounded-xl bg-[#0a122e]/80 hover:bg-[#101e4a] border border-blue-900/30 hover:border-sky-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/10"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-900/40 group-hover:bg-blue-900/40 transition-colors">
                    {getServiceIcon(svc.icon)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                      {svc.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {svc.shortDesc}
                    </p>
                  </div>
                </div>
                <div className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all duration-200">
                  <IconChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="space-y-3.5">
            {col3.map((svc) => (
              <div
                key={svc.id}
                onClick={() => onSelectService(svc.id)}
                className="group cursor-pointer flex items-center justify-between p-4 rounded-xl bg-[#0a122e]/80 hover:bg-[#101e4a] border border-blue-900/30 hover:border-sky-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/10"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-900/40 group-hover:bg-blue-900/40 transition-colors">
                    {getServiceIcon(svc.icon)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                      {svc.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {svc.shortDesc}
                    </p>
                  </div>
                </div>
                <div className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all duration-200">
                  <IconChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===================== WHY CHOOSE US? SECTION ===================== */}
      <section className="py-16 sm:py-20 bg-[#060c22]/60 border-t border-b border-blue-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
                  Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Us?</span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base max-w-lg">
                  We are committed to providing fast, secure and reliable services to our customers.
                </p>
              </div>

              {/* 4 Feature Badges / Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* 1. Fast Processing */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0b1433] border border-blue-900/40 hover:border-sky-500/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                    <IconSpeed className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Fast Processing
                    </h4>
                    <p className="text-xs text-slate-400">
                      Quick & Hassle Free
                    </p>
                  </div>
                </div>

                {/* 2. Secure Documents */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0b1433] border border-blue-900/40 hover:border-sky-500/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <IconShield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Secure Documents
                    </h4>
                    <p className="text-xs text-slate-400">
                      Your Data is Safe
                    </p>
                  </div>
                </div>

                {/* 3. Expert Support */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0b1433] border border-blue-900/40 hover:border-sky-500/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <IconSupport className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Expert Support
                    </h4>
                    <p className="text-xs text-slate-400">
                      Always Here for You
                    </p>
                  </div>
                </div>

                {/* 4. Affordable Pricing */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0b1433] border border-blue-900/40 hover:border-sky-500/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                    <IconPricing className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Affordable Pricing
                    </h4>
                    <p className="text-xs text-slate-400">
                      Best Rates in Town
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Workstation Visual */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-blue-800/40 shadow-2xl shadow-blue-950/80 group">
                <img
                  src="https://res.cloudinary.com/e8wyohlx/image/upload/v1788781695/ChatGPT_Image_Sep_7_2026_05_17_45_PM_chjeck.png"
                  alt="Digital Services Made Easy Desk"
                  className="w-full h-[280px] sm:h-[350px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050a1b] via-[#050a1b]/40 to-transparent pointer-events-none" />
                
                {/* Screen Card Graphic Mock */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#070e28]/90 backdrop-blur-md border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-0.5">
                        Digital Services Made Easy
                      </div>
                      <div className="text-xs text-slate-300">
                        Government verification, printing & high-speed internet in one place
                      </div>
                    </div>
                    <div className="shrink-0 pl-3">
                      <span className="w-3 h-3 rounded-full bg-sky-400 inline-block animate-ping" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================== BOTTOM STATS BANNER ===================== */}
      <StatsBanner onContactClick={() => {
        setActivePage('contact');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

    </div>
  );
}
