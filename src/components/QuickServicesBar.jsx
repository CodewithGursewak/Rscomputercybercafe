import React from 'react';
import { 
  IconBolt, 
  IconPanCard, 
  IconFingerprint, 
  IconVoterId, 
  IconPassport, 
  IconOnlineForms, 
  IconPrinter, 
  IconCamera,
  IconArrowRight
} from './Icons';

export default function QuickServicesBar({ onSelectService }) {
  const quickItems = [
    {
      id: "pan-card",
      title: "PAN Card",
      icon: <IconPanCard className="w-6 h-6 text-sky-400" />
    },
    {
      id: "aadhaar-services",
      title: "Aadhaar Services",
      icon: <IconFingerprint className="w-6 h-6 text-sky-400" />
    },
    {
      id: "voter-id",
      title: "Voter ID",
      icon: <IconVoterId className="w-6 h-6 text-sky-400" />
    },
    {
      id: "passport",
      title: "Passport",
      icon: <IconPassport className="w-6 h-6 text-sky-400" />
    },
    {
      id: "online-forms",
      title: "Online Forms",
      icon: <IconOnlineForms className="w-6 h-6 text-sky-400" />
    },
    {
      id: "printing-xerox",
      title: "Printing / Xerox",
      icon: <IconPrinter className="w-6 h-6 text-sky-400" />
    },
    {
      id: "photo-studio",
      title: "Photo Studio",
      icon: <IconCamera className="w-6 h-6 text-sky-400" />
    }
  ];

  return (
    <div className="relative -mt-8 sm:-mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#091129]/95 backdrop-blur-xl border border-blue-900/40 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xl shadow-blue-950/70">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4 xl:gap-6">
          
          {/* Left Callout Header */}
          <div className="flex items-center gap-3.5 xl:border-r xl:border-blue-900/40 xl:pr-6 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400 shadow-inner">
              <IconBolt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
                Quick Services
              </h3>
              <p className="text-xs text-slate-400 font-normal">
                Get your work done in just a few clicks!
              </p>
            </div>
          </div>

          {/* 7 Quick Service Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 flex-1">
            {quickItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectService(item.id)}
                className="group cursor-pointer bg-[#0c1638]/70 hover:bg-[#111f4d] border border-blue-900/30 hover:border-sky-500/50 rounded-xl p-3 flex flex-col items-center text-center justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/10"
              >
                {/* Icon Container */}
                <div className="mb-2 p-2 rounded-lg bg-blue-950/50 group-hover:bg-blue-900/40 transition-colors">
                  {item.icon}
                </div>

                {/* Service Title */}
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors line-clamp-1 mb-2.5">
                  {item.title}
                </span>

                {/* Circular Arrow Button */}
                <div className="w-6 h-6 rounded-full border border-slate-700/80 group-hover:border-sky-400 group-hover:bg-sky-500/20 flex items-center justify-center text-slate-400 group-hover:text-sky-300 transition-all duration-200">
                  <IconArrowRight className="w-2.5 h-2.5" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
