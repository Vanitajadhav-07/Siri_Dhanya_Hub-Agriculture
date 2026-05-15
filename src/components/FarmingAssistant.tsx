import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, Sun, Droplets, Wind, 
  Calendar, Clock, Sprout, ShieldAlert,
  ChevronRight, Thermometer, MapPin, 
  Leaf, Info, AlertTriangle, ScanLine, Camera, QrCode, CheckCircle
} from 'lucide-react';
import { SmartGPSTracker } from './SmartGPSTracker';

interface FarmingAssistantProps {
  onLocationUpdate?: (coords: {lat: number, lng: number}) => void;
  language?: 'en' | 'kn' | 'hi';
}

export const FarmingAssistant: React.FC<FarmingAssistantProps> = ({ onLocationUpdate, language = 'en' }) => {
  const translations = {
    en: {
      title: "Farming Assistant",
      seasonal: "Seasonal Calendar",
      scanning: "Crop Health Scan",
      aiAdvisor: "Smart AI Suggestions",
      weatherAlert: "Active Weather Alert",
      expertAdvisory: "View Detailed Advisory",
      verificationCenter: "Verification Center",
      qualityAssurance: "Quality Assurance Portal",
      verifyCrop: "Verify Crop",
      verifyTag: "Verify Tag",
      digitalCert: "Digital Certification",
      mainOperation: "Main Operation",
      targetCrops: "Target Crops",
      expertTip: "Expert Tip"
    },
    kn: {
      title: "ಕೃಷಿ ಸಹಾಯ",
      seasonal: "ಕಾಲೋಚಿತ ಕ್ಯಾಲೆಂಡರ್",
      scanning: "ಬೆಳೆ ಆರೋಗ್ಯ ತಪಾಸಣೆ",
      aiAdvisor: "ಸ್ಮಾರ್ಟ್ ಎಐ ಸಲಹೆಗಳು",
      weatherAlert: "ಸಕ್ರಿಯ ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ",
      expertAdvisory: "ವಿವರವಾದ ಸಲಹೆ ವೀಕ್ಷಿಸಿ",
      verificationCenter: "ಪರಿಶೀಲನಾ ಕೇಂದ್ರ",
      qualityAssurance: "ಗುಣಮಟ್ಟ ಭರವಸೆ ಪೋರ್ಟಲ್",
      verifyCrop: "ಬೆಳೆ ಪರಿಶೀಲಿಸಿ",
      verifyTag: "ಟ್ಯಾಗ್ ಪರಿಶೀಲಿಸಿ",
      digitalCert: "ಡಿಜಿಟಲ್ ಪ್ರಮಾಣೀಕರಣ",
      mainOperation: "ಮುಖ್ಯ ಕಾರ್ಯಾಚರಣೆ",
      targetCrops: "ಗುರಿ ಬೆಳೆಗಳು",
      expertTip: "ತಜ್ಞರ ಸಲಹೆ"
    },
    hi: {
      title: "खेती सहायक",
      seasonal: "मौसमी कैलेंडर",
      scanning: "फसल स्वास्थ्य स्कैन",
      aiAdvisor: "स्मार्ट एआई सुझाव",
      weatherAlert: "सक्रिय मौसम अलर्ट",
      expertAdvisory: "विस्तृत सलाह देखें",
      verificationCenter: "सत्यापन केंद्र",
      qualityAssurance: "गुणवत्ता आश्वासन पोर्टल",
      verifyCrop: "फसल सत्यापित करें",
      verifyTag: "टैग सत्यापित करें",
      digitalCert: "डिजिटल प्रमाणन",
      mainOperation: "मुख्य कार्य",
      targetCrops: "लक्षित फसलें",
      expertTip: "विशेषज्ञ टिप"
    }
  };

  const t = translations[language];

  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  
  const months = language === 'kn' ? [
    "ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್",
    "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್"
  ] : language === 'hi' ? [
    "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
  ] : [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const calendarData = [
    {
      month: 4,
      activity: language === 'kn' ? "ಭೂಮಿ ಸಿದ್ಧತೆ" : language === 'hi' ? "भूमि की तैयारी" : "Land Preparation",
      crops: language === 'kn' ? ["ರಾಗಿ", "ಸಜ್ಜೆ"] : language === 'hi' ? ["रागी", "बाजरा"] : ["Ragi", "Sajje"],
      tip: language === 'kn' ? "ಪ್ರತಿ ಹೆಕ್ಟೇರ್‌ಗೆ 10-15 ಟನ್ ಎಫ್‌ವೈಎಂ ಅನ್ವಯಿಸಿ." : language === 'hi' ? "प्रति हेक्टेयर 10-15 टन FYM डालें।" : "Apply 10-15 tons of FYM per hectare."
    },
    {
      month: 5,
      activity: language === 'kn' ? "ಬತ್ತ ಬಿತ್ತನೆ ಕಾಲ" : language === 'hi' ? "बुवाई का मौसम" : "Sowing Season",
      crops: language === 'kn' ? ["ನವಣೆ", "ಕೊಡೊ"] : language === 'hi' ? ["कंगनी", "कोदो"] : ["Navane", "Kodo"],
      tip: language === 'kn' ? "ಬಿತ್ತನೆ ಮಾಡುವ ಮೊದಲು ಜೈವಿಕ ಗೊಬ್ಬರಗಳೊಂದಿಗೆ ಬೀಜಗಳನ್ನು ಸಂಸ್ಕರಿಸಿ." : language === 'hi' ? "बुवाई से पहले बीजों को जैव-उर्वरकों से उपचारित करें।" : "Treat seeds with Bio-fertilizers before sowing."
    },
    {
      month: 8,
      activity: language === 'kn' ? "ಕಳೆ ಕೀಳುವಿಕೆ ಮತ್ತು ಆರೈಕೆ" : language === 'hi' ? "निराई और देखभाल" : "Weeding & Care",
      crops: language === 'kn' ? ["ಎಲ್ಲಾ ಸಿರಿಧಾನ್ಯಗಳು"] : language === 'hi' ? ["सभी बाजरा"] : ["All Millets"],
      tip: language === 'kn' ? "25 ದಿನಗಳ ನಂತರ ಎರಡನೇ ಬಾರಿ ಕಳೆ ಕೀಳಿ." : language === 'hi' ? "25 दिनों के बाद दूसरी निराई करें।" : "Perform second weeding after 25 days."
    },
    {
      month: 10,
      activity: language === 'kn' ? "ಕೊಯ್ಲು" : language === 'hi' ? "कटाई" : "Harvesting",
      crops: language === 'kn' ? ["ಸಾಮೆ"] : language === 'hi' ? ["कुटकी"] : ["Little Millet"],
      tip: language === 'kn' ? "ಧಾನ್ಯಗಳು ಗಟ್ಟಿಯಾಗಿ ಮತ್ತು ಒಣಗಿದಾಗ ಕೊಯ್ಲು ಮಾಡಿ." : language === 'hi' ? "जब दाने सख्त और सूखे हों तब कटाई करें।" : "Harvest when grains are hard and dry."
    },
  ];

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{title: string, status: string, score: number} | null>(null);

  const handleStartScan = (type: string) => {
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate AI Processing
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        title: type === 'crop' ? 'Navane (Foxtail) Identified' : 'Batch #8821 Organic Verified',
        status: 'AUTHENTIC',
        score: type === 'crop' ? 98.4 : 100
      });
    }, 2500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">
      {/* Scanning Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-10 rounded-[48px] shadow-2xl max-w-sm w-full text-center space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-1/3 h-full bg-emerald-500"
                />
              </div>
              
              <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                   className="absolute inset-0 border-4 border-dashed border-emerald-500/30 rounded-full"
                 />
                 <ScanLine size={64} className="text-emerald-600 animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 uppercase">AI ANALYZING...</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Processing spectral images</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {scanResult && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white p-10 rounded-[48px] shadow-2xl max-w-sm w-full text-center space-y-8"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl mx-auto flex items-center justify-center text-emerald-600">
                <CheckCircle size={48} strokeWidth={2.5} />
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 inline-block px-3 py-1 rounded-full">{scanResult.status}</p>
                <h3 className="text-2xl font-black text-slate-900">{scanResult.title}</h3>
                <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-xs">
                   <span>Confidence Score:</span>
                   <span className="text-emerald-600">{scanResult.score}%</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setScanResult(null)}
                  className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
                >
                  Access Deep Analysis
                </button>
                <button 
                  onClick={() => setScanResult(null)}
                  className="w-full bg-slate-100 text-slate-500 py-4 rounded-[24px] font-black uppercase tracking-widest text-[10px]"
                >
                  Close Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather Insights */}
      <div className="md:col-span-5 space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[40px] text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden"
        >
          {/* Background Decorative Circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-300" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Hubli, Karnataka</span>
              </div>
              <p className="text-[10px] font-mono text-emerald-300">LIVE SATELLITE FEED</p>
            </div>

            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <p className="text-sm font-bold text-emerald-200">Partly Cloudy</p>
                <h2 className="text-7xl font-black tracking-tighter">32°</h2>
              </div>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <Cloud size={80} className="text-white drop-shadow-2xl" />
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
              <div className="flex flex-col items-center gap-1">
                <Droplets size={16} className="text-emerald-300" />
                <span className="text-[10px] font-black uppercase text-white">45%</span>
                <span className="text-[8px] font-bold text-emerald-200">HUMIDITY</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-white/10 px-2">
                <Wind size={16} className="text-emerald-300" />
                <span className="text-[10px] font-black uppercase text-white">12km/h</span>
                <span className="text-[8px] font-bold text-emerald-200">WIND</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Thermometer size={16} className="text-emerald-300" />
                <span className="text-[10px] font-black uppercase text-white">35/22°</span>
                <span className="text-[8px] font-bold text-emerald-200">TEMP</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-[32px] space-y-4">
           <div className="flex items-center gap-3 text-amber-700">
              <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center">
                <ShieldAlert size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">{t.weatherAlert}</p>
                <h4 className="font-black text-sm tracking-tight">{language === 'kn' ? 'ಮಧ್ಯಮ ಮಳೆ ಮುನ್ಸೂಚನೆ' : language === 'hi' ? 'मध्यम बारिश की भविष्यवाणी' : 'Moderate Rainfall Predicted'}</h4>
              </div>
           </div>
           <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
             {language === 'kn' ? 'ಮುಂದಿನ 48 ಗಂಟೆಗಳಲ್ಲಿ ಉತ್ತರ ಕರ್ನಾಟಕದಲ್ಲಿ ತುಂತುರು ಮಳೆಯ ನಿರೀಕ್ಷೆಯಿದೆ. ಸಿರಿಧಾನ್ಯ ನರ್ಸರಿಗಳಿಗೆ ಸರಿಯಾದ ಒಳಚರಂಡಿ ವ್ಯವಸ್ಥೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.' : language === 'hi' ? 'अगले 48 घंटों में उत्तरी कर्नाटक में बारिश की संभावना है। बाजरा नर्सरी के लिए उचित जल निकासी सुनिश्चित करें।' : 'Intermittent showers expected in Northern Karnataka over the next 48 hours. Ensure proper drainage for millet nurseries. Avoid sowing if soil is overly saturated.'}
           </p>
           <button className="w-full py-3 bg-amber-200 hover:bg-amber-300 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-800">
             {t.expertAdvisory}
           </button>
        </div>

        {/* Verification Hub */}
        <div className="bg-white border-2 border-slate-100 p-8 rounded-[40px] space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{t.verificationCenter}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.qualityAssurance}</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <ScanLine size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleStartScan('crop')}
              className="p-4 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition-all group text-center space-y-2 border border-transparent hover:border-emerald-200"
            >
              <div className="w-8 h-8 bg-white mx-auto rounded-lg flex items-center justify-center shadow-sm">
                <Camera size={16} />
              </div>
              <p className="text-[9px] font-black uppercase">{t.verifyCrop}</p>
            </button>
            <button 
              onClick={() => handleStartScan('tag')}
              className="p-4 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition-all group text-center space-y-2 border border-transparent hover:border-emerald-200"
            >
              <div className="w-8 h-8 bg-white mx-auto rounded-lg flex items-center justify-center shadow-sm">
                <QrCode size={16} />
              </div>
              <p className="text-[9px] font-black uppercase">{t.verifyTag}</p>
            </button>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600">
                <CheckCircle size={18} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">{t.digitalCert}</p>
            </div>
            <ChevronRight size={16} className="text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Farming Calendar */}
      <div className="md:col-span-7">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{t.seasonal}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{language === 'kn' ? 'ಕಾಲೋಚಿತ ಸಿರಿ-ಧಾನ್ಯ ಮೈಲಿಗಲ್ಲುಗಳು' : language === 'hi' ? 'मौसमी सिरी-धान्य मील के पत्थर' : 'Seasonal Siri-Dhanya Milestones'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <Calendar size={24} className="text-emerald-600" />
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 mb-8">
            {months.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMonth(idx)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeMonth === idx ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20' : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {calendarData.filter(d => d.month === activeMonth).length > 0 ? (
                calendarData.filter(d => d.month === activeMonth).map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="p-8 bg-slate-50/50 rounded-[32px] border-2 border-slate-100 relative overflow-hidden group hover:border-emerald-200 transition-all">
                      <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform" />
                      
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100">
                             <Sprout size={32} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t.mainOperation}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{d.activity}</h3>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                           <div className="space-y-2">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.targetCrops}</p>
                             <div className="flex flex-wrap gap-2">
                                {d.crops.map((c, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-tight">
                                    {c}
                                  </span>
                                ))}
                             </div>
                           </div>
                           <div className="space-y-2">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.expertTip}</p>
                             <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{d.tip}"</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                    <Leaf size={40} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-300 uppercase italic">General Maintenance</h3>
                    <p className="text-xs text-slate-400 font-medium">Regular monitoring of crop health recommended for {months[activeMonth]}.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="pt-8 border-t border-slate-100 mt-auto">
               <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl text-emerald-800">
                 <div className="flex items-center gap-3">
                   <Clock size={20} className="text-emerald-600" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Sowing Window Closing in 14 Days</p>
                 </div>
                 <ChevronRight size={16} />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart GPS Tracking Section */}
      <div className="md:col-span-12">
        <SmartGPSTracker onLocationUpdate={onLocationUpdate} />
      </div>
    </div>
  );
};
