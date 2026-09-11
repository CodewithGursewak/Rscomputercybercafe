import React, { useState, useEffect } from 'react';
import { initialWorkstations, defaultRates } from '../data/adminData';
import { 
  IconSpeed, 
  IconShield, 
  IconSupport, 
  IconComputer, 
  IconPrinter, 
  IconUsers, 
  IconClock, 
  IconSearch, 
  IconCheck, 
  IconClose, 
  IconWhatsApp, 
  IconLogout, 
  IconRupee,
  IconBolt,
  IconRefresh,
  IconCertificate,
  IconDownload,
  IconExternalLink,
  IconFileText,
  IconCheckCircle,
  IconAlertCircle,
  IconXCircle,
  IconQrCode
} from '../components/Icons';
import {
  isSupabaseConfigured,
  fetchCertificates,
  generateNextCertificateId,
  createCertificate,
  updateCertificate,
  deleteCertificate
} from '../lib/supabaseClient';

// Local generator helper so AdminDashboard never crashes even if supabaseClient is cached or missing export
function generateRandomCertificateId(mode = 'number') {
  const currentYear = new Date().getFullYear();
  if (mode === 'alpha') {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `RSCC-${currentYear}-${code}`;
  }
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `RSCC-${currentYear}-${randomNum}`;
}

