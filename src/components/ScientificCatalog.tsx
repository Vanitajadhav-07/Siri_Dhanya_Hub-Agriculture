import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Download, Scale, Heart, Shield, Activity, PlusCircle } from 'lucide-react';
import { Millet } from '../types';

interface ScientificCatalogProps {
  showCatalog: boolean;
  setShowCatalog: (show: boolean) => void;
  filteredMillets: Millet[];
  handlePrintCatalog: () => void;
}

export const ScientificCatalog: React.FC<ScientificCatalogProps> = ({
  showCatalog,
  setShowCatalog,
  filteredMillets,
  handlePrintCatalog
}) => {
  return (
    <AnimatePresence>
      {showCatalog && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-white overflow-y-auto print:static print:bg-white"
        >
          <div className="max-w-4xl mx-auto p-8 md:p-12">
            <div className="flex items-center justify-between mb-12 print:hidden sticky top-0 bg-white/80 backdrop-blur-md py-4 z-10 border-b border-slate-100">
              <button 
                onClick={() => setShowCatalog(false)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors"
              >
                <ArrowLeft size={20} />
                Back to App
              </button>
              <button 
                onClick={handlePrintCatalog}
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
              >
                <Download size={20} />
                Print Scientific Guide
              </button>
            </div>

            <header className="border-b-4 border-emerald-600 pb-8 mb-12">
              <h1 className="text-5xl font-black text-slate-900 mb-2">Scientific Reference Guide</h1>
              <p className="text-slate-400 font-mono tracking-[0.3em] uppercase text-xs flex items-center gap-2">
                <Scale size={14} className="text-emerald-500" />
                International Year of Millets • Official Publication
              </p>
            </header>

            <div className="space-y-24">
              {filteredMillets.map((m, idx) => (
                <div key={m.id} className="grid grid-cols-1 md:grid-cols-12 gap-12 break-inside-avoid">
                  <div className="md:col-span-7 space-y-6">
                    <div className="flex items-start gap-6">
                      <span className="text-6xl font-black text-emerald-600/10 leading-none">{idx + 1}.</span>
                      <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">{m.name}</h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                          <p className="text-xl font-bold text-slate-600">Local Name: <span className="font-kannada text-emerald-700">{m.kannadaName}</span></p>
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden md:block"></div>
                          <p className="text-lg italic text-emerald-800/80 font-serif">Scientific: {m.scientificName}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-3xl border-l-4 border-emerald-500">
                      <p className="text-slate-700 leading-relaxed font-medium">{m.description}</p>
                    </div>

                    {/* Commercial Data from Backend */}
                    {(m.price || m.kg) && (
                      <div className="flex gap-4">
                        {m.price && (
                          <div className="bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Market Value</p>
                            <p className="text-xl font-black text-slate-900">₹{m.price}/kg</p>
                          </div>
                        )}
                        {m.kg && (
                          <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Available Qty</p>
                            <p className="text-xl font-black text-slate-900">{m.kg} KG</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       <div className="space-y-4">
                         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Nutritional Profile (per 100g)</h4>
                         <div className="grid grid-cols-2 gap-3">
                            {m.nutritionalValues.map((nv, i) => (
                              <div key={i} className="flex flex-col">
                                <span className="text-[10px] text-slate-400">{nv.label}</span>
                                <span className="font-bold text-slate-800">{nv.value}{nv.unit}</span>
                              </div>
                            ))}
                         </div>
                       </div>
                       <div className="space-y-4">
                         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Health Benefits</h4>
                         <ul className="space-y-2">
                            {m.benefits.map((benefit, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2 text-sm font-medium text-slate-600">
                                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                </div>
                                {benefit}
                              </li>
                            ))}
                         </ul>
                       </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 space-y-8">
                    <div className="aspect-square rounded-[40px] overflow-hidden border-8 border-slate-50 shadow-inner">
                      <img 
                        src={m.imageUrl} 
                        alt={m.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                       {[
                         { icon: Heart, label: 'Cardiac', value: 'High' },
                         { icon: Shield, label: 'Immunity', value: 'Ultra' },
                         { icon: Scale, label: 'Glycemic', value: 'Low' },
                         { icon: Activity, label: 'Digest', value: 'Fast' }
                       ].map((stat, sIdx) => (
                         <div key={sIdx} className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                           <stat.icon size={14} className="mb-1 text-slate-400" />
                           <span className="text-[8px] font-black uppercase text-slate-400 text-center">{stat.label}</span>
                           <span className="text-[10px] font-black text-emerald-600 uppercase">{stat.value}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="mt-32 pt-12 border-t border-slate-100 text-center">
              <p className="text-xs font-black text-slate-300 uppercase tracking-[0.4em]">End of Official Record • Siri-Dhanya Archive v2.0</p>
            </footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
