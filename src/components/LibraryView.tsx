import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Scale, Sparkles, Filter, Heart, Zap, Leaf, Activity, PlusCircle } from 'lucide-react';
import { Millet } from '../types';

interface LibraryViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSavedOnly: boolean;
  setShowSavedOnly: (show: boolean) => void;
  setShowCatalog: (show: boolean) => void;
  filteredMillets: Millet[];
  savedMilletIds: string[];
  toggleSaveMillet: (e: React.MouseEvent, id: string) => void;
  setSelectedMillet: (millet: Millet) => void;
  language?: 'en' | 'kn' | 'hi';
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  searchQuery,
  setSearchQuery,
  showSavedOnly,
  setShowSavedOnly,
  setShowCatalog,
  filteredMillets,
  savedMilletIds,
  toggleSaveMillet,
  setSelectedMillet,
  language = 'en'
}) => {
  const translations = {
    en: {
      searchPlaceholder: "Search Millets...",
      viewCatalog: "View Catalog",
      savedItems: "Saved Items",
      smartRegistry: "Smart Registry",
      archive: "Siri-Dhanya Archive",
      metadata: "View Metadata",
      superfood: "Superfood",
      stats: "+12 Bio-Stats",
      explore: "Explore",
      available: "Available",
      description: "Digital catalog of climate-resilient grains, nutritional profiles, and traditional farming methodologies."
    },
    kn: {
      searchPlaceholder: "ಸಿರಿಧಾನ್ಯಗಳನ್ನು ಹುಡುಕಿ...",
      viewCatalog: "ಕ್ಯಾಟಲಾಗ್ ನೋಡಿ",
      savedItems: "ಉಳಿಸಿದ ಐಟಂಗಳು",
      smartRegistry: "ಸ್ಮಾರ್ಟ್ ನೋಂದಣಿ",
      archive: "ಸಿರಿ-ಧಾನ್ಯ ದಾಸ್ತಾನು",
      metadata: "ಮೆಟಾಡೇಟಾ ವೀಕ್ಷಿಸಿ",
      superfood: "ಸೂಪರ್‌ಫುಡ್",
      stats: "+12 ಬಯೋ-ಅಂಕಿಅಂಶಗಳು",
      explore: "ಅನ್ವೇಷಿಸಿ",
      available: "ಲಭ್ಯವಿದೆ",
      description: "ಹವಾಮಾನ-ನಿರೋಧಕ ಧಾನ್ಯಗಳು, ಪೌಷ್ಟಿಕಾಂಶದ ವಿವರಗಳು ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಕೃಷಿ ವಿಧಾನಗಳ ಡಿಜಿಟಲ್ ಕ್ಯಾಟಲಾಗ್."
    },
    hi: {
      searchPlaceholder: "बाजरा खोजें...",
      viewCatalog: "कैटलॉग देखें",
      savedItems: "सहेजे गए आइटम",
      smartRegistry: "स्मार्ट रजिस्ट्री",
      archive: "सिरी-धान्य संग्रह",
      metadata: "मेटाडेटा देखें",
      superfood: "सुपरफूड",
      stats: "+12 बायो-आंकड़े",
      explore: "अन्वेषण",
      available: "उपलब्ध",
      description: "जलवायु-अनुकूल अनाज, पोषण संबंधी प्रोफाइल और पारंपरिक खेती पद्धतियों का डिजिटल कैटलॉग।"
    }
  };

  const t = translations[language];
  return (
    <div className="space-y-12">
      {/* Library Hero Section */}
      <div className="relative rounded-[48px] overflow-hidden bg-slate-900 min-h-[400px] flex items-center p-8 md:p-16 border-b-8 border-emerald-500 shadow-2xl">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop" 
            alt="Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.1),transparent_50%)]" />
        </div>

        <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <Sparkles size={12} />
                {t.archive}
              </span>
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.8] uppercase font-display">
                {t.smartRegistry.split(' ')[0]} <br />
                <span className="text-emerald-500">{t.smartRegistry.split(' ')[1]}</span>
              </h2>
            </motion.div>
            <p className="text-slate-300 font-bold text-base md:text-lg uppercase tracking-wide max-w-md leading-relaxed">
              {t.description}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-[32px] border border-white/10 flex items-center gap-2 px-6 shadow-2xl focus-within:bg-white/20 transition-all">
              <Search size={22} className="text-emerald-400" />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none py-5 font-bold text-white placeholder:text-slate-400 min-w-[200px] text-lg"
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`p-6 rounded-[32px] border flex items-center justify-center transition-all shadow-xl ${showSavedOnly ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}
            >
              <Filter size={24} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCatalog(true)}
              className="bg-emerald-500 text-white px-10 py-6 rounded-[32px] font-black uppercase tracking-wider text-sm hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/30 flex items-center gap-4 group border-b-4 border-emerald-700"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Scale size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] opacity-70 leading-none mb-1">{t.explore}</p>
                <p className="leading-none">{t.viewCatalog}</p>
              </div>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform ml-2" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Grain Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {filteredMillets.map((millet, idx) => (
            <motion.div
              key={millet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedMillet(millet)}
              className="group relative bg-white rounded-[40px] p-6 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all cursor-pointer overflow-hidden border-b-8 border-transparent hover:border-emerald-500"
            >
              <div className="aspect-[4/3] rounded-[32px] overflow-hidden mb-6 relative">
                <motion.img 
                  src={millet.imageUrl || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop'}
                  alt={millet.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e: React.MouseEvent) => toggleSaveMillet(e, millet.id)}
                    className={`p-3 rounded-2xl backdrop-blur-md transition-all shadow-xl ${savedMilletIds.includes(millet.id) ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-900 hover:bg-white'}`}
                  >
                    <Heart size={18} fill={savedMilletIds.includes(millet.id) ? 'currentColor' : 'none'} />
                  </motion.button>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                   <div className="bg-white/20 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-[10px]">
                     <PlusCircle size={14} />
                     {t.metadata}
                   </div>
                </div>
              </div>
              
                <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight font-display">
                    {language === 'kn' ? (millet.kannadaName || millet.name).split(' ')[0] : millet.name}
                  </h3>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      <Zap size={10} />
                      {t.superfood}
                    </div>
                    {millet.price && (
                      <div className="text-[10px] font-black text-white bg-slate-900 px-2 py-1 rounded-lg">
                        ₹{millet.price}/{language === 'kn' ? 'ಕೆಜಿ' : language === 'hi' ? 'किग्रा' : 'kg'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-slate-400 font-kannada leading-none">
                    {language === 'kn' ? millet.name : millet.kannadaName}
                  </p>
                  {millet.kg && (
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{millet.kg}{language === 'kn' ? 'ಕೆಜಿ' : language === 'hi' ? 'किग्रा' : 'kg'} {t.available}</p>
                  )}
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                  {millet.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                          {i === 1 ? <Leaf size={12} className="text-emerald-500" /> : i === 2 ? <Heart size={12} className="text-rose-500" /> : <Activity size={12} className="text-amber-500" />}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.stats}</span>
                  </div>
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors"
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