export default function AdminDashboard({ onLogout, onExitToWebsite }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, workstations, applications, certificates, billing, rates
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
  const [nowEpoch, setNowEpoch] = useState(Date.now());

  // Real Persistent Workstations
  const [workstations, setWorkstations] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_workstations');
      return saved ? JSON.parse(saved) : initialWorkstations;
    } catch {
      return initialWorkstations;
    }
  });

  // Real Persistent Applications (includes inquiries from Contact page)
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_applications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Real Persistent Sales History
  const [salesHistory, setSalesHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_sales_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Real Persistent Rates
  const [rates, setRates] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_rates');
      return saved ? JSON.parse(saved) : defaultRates;
    } catch {
      return defaultRates;
    }
  });

  // UI state for Workstation Session Modal
  const [newSessionModal, setNewSessionModal] = useState(null); // PC id
  const [sessionForm, setSessionForm] = useState({
    user: '',
    purpose: 'Internet Browsing',
    hourlyRate: 40
  });

  // UI state for New Application Modal
  const [newAppModal, setNewAppModal] = useState(false);
  const [newAppForm, setNewAppForm] = useState({
    customer: '',
    phone: '',
    service: 'PAN Card (New Form 49A)',
    fee: '₹200'
  });

  // UI state for Applications filter/search
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState('All');

  // UI state for POS Billing
  const [posBw, setPosBw] = useState(0);
  const [posColor, setPosColor] = useState(0);
  const [posHours, setPosHours] = useState(0);
  const [posLami, setPosLami] = useState(0);
  const [posPhotos, setPosPhotos] = useState(0);

  // Live Timer: updates every second to calculate live elapsed time and bill
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      setNowEpoch(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage whenever workstations change
  useEffect(() => {
    localStorage.setItem('rs_workstations', JSON.stringify(workstations));
  }, [workstations]);

  // Save to localStorage whenever applications change
  useEffect(() => {
    localStorage.setItem('rs_applications', JSON.stringify(applications));
  }, [applications]);

  // Save to localStorage whenever sales change
  useEffect(() => {
    localStorage.setItem('rs_sales_history', JSON.stringify(salesHistory));
  }, [salesHistory]);

  // Save to localStorage whenever rates change
  useEffect(() => {
    localStorage.setItem('rs_rates', JSON.stringify(rates));
  }, [rates]);

  // Calculate live workstation duration & bill
  const getWorkstationStats = (pc) => {
    if (pc.status !== 'Occupied' || !pc.startEpoch) {
      return { elapsedMins: 0, elapsedSecs: 0, bill: 0 };
    }
    const diffMs = Math.max(0, nowEpoch - pc.startEpoch);
    const totalSecs = Math.floor(diffMs / 1000);
    const elapsedMins = Math.floor(totalSecs / 60);
    const elapsedSecs = totalSecs % 60;
    
    // Rate: Minimum ₹10, then pro-rata based on hourly rate
    const rate = pc.hourlyRate || 40;
    const bill = Math.max(10, Math.ceil((elapsedMins / 60) * rate));
    return { elapsedMins, elapsedSecs, bill };
  };

  // Workstation Actions
  const handleOpenStartSession = (pcId) => {
    setNewSessionModal(pcId);
    setSessionForm({ user: '', purpose: 'Internet Browsing', hourlyRate: 40 });
  };

  const confirmStartSession = (e) => {
    e.preventDefault();
    if (!sessionForm.user.trim()) return;

    setWorkstations(workstations.map(pc => {
      if (pc.id === newSessionModal) {
        return {
          ...pc,
          status: 'Occupied',
          user: sessionForm.user.trim(),
          purpose: sessionForm.purpose,
          startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          startEpoch: Date.now(),
          hourlyRate: Number(sessionForm.hourlyRate) || 40
        };
      }
      return pc;
    }));
    setNewSessionModal(null);
  };

  const handleEndSession = (pc) => {
    const { elapsedMins, bill } = getWorkstationStats(pc);
    const confirmed = window.confirm(`End session for ${pc.id} (${pc.user})?\nTime Used: ${elapsedMins} mins\nTotal Bill: ₹${bill}`);
    
    if (confirmed) {
      // Add transaction to real sales history
      const newSale = {
        id: Date.now(),
        desc: `${pc.id} Cyber Session (${pc.user} - ${elapsedMins} mins)`,
        amount: bill,
        method: "Cash",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString()
      };
      setSalesHistory([newSale, ...salesHistory]);

      // Free workstation
      setWorkstations(workstations.map(p => {
        if (p.id === pc.id) {
          return {
            ...p,
            status: 'Available',
            user: '-',
            purpose: '-',
            startTime: null,
            startEpoch: null
          };
        }
        return p;
      }));
    }
  };

  const handleToggleMaintenance = (pcId) => {
    setWorkstations(workstations.map(pc => {
      if (pc.id === pcId) {
        return {
          ...pc,
          status: pc.status === 'Maintenance' ? 'Available' : 'Maintenance',
          user: '-',
          startTime: null,
          startEpoch: null
        };
      }
      return pc;
    }));
  };

  // Applications Actions
  const handleStatusChange = (appId, newStatus) => {
    setApplications(applications.map(app => {
      if (app.id === appId) {
        return { ...app, status: newStatus };
      }
      return app;
    }));
  };

  const handleDeleteApplication = (appId) => {
    if (window.confirm("Are you sure you want to delete this application record?")) {
      setApplications(applications.filter(app => app.id !== appId));
    }
  };

  const handleNotifyWhatsApp = (app) => {
    const message = encodeURIComponent(
      `Hello ${app.customer}! Update from RS Computer Cyber Cafe:\nYour request for "${app.service}" status is now: ${app.status.toUpperCase()}.\nAck No: ${app.ackNumber}.\nPlease feel free to visit our center or reply to this message.`
    );
    window.open(`https://wa.me/91${app.phone}?text=${message}`, '_blank');
  };

  const handleAddNewApp = (e) => {
    e.preventDefault();
    if (!newAppForm.customer.trim() || !newAppForm.phone.trim()) return;

    const newEntry = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      customer: newAppForm.customer.trim(),
      phone: newAppForm.phone.trim(),
      service: newAppForm.service,
      appliedDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: "In Progress",
      fee: newAppForm.fee,
      docsVerified: true,
      ackNumber: `WALK-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: "Walk-in entry added by admin"
    };

    setApplications([newEntry, ...applications]);
    setNewAppModal(false);
    setNewAppForm({ customer: '', phone: '', service: 'PAN Card (New Form 49A)', fee: '₹200' });
  };

  // POS Real Billing Actions
  const posRateBw = rates.find(r => r.key === 'bwPrint')?.rate || 2;
  const posRateColor = rates.find(r => r.key === 'colorPrint')?.rate || 10;
  const posRateHour = rates.find(r => r.key === 'pcHour')?.rate || 40;
  const posRateLami = rates.find(r => r.key === 'lamination')?.rate || 40;
  const posRatePhotos = rates.find(r => r.key === 'photos')?.rate || 60;

  const posTotal = (posBw * posRateBw) + 
                    (posColor * posRateColor) + 
                    (posHours * posRateHour) + 
                    (posLami * posRateLami) + 
                    (posPhotos * posRatePhotos);

  const handleRecordSale = (method) => {
    if (posTotal === 0) return;
    const items = [];
    if (posBw > 0) items.push(`${posBw} B/W Print`);
    if (posColor > 0) items.push(`${posColor} Color Print`);
    if (posHours > 0) items.push(`${posHours}h PC Usage`);
    if (posLami > 0) items.push(`${posLami} Lamination`);
    if (posPhotos > 0) items.push(`${posPhotos} Photos`);

    const newSale = {
      id: Date.now(),
      desc: items.join(', '),
      amount: posTotal,
      method: method,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    };

    setSalesHistory([newSale, ...salesHistory]);
    setPosBw(0);
    setPosColor(0);
    setPosHours(0);
    setPosLami(0);
    setPosPhotos(0);
    alert(`Success! Real payment of ₹${posTotal} recorded via ${method}.`);
  };

  const handleClearSales = () => {
    if (window.confirm("Are you sure you want to clear today's sales history?")) {
      setSalesHistory([]);
    }
  };

  // Real Certificates Management State
  const [certificates, setCertificates] = useState([]);
  const [certLoading, setCertLoading] = useState(false);
  const [certSearch, setCertSearch] = useState('');
  const [certStatusFilter, setCertStatusFilter] = useState('all');
  const [certModal, setCertModal] = useState(null); // null or { mode: 'create' | 'edit', data?: object }
  const [certForm, setCertForm] = useState({
    certificate_id: '',
    customer_name: '',
    phone: '',
    certificate_type: 'Income Certificate (आय प्रमाण पत्र)',
    issue_date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    description: '',
    file_url: '',
    file_path: ''
  });
  const [certFile, setCertFile] = useState(null);
  const [certSaving, setCertSaving] = useState(false);

  const loadCertificatesData = async (searchVal = certSearch, statusVal = certStatusFilter) => {
    setCertLoading(true);
    try {
      const { data, error } = await fetchCertificates({ search: searchVal, status: statusVal });
      if (!error && data) {
        setCertificates(data);
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setCertLoading(false);
    }
  };

  useEffect(() => {
    loadCertificatesData(certSearch, certStatusFilter);
  }, [certStatusFilter]);

  const handleOpenCreateCert = async () => {
    // Generate fresh random ID by default (can also switch to sequential or alphanumeric with 1 click)
    const randomId = generateRandomCertificateId('number');
    setCertForm({
      certificate_id: randomId,
      customer_name: '',
      phone: '',
      certificate_type: 'Income Certificate (आय प्रमाण पत्र)',
      issue_date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      description: '',
      file_url: '',
      file_path: ''
    });
    setCertFile(null);
    setCertModal({ mode: 'create' });
  };

  const handleOpenEditCert = (cert) => {
    setCertForm({
      id: cert.id,
      certificate_id: cert.certificate_id,
      customer_name: cert.customer_name,
      phone: cert.phone || '',
      certificate_type: cert.certificate_type,
      issue_date: cert.issue_date,
      status: cert.status,
      description: cert.description || '',
      file_url: cert.file_url || '',
      file_path: cert.file_path || ''
    });
    setCertFile(null);
    setCertModal({ mode: 'edit', data: cert });
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    if (!certForm.certificate_id.trim() || !certForm.customer_name.trim()) {
      alert('Please fill in Certificate ID and Customer Name.');
      return;
    }

    setCertSaving(true);
    try {
      if (certModal.mode === 'create') {
        const { data, error } = await createCertificate(certForm, certFile);
        if (error) {
          alert(`Failed to create certificate: ${error.message}`);
        } else {
          setCertModal(null);
          loadCertificatesData(certSearch, certStatusFilter);
        }
      } else {
        const { data, error } = await updateCertificate(certForm.id, certForm, certFile);
        if (error) {
          alert(`Failed to update certificate: ${error.message}`);
        } else {
          setCertModal(null);
          loadCertificatesData(certSearch, certStatusFilter);
        }
      }
    } catch (err) {
      alert(`Error saving certificate: ${err.message}`);
    } finally {
      setCertSaving(false);
    }
  };

  const handleQuickStatusChange = async (cert, newStatus) => {
    try {
      const { error } = await updateCertificate(cert.id, { ...cert, status: newStatus });
      if (!error) {
        loadCertificatesData(certSearch, certStatusFilter);
      } else {
        alert(`Failed to update status: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCert = async (cert) => {
    if (window.confirm(`Are you sure you want to permanently delete certificate ${cert.certificate_id} (${cert.customer_name})?`)) {
      const { error } = await deleteCertificate(cert.id, cert.file_path);
      if (error) {
        alert(`Failed to delete certificate: ${error.message}`);
      } else {
        loadCertificatesData(certSearch, certStatusFilter);
      }
    }
  };

  const handleCertNotifyWhatsApp = (cert) => {
    const siteUrl = window.location.origin;
    const msg = encodeURIComponent(
      `Hello ${cert.customer_name}! Update from RS Computer Cyber Cafe:\n` +
      `Your Certificate "${cert.certificate_type}" (ID: ${cert.certificate_id}) status is now: ${cert.status.toUpperCase()}.\n` +
      (cert.description ? `Remarks: ${cert.description}\n` : '') +
      `You can verify and view your certificate online at:\n${siteUrl} (Go to Verify Certificate and enter: ${cert.certificate_id})\n` +
      `Thank you for choosing RS Computer Cyber Cafe!`
    );
    const phone = (cert.phone || '').replace(/\D/g, '');
    if (!phone) {
      alert('No phone number recorded for this customer.');
      return;
    }
    window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
  };

  // Calculations
  const occupiedCount = workstations.filter(pc => pc.status === 'Occupied').length;
  const totalRevenue = salesHistory.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const verifiedCertsCount = certificates.filter(c => c.status === 'Verified').length;

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const matchFilter = appFilter === 'All' || app.status === appFilter;
    const matchSearch = (app.customer || '').toLowerCase().includes(appSearch.toLowerCase()) ||
                        (app.phone || '').includes(appSearch) ||
                        (app.service || '').toLowerCase().includes(appSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#040817] text-white flex flex-col font-sans">
      
      {/* Top Real Admin Bar */}
      <header className="sticky top-0 z-40 bg-[#070e26]/95 backdrop-blur-md border-b border-blue-900/40 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 p-[1.5px] shadow-lg shadow-sky-500/20 flex items-center justify-center">
              <span className="font-extrabold text-white text-base tracking-tighter">RS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-wide">RS COMPUTER</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  Live Admin System
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Real-Time Operations & Station Control
              </div>
            </div>
          </div>

          {/* Clock & Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <div className="hidden md:flex items-center gap-2 bg-[#0a122e] px-3.5 py-2 rounded-xl border border-blue-900/40 text-slate-300">
              <IconClock className="w-4 h-4 text-sky-400" />
              <span>{currentTime}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{currentDate}</span>
            </div>

            <button
              onClick={onExitToWebsite}
              className="px-3.5 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900/60 border border-blue-800/40 text-sky-300 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              Public Site ↗
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 hover:text-rose-100 font-semibold transition-colors cursor-pointer"
            >
              <IconLogout className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Sub-Navigation Tabs */}
      <div className="bg-[#060c22] border-b border-blue-900/30 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto py-2.5 scrollbar-none">
          {[
            { id: 'overview', label: '📊 Live Overview' },
            { id: 'workstations', label: `🖥️ PC Workstations (${occupiedCount}/10 Active)` },
            { id: 'applications', label: `📋 Real Applications (${applications.length})` },
            { id: 'certificates', label: `📜 Certificates (${certificates.length})` },
            { id: 'billing', label: '💵 Quick Counter Billing (POS)' },
            { id: 'rates', label: '⚙️ Service Rates' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-blue-950/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ===================== TAB 1: REAL OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Real Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              
              {/* Real Metric 1: Real Revenue */}
              <div className="p-5 rounded-2xl bg-[#09122c] border border-blue-900/40 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Real Sales</span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <IconRupee className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  ₹{totalRevenue}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  From {salesHistory.length} recorded transactions
                </div>
              </div>

              {/* Real Metric 2: Active Workstations */}
              <div className="p-5 rounded-2xl bg-[#09122c] border border-blue-900/40 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Workstations</span>
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    <IconComputer className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {occupiedCount} <span className="text-sm font-semibold text-slate-400">/ 10 Active</span>
                </div>
                <div className="text-[11px] text-sky-400 mt-1">
                  {10 - occupiedCount} PCs Available Right Now
                </div>
              </div>

              {/* Real Metric 3: Real Applications */}
              <div className="p-5 rounded-2xl bg-[#09122c] border border-blue-900/40 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applications In System</span>
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    <IconShield className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {applications.length} Total
                </div>
                <div className="text-[11px] text-amber-400 mt-1">
                  {applications.filter(a => a.status === 'Pending').length} Pending Action
                </div>
              </div>

              {/* Real Metric 4: Certificates */}
              <div className="p-5 rounded-2xl bg-[#09122c] border border-cyan-900/50 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Certificates</span>
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <IconCertificate className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-cyan-300">
                  {certificates.length} Total
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  {verifiedCertsCount} Verified & Issued
                </div>
              </div>

              {/* Real Metric 5: System Status */}
              <div className="p-5 rounded-2xl bg-[#09122c] border border-blue-900/40 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cloud Backend</span>
                  <div className={`p-2 rounded-lg border ${
                    isSupabaseConfigured 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    <IconSpeed className="w-4 h-4" />
                  </div>
                </div>
                <div className={`text-xl sm:text-2xl font-black ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isSupabaseConfigured ? 'Supabase Live' : 'Demo Storage'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {isSupabaseConfigured ? 'Realtime DB & Storage' : 'Local browser fallback'}
                </div>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-3xl bg-[#09122c] border border-blue-900/40">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
                Operations Shortcuts
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <button
                  onClick={() => setActiveTab('workstations')}
                  className="p-3.5 rounded-xl bg-[#060c22] hover:bg-blue-900/30 border border-blue-900/40 text-left transition-all cursor-pointer"
                >
                  <div className="text-sky-400 mb-1">🖥️</div>
                  <div className="text-xs font-bold text-white">Assign PC Booth</div>
                  <div className="text-[10px] text-slate-400">Start live customer timer</div>
                </button>

                <button
                  onClick={() => { setActiveTab('applications'); setNewAppModal(true); }}
                  className="p-3.5 rounded-xl bg-[#060c22] hover:bg-blue-900/30 border border-blue-900/40 text-left transition-all cursor-pointer"
                >
                  <div className="text-emerald-400 mb-1">📝</div>
                  <div className="text-xs font-bold text-white">New Application</div>
                  <div className="text-[10px] text-slate-400">Add walk-in record</div>
                </button>

                <button
                  onClick={() => { setActiveTab('certificates'); handleOpenCreateCert(); }}
                  className="p-3.5 rounded-xl bg-[#060c22] hover:bg-cyan-900/30 border border-cyan-800/40 text-left transition-all cursor-pointer"
                >
                  <div className="text-cyan-400 mb-1">📜</div>
                  <div className="text-xs font-bold text-white">New Certificate</div>
                  <div className="text-[10px] text-cyan-300">Generate ID & Upload</div>
                </button>

                <button
                  onClick={() => setActiveTab('billing')}
                  className="p-3.5 rounded-xl bg-[#060c22] hover:bg-blue-900/30 border border-blue-900/40 text-left transition-all cursor-pointer"
                >
                  <div className="text-amber-400 mb-1">🧾</div>
                  <div className="text-xs font-bold text-white">Counter Bill (POS)</div>
                  <div className="text-[10px] text-slate-400">Prints, Xerox & Photos</div>
                </button>

                <button
                  onClick={() => setActiveTab('rates')}
                  className="p-3.5 rounded-xl bg-[#060c22] hover:bg-blue-900/30 border border-blue-900/40 text-left transition-all cursor-pointer"
                >
                  <div className="text-indigo-400 mb-1">⚙️</div>
                  <div className="text-xs font-bold text-white">Edit Service Rates</div>
                  <div className="text-[10px] text-slate-400">Update pricing</div>
                </button>
              </div>
            </div>

            {/* Real Sales History Table */}
            <div className="p-6 rounded-3xl bg-[#09122c] border border-blue-900/40">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Today's Recorded Transactions
                  </h3>
                  <p className="text-xs text-slate-400">Real sales recorded via PC timers and POS billing.</p>
                </div>
                {salesHistory.length > 0 && (
                  <button
                    onClick={handleClearSales}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {salesHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs italic bg-[#060c20] rounded-2xl border border-blue-950">
                  No sales recorded today yet. When you end a PC session or bill prints in the POS, real entries will show here.
                </div>
              ) : (
                <div className="space-y-2">
                  {salesHistory.map(sale => (
                    <div key={sale.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#060c20] border border-blue-950 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono">{sale.time}</span>
                        <span className="font-bold text-white">{sale.desc}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sale.method === 'UPI' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {sale.method}
                        </span>
                      </div>
                      <div className="font-black text-emerald-400 text-sm">
                        ₹{sale.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ===================== TAB 2: WORKSTATIONS (LIVE STOPWATCH) ===================== */}
        {activeTab === 'workstations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Live Cyber Cafe Workstations Monitor
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Real stopwatches ticking for each active PC. Automatic bill calculation based on actual elapsed minutes.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Available
                </span>
                <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span> Occupied (Timer Running)
                </span>
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Maintenance
                </span>
              </div>
            </div>

            {/* 10 Workstations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {workstations.map(pc => {
                const isOccupied = pc.status === 'Occupied';
                const isMaintenance = pc.status === 'Maintenance';
                const { elapsedMins, elapsedSecs, bill } = getWorkstationStats(pc);

                return (
                  <div
                    key={pc.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                      isOccupied 
                        ? 'bg-[#0a1638] border-sky-500/50 shadow-lg shadow-sky-950/60' 
                        : isMaintenance 
                          ? 'bg-[#181106] border-amber-500/40 opacity-70' 
                          : 'bg-[#09122c] border-blue-900/40 hover:border-emerald-500/50'
                    }`}
                  >
                    <div>
                      {/* Top Row: PC ID + Status */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-base text-white tracking-wider">
                          {pc.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isOccupied 
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' 
                            : isMaintenance 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {pc.status}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 text-xs mb-4">
                        <div>
                          <span className="text-slate-400">Customer: </span>
                          <span className="font-bold text-white">{pc.user}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Purpose: </span>
                          <span className="text-slate-300">{pc.purpose}</span>
                        </div>
                        {isOccupied && (
                          <>
                            <div>
                              <span className="text-slate-400">Started: </span>
                              <span className="text-slate-300">{pc.startTime}</span>
                            </div>
                            <div className="pt-2 border-t border-blue-900/40 flex items-center justify-between">
                              <span className="text-slate-400">Live Time:</span>
                              <span className="font-mono font-bold text-sky-400">
                                {elapsedMins}m {elapsedSecs}s
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Rate:</span>
                              <span className="text-slate-300">₹{pc.hourlyRate}/hr</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-blue-900/40 space-y-1.5">
                      {isOccupied ? (
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-black text-emerald-400 text-sm">₹{bill}</span>
                          <button
                            onClick={() => handleEndSession(pc)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-rose-700/30"
                          >
                            End & Bill
                          </button>
                        </div>
                      ) : isMaintenance ? (
                        <button
                          onClick={() => handleToggleMaintenance(pc.id)}
                          className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs cursor-pointer"
                        >
                          Mark Available
                        </button>
                      ) : (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleOpenStartSession(pc.id)}
                            className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-emerald-700/20"
                          >
                            Start Session
                          </button>
                          <button
                            onClick={() => handleToggleMaintenance(pc.id)}
                            className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-300 text-[10px] cursor-pointer"
                            title="Set to Maintenance"
                          >
                            🔧
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: REAL APPLICATIONS ===================== */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Real Customer Applications & Inquiries
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Applications submitted by customers on the Contact page appear here automatically. You can also add walk-ins.
                </p>
              </div>
              <button
                onClick={() => setNewAppModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 cursor-pointer"
              >
                <span>+ Add Walk-in Application</span>
              </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#09122c] p-3.5 rounded-2xl border border-blue-900/40">
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IconSearch className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search by name, phone, or service..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060c20] border border-blue-900/50 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
                {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setAppFilter(status)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      appFilter === status 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-[#060c20] text-slate-400 hover:text-white border border-blue-900/30'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications Table */}
            {filteredApps.length === 0 ? (
              <div className="text-center py-16 bg-[#09122c] border border-blue-900/40 rounded-3xl p-6">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="text-base font-bold text-white mb-1">No Applications Found</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  When visitors submit inquiries on the public website Contact form, they will instantly show up here. You can also click "+ Add Walk-in Application" above.
                </p>
                <button
                  onClick={() => setNewAppModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
                >
                  Create First Record
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-blue-900/40 bg-[#09122c] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#060c20] border-b border-blue-900/40 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">App ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Fee</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-900/30 text-slate-300">
                      {filteredApps.map(app => (
                        <tr key={app.id} className="hover:bg-blue-950/30 transition-colors">
                          <td className="p-4 font-mono font-bold text-sky-400">{app.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-white">{app.customer}</div>
                            <div className="text-[11px] text-slate-400">{app.phone}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-200">{app.service}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{app.ackNumber}</div>
                          </td>
                          <td className="p-4 text-xs text-slate-400">{app.appliedDate}</td>
                          <td className="p-4">
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none ${
                                app.status === 'Completed'
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40'
                                  : app.status === 'In Progress'
                                    ? 'bg-sky-950/80 text-sky-300 border-sky-600/40'
                                    : 'bg-amber-950/80 text-amber-300 border-amber-600/40'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td className="p-4 font-bold text-emerald-400">{app.fee}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleNotifyWhatsApp(app)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                                title="Notify on WhatsApp"
                              >
                                <IconWhatsApp className="w-3.5 h-3.5" />
                                <span>Notify</span>
                              </button>
                              <button
                                onClick={() => handleDeleteApplication(app.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                                title="Delete application"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ===================== TAB: CERTIFICATE VERIFICATION & STATUS TRACKING ===================== */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            
            {/* Top Certificates Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#09122c] border border-cyan-900/40 p-6 rounded-3xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <IconCertificate className="w-6 h-6 text-cyan-400" />
                    Certificate Verification & Status Tracking
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                    {certificates.length} Records
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Issue genuine certificates with unique IDs (RSCC-YYYY-XXXXX), upload softcopies, and track status live.
                </p>
                
                {/* Cloud Database Connection Status Banner */}
                <div className="mt-3 flex items-center gap-2">
                  {isSupabaseConfigured ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-600/40">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      🟢 Supabase Cloud Active (PostgreSQL + Storage)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-600/40" title="Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to activate cloud sync">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      🟡 Local Storage Demo Mode (Add Supabase credentials to .env to connect Cloud DB)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => loadCertificatesData(certSearch, certStatusFilter)}
                  className="px-3.5 py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/40 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Refresh from Database"
                >
                  <IconRefresh className="w-4 h-4 text-cyan-400" />
                  <span>Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenCreateCert}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="text-base leading-none font-black">+</span>
                  <span>Create Certificate</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              
              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Status' },
                  { id: 'Pending', label: '🟡 Pending' },
                  { id: 'Processing', label: '🔵 Processing' },
                  { id: 'Verified', label: '🟢 Verified' },
                  { id: 'Rejected', label: '🔴 Rejected' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setCertStatusFilter(tab.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      certStatusFilter === tab.id
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                        : 'bg-[#09122c] border border-blue-900/40 text-slate-400 hover:text-slate-200 hover:bg-blue-950/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px] sm:min-w-[280px]">
                <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={certSearch}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCertSearch(v);
                    loadCertificatesData(v, certStatusFilter);
                  }}
                  placeholder="Search ID, customer, phone..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#09122c] border border-blue-900/40 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

            </div>

            {/* Certificates Table */}
            {certLoading ? (
              <div className="p-12 text-center text-slate-400 bg-[#09122c] rounded-3xl border border-blue-900/40">
                <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs">Loading certificates from database...</p>
              </div>
            ) : certificates.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-[#09122c] rounded-3xl border border-blue-900/40">
                <IconCertificate className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">No Certificates Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  {certSearch || certStatusFilter !== 'all'
                    ? 'No records match your search or filter criteria.'
                    : 'Get started by creating your first certificate entry.'}
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreateCert}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  + Create First Certificate
                </button>
              </div>
            ) : (
              <div className="bg-[#09122c] border border-blue-900/40 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-blue-900/40 bg-[#060c20] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="p-4">Certificate ID</th>
                        <th className="p-4">Customer Name & Phone</th>
                        <th className="p-4">Certificate Type</th>
                        <th className="p-4">Issue Date</th>
                        <th className="p-4">Live Status</th>
                        <th className="p-4">Document</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-900/20 text-xs text-slate-300">
                      {certificates.map((cert) => (
                        <tr key={cert.id} className="hover:bg-blue-950/20 transition-colors">
                          <td className="p-4 font-mono font-bold text-cyan-300">
                            {cert.certificate_id}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{cert.customer_name}</div>
                            {cert.phone && (
                              <div className="text-[11px] text-slate-400">{cert.phone}</div>
                            )}
                          </td>
                          <td className="p-4 text-slate-200">
                            {cert.certificate_type}
                          </td>
                          <td className="p-4 text-slate-400">
                            {cert.issue_date || 'N/A'}
                          </td>
                          <td className="p-4">
                            <select
                              value={cert.status}
                              onChange={(e) => handleQuickStatusChange(cert, e.target.value)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none transition-all ${
                                cert.status === 'Verified'
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40 shadow-[0_0_10px_rgba(52,211,153,0.15)]'
                                  : cert.status === 'Processing'
                                  ? 'bg-sky-950/80 text-sky-300 border-sky-600/40 shadow-[0_0_10px_rgba(56,189,248,0.15)]'
                                  : cert.status === 'Rejected'
                                  ? 'bg-rose-950/80 text-rose-300 border-rose-600/40 shadow-[0_0_10px_rgba(251,113,133,0.15)]'
                                  : 'bg-amber-950/80 text-amber-300 border-amber-600/40 shadow-[0_0_10px_rgba(251,191,36,0.15)]'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Verified">Verified</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="p-4">
                            {cert.file_url ? (
                              <div className="flex items-center gap-2">
                                <a
                                  href={cert.file_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                                  title="View Certificate File"
                                >
                                  <IconFileText className="w-3.5 h-3.5" />
                                  <span>View</span>
                                </a>
                                <a
                                  href={cert.file_url}
                                  download
                                  className="text-slate-400 hover:text-slate-200"
                                  title="Download"
                                >
                                  <IconDownload className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">No File</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCertNotifyWhatsApp(cert)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                                title="Send WhatsApp Notification"
                              >
                                <IconWhatsApp className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditCert(cert)}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/40 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
                                title="Edit Certificate Details"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCert(cert)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Delete Certificate"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ===================== TAB 4: REAL COUNTER BILLING (POS) ===================== */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Walk-in Counter Quick Billing (POS)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Ring up real printouts, photocopies, passport photos, and lamination for walk-in customers.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left POS Counter Selectors */}
              <div className="lg:col-span-8 bg-[#09122c] border border-blue-900/40 rounded-3xl p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* B/W Laser */}
                  <div className="p-4 rounded-2xl bg-[#060c20] border border-blue-950 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">B/W Laser Print</div>
                      <div className="text-xs text-sky-400">₹{posRateBw} per page</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setPosBw(Math.max(0, posBw - 1))} className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold cursor-pointer">-</button>
                      <span className="w-8 text-center font-bold text-sm">{posBw}</span>
                      <button onClick={() => setPosBw(posBw + 1)} className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold cursor-pointer">+</button>
                    </div>
                  </div>

                  {/* Color Print */}
                  <div className="p-4 rounded-2xl bg-[#060c20] border border-blue-950 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">Color Print</div>
                      <div className="text-xs text-teal-400">₹{posRateColor} per page</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setPosColor(Math.max(0, posColor - 1))} className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold cursor-pointer">-</button>
                      <span className="w-8 text-center font-bold text-sm">{posColor}</span>
                      <button onClick={() => setPosColor(posColor + 1)} className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold cursor-pointer">+</button>
                    </div>
                  </div>

                  {/* PC Hours */}
                  <div className="p-4 rounded-2xl bg-[#060c20] border border-blue-950 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">PC Browsing / Gaming</div>
                      <div className="text-xs text-indigo-400">₹{posRateHour} per hour</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setPosHours(Math.max(0, posHours - 1))} className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold cursor-pointer">-</button>
                      <span className="w-8 text-center font-bold text-sm">{posHours}</span>
                      <button onClick={() => setPosHours(posHours + 1)} className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold cursor-pointer">+</button>
                    </div>
                  </div>

                  {/* Lamination */}
                  <div className="p-4 rounded-2xl bg-[#060c20] border border-blue-950 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">A4 Thermal Lamination</div>
                      <div className="text-xs text-amber-400">₹{posRateLami} per sheet</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setPosLami(Math.max(0, posLami - 1))} className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold cursor-pointer">-</button>
                      <span className="w-8 text-center font-bold text-sm">{posLami}</span>
                      <button onClick={() => setPosLami(posLami + 1)} className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold cursor-pointer">+</button>
                    </div>
                  </div>

                  {/* Photos */}
                  <div className="p-4 rounded-2xl bg-[#060c20] border border-blue-950 flex items-center justify-between sm:col-span-2">
                    <div>
                      <div className="font-bold text-sm text-white">Passport Photos (Set of 8)</div>
                      <div className="text-xs text-rose-400">₹{posRatePhotos} per set</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setPosPhotos(Math.max(0, posPhotos - 1))} className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold cursor-pointer">-</button>
                      <span className="w-8 text-center font-bold text-sm">{posPhotos}</span>
                      <button onClick={() => setPosPhotos(posPhotos + 1)} className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold cursor-pointer">+</button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Bill Receipt & Real Payment */}
              <div className="lg:col-span-4 bg-[#09122c] border border-blue-900/40 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Receipt Summary</div>
                  <div className="text-4xl font-black text-emerald-400 mb-4">₹{posTotal}</div>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-blue-950 pt-4 mb-6">
                    {posBw > 0 && <div className="flex justify-between"><span>{posBw} B/W Prints</span><span>₹{posBw * posRateBw}</span></div>}
                    {posColor > 0 && <div className="flex justify-between"><span>{posColor} Color Prints</span><span>₹{posColor * posRateColor}</span></div>}
                    {posHours > 0 && <div className="flex justify-between"><span>{posHours} PC Hours</span><span>₹{posHours * posRateHour}</span></div>}
                    {posLami > 0 && <div className="flex justify-between"><span>{posLami} Lamination</span><span>₹{posLami * posRateLami}</span></div>}
                    {posPhotos > 0 && <div className="flex justify-between"><span>{posPhotos} Photo Sets</span><span>₹{posPhotos * posRatePhotos}</span></div>}
                    {posTotal === 0 && <div className="text-slate-500 italic text-center py-4">No items added to bill yet</div>}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    disabled={posTotal === 0}
                    onClick={() => handleRecordSale("Cash")}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm disabled:opacity-40 cursor-pointer shadow-lg shadow-emerald-700/20"
                  >
                    Collect Cash (₹{posTotal})
                  </button>
                  <button
                    disabled={posTotal === 0}
                    onClick={() => handleRecordSale("UPI")}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm disabled:opacity-40 cursor-pointer shadow-lg shadow-blue-700/20"
                  >
                    Collect via UPI / QR (₹{posTotal})
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ===================== TAB 5: REAL RATES ===================== */}
        {activeTab === 'rates' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Service Rates & Price Configuration
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Adjust standard rates for printing, computer usage, and government paperwork assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rates.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#09122c] border border-blue-900/40 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.label}</h4>
                    <span className="text-xs text-slate-400">{item.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">₹</span>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => {
                        const newR = [...rates];
                        newR[idx].rate = Number(e.target.value);
                        setRates(newR);
                      }}
                      className="w-24 px-3 py-1.5 rounded-lg bg-[#060c20] border border-blue-800 text-white font-bold text-sm text-right focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/40 text-xs text-sky-400 flex items-center gap-2">
              <IconCheck className="w-4 h-4" />
              <span>Real rates are saved permanently in browser storage.</span>
            </div>
          </div>
        )}

      </main>

      {/* Start Session Modal */}
      {newSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#09122c] border border-blue-900/60 rounded-3xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">
              Start Session on {newSessionModal}
            </h3>
            <form onSubmit={confirmStartSession} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={sessionForm.user}
                  onChange={(e) => setSessionForm({ ...sessionForm, user: e.target.value })}
                  placeholder="Enter customer name"
                  className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-800 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Purpose of Usage</label>
                <select
                  value={sessionForm.purpose}
                  onChange={(e) => setSessionForm({ ...sessionForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-800 text-white text-sm"
                >
                  <option value="Internet Browsing">Internet Browsing</option>
                  <option value="Online Exam">Online Exam</option>
                  <option value="Job Application">Job Application</option>
                  <option value="Gaming / Workstation">Gaming / Workstation</option>
                  <option value="Video Call / Interview">Video Call / Interview</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Hourly Rate (₹/hr)</label>
                <input
                  type="number"
                  value={sessionForm.hourlyRate}
                  onChange={(e) => setSessionForm({ ...sessionForm, hourlyRate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-800 text-white text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white cursor-pointer"
                >
                  Confirm & Start Timer
                </button>
                <button
                  type="button"
                  onClick={() => setNewSessionModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Application Modal */}
      {newAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#09122c] border border-blue-900/60 rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-3">
              Add Walk-in Application Record
            </h3>
            <form onSubmit={handleAddNewApp} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={newAppForm.customer}
                  onChange={(e) => setNewAppForm({ ...newAppForm, customer: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-800 text-white text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Customer WhatsApp Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={newAppForm.phone}
                  onChange={(e) => setNewAppForm({ ...newAppForm, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-800 text-white text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Service Requested</label>
                <select
                  value={newAppForm.service}
                  onChange={(e) => setNewAppForm({ ...newAppForm, service: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-800 text-white text-xs sm:text-sm"
                >
                  <option value="PAN Card (New Form 49A)">PAN Card (New Form 49A)</option>
                  <option value="Aadhaar Correction">Aadhaar Correction</option>
                  <option value="Voter ID Form 6">Voter ID Form 6</option>
                  <option value="Passport Appointment">Passport Appointment</option>
                  <option value="SSC / Railway Exam Form">SSC / Railway Exam Form</option>
                  <option value="PVC Smart Card">PVC Smart Card</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Service Fee</label>
                <input
                  type="text"
                  value={newAppForm.fee}
                  onChange={(e) => setNewAppForm({ ...newAppForm, fee: e.target.value })}
                  placeholder="e.g. ₹200"
                  className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-800 text-white text-xs sm:text-sm"
                />
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs cursor-pointer"
                >
                  Save Record
                </button>
                <button
                  type="button"
                  onClick={() => setNewAppModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Certificate Modal */}
      {certModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#09122c] border border-cyan-800/60 rounded-3xl p-6 max-w-lg w-full shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4 border-b border-cyan-900/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <IconCertificate className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {certModal.mode === 'create' ? 'Issue New Certificate' : 'Edit Certificate Record'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {certModal.mode === 'create'
                      ? 'Creates a unique verification record accessible by the customer'
                      : `Updating details for ${certForm.certificate_id}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCertModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4 text-xs">
              
              {/* Certificate ID & Generator Buttons */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                  <label className="text-slate-300 font-bold">Certificate ID (Unique Tracking ID) *</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const rnd = generateRandomCertificateId('number');
                        setCertForm(prev => ({ ...prev, certificate_id: rnd }));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-[10px] text-cyan-300 font-bold transition-all hover:scale-105 cursor-pointer flex items-center gap-1 shadow-sm"
                      title="Generate Random 5-Digit Number (e.g. RSCC-2026-84921)"
                    >
                      <span>🎲</span>
                      <span>Random ID</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const rnd = generateRandomCertificateId('alpha');
                        setCertForm(prev => ({ ...prev, certificate_id: rnd }));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-700/60 text-[10px] text-purple-300 font-bold transition-all hover:scale-105 cursor-pointer flex items-center gap-1 shadow-sm"
                      title="Generate Random Alphanumeric (e.g. RSCC-2026-9XK4A)"
                    >
                      <span>🔤</span>
                      <span>Alphanumeric</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const nextId = await generateNextCertificateId();
                        setCertForm(prev => ({ ...prev, certificate_id: nextId }));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-700/60 text-[10px] text-sky-300 font-bold transition-all hover:scale-105 cursor-pointer flex items-center gap-1 shadow-sm"
                      title="Generate Next Sequential ID (e.g. RSCC-2026-00003)"
                    >
                      <span>🔢</span>
                      <span>Sequential</span>
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  required
                  value={certForm.certificate_id}
                  onChange={(e) => setCertForm({ ...certForm, certificate_id: e.target.value.toUpperCase() })}
                  placeholder="RSCC-2026-84921"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#060c20] border border-cyan-800 text-white font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Click <b>Random ID</b> or <b>Alphanumeric</b> to generate randomly, or type any custom code.
                </span>
              </div>

              {/* Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={certForm.customer_name}
                    onChange={(e) => setCertForm({ ...certForm, customer_name: e.target.value })}
                    placeholder="e.g. Amit Kumar"
                    className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-900 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={certForm.phone}
                    onChange={(e) => setCertForm({ ...certForm, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-900 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Certificate Type & Issue Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Certificate Type *</label>
                  <select
                    value={certForm.certificate_type}
                    onChange={(e) => setCertForm({ ...certForm, certificate_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-900 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Income Certificate">
  Income Certificate (ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ)
</option>

<option value="Caste Certificate">
  Caste Certificate (ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ)
</option>

<option value="Domicile / Niwas">
  Domicile / Niwas (ਰਿਹਾਇਸ਼ ਸਰਟੀਫਿਕੇਟ)
</option>

<option value="Birth Certificate">
  Birth Certificate (ਜਨਮ ਸਰਟੀਫਿਕੇਟ)
</option>

<option value="Death Certificate">
  Death Certificate (ਮੌਤ ਸਰਟੀਫਿਕੇਟ)
</option>

<option value="Non-Creamy Layer (OBC)">
  Non-Creamy Layer (OBC) (ਨਾਨ-ਕ੍ਰੀਮੀ ਲੇਅਰ)
</option>

<option value="EWS Certificate">
  EWS Certificate (ਆਰਥਿਕ ਤੌਰ 'ਤੇ ਕਮਜ਼ੋਰ ਵਰਗ)
</option>

<option value="Character Certificate">
  Character Certificate (ਚਰਿੱਤਰ ਸਰਟੀਫਿਕੇਟ)
</option>

<option value="Ration Card / Food Security">
  Ration Card / Food Security (ਰਾਸ਼ਨ ਕਾਰਡ / ਖੁਰਾਕ ਸੁਰੱਖਿਆ)
</option>

<option value="General Cyber Cafe Certificate">
  General Cyber Cafe Certificate (ਜਨਰਲ ਸਾਈਬਰ ਕੈਫੇ ਸਰਟੀਫਿਕੇਟ)
</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Issue / Application Date</label>
                  <input
                    type="date"
                    value={certForm.issue_date}
                    onChange={(e) => setCertForm({ ...certForm, issue_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-900 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Current Verification Status</label>
                <select
                  value={certForm.status}
                  onChange={(e) => setCertForm({ ...certForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-900 text-white font-bold focus:outline-none focus:border-cyan-400"
                >
                  <option value="Pending">🟡 Pending (Received, awaiting review)</option>
                  <option value="Processing">🔵 Processing (Under verification)</option>
                  <option value="Verified">🟢 Verified / Completed (Officially Approved)</option>
                  <option value="Rejected">🔴 Rejected (Discrepancy / Incomplete)</option>
                </select>
              </div>

              {/* Description / Remarks */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Description / Official Remarks</label>
                <textarea
                  rows={2}
                  value={certForm.description}
                  onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                  placeholder="e.g. Issued by SDM Tehsil, verified with original Aadhaar & Khatauni."
                  className="w-full px-3 py-2 rounded-xl bg-[#060c20] border border-blue-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* File Attachment Upload */}
              <div className="p-3.5 rounded-2xl bg-[#060c20] border border-cyan-900/40">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <IconFileText className="w-4 h-4 text-cyan-400" />
                    <span>Upload Certificate File (PDF / Image)</span>
                  </label>
                  {certForm.file_url && (
                    <a
                      href={certForm.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 underline"
                    >
                      View Current Attached File ↗
                    </a>
                  )}
                </div>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCertFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 file:cursor-pointer cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  {certFile
                    ? `Selected: ${certFile.name} (${(certFile.size / 1024).toFixed(1)} KB)`
                    : 'Accepted formats: PDF, JPG, PNG. Files are stored securely in Supabase Storage.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2 border-t border-cyan-900/40">
                <button
                  type="submit"
                  disabled={certSaving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  {certSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <span>{certModal.mode === 'create' ? 'Save & Issue Certificate' : 'Update Certificate'}</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCertModal(null)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
