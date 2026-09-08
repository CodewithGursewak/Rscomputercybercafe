import React from 'react';

import { 
  IconUsers, 
  IconGrid, 
  IconShield, 
  IconStar, 
  IconChat 
} from '../components/Icons';

export default function StatsBanner({ onContactClick }) {
  const stats = [
    {
      icon: <IconUsers className="w-6 h-6 text-sky-400" />,
      value: "10K+",
      label: "Happy Customers"
    },
    {
      icon: <IconGrid className="w-6 h-6 text-sky-400" />,
      value: "50+",
      label: "Services Available"
    },
    {
      icon: <IconShield className="w-6 h-6 text-sky-400" />,
      value: "5+",
      label: "Years of Experience"
    },
    {
      icon: <IconStar className="w-6 h-6 text-amber-400 fill-amber-400" />,
      value: "99%",
      label: "Customer Satisfaction"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#0a122e]/90 border border-blue-900/40 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Stats Items */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 flex-1 w-full">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-900/40 shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Action Button */}
          <div className="shrink-0 w-full lg:w-auto">
            <button
              onClick={onContactClick}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <IconChat className="w-4 h-4" />
              <span>Get in Touch</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
