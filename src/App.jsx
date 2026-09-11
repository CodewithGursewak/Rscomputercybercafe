import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ServiceModal from './components/ServiceModal';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PricingPage from './pages/PricingPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import VerifyCertificatePage from './pages/VerifyCertificatepage';
import { allServices, quickServices } from './data/serviceData';
import { IconWhatsApp } from './components/Icons';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [initialCertId, setInitialCertId] = useState('');

  // Admin authentication and view states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [currentView, setCurrentView] = useState('public'); // 'public' | 'admin'

  // Check persisted session on load & listen for certificate URL params/hashes
  useEffect(() => {
    const persisted = localStorage.getItem('rs_admin_logged_in');
    if (persisted === 'true') {
      setIsAdminLoggedIn(true);
    }

    // Auto-navigate to verify page if ?cert= or #verify is passed
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const certParam = searchParams.get('cert') || searchParams.get('verify') || searchParams.get('id');
      if (certParam) {
        setInitialCertId(certParam);
        setActivePage('verify-certificate');
      } else if (window.location.hash === '#verify' || window.location.hash.startsWith('#RSCC')) {
        const hashVal = window.location.hash.replace('#', '');
        if (hashVal.startsWith('RSCC')) {
          setInitialCertId(hashVal);
        }
        setActivePage('verify-certificate');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Smooth scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, currentView]);

  // Handler for opening service modal from any page
  const handleSelectService = (serviceId) => {
    const found = allServices.find((s) => s.id === serviceId) ||
                  quickServices.find((s) => s.id === serviceId);
    if (found) {
      setSelectedService(found);
    }
  };

  // Direct WhatsApp click
  const handleFloatingWhatsApp = () => {
    const text = encodeURIComponent("Hello RS Computer Cyber Cafe! I would like to inquire about your services.");
    window.open(`https://wa.me/9023060244?text=${text}`, '_blank');
  };

  // Admin handlers
  const handleOpenAdminLogin = () => {
    if (isAdminLoggedIn) {
      setCurrentView('admin');
    } else {
      setShowAdminLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLoginModal(false);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('rs_admin_logged_in');
    setIsAdminLoggedIn(false);
    setCurrentView('public');
  };

  // If in Admin Dashboard view
  if (currentView === 'admin' && isAdminLoggedIn) {
    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onExitToWebsite={() => setCurrentView('public')}
      />
    );
  }

  // Public Website View
  return (
    <div className="min-h-screen bg-[#040817] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            onSelectService={handleSelectService}
          />
        )}

        {activePage === 'services' && (
          <ServicesPage
            onSelectService={handleSelectService}
          />
        )}

        {activePage === 'pricing' && (
          <PricingPage />
        )}

        {activePage === 'gallery' && (
          <GalleryPage />
        )}

        {activePage === 'about' && (
          <AboutPage
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'verify-certificate' && (
          <VerifyCertificatePage
            initialCertId={initialCertId}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Global Footer with Admin Button */}
      <Footer
        setActivePage={setActivePage}
        onOpenAdminLogin={handleOpenAdminLogin}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Interactive Service Details Modal */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Floating Bottom-Right WhatsApp Bubble */}
      <button
        onClick={handleFloatingWhatsApp}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-700/50 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group"
        title="Chat with RS Computer on WhatsApp"
      >
        <IconWhatsApp className="w-7 h-7" />
        <span className="sr-only">WhatsApp</span>
        <span className="absolute right-16 bg-[#070e28] text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-900/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          Chat with us on WhatsApp
        </span>
      </button>

    </div>
  );
}
