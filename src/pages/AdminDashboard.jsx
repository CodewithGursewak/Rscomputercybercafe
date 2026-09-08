import React, { useState, useEffect } from 'react';
import { initialWorkstations, defaultRates } from '../data/adminData';
import { 
  IconSpeed, 
  IconShield, 
  IconComputer, 
  IconPrinter, 
  IconClock, 
  IconSearch, 
  IconCheck, 
  IconWhatsApp, 
  IconLogout, 
  IconRupee
} from '../components/Icons';

export default function AdminDashboard({ onLogout, onExitToWebsite }) {
  const [activeTab, setActiveTab] = useState('overview');
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

  // Real Persistent Applications
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

  const [newSessionModal, setNewSessionModal] = useState(null);
  const [sessionForm, setSessionForm] = useState({ user: '', purpose: 'Internet Browsing', hourlyRate: 40 });
  const [newAppModal, setNewAppModal] = useState(false);
  const [newAppForm, setNewAppForm] = useState({ customer: '', phone: '', service: 'PAN Card (New Form 49A)', fee: '₹200' });
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState('All');

  const [posBw, setPosBw] = useState(0);
  const [posColor, setPosColor] = useState(0);
  const [posHours, setPosHours] = useState(0);
  const [posLami, setPosLami] = useState(0);
  const [posPhotos, setPosPhotos] = useState(0);

  // Live Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      setNowEpoch(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('rs_workstations', JSON.stringify(workstations));
  }, [workstations]);

  useEffect(() => {
    localStorage.setItem('rs_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('rs_sales_history', JSON.stringify(salesHistory));
  }, [salesHistory]);

  useEffect(() => {
    localStorage.setItem('rs_rates', JSON.stringify(rates));
  }, [rates]);

  const getWorkstationStats = (pc) => {
    if (pc.status !== 'Occupied' || !pc.startEpoch) {
      return { elapsedMins: 0, elapsedSecs: 0, bill: 0 };
    }
    const diffMs = Math.max(0, nowEpoch - pc.startEpoch);
    const totalSecs = Math.floor(diffMs / 1000);
    const elapsedMins = Math.floor(totalSecs / 60);
    const elapsedSecs = totalSecs % 60;
    const rate = pc.hourlyRate || 40;
    const bill = Math.max(10, Math.ceil((elapsedMins / 60) * rate));
    return { elapsedMins, elapsedSecs, bill };
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
    const confirmed = window.confirm(`End session for ${pc.id} (${pc.user})?\nTime: ${elapsedMins} mins\nBill: ₹${bill}`);
    
    if (confirmed) {
      const newSale = {
        id: Date.now(),
        desc: `${pc.id} Usage (${pc.user} - ${elapsedMins}m)`,
        amount: bill,
        method: "Cash",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setSalesHistory([newSale, ...salesHistory]);

      setWorkstations(workstations.map(p => {
        if (p.id === pc.id) {
          return { ...p, status: 'Available', user: '-', purpose: '-', startTime: null, startEpoch: null };
        }
        return p;
      }));
    }
  };

  const handleStatusChange = (appId, newStatus) => {
    setApplications(applications.map(app => app.id === appId ? { ...app, status: newStatus } : app));
  };

  const handleDeleteApplication = (appId) => {
    if (window.confirm("Delete this record?")) {
      setApplications(applications.filter(app => app.id !== appId));
    }
  };

  const handleNotifyWhatsApp = (app) => {
    const message = encodeURIComponent(
      `Hello ${app.customer}! RS Computer Cyber Cafe update: Your request for "${app.service}" status is: ${app.status.toUpperCase()}.`
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
      appliedDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "In Progress",
      fee: newAppForm.fee,
      docsVerified: true,
      ackNumber: `WALK-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setApplications([newEntry, ...applications]);
    setNewAppModal(false);
    setNewAppForm({ customer: '', phone: '', service: 'PAN Card (New Form 49A)', fee: '₹200' });
  };

  const posRateBw = rates.find(r => r.key === 'bwPrint')?.rate || 2;
  const posRateColor = rates.find(r => r.key === 'colorPrint')?.rate || 10;
  const posRateHour = rates.find(r => r.key === 'pcHour')?.rate || 40;
  const posRateLami = rates.find(r => r.key === 'lamination')?.rate || 40;
  const posRatePhotos = rates.find(r => r.key === 'photos')?.rate || 60;

  const posTotal = (posBw * posRateBw) + (posColor * posRateColor) + (posHours * posRateHour) + (posLami * posRateLami) + (posPhotos * posRatePhotos);

  const handleRecordSale = (method) => {
    if (posTotal === 0) return;
    const items = [];
    if (posBw > 0) items.push(`${posBw} B/W`);
    if (posColor > 0) items.push(`${posColor} Color`);
    if (posHours > 0) items.push(`${posHours}h PC`);
    if (posLami > 0) items.push(`${posLami} Lami`);
    if (posPhotos > 0) items.push(`${posPhotos} Photos`);

    const newSale = {
      id: Date.now(),
      desc: items.join(', '),
      amount: posTotal,
      method: method,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSalesHistory([newSale, ...salesHistory]);
    setPosBw(0); setPosColor(0); setPosHours(0); setPosLami(0); setPosPhotos(0);
    alert(`Payment of ₹${posTotal} recorded via ${method}!`);
  };

  const occupiedCount = workstations.filter(pc => pc.status === 'Occupied').length;
  const totalRevenue = salesHistory.reduce((sum, item) => sum + Number(item.amount || 0), 0);

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 p-[1.5px] flex items-center justify-center">
              <span className="font-extrabold text-white text-base">RS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">RS COMPUTER</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  Live Admin
                </span>
              </div>
              <div className="text-xs text-slate-400">Real-Time Cyber Cafe Operations</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden md:flex items-center gap-2 bg-[#0a122e] px-3.5 py-2 rounded-xl border border-blue-900/40 text-slate-300">
              <IconClock className="w-4 h-4 text-sky-400" />
              <span>{currentTime}</span> • <span>{currentDate}</span>
            </div>
            <button onClick={onExitToWebsite} className="px-3.5 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-sky-300 font-semibold cursor-pointer">
              Public Site ↗
            </button>
            <button onClick={onLogout} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold cursor-pointer">
              <IconLogout className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-[#060c22] border-b border-blue-900/30 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto py-2.5 scrollbar-none">
          {[
            { id: 'overview', label: '📊 Live Overview' },
            { id: 'workstations', label: `🖥️ PC Workstations (${occupiedCount}/10 Active)` },
            { id: 'applications', label: `📋 Real Applications (${applications.length})` },
            { id: 'billing', label: '💵 Quick Counter POS' },
            { id: 'rates', label: '⚙️ Service Rates' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer ${
                activeTab === tab.id ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-[#09122c] border border-blue-900/40 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Today's Real Sales</span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><IconRupee className="w-4 h-4" /></div>
                </div>
                <div className="text-3xl font-black text-emerald-400">₹{totalRevenue}</div>
                <div className="text-[11px] text-slate-400 mt-1">{salesHistory.length} sales recorded</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#09122c] border border-blue-900/40 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Active Workstations</span>
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400"><IconComputer className="w-4 h-4" /></div>
                </div>
                <div className="text-3xl font-black text-white">{occupiedCount} <span className="text-sm font-normal text-slate-400">/ 10</span></div>
                <div className="text-[11px] text-sky-400 mt-1">{10 - occupiedCount} PCs Available</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#09122c] border border-blue-900/40 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Applications</span>
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><IconShield className="w-4 h-4" /></div>
                </div>
                <div className="text-3xl font-black text-white">{applications.length}</div>
                <div className="text-[11px] text-amber-400 mt-1">{applications.filter(a => a.status === 'Pending').length} Pending</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#09122c] border border-blue-900/40 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Storage</span>
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400"><IconSpeed className="w-4 h-4" /></div>
                </div>
                <div className="text-3xl font-black text-emerald-400">Active</div>
                <div className="text-[11px] text-slate-400 mt-1">Real localStorage Data</div>
              </div>
            </div>

            {/* Sales Stream */}
            <div className="p-6 rounded-3xl bg-[#09122c] border border-blue-900/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase">Today's Transactions</h3>
                {salesHistory.length > 0 && (
                  <button onClick={() => setSalesHistory([])} className="text-xs text-rose-400 hover:underline cursor-pointer">Clear History</button>
                )}
              </div>
              {salesHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs italic">No transactions yet today. End a PC session or bill prints in the POS to record real cash.</div>
              ) : (
                <div className="space-y-2">
                  {salesHistory.map(sale => (
                    <div key={sale.id} className="flex items-center justify-between p-3 rounded-xl bg-[#060c20] border border-blue-950 text-xs">
                      <div><span className="text-slate-400 mr-3">{sale.time}</span><span className="font-bold text-white">{sale.desc}</span></div>
                      <div className="font-black text-emerald-400 text-sm">₹{sale.amount}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: WORKSTATIONS */}
        {activeTab === 'workstations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {workstations.map(pc => {
                const isOccupied = pc.status === 'Occupied';
                const { elapsedMins, elapsedSecs, bill } = getWorkstationStats(pc);

                return (
                  <div key={pc.id} className={`p-4 rounded-2xl border flex flex-col justify-between ${
                    isOccupied ? 'bg-[#0a1638] border-sky-500/50 shadow-lg' : 'bg-[#09122c] border-blue-900/40'
                  }`}>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-black text-white">{pc.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOccupied ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>{pc.status}</span>
                      </div>
                      <div className="text-xs space-y-1 mb-4 text-slate-300">
                        <div>User: <span className="font-bold text-white">{pc.user}</span></div>
                        {isOccupied && (
                          <div className="pt-2 border-t border-blue-900/40">
                            <div className="text-slate-400">Live Duration:</div>
                            <div className="text-base font-bold font-mono text-sky-400">{elapsedMins}m {elapsedSecs}s</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      {isOccupied ? (
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-blue-900/40">
                          <span className="font-bold text-emerald-400">₹{bill}</span>
                          <button onClick={() => handleEndSession(pc)} className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white cursor-pointer">
                            End & Bill
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => { setNewSessionModal(pc.id); setSessionForm({ user: '', purpose: 'Internet Browsing', hourlyRate: 40 }); }} className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white cursor-pointer">
                          Start Session
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: REAL APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Customer Applications ({applications.length})</h2>
              <button onClick={() => setNewAppModal(true)} className="px-4 py-2 rounded-xl bg-blue-600 font-bold text-xs text-white cursor-pointer">+ Add Record</button>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12 bg-[#09122c] rounded-2xl border border-blue-900/40 text-slate-400 text-xs">
                No customer applications yet. When customers submit the Contact form, they appear here live.
              </div>
            ) : (
              <div className="rounded-2xl border border-blue-900/40 bg-[#09122c] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#060c20] text-slate-400 border-b border-blue-900/40 uppercase">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Fee</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/30 text-slate-300">
                    {filteredApps.map(app => (
                      <tr key={app.id}>
                        <td className="p-3 font-bold text-white">{app.customer}<div className="text-[11px] text-slate-400 font-normal">{app.phone}</div></td>
                        <td className="p-3">{app.service}</td>
                        <td className="p-3">
                          <select value={app.status} onChange={(e) => handleStatusChange(app.id, e.target.value)} className="bg-slate-900 px-2 py-1 rounded border border-blue-800 text-xs">
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="p-3 font-bold text-emerald-400">{app.fee}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => handleNotifyWhatsApp(app)} className="p-1.5 rounded bg-emerald-600 text-white font-bold mr-2 cursor-pointer">WhatsApp</button>
                          <button onClick={() => handleDeleteApplication(app.id)} className="text-rose-400 cursor-pointer">✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REAL POS BILLING */}
        {activeTab === 'billing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-[#09122c] border border-blue-900/40 rounded-3xl p-6 space-y-3">
              {[
                { label: "B/W Laser Print", rate: posRateBw, val: posBw, set: setPosBw },
                { label: "Color Print", rate: posRateColor, val: posColor, set: setPosColor },
                { label: "PC Browsing Hours", rate: posRateHour, val: posHours, set: setPosHours },
                { label: "A4 Lamination", rate: posRateLami, val: posLami, set: setPosLami },
                { label: "Passport Photos (8)", rate: posRatePhotos, val: posPhotos, set: setPosPhotos }
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#060c20] border border-blue-950 flex justify-between items-center text-xs">
                  <div><div className="font-bold text-white text-sm">{item.label}</div><div className="text-sky-400">₹{item.rate} each</div></div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => item.set(Math.max(0, item.val - 1))} className="w-7 h-7 rounded bg-slate-800 font-bold cursor-pointer">-</button>
                    <span className="w-8 text-center font-bold text-sm">{item.val}</span>
                    <button onClick={() => item.set(item.val + 1)} className="w-7 h-7 rounded bg-blue-600 font-bold cursor-pointer">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 bg-[#09122c] border border-blue-900/40 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-400 uppercase font-bold">Total Bill</div>
                <div className="text-4xl font-black text-emerald-400 my-4">₹{posTotal}</div>
              </div>
              <div className="space-y-2">
                <button disabled={posTotal === 0} onClick={() => handleRecordSale("Cash")} className="w-full py-3 rounded-xl bg-emerald-600 font-bold text-sm disabled:opacity-40 cursor-pointer">
                  Collect Cash (₹{posTotal})
                </button>
                <button disabled={posTotal === 0} onClick={() => handleRecordSale("UPI")} className="w-full py-3 rounded-xl bg-blue-600 font-bold text-sm disabled:opacity-40 cursor-pointer">
                  Collect UPI (₹{posTotal})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: RATES */}
        {activeTab === 'rates' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rates.map((r, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#09122c] border border-blue-900/40 flex justify-between items-center text-xs">
                  <div><div className="font-bold text-white text-sm">{r.label}</div><div className="text-slate-400">{r.unit}</div></div>
                  <div className="flex items-center gap-1.5">
                    <span>₹</span>
                    <input type="number" value={r.rate} onChange={(e) => {
                      const updated = [...rates]; updated[i].rate = Number(e.target.value); setRates(updated);
                    }} className="w-20 px-2 py-1 rounded bg-[#060c20] border border-blue-800 text-right font-bold" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Start Session Modal */}
      {newSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#09122c] border border-blue-900/60 rounded-2xl p-6 max-w-sm w-full text-xs">
            <h3 className="text-sm font-bold text-white mb-3">Assign {newSessionModal}</h3>
            <form onSubmit={confirmStartSession} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Customer Name</label>
                <input required type="text" value={sessionForm.user} onChange={(e) => setSessionForm({ ...sessionForm, user: e.target.value })} placeholder="Enter customer name" className="w-full p-2 rounded bg-[#060c20] border border-blue-800 text-white" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 rounded bg-blue-600 font-bold text-white cursor-pointer">Start Timer</button>
                <button type="button" onClick={() => setNewSessionModal(null)} className="px-3 py-2 rounded bg-slate-800 text-slate-400 cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add App Modal */}
      {newAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#09122c] border border-blue-900/60 rounded-2xl p-6 max-w-sm w-full text-xs">
            <h3 className="text-sm font-bold text-white mb-3">Add Customer Application</h3>
            <form onSubmit={handleAddNewApp} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Name</label>
                <input required type="text" value={newAppForm.customer} onChange={(e) => setNewAppForm({ ...newAppForm, customer: e.target.value })} placeholder="Customer name" className="w-full p-2 rounded bg-[#060c20] border border-blue-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">WhatsApp Number</label>
                <input required type="tel" value={newAppForm.phone} onChange={(e) => setNewAppForm({ ...newAppForm, phone: e.target.value })} placeholder="9876543210" className="w-full p-2 rounded bg-[#060c20] border border-blue-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Service Fee</label>
                <input type="text" value={newAppForm.fee} onChange={(e) => setNewAppForm({ ...newAppForm, fee: e.target.value })} placeholder="₹200" className="w-full p-2 rounded bg-[#060c20] border border-blue-800 text-white" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 rounded bg-blue-600 font-bold text-white cursor-pointer">Save</button>
                <button type="button" onClick={() => setNewAppModal(false)} className="px-3 py-2 rounded bg-slate-800 text-slate-400 cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}