import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, TrendingDown, Minus, MapPin, 
  Calendar, RefreshCw, Filter, Download, 
  ChevronRight, ArrowUpRight, ArrowDownRight,
  Info, BarChart3, PieChart, Activity, Navigation,
  UserCheck, MessageSquare, Gavel, CheckCircle2, X,
  HelpCircle, ShieldCheck, ChevronDown, Sparkles
} from 'lucide-react';
import { GOOGLE_MAPS_API_KEY } from '../lib/config';
import { millets as milletsData } from '../data/millets';

interface MarketPrice {
  id: string;
  millet: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  volume: string;
  market: string;
  lastUpdated: Date;
}

interface APMCMarket {
  name: string;
  distance: string;
  status: 'ACTIVE' | 'AUCTION_LIVE' | 'BUFFER';
  address: string;
  coordinates: string;
  eta: string;
}

interface MarketDashboardProps {
  language?: 'en' | 'kn' | 'hi';
}

export const MarketDashboard: React.FC<MarketDashboardProps> = ({ language = 'en' }) => {
  const translations = {
    en: {
      marketPulse: 'Market Pulse',
      nearbyApmc: 'Nearby APMC Markets',
      locating: 'Locating...',
      detecting: 'Detecting market address...',
      faq: 'Market FAQ',
      all: 'All',
      favorites: 'Favorites',
      marketAverage: 'Market Average',
      weeklyGrowth: 'Weekly Growth',
      liveNodes: 'Live APMC Connected',
      gpsTracker: 'GPS Tracker',
      proximityEngine: 'APMC Proximity Engine',
      scanMarkets: 'Detect Local Markets',
      scanning: 'Scanning...',
      marketIntelligence: 'Market Intelligence',
      refresh: 'Refresh List',
      syncing: 'Syncing...',
      verified: 'Verified by Hub',
      commodity: 'Commodity (Siri-Dhanya)',
      trend: 'Trend',
      price: 'Price (₹/Qntl)',
      action: 'Action',
      enableAlerts: 'Enable Alerts',
      activeAlert: 'Active Alert',
      liveFeed: 'Live Feed',
      auctionWindow: 'Auction Window',
      dataSourced: 'Data sourced from APMC Network'
    },
    kn: {
      marketPulse: 'ಮಾರುಕಟ್ಟೆ ದರ',
      nearbyApmc: 'ಹತ್ತಿರದ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಗಳು',
      locating: 'ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
      detecting: 'ಮಾರುಕಟ್ಟೆ ವಿಳಾಸ ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತಿದೆ...',
      faq: 'ಮಾರುಕಟ್ಟೆ ಪ್ರಶ್ನೋತ್ತರ',
      all: 'ಎಲ್ಲಾ',
      favorites: 'ನೆಚ್ಚಿನ',
      marketAverage: 'ಮಾರುಕಟ್ಟೆ ಸರಾಸರಿ',
      weeklyGrowth: 'ವಾರದ ಬೆಳವಣಿಗೆ',
      liveNodes: 'ಲೈವ್ ಎಪಿಎಂಸಿ ಸಂಪರ್ಕ',
      gpsTracker: 'ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕರ್',
      proximityEngine: 'ಎಪಿಎಂಸಿ ಸಾಮೀಪ್ಯ ಎಂಜಿನ್',
      scanMarkets: 'ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ',
      scanning: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
      marketIntelligence: 'ಮಾರುಕಟ್ಟೆ ಬುದ್ಧಿವಂತಿಕೆ',
      refresh: 'ಪಟ್ಟಿಯನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ',
      syncing: 'ಸಿಂಕ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
      verified: 'ಹಬ್‌ನಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
      commodity: 'ಸರಕು (ಸಿರಿ-ಧಾನ್ಯ)',
      trend: 'ಪ್ರವೃತ್ತಿ',
      price: 'ಬೆಲೆ (₹/ಕ್ವಿಂಟಲ್)',
      action: 'ಕ್ರಮ',
      enableAlerts: 'ಅಲರ್ಟ್ ಸಕ್ರಿಯಗೊಳಿಸಿ',
      activeAlert: 'ಸಕ್ರಿಯ ಅಲರ್ಟ್',
      liveFeed: 'ಲೈವ್ ಫೀಡ್',
      auctionWindow: 'ಹರಾಜು ವಿಂಡೋ',
      dataSourced: 'ಎಪಿಎಂಸಿ ನೆಟ್‌ವರ್ಕ್‌ನಿಂದ ಡೇಟಾ ಪಡೆಯಲಾಗಿದೆ'
    },
    hi: {
      marketPulse: 'बाजार भाव',
      nearbyApmc: 'नजदीकी एपीएमसी बाजार',
      locating: 'खोज रहे हैं...',
      detecting: 'बाजार का पता लगाया जा रहा है...',
      faq: 'बाजार अक्सर पूछे जाने वाले प्रश्न',
      all: 'सब',
      favorites: 'पसंदीदा',
      marketAverage: 'बाजार औसत',
      weeklyGrowth: 'साप्ताहिक वृद्धि',
      liveNodes: 'लाइव एपीएमसी कनेक्टेड',
      gpsTracker: 'जीपीएस ट्रैकर',
      proximityEngine: 'एपीएमसी प्रॉक्सिमिटी इंजन',
      scanMarkets: 'स्थानीय बाजारों का पता लगाएं',
      scanning: 'स्कैनिंग...',
      marketIntelligence: 'बाजार बुद्धिमत्ता',
      refresh: 'सूची को रिफ्रेश करें',
      syncing: 'सिंक हो रहा है...',
      verified: 'हब द्वारा सत्यापित',
      commodity: 'वस्तु (सिरी-धान्य)',
      trend: 'रुझान',
      price: 'कीमत (₹/क्विंटल)',
      action: 'कार्रवाई',
      enableAlerts: 'अलर्ट सक्षम करें',
      activeAlert: 'सक्रिय अलर्ट',
      liveFeed: 'लाइव फीड',
      auctionWindow: 'नीलामी विंडो',
      dataSourced: 'एपीएमसी नेटवर्क से प्राप्त डेटा'
    }
  };

  const t = translations[language];

  const FAQ_DATA = [
    {
      question: language === 'kn' ? "ಎಪಿಎಂಸಿ ಬೆಲೆಗಳನ್ನು ಪ್ರತಿದಿನ ಹೇಗೆ ನಿರ್ಧರಿಸಲಾಗುತ್ತದೆ?" : language === 'hi' ? "एपीएमसी की कीमतें रोजाना कैसे निर्धारित की जाती हैं?" : "How are APMC prices determined daily?",
      answer: language === 'kn' ? "ಬೆಲೆಗಳನ್ನು ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ ಎಪಿಎಂಸಿ ಆವರಣದಲ್ಲಿ ನಡೆಯುವ ಪಾರದರ್ಶಕ ಮುಕ್ತ ಹರಾಜು ವ್ಯವಸ್ಥೆಯ ಮೂಲಕ ನಿರ್ಧರಿಸಲಾಗುತ್ತದೆ." : language === 'hi' ? "कीमतें हर सुबह एपीएमसी यार्ड में आयोजित एक पारदर्शी खुली नीलामी प्रणाली के माध्यम से स्थापित की जाती हैं।" : "Prices are established through a transparent open auction system held every morning at APMC yards, influenced by daily supply volume, quality grading, and regional demand."
    },
    {
      question: language === 'kn' ? "ಅಪ್ಲಿಕೇಶನ್ ಮೂಲಕ ನಾನು ನೇರವಾಗಿ ಈ ಮಾರುಕಟ್ಟೆಗಳಿಗೆ ಮಾರಾಟ ಮಾಡಬಹುದೇ?" : language === 'hi' ? "क्या मैं ऐप के माध्यम से इन बाजारों में सीधे बेच सकता हूं?" : "Can I sell directly to these markets via the app?",
      answer: language === 'kn' ? "ಹೌದು, ಹಬ್ ನಿಮಗೆ 'ಪಿಕ್-ಅಪ್‌ಗೆ ಸಿದ್ಧವಾಗಿದೆ' ಸ್ಲಾಟ್ ಅನ್ನು ನಿಗದಿಪಡಿಸಲು ಅನುಮತಿಸುತ್ತದೆ." : language === 'hi' ? "हाँ, हब आपको 'पिकअप के लिए तैयार' स्लॉट शेड्यूल करने की अनुमति देता है।" : "Yes, the Hub allows you to schedule a 'Ready for Pickup' slot which pre-registers your batch in the APMC digital ledger for faster processing upon arrival."
    },
    {
      question: language === 'kn' ? "ಬೆಲೆಗಳ ಮೇಲಿನ 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ' ಬ್ಯಾಡ್ಜ್ ಎಂದರೇನು?" : language === 'hi' ? "कीमतों पर 'सत्यापित' बैज क्या है?" : "What is the 'Verified' badge on prices?",
      answer: language === 'kn' ? "'ಪರಿಶೀಲಿಸಲಾಗಿದೆ' ಬ್ಯಾಡ್ಜ್ ಎಂದರೆ ಬೆಲೆಯನ್ನು ಅಧಿಕೃತ ಮಂಡಿ ಬೋರ್ಡ್ ದಾಖಲೆಗಳೊಂದಿಗೆ ಕ್ರಾಸ್-ರೆಫರೆನ್ಸ್ ಮಾಡಲಾಗಿದೆ." : language === 'hi' ? "'सत्यापित' बैज इंगित करता है कि कीमत को आधिकारिक मंडी बोर्ड रिकॉर्ड के साथ क्रॉस-रेफरेंस किया गया है।" : "The 'Verified' badge indicates that the price has been cross-referenced with official Mandi Board records and confirmed by on-ground Hub agents within the last hour."
    }
  ];

  const [activeFilter, setActiveFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeRoute, setActiveRoute] = useState<APMCMarket | null>(null);
  
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [nearbyMarkets, setNearbyMarkets] = useState<APMCMarket[]>([
    { 
      name: 'Dharwad APMC', 
      distance: '4.2 km', 
      status: 'ACTIVE',
      address: 'Mandi Road, NR Circle, Dharwad, Karnataka 580001',
      coordinates: '15.4589° N, 75.0078° E',
      eta: '12 min'
    },
    { 
      name: 'Hubballi Main Market', 
      distance: '12.8 km', 
      status: 'AUCTION_LIVE',
      address: 'APMC Yard, Amaragol, Hubballi, Karnataka 580025',
      coordinates: '15.3647° N, 75.1240° E',
      eta: '25 min'
    },
  ]);

  // Unified Audio Assistant Logic
  const audioCtx = useRef<AudioContext | null>(null);
  const activeUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Prime the speech engine for Android WebView
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      const handleVoices = () => window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener('voiceschanged', handleVoices);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', handleVoices);
    }
  }, []);

  const playSystemDing = () => {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtx.current;
      // Resume if suspended (common in mobile)
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.error("Audio Context failed", e);
    }
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        // Cancel any existing speech
        window.speechSynthesis.cancel();

        // Android WebView bug fix: occasionally the engine pauses itself
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Attempt to find a better voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en-IN')) ||
                             voices.find(v => v.lang.includes('en-US')) ||
                             voices[0];

        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.lang = preferredVoice?.lang || 'en-US';

        // Keep reference to prevent GC
        activeUtterance.current = utterance;

        console.log(`Speech triggered (Market): "${text.substring(0, 30)}..."`);
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("Speech Synthesis failed", e);
      }
    } else {
      console.warn("Speech Synthesis not supported in this browser");
    }
  };

  const startNavigation = (market: APMCMarket) => {
    setActiveRoute(market);
    setIsNavigating(true);
    speak(`Initiating root direction voice assistant. Navigating to ${market.name}. It is approximately ${market.distance} away with an estimated arrival time of ${market.eta}.`);
  };

  const [selectedMarket, setSelectedMarket] = useState<APMCMarket | null>(null);
  const [isCommunicating, setIsCommunicating] = useState(false);
  const [enabledAlertIds, setEnabledAlertIds] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const handleToggleAlert = (id: string, millet: string) => {
    if (enabledAlertIds.includes(id)) {
      setEnabledAlertIds(prev => prev.filter(i => i !== id));
    } else {
      setEnabledAlertIds(prev => [...prev, id]);
      setNotification(`ENABLED: Alerts active for ${millet}.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setNotification("Geolocation not supported.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsLocating(true);
    setLocationStatus("Detecting market address...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setLocationStatus("Location locked. Finding nearest APMC...");
        
        // Mocking nearby APMC markets based on proximity
        setTimeout(() => {
          setNearbyMarkets([
            { 
              name: 'Dharwad APMC', 
              distance: '4.2 km', 
              status: 'ACTIVE', 
              address: 'Mandi Road, NR Circle, Dharwad, Karnataka 580001',
              coordinates: '15.4589° N, 75.0078° E',
              eta: '12 min'
            },
            { 
              name: 'Hubballi Main Market', 
              distance: '12.8 km', 
              status: 'AUCTION_LIVE', 
              address: 'APMC Yard, Amaragol, Hubballi, Karnataka 580025',
              coordinates: '15.3647° N, 75.1240° E',
              eta: '25 min'
            },
            { 
              name: 'Kalghatgi Sub-Market', 
              distance: '28.5 km', 
              status: 'BUFFER', 
              address: 'Market Yard, State Highway-1, Kalghatgi 581204',
              coordinates: '15.1788° N, 74.9655° E',
              eta: '45 min'
            },
          ]);
          setIsLocating(false);
          setLocationStatus(null);
        }, 1500);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        setLocationStatus(null);
        setNotification("Unable to retrieve location.");
        setTimeout(() => setNotification(null), 3000);
      }
    );
  };

  const initialPrices: MarketPrice[] = milletsData.map(m => ({
    id: m.id,
    millet: language === 'kn' ? (m.kannadaName || m.name) : m.name,
    price: m.price || 0,
    unit: 'kg',
    trend: 'up',
    change: 1.5,
    volume: `${(m.kg || 0)} KG`,
    market: 'Hubballi APMC',
    lastUpdated: new Date()
  }));

  const [prices, setPrices] = useState<MarketPrice[]>(initialPrices);

  // Sync prices when language changes
  useEffect(() => {
    setPrices(milletsData.map(m => ({
      id: m.id,
      millet: language === 'kn' ? (m.kannadaName || m.name) : m.name,
      price: m.price || 0,
      unit: 'kg',
      trend: 'up',
      change: 1.5,
      volume: `${(m.kg || 0)} KG`,
      market: 'Hubballi APMC',
      lastUpdated: new Date()
    })));
  }, [language]);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPrices(prev => prev.map(p => {
        const changeVal = (Math.random() * 4) - 2;
        const newPrice = Math.round(p.price + (p.price * (changeVal / 100)));
        return {
          ...p,
          price: newPrice,
          change: Number(changeVal.toFixed(1)),
          trend: changeVal > 0.5 ? 'up' : changeVal < -0.5 ? 'down' : 'stable',
          lastUpdated: new Date()
        };
      }));
      setIsRefreshing(false);
    }, 1200);
  };

  const stats = useMemo(() => {
    if (!prices.length) return { avg: 0, topPerformer: { change: 0 } as any };
    const avg = Math.round(prices.reduce((acc, p) => acc + p.price, 0) / prices.length);
    const topPerformer = [...prices].sort((a, b) => (b.change || 0) - (a.change || 0))[0];
    return { avg, topPerformer };
  }, [prices]);

  return (
    <div className="space-y-6 p-1">
      {/* Header for verification */}
      <div className="mb-2">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter font-display">
          {t.marketPulse.split(' ')[0]} <span className="text-emerald-600">{t.marketPulse.split(' ')[1]}</span>
        </h2>
        <div className="h-2 w-24 bg-emerald-500 rounded-full mt-2" />
      </div>

      {/* Market Gateway Overlay */}
      <AnimatePresence>
        {selectedMarket && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[48px] shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col"
            >
              <div className="p-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
                <button 
                  onClick={() => setSelectedMarket(null)}
                  className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-emerald-500 rounded-[28px] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <MapPin size={40} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black tracking-tight">{selectedMarket.name}</h3>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em]">{selectedMarket.status.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Select Next Process</p>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { id: 'auction', label: 'Enter Live Auction', desc: 'Secure bidding for commodity batches', icon: Gavel },
                      { id: 'manager', label: 'Contact APMC Manager', desc: 'Direct secure line to market official', icon: MessageSquare },
                      { id: 'pickup', label: 'Schedule Drop/Pickup', desc: 'Coordinate logistics and transportation', icon: UserCheck }
                    ].map((btn) => (
                      <button 
                        key={btn.id}
                        onClick={() => {
                          setIsCommunicating(true);
                          setTimeout(() => {
                            setIsCommunicating(false);
                            setNotification(`${btn.label} INITIATED: Awaiting Node handshake.`);
                            setTimeout(() => setNotification(null), 3000);
                            setSelectedMarket(null);
                          }, 1500);
                        }}
                        disabled={isCommunicating}
                        className="flex items-center gap-5 p-5 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 rounded-[28px] border border-slate-100 transition-all text-left group"
                      >
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-slate-100">
                          <btn.icon size={20} className="text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-wide">{btn.label}</h4>
                          <p className="text-[9px] font-medium text-slate-400 mt-0.5">{btn.desc}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Node Insights</span>
                     </div>
                     <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-black text-emerald-700 uppercase">Signal Verified</span>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Market Sentiment</p>
                        <p className="text-xs font-bold text-slate-700">Highly Active</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Queue Density</p>
                        <p className="text-xs font-bold text-slate-700">Moderate (12 min)</p>
                      </div>
                   </div>
                   <p className="text-[10px] text-slate-500 font-medium italic border-t border-slate-100 pt-3">
                     "Auction activity peak expected in 45 mins. Suggested arrival: Immediate."
                   </p>
                </div>

                <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Encrypted APMC Gateway Access</p>
              </div>

              <AnimatePresence>
                {isCommunicating && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4"
                  >
                    <RefreshCw size={40} className="text-emerald-600 animate-spin" />
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Securing Node Handshake...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:shadow-emerald-900/5 transition-all"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.marketAverage}</p>
            <h3 className="text-3xl font-black text-slate-900">₹{stats.avg}<span className="text-sm font-bold text-slate-400">/q</span></h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <Activity size={24} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:shadow-emerald-900/5 transition-all"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.weeklyGrowth}</p>
            <div className="flex items-center gap-2">
              <h3 className="text-3xl font-black text-emerald-600">+{stats.topPerformer.change}%</h3>
              <ArrowUpRight size={20} className="text-emerald-500" />
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:shadow-emerald-900/5 transition-all"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.liveNodes}</p>
            <h3 className="text-3xl font-black text-slate-900">24 <span className="text-sm font-bold text-slate-400">{language === 'kn' ? 'ನೋಡ್‌ಗಳು' : language === 'hi' ? 'नोड्स' : 'Nodes'}</span></h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <MapPin size={24} />
          </div>
        </motion.div>
      </div>

      {/* GPS Location Tracker & Nearby Markets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">{t.gpsTracker}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t.proximityEngine}</p>
            </div>
            <button 
              onClick={handleLocate}
              disabled={isLocating}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isLocating ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-emerald-600 hover:text-white shadow-lg shadow-emerald-600/0 hover:shadow-emerald-600/20'}`}
            >
              <MapPin size={24} />
            </button>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl space-y-4 border border-slate-100 relative">
            {isLocating && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-10 bg-emerald-500/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center text-center p-4 text-white"
              >
                <RefreshCw size={24} className="animate-spin mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest">{locationStatus}</p>
              </motion.div>
            )}
            {userCoords ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Latitude</span>
                  <span className="text-xs font-mono font-bold text-slate-600">{userCoords.lat.toFixed(4)}°</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Longitude</span>
                  <span className="text-xs font-mono font-bold text-slate-600">{userCoords.lng.toFixed(4)}°</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                   <div className="flex items-center gap-2 text-emerald-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] font-black uppercase">Signal Locked</span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-200">
                  <Activity size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Awaiting Location Data</p>
              </div>
            )}
          </div>

          <button 
            onClick={handleLocate}
            disabled={isLocating}
            className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            {isLocating ? t.scanning : t.scanMarkets}
            <ChevronRight size={16} className="text-emerald-400" />
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-white p-6 rounded-[40px] shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">{t.nearbyApmc}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'kn' ? 'ತಲುಪಬಹುದಾದ ವ್ಯಾಪ್ತಿಯಲ್ಲಿರುವ ಸಕ್ರಿಯ ನೋಡ್‌ಗಳು' : language === 'hi' ? 'पहुंच योग्य दायरे में सक्रिय नोड्स' : 'Active nodes within reachable radius'}</p>
            </div>
            {nearbyMarkets.length > 0 && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                {nearbyMarkets.length} {language === 'kn' ? 'ಸಿಕ್ಕಿವೆ' : language === 'hi' ? 'मिले' : 'Found'}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {nearbyMarkets.length > 0 ? (
                nearbyMarkets.map((market, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 border border-slate-100 rounded-[32px] transition-all group gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center text-emerald-600 shadow-sm border border-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                        <MapPin size={24} />
                        <span className="text-[8px] font-black text-slate-400 mt-1 uppercase">POS</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">{market.name}</h4>
                           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${market.status === 'AUCTION_LIVE' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                             {market.status.replace('_', ' ')}
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{market.distance} Away</span>
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{market.eta} EST. ARRIVAL</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-medium max-w-[240px] leading-tight truncate">{market.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => startNavigation(market)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-emerald-500 hover:text-white transition-all shadow-sm group/nav"
                      >
                        <MapPin size={14} className="group-hover/nav:animate-pulse" />
                        Get Directions
                      </button>
                      <button 
                        onClick={() => setSelectedMarket(market)}
                        className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 shadow-sm transition-all active:scale-95"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                    <Navigation size={32} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-300 uppercase italic">Network Idle</h4>
                    <p className="text-xs text-slate-400 font-medium">Use GPS scan to surface local APMC infrastructure.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Main Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">{t.marketIntelligence}</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{language === 'kn' ? 'ನೈಜ-ಸಮಯದ ಸರಕು ಉತ್ಪನ್ನಗಳ ಟ್ರ್ಯಾಕಿಂಗ್' : language === 'hi' ? 'वास्तविक समय वस्तु डेरिवेटिव ट्रैकिंग' : 'Real-time commodity derivatives tracking'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? t.syncing : t.refresh}
            </button>
            <button className="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
              <Download size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.commodity}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">APMC Market</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t.trend}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t.price}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prices.map((p) => (
                <motion.tr 
                  key={p.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-black text-xs">
                        {p.millet[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight">{p.millet}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{p.volume} Available</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {p.market}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                      {p.trend === 'up' ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-black">
                          <ArrowUpRight size={16} />
                          <span className="text-xs">+{p.change}%</span>
                        </div>
                      ) : p.trend === 'down' ? (
                        <div className="flex items-center gap-1 text-rose-500 font-black">
                          <ArrowDownRight size={16} />
                          <span className="text-xs">{p.change}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 font-black">
                          <Minus size={16} />
                          <span className="text-xs">0.0%</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-lg font-black text-slate-900 tracking-tighter">₹{p.price}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{t.verified}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleToggleAlert(p.id, p.millet)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all group-hover:scale-105 ${enabledAlertIds.includes(p.id) ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 hover:bg-emerald-600 hover:text-white border border-transparent'}`}
                    >
                      {enabledAlertIds.includes(p.id) ? (
                        <>
                          <CheckCircle2 size={14} />
                          {t.activeAlert}
                        </>
                      ) : (
                        <>
                          <ChevronRight size={14} />
                          {t.enableAlerts}
                        </>
                      )}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.liveFeed}</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.auctionWindow}</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-100 rounded text-emerald-600 flex items-center justify-center">
                <Info size={10} />
              </div>
              <span className="text-[10px] font-black text-emerald-600/50 uppercase tracking-[0.2em]">{t.dataSourced}</span>
           </div>
        </div>
      </motion.div>

      {/* Voice Assistant Navigation Modal */}
      <AnimatePresence>
        {isNavigating && activeRoute && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="bg-slate-900 p-8 text-white relative">
                <div className="absolute top-8 right-8 flex gap-2">
                   <button 
                     onClick={() => {
                       if (typeof window !== 'undefined' && window.speechSynthesis) {
                         window.speechSynthesis.cancel();
                       }
                       setIsNavigating(false);
                     }}
                     className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                   >
                     <X size={20} />
                   </button>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center animate-pulse">
                    <Activity size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase italic italic font-display leading-tight">{activeRoute.name}</h3>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Active Routing Engagement</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Time to Hub</p>
                    <p className="text-xl font-black text-white">{activeRoute.eta}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Distance</p>
                    <p className="text-xl font-black text-white">{activeRoute.distance}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-emerald-500" />
                      <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Route Direction: <span className="text-emerald-600">Google Map Active</span></p>
                    </div>
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeRoute.address)}`, '_blank')}
                      className="text-[10px] font-black text-emerald-600 uppercase hover:underline"
                    >
                      Open External App
                    </button>
                  </div>

                  <div className="aspect-square w-full bg-slate-100 rounded-[32px] border-2 border-slate-100 shadow-inner flex flex-col items-center justify-center gap-5 p-8">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
                      <Navigation size={36} className="text-white animate-bounce" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-black text-slate-800 text-sm uppercase">{activeRoute.name}</p>
                      <p className="text-xs text-slate-500">{activeRoute.address}</p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase">{activeRoute.distance} · {activeRoute.eta}</p>
                    </div>
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeRoute.address)}`, '_blank')}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                    >
                      <Navigation size={16} />
                      Open in Google Maps
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeRoute.address)}`, '_blank')}
                    className="flex-1 py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                  >
                    <Navigation size={16} />
                    Start Navigation
                  </button>
                  <button 
                    onClick={() => {
                      setIsNavigating(false);
                    }}
                    className="flex-1 py-5 bg-emerald-500 text-white rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
                  >
                    Close Map
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verified Market Facts & Related Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Smart Hub Guide - Explanation of Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-emerald-600 p-8 rounded-[40px] shadow-2xl text-white relative overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Navigation size={200} />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase font-display tracking-tight leading-none">Smart Hub <br/> Logic Agent</h3>
                <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mt-1">Navigation Mastery</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-white/10 rounded-3xl border border-white/10">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black">01</span>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase mb-1">GPS Lock & Labeling</h4>
                  <p className="text-[10px] text-emerald-50 font-medium leading-relaxed">The hub uses live satellite data to find the nearest grain terminal. Once detected, the market name and proximity are displayed with a live 'active' signal.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white/10 rounded-3xl border border-white/10">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black">02</span>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase mb-1">Route-Map Sync</h4>
                  <p className="text-[10px] text-emerald-50 font-medium leading-relaxed">Click 'Get Directions' to visualize the route on a map. The AI calculates the fastest path to APMC yards for efficient transport.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">System Accuracy</span>
                <span className="text-xs font-black">99.8% VERIFIED</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Questions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900 p-8 rounded-[40px] shadow-2xl text-white flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/10 text-emerald-400 rounded-2xl">
              <HelpCircle size={24} />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xl font-black text-white tracking-tight uppercase font-display">Related Intel</h3>
              <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest">Market Query & Support</p>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {FAQ_DATA.map((faq, i) => {
              return (
                <div key={i} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full py-4 flex items-center justify-between text-left group"
                  >
                    <span className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors pr-4">{faq.question}</span>
                    <ChevronDown size={18} className={`text-slate-500 transition-transform duration-300 ${expandedFaq === i ? 'rotate-180 text-emerald-400' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {expandedFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 text-xs font-medium text-slate-400 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4 ml-1">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <button className="mt-8 w-full py-4 bg-emerald-500 text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">
            Ask More Questions
          </button>
        </motion.div>
      </div>

      {/* Floating Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 text-white px-8 py-4 rounded-[32px] shadow-2xl border border-white/10 flex items-center gap-4 min-w-[320px]"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-wider flex-1">{notification}</p>
            <button onClick={() => setNotification(null)}>
              <X size={14} className="text-slate-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
