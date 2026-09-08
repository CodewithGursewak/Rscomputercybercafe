import React from 'react';
import { 
  IconSpeed, 
  IconShield, 
  IconSupport, 
  IconStar, 
  IconCheck, 
  IconComputer, 
  IconPrinter, 
  IconUsers 
} from '../components/Icons';

export default function AboutPage({ setActivePage }) {
  const features = [
    {
      title: "300 Mbps Dual Optical Fiber",
      desc: "Ultra-fast ping, zero latency, and redundant backup ISP lines ensuring seamless online exam submissions and application downloads.",
      icon: <IconSpeed className="w-6 h-6 text-sky-400" />
    },
    {
      title: "Heavy-Duty Laser Printing",
      desc: "Industrial Xerox & Canon laser engines delivering 1200 DPI crisp printouts on premium quality bond and photo sheets.",
      icon: <IconPrinter className="w-6 h-6 text-teal-400" />
    },
    {
      title: "100% Data Privacy & Security",
      desc: "All client personal identity documents, OTPs, and bank transactions are wiped immediately after form completion. Zero data retention.",
      icon: <IconShield className="w-6 h-6 text-blue-400" />
    },
    {
      title: "100% Power Generator Backup",
      desc: "Equipped with high-capacity online UPS systems and backup generators so your exams or form deadlines are never interrupted by power cuts.",
      icon: <IconSupport className="w-6 h-6 text-indigo-400" />
    }
  ];

  const testimonials = [
    {
      name: "Ramesh Sharma",
      role: "Govt Job Aspirant",
      text: "I applied for SSC CGL and Railway exam forms from RS Computer Cafe. The operator checked my documents twice and resized my photo perfectly. Both admit cards came without any issue!",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "College Student",
      text: "Best cyber cafe in town! Printing speed is amazing and the rate is only ₹2 per page. The PCs have comfortable chairs and fast internet for research projects.",
      rating: 5
    },
    {
      name: "Sunil Verma",
      role: "Business Owner",
      text: "Got my company's GST documents printed, laminated, and scanned to PDF within 10 minutes. Polite staff and very clean air-conditioned environment.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#040817] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 text-sky-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider mb-4">
            Established 2019
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">RS Computer Cyber Cafe</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Your neighborhood digital center bridging citizens, students, and job seekers with official online government portals and modern computing facilities.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Pioneering Trusted Digital Assistance & Fast Computing
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Founded with the vision to simplify digital government services, RS Computer Cyber Cafe has grown to become the most reputable and sought-after tech center in the area. We understand that applying for a competitive exam, rectifying an Aadhaar card, or printing university thesis papers requires extreme accuracy and reliable technology.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our staff consists of certified computer operators trained in official government portals (UIDAI, NSDL, UTITSL, NVSP, SSC, UPSC, State Exam boards). We ensure zero form rejection by double-verifying every single applicant detail before final fee submission.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#09122c] border border-blue-900/40">
                <div className="text-2xl font-black text-sky-400">10,000+</div>
                <div className="text-xs text-slate-400">Forms Submitted Successfully</div>
              </div>
              <div className="p-4 rounded-xl bg-[#09122c] border border-blue-900/40">
                <div className="text-2xl font-black text-emerald-400">99.8%</div>
                <div className="text-xs text-slate-400">Zero-Rejection Track Record</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-blue-800/50 shadow-2xl shadow-blue-950">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                alt="RS Computer Cyber Cafe Center"
                className="w-full h-[380px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050a1a] via-[#050a1a]/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-[#08102a]/90 backdrop-blur-md p-4 rounded-2xl border border-blue-800/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                    <IconShield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Authorized & Registered Digital Service Point</h4>
                    <p className="text-xs text-slate-400">Compliant with all state and central online e-governance standards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Equipment & Standards Grid */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              State-of-the-Art Infrastructure
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built with commercial-grade hardware for uncompromising speed and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#09122c] border border-blue-900/40 hover:border-sky-500/40 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/10"
              >
                <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-900/40 w-fit mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="mb-16 bg-[#060c22] border border-blue-900/40 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              What Our Customers Say
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Honest reviews from students, job aspirants, and local business owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#09122c]/80 border border-blue-900/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(item.rating)].map((_, idx) => (
                      <IconStar key={idx} className="w-4 h-4" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                    "{item.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-blue-950 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center font-bold text-xs text-white">
                    {item.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <span className="text-[11px] text-sky-400">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Strip */}
        <div className="text-center bg-gradient-to-r from-blue-900/40 via-sky-900/30 to-blue-900/40 border border-blue-800/40 rounded-3xl p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Ready to get your work done in minutes?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-lg mx-auto">
            Walk in directly to our center or connect with our operators online via WhatsApp for immediate support.
          </p>
          <button
            onClick={() => {
              setActivePage('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-sky-500/50 hover:scale-105 transition-all cursor-pointer"
          >
            Visit Our Center or Contact Us
          </button>
        </div>

      </div>
    </div>
  );
}
