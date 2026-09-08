import React, { useState } from 'react';
import { pricingCategories } from '../data/pricingData';
import { 
  IconComputer, 
  IconPrinter, 
  IconLamination, 
  IconPanCard, 
  IconWhatsApp, 
  IconCheck 
} from '../components/Icons';

export default function PricingPage() {
  // Calculator state
  const [bwPrints, setBwPrints] = useState(10);
  const [colorPrints, setColorPrints] = useState(2);
  const [pcHours, setPcHours] = useState(1);
  const [lamination, setLamination] = useState(0);
  const [pvcCards, setPvcCards] = useState(0);

  // Rates
  const rateBw = 2;
  const rateColor = 10;
  const ratePc = 40;
  const rateLamination = 40;
  const ratePvc = 80;

  // Calculation
  const totalCost = (bwPrints * rateBw) + 
                    (colorPrints * rateColor) + 
                    (pcHours * ratePc) + 
                    (lamination * rateLamination) + 
                    (pvcCards * ratePvc);

  const handleSendEstimateWhatsApp = () => {
    const summary = `Hello RS Computer Cafe! I calculated an estimate on your website:\n` +
      `- B/W Prints: ${bwPrints} pages (₹${bwPrints * rateBw})\n` +
      `- Color Prints: ${colorPrints} pages (₹${colorPrints * rateColor})\n` +
      `- PC Workstation: ${pcHours} hour(s) (₹${pcHours * ratePc})\n` +
      (lamination > 0 ? `- Lamination: ${lamination} sheet(s) (₹${lamination * rateLamination})\n` : '') +
      (pvcCards > 0 ? `- PVC Smart Cards: ${pvcCards} card(s) (₹${pvcCards * ratePvc})\n` : '') +
      `*Total Estimated Amount: ₹${totalCost}*\nCan I get this done today?`;

    window.open(`https://wa.me/919023060244?text=${encodeURIComponent(summary)}`, '_blank');
  };

  const getCategoryIcon = (icon) => {
    switch (icon) {
      case 'computer': return <IconComputer className="w-6 h-6 text-sky-400" />;
      case 'printer': return <IconPrinter className="w-6 h-6 text-teal-400" />;
      case 'lamination': return <IconLamination className="w-6 h-6 text-yellow-400" />;
      case 'pan': return <IconPanCard className="w-6 h-6 text-indigo-400" />;
      default: return <IconPrinter className="w-6 h-6 text-sky-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#040817] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 text-sky-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider mb-4">
            Transparent Pricing
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Affordable Rates with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Zero Hidden Fees</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Standard published pricing for workstation usage, high-resolution printing, xerox, smart cards, and online form applications.
          </p>
        </div>

        {/* ===================== INTERACTIVE INSTANT CALCULATOR ===================== */}
        <div className="mb-16 bg-gradient-to-br from-[#09122c] to-[#070e24] border border-blue-900/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 relative z-10">
            
            {/* Calculator Controls */}
            <div className="flex-1 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Interactive Tool</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Instant Cost Calculator
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Adjust the quantities below to calculate your estimated bill in real time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* B/W Prints */}
                <div className="bg-[#050a1b]/80 p-4 rounded-xl border border-blue-950">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                    <span>B/W Laser Prints (₹2/page)</span>
                    <span className="text-sky-400 font-bold">{bwPrints} pages</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={bwPrints}
                    onChange={(e) => setBwPrints(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                {/* Color Prints */}
                <div className="bg-[#050a1b]/80 p-4 rounded-xl border border-blue-950">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                    <span>Color Prints (₹10/page)</span>
                    <span className="text-teal-400 font-bold">{colorPrints} pages</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={colorPrints}
                    onChange={(e) => setColorPrints(Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                </div>

                {/* PC Workstation Hours */}
                <div className="bg-[#050a1b]/80 p-4 rounded-xl border border-blue-950">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                    <span>PC Browsing / Gaming (₹40/hr)</span>
                    <span className="text-indigo-400 font-bold">{pcHours} hr(s)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="1"
                    value={pcHours}
                    onChange={(e) => setPcHours(Number(e.target.value))}
                    className="w-full accent-indigo-400 cursor-pointer"
                  />
                </div>

                {/* Lamination */}
                <div className="bg-[#050a1b]/80 p-4 rounded-xl border border-blue-950">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                    <span>A4 Lamination (₹40/sheet)</span>
                    <span className="text-amber-400 font-bold">{lamination} sheet(s)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={lamination}
                    onChange={(e) => setLamination(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* PVC Smart Cards */}
                <div className="bg-[#050a1b]/80 p-4 rounded-xl border border-blue-950 sm:col-span-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                    <span>PVC Smart Card Prints (Aadhaar / PAN) (₹80/card)</span>
                    <span className="text-rose-400 font-bold">{pvcCards} card(s)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={pvcCards}
                    onChange={(e) => setPvcCards(Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                </div>

              </div>
            </div>

            {/* Total Display Card */}
            <div className="lg:w-80 bg-[#060c22] border border-blue-900/60 rounded-2xl p-6 flex flex-col justify-between shrink-0 shadow-xl">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Estimated Total
                </div>
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-400 to-blue-400 mb-4">
                  ₹{totalCost}
                </div>

                <div className="space-y-2 text-xs text-slate-300 border-t border-blue-950 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span>B/W Prints:</span>
                    <span>₹{bwPrints * rateBw}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Color Prints:</span>
                    <span>₹{colorPrints * rateColor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PC Hours:</span>
                    <span>₹{pcHours * ratePc}</span>
                  </div>
                  {lamination > 0 && (
                    <div className="flex justify-between">
                      <span>Lamination:</span>
                      <span>₹{lamination * rateLamination}</span>
                    </div>
                  )}
                  {pvcCards > 0 && (
                    <div className="flex justify-between">
                      <span>PVC Cards:</span>
                      <span>₹{pvcCards * ratePvc}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSendEstimateWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <IconWhatsApp className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </button>
            </div>

          </div>
        </div>

        {/* ===================== FULL RATE TABLES ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pricingCategories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-[#09122c]/90 border border-blue-900/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-blue-900/40">
                  <div className="p-2.5 rounded-xl bg-blue-950/70 border border-blue-800/40">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {cat.category}
                  </h3>
                </div>

                {/* Items List */}
                <div className="space-y-3.5">
                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="p-3.5 rounded-xl bg-[#060c20]/60 border border-blue-950/70 hover:border-sky-500/30 transition-colors flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.note}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-extrabold text-sky-400">
                          {item.rate}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {item.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Footer note */}
              <div className="mt-5 pt-3 border-t border-blue-950/80 flex items-center gap-2 text-xs text-slate-400">
                <IconCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Bulk discount available on orders over 100 pages.</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
