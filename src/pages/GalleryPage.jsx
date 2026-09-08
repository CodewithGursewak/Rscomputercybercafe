import React, { useState } from 'react';
import { galleryCategories, galleryItems } from '../data/galleryData';
import { IconClose } from '../components/Icons';

export default function GalleryPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeImage, setActiveImage] = useState(null);

  const filteredItems = galleryItems.filter(
    (item) => selectedFilter === 'All' || item.category === selectedFilter
  );

  return (
    <div className="min-h-screen bg-[#040817] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 text-sky-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider mb-4">
            Virtual Tour & Atmosphere
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            RS Computer <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Cyber Cafe Gallery</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Take a look inside our high-tech cyber lounge, air-conditioned private booths, industrial printing lab, and biometric photo studio.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {galleryCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedFilter === category
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25'
                  : 'bg-[#09122c] border border-blue-900/40 text-slate-400 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group cursor-pointer relative rounded-2xl overflow-hidden bg-[#09122c] border border-blue-900/40 hover:border-sky-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-sky-500/10"
            >
              {/* Image with zoom effect */}
              <div className="overflow-hidden aspect-video relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060c20] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                {/* Floating Tag */}
                <div className="absolute top-3 right-3 bg-[#070e28]/85 backdrop-blur-md border border-sky-500/40 px-3 py-1 rounded-full text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                  {item.tag}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5">
                <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider mb-1">
                  {item.category}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setActiveImage(null)}
          >
            <div 
              className="relative max-w-4xl w-full bg-[#09122c] border border-blue-800/60 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-sky-500 transition-colors"
              >
                <IconClose className="w-5 h-5" />
              </button>

              <img
                src={activeImage.image}
                alt={activeImage.title}
                className="w-full max-h-[70vh] object-cover"
              />

              <div className="p-6 bg-[#070e24]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-blue-950 border border-blue-800/50">
                    {activeImage.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    • {activeImage.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {activeImage.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeImage.description}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
