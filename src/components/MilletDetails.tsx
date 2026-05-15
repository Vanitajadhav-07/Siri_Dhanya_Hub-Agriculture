import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChefHat, Info, Zap, Leaf, Heart, Activity, 
  Sparkles, Wand2, ChefHat as RecipeIcon, ShoppingBag, 
  ChevronRight, ArrowRight, Star, CheckCircle, Play, Loader2,
  HelpCircle, Youtube
} from 'lucide-react';
import { Millet, Recipe } from '../types';

interface MilletDetailsProps {
  millet: Millet | null;
  onClose: () => void;
  onGenerateRecipe: (milletName: string) => void;
  isGeneratingRecipe: boolean;
  currentRecipe: Recipe | null;
  recipePreference: string;
  setRecipePreference: (pref: string) => void;
  onGenerateVideo: (millet: Millet) => void;
  language?: 'en' | 'kn' | 'hi';
}

export const MilletDetails: React.FC<MilletDetailsProps> = ({
  millet,
  onClose,
  onGenerateRecipe,
  isGeneratingRecipe,
  currentRecipe,
  recipePreference,
  setRecipePreference,
  onGenerateVideo,
  language = 'en'
}) => {
  if (!millet) return null;

  const [showVideo, setShowVideo] = useState(false);

  const translations = {
    en: {
      nutritional: "Nutritional DNA",
      benefits: "Health Benefits",
      generateRecipe: "Forge Recipe",
      generateVideo: "Cinematic Guide",
      marketPrice: "Market Price",
      availableQty: "Available Qty",
      ecoProfile: "Ecological Profile",
      waterDep: "Water Dependency",
      carbonSeq: "Carbon Sequestration",
      bioBenefits: "Bio-Benefits Network",
      culinaryEngine: "AI Culinary Engine",
      masterclass: "Smart Masterclass",
      masterclassDesc: "Generate real-time cinematic cooking guides and nutritional recipes.",
      ingredients: "Ingredients Matrix",
      protocol: "Preparation Protocol",
      scientificNarrative: "Scientific Narrative",
      relatedQuestions: "Related Questions",
      quickActions: "Quick Actions",
      findProducers: "Find Producers Nearby",
      saveSeedBank: "Save to My Seed Bank",
      ultraLow: "Ultra-Low",
      high: "High"
    },
    kn: {
      nutritional: "ಪೌಷ್ಟಿಕಾಂಶದ ವಿವರ",
      benefits: "ಆರೋಗ್ಯ ಪ್ರಯೋಜನಗಳು",
      generateRecipe: "ರೆಸಿಪಿ ತಯಾರಿಸಿ",
      generateVideo: "ಸಿನಿಮೀಯ ಮಾರ್ಗದರ್ಶಿ",
      marketPrice: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",
      availableQty: "ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ",
      ecoProfile: "ಪರಿಸರ ವಿವರ",
      waterDep: "ನೀರಿನ ಅವಲಂಬನೆ",
      carbonSeq: "ಕಾರ್ಬನ್ ಸೀಕ್ವೆಸ್ಟ್ರೇಶನ್",
      bioBenefits: "ಜೈವಿಕ ಪ್ರಯೋಜನಗಳ ಜಾಲ",
      culinaryEngine: "ಎಐ ಪಾಕಶಾಲೆಯ ಎಂಜಿನ್",
      masterclass: "ಸ್ಮಾರ್ಟ್ ಮಾಸ್ಟರ್‌ಕ್ಲಾಸ್",
      masterclassDesc: "ನೈಜ-ಸಮಯದ ಸಿನಿಮೀಯ ಅಡುಗೆ ಮಾರ್ಗದರ್ಶಿಗಳು ಮತ್ತು ಪೌಷ್ಟಿಕಾಂಶದ ಪಾಕವಿಧಾನಗಳನ್ನು ತಯಾರಿಸಿ.",
      ingredients: "ಪದಾರ್ಥಗಳ ಪಟ್ಟಿ",
      protocol: "ತಯಾರಿಕೆಯ ವಿಧಾನ",
      scientificNarrative: "ವೈಜ್ಞಾನಿಕ ವಿವರಣೆ",
      relatedQuestions: "ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳು",
      quickActions: "ತ್ವರಿತ ಕ್ರಮಗಳು",
      findProducers: "ಹತ್ತಿರದ ಉತ್ಪಾದಕರನ್ನು ಹುಡುಕಿ",
      saveSeedBank: "ನನ್ನ ಬೀಜ ಬ್ಯಾಂಕ್‌ಗೆ ಉಳಿಸಿ",
      ultraLow: "ಅತಿ ಕಡಿಮೆ",
      high: "ಹೆಚ್ಚು"
    },
    hi: {
      nutritional: "पोषण संबंधी विवरण",
      benefits: "स्वास्थ्य लाभ",
      generateRecipe: "रेसिपी बनाएं",
      generateVideo: "सिनेमैटिक गाइड",
      marketPrice: "बाजार मूल्य",
      availableQty: "उपलब्ध मात्रा",
      ecoProfile: "पारिस्थितಿಕ प्रोफाइल",
      waterDep: "जल निर्भरता",
      carbonSeq: "कार्बन पृथक्करण",
      bioBenefits: "बायो-बेनिफिट्स नेटवर्क",
      culinaryEngine: "एआई पाक इंजन",
      masterclass: "स्मार्ट मास्टरक्लास",
      masterclassDesc: "वास्तविक समय के सिनेमाई खाना पकाने के गाइड और पोषण संबंधी व्यंजनों का निर्माण करें।",
      ingredients: "सामग्री सूची",
      protocol: "तैयारी प्रोटोकॉल",
      scientificNarrative: "वैज्ञानिक विवरण",
      relatedQuestions: "संबंधित प्रश्न",
      quickActions: "त्वरित कार्रवाई",
      findProducers: "नजदीकी उत्पादकों को खोजें",
      saveSeedBank: "मेरे बीज बैंक में सहेजें",
      ultraLow: "बेहद कम",
      high: "उच्च"
    }
  };

  const t = translations[language];

  const FAQ_DATA = [
    {
      q: language === 'kn' ? "ಇದು ಗ್ಲುಟನ್ ಮುಕ್ತವಾಗಿದೆಯೇ?" : language === 'hi' ? "क्या यह ग्लूटेन-मुक्त है?" : "Is this gluten-free?",
      a: language === 'kn' ? "ಹೌದು, ಎಲ್ಲಾ ಸಿರಿಧಾನ್ಯಗಳು ನೈಸರ್ಗಿಕವಾಗಿ ಗ್ಲುಟನ್ ಮುಕ್ತವಾಗಿರುತ್ತವೆ." : language === 'hi' ? "हाँ, सभी बाजरा स्वाभाविक रूप से ग्लूटेन-मुक्त होते हैं।" : "Yes, all millets are naturally gluten-free and alkaline in nature."
    },
    {
      q: language === 'kn' ? "ಬಳಸಲು ಉತ್ತಮ ಮಾರ್ಗ ಯಾವುದು?" : language === 'hi' ? "उपभोग करने का सबसे अच्छा तरीका?" : "Best way to consume?",
      a: language === 'kn' ? "ಗರಿಷ್ಠ ಪೌಷ್ಟಿಕಾಂಶದ ಹೀರಿಕೊಳ್ಳುವಿಕೆಗಾಗಿ, ಅಡುಗೆ ಮಾಡುವ ಮೊದಲು 6-8 ಗಂಟೆಗಳ ಕಾಲ ನೆನೆಸಲು ಶಿಫಾರಸು ಮಾಡಲಾಗುತ್ತದೆ." : language === 'hi' ? "अधिकतम पोषक तत्व अवशोषण के लिए, खाना पकाने से पहले 6-8 घंटे भिगोने की सिफारिश की जाती है।" : "To maximize nutrient absorption, soaking for 6-8 hours before cooking is recommended."
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[48px] overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="fixed md:absolute top-8 right-8 z-50 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-xl text-slate-800 rounded-full transition-all border border-white/20 shadow-lg"
          >
            <X size={24} />
          </button>

          {/* Left Column: Visuals & Stats */}
          <div className="w-full md:w-2/5 relative bg-slate-50 flex flex-col shrink-0">
            <div className="relative overflow-hidden group aspect-[4/5] md:flex-1">
              <img 
                src={millet.imageUrl} 
                alt={millet.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-4xl font-black text-white tracking-tighter uppercase font-display">{millet.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-emerald-400 font-kannada font-bold text-xl">{millet.kannadaName}</span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-white/60 font-serif italic text-sm">{millet.scientificName}</span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Display Price and KG from Backend */}
              {(Number(millet.price) > 0 || Number(millet.kg) > 0) && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {Number(millet.price) > 0 && (
                    <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex flex-col items-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-emerald-500 text-[8px] text-white px-2 py-0.5 rounded-bl-lg font-black uppercase tracking-tighter">Live</div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t.marketPrice}</span>
                      <span className="text-xl font-black text-slate-900">₹{millet.price}</span>
                    </div>
                  )}
                  {Number(millet.kg) > 0 && (
                    <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex flex-col items-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-emerald-500 text-[8px] text-white px-2 py-0.5 rounded-bl-lg font-black uppercase tracking-tighter">Live</div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t.availableQty}</span>
                      <span className="text-xl font-black text-slate-900">{millet.kg} KG</span>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {millet.nutritionalValues.map((stat, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</span>
                    <span className="text-xl font-black text-slate-900">{stat.value}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{stat.unit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-600 rounded-[32px] p-6 text-white overflow-hidden relative">
                 <div className="absolute -right-4 -top-4 opacity-10">
                   <Zap size={80} />
                 </div>
                 <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Sparkles size={12} />
                      {t.ecoProfile}
                    </p>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between text-xs font-bold border-b border-white/10 pb-2">
                         <span>{t.waterDep}</span>
                         <span className="text-emerald-200">{t.ultraLow}</span>
                       </div>
                       <div className="flex items-center justify-between text-xs font-bold border-b border-white/10 pb-2">
                         <span>{t.carbonSeq}</span>
                         <span className="text-emerald-200">{t.high}</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI & Content */}
          <div className="flex-1 md:overflow-y-auto p-8 md:p-12 space-y-12">
            {/* Health Benefits Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Heart size={20} className="text-emerald-600" />
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{t.bioBenefits}</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {millet.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-start">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-100">
                      <CheckCircle size={12} className="text-emerald-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-tight">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Recipe Section */}
            <section className="space-y-8 bg-slate-900 rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <RecipeIcon size={120} />
               </div>

               <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] uppercase font-bold tracking-widest">
                      <Wand2 size={12} />
                      {t.culinaryEngine}
                    </span>
                    <h4 className="text-4xl font-black tracking-tight leading-none uppercase font-display">
                      {t.masterclass.split(' ')[0]} <br /> <span className="text-emerald-500">{t.masterclass.split(' ')[1]}</span>
                    </h4>
                    <p className="text-slate-400 font-medium max-w-sm">{t.masterclassDesc}</p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                     <button 
                       onClick={() => onGenerateVideo(millet)}
                       className="px-8 py-5 bg-white text-slate-900 rounded-[24px] font-black uppercase text-xs tracking-wider flex items-center gap-3 hover:bg-slate-100 transition-all shadow-xl shadow-white/5"
                     >
                       <Play size={16} fill="currentColor" />
                       {t.generateVideo}
                     </button>
                     {millet.youtubeId && (
                       <button
                         onClick={() => setShowVideo(!showVideo)}
                         className="px-8 py-5 bg-red-600 text-white rounded-[24px] font-black uppercase text-xs tracking-wider flex items-center gap-3 hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
                       >
                         <Youtube size={16} />
                         {showVideo
                           ? (language === 'kn' ? 'ವೀಡಿಯೊ ಮುಚ್ಚಿ' : language === 'hi' ? 'वीडियो बंद करें' : 'Close Video')
                           : (language === 'kn' ? 'ರೆಸಿಪಿ ವೀಡಿಯೊ' : language === 'hi' ? 'रेसिपी वीडियो' : 'Recipe Video')
                         }
                       </button>
                     )}
                     <button 
                       onClick={() => onGenerateRecipe(millet.name)}
                       disabled={isGeneratingRecipe}
                       className="px-8 py-5 bg-emerald-500 text-white rounded-[24px] font-black uppercase text-xs tracking-wider flex items-center gap-3 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                     >
                       {isGeneratingRecipe ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                       {t.generateRecipe}
                     </button>
                  </div>
               </div>

               {/* YouTube Video Player */}
               <AnimatePresence>
                 {showVideo && millet.youtubeId && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="overflow-hidden"
                   >
                     <div className="mt-4 space-y-3">
                       <p className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                         <Youtube size={12} />
                         {language === 'kn' ? `${millet.kannadaName} ರೆಸಿಪಿ ವೀಡಿಯೊ` : language === 'hi' ? `${millet.kannadaName} रेसिपी वीडियो` : `${millet.name} Recipe Video`}
                       </p>
                       {/* Open in YouTube app/browser — works on Android */}
                       <div className="rounded-[24px] overflow-hidden bg-slate-800 border border-white/10">
                         <div className="aspect-video flex flex-col items-center justify-center gap-5 p-8">
                           <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/40">
                             <Play size={36} fill="white" className="text-white ml-1" />
                           </div>
                           <div className="text-center space-y-1">
                             <p className="text-white font-bold text-sm">
                               {language === 'kn' ? `${millet.kannadaName} ರೆಸಿಪಿ` : `${millet.name} Recipe`}
                             </p>
                             <p className="text-slate-400 text-xs">
                               {language === 'kn' ? 'ಯೂಟ್ಯೂಬ್‌ನಲ್ಲಿ ತೆರೆಯಲು ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Tap to watch on YouTube'}
                             </p>
                           </div>
                           <button
                             onClick={() => window.open(`https://www.youtube.com/watch?v=${millet.youtubeId}`, '_blank')}
                             className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center gap-2 shadow-xl shadow-red-600/30"
                           >
                             <Youtube size={16} />
                             {language === 'kn' ? 'ಯೂಟ್ಯೂಬ್ ತೆರೆಯಿರಿ' : language === 'hi' ? 'YouTube खोलें' : 'Open YouTube'}
                           </button>
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <AnimatePresence>
                 {currentRecipe && (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="mt-12 pt-12 border-t border-white/10 space-y-8"
                   >
                     <div className="flex flex-col md:flex-row gap-12">
                        <div className="w-full md:w-1/3 space-y-6">
                           <div className="space-y-2">
                             <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">{t.ingredients}</h5>
                             <div className="flex flex-wrap gap-2">
                               {currentRecipe.ingredients.map((ing, i) => (
                                 <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold">{ing}</span>
                               ))}
                             </div>
                           </div>
                           <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                              <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">AI Note</p>
                              <p className="text-[10px] text-slate-300 italic">"{language === 'kn' ? 'ಆಯ್ಕೆಗೆ ಹೊಂದುವಂತೆ ಮಾಡಲಾಗಿದೆ' : language === 'hi' ? 'पसंद के लिए अनुकूलित' : 'Optimized for'} {recipePreference} {language === 'kn' ? 'ಆಯ್ಕೆ. ಬಯೋ-ಸ್ಟ್ಯಾಟ್ಸ್ ಹೊಂದಾಣಿಕೆಯಾಗಿದೆ.' : language === 'hi' ? 'पसंद। बायो-आंकड़े मेल खाते हैं।' : 'preference. Bio-stats matched.'}"</p>
                           </div>
                        </div>
                        <div className="flex-1 space-y-6">
                           <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">{t.protocol}</h5>
                           <div className="space-y-4">
                             {currentRecipe.instructions.map((step, i) => (
                               <div key={i} className="flex gap-4">
                                 <span className="text-lg font-black text-emerald-500 font-mono">{(i+1).toString().padStart(2, '0')}</span>
                                 <p className="text-slate-300 text-sm font-medium leading-relaxed">{step}</p>
                               </div>
                             ))}
                           </div>
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </section>

            {/* Scientific Details & FAQ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-100 pt-12">
               <div className="space-y-6">
                 <div className="space-y-4">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                     <Info size={12} className="text-slate-400" />
                     {t.scientificNarrative}
                   </h5>
                   <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                     {millet.description}
                   </p>
                 </div>

                 {/* Related Questions in Modal */}
                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                      <HelpCircle size={12} className="text-emerald-500" />
                      {t.relatedQuestions}
                    </h5>
                    <div className="space-y-3">
                       {FAQ_DATA.map((item, i) => (
                         <div key={i} className="space-y-1">
                           <p className="text-xs font-black text-slate-800">{item.q}</p>
                           <p className="text-[10px] font-medium text-slate-500 leading-relaxed">{item.a}</p>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                   <Star size={12} className="text-amber-500" />
                   {t.quickActions}
                 </h5>
                 <div className="flex flex-col gap-2">
                    <button className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group">
                      <div className="flex items-center gap-3">
                        <ShoppingBag size={18} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{t.findProducers}</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group">
                      <div className="flex items-center gap-3">
                        <Star size={18} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{t.saveSeedBank}</span>
                      </div>
                      <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
