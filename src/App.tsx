import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ChevronRight, Scale, Wheat, Zap, ChefHat, Info, X, 
  Loader2, Leaf, RefreshCw, MapPin, Navigation, Share2, 
  Mic, Volume2, Languages, User, LogOut, LogIn, Heart, Mail,
  Bookmark, Play, Download, CheckCircle, Sparkles, Trash2,
  Clapperboard, Wand2, ArrowLeft, ArrowRight, Video, Camera, Star,
  Activity, Sprout, ShieldCheck, PlusCircle, Filter
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { millets } from './data/millets';
import { Millet, Recipe, VideoScene, UserProfile } from './types';
import { generateMilletRecipe } from './services/aiService';
import { LoginView } from './components/LoginView';
import { auth, db } from './lib/firebase';
import { GEMINI_API_KEY } from './lib/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';

import { AIAdvisor } from './components/AIAdvisor';
import { MarketDashboard } from './components/MarketDashboard';
import { FarmingAssistant } from './components/FarmingAssistant';
import { SecurityVault } from './components/SecurityVault';
import { LibraryView } from './components/LibraryView';
import { ScientificCatalog } from './components/ScientificCatalog';
import { AIVideoStudio } from './components/AIVideoStudio';
import { MilletDetails } from './components/MilletDetails';

export default function App() {
  const getAiInstance = () => {
    console.log("Gemini: Initializing with key length", GEMINI_API_KEY.length);
    return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  };

  const cameraAngles = ["Close-up", "Bird's eye", "Side profile", "Dutch angle", "Wide shot", "Handheld"];
  const lightingEffects = ["Natural", "Cinematic", "Warm", "Moody", "High-contrast", "Flat"];

  const genProcessSteps = {
    en: [
      "Analyzing grain texture...",
      "Decoding nutritional DNA...",
      "Drafting cinematic storyboard...",
      "Synthesizing English narration...",
      "Rendering 4K visual guides...",
      "Finalizing Masterclass..."
    ],
    kn: [
      "ಧಾನ್ಯದ ವಿನ್ಯಾಸವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
      "ಪೌಷ್ಟಿಕಾಂಶದ ಡಿಎನ್ಎ ಡಿಕೋಡಿಂಗ್...",
      "ಸಿನಿಮೀಯ ಸ್ಟೋರಿಬೋರ್ಡ್ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...",
      "ಕನ್ನಡ ನಿರೂಪಣೆಯನ್ನು ಸಂಯೋಜಿಸಲಾಗುತ್ತಿದೆ...",
      "4K ದೃಶ್ಯ ಮಾರ್ಗದರ್ಶಿಗಳನ್ನು ರೆಂಡರಿಂಗ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
      "ಮಾಸ್ಟರ್‌ಕ್ಲಾಸ್ ಅಂತಿಮಗೊಳಿಸಲಾಗುತ್ತಿದೆ..."
    ],
    hi: [
      "अनाज की बनावट का विश्लेषण...",
      "पोषण संबंधी डीएनए को डिकोड करना...",
      "सिनेमैटिक स्टोरीबोर्ड तैयार करना...",
      "हिंदी वर्णन का संश्लेषण...",
      "4K विज़ुअल गाइड रेंडर करना...",
      "मास्टरक्लास को अंतिम रूप देना..."
    ]
  };

  const [activeView, setActiveView] = useState<'library' | 'dashboard' | 'services' | 'security'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMillet, setSelectedMillet] = useState<Millet | null>(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [recipePreference, setRecipePreference] = useState('healthy');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [savedMilletIds, setSavedMilletIds] = useState<string[]>([]);
  const [downloadedVideoIds, setDownloadedVideoIds] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [language, setLanguage] = useState<'en' | 'kn' | 'hi'>('en');

  const translations = {
    en: {
      archive: 'Archive',
      marketPulse: 'Market Pulse',
      farmerAssistant: 'Farmer Assistant',
      securityCenter: 'Security Center',
      smartAgriHub: 'Smart Agri Hub'
    },
    kn: {
      archive: 'ದಾಸ್ತಾನು',
      marketPulse: 'ಮಾರುಕಟ್ಟೆ ದರ',
      farmerAssistant: 'ರೈತ ಸಹಾಯ',
      securityCenter: 'ಭದ್ರತಾ ಕೇಂದ್ರ',
      smartAgriHub: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಕೇಂದ್ರ'
    },
    hi: {
      archive: 'संग्रह',
      marketPulse: 'बाजार भाव',
      farmerAssistant: 'किसान सहायक',
      securityCenter: 'सुरक्षा केंद्र',
      smartAgriHub: 'स्मार्ट एग्री हब'
    }
  };

  const t = translations[language];
  const [milletsData, setMilletsData] = useState<Millet[]>(millets);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Sync selectedMillet with live data updates
  useEffect(() => {
    if (selectedMillet) {
      const updated = milletsData.find(m => m.id === selectedMillet.id);
      if (updated && (updated.price !== selectedMillet.price || updated.kg !== selectedMillet.kg)) {
        setSelectedMillet(updated);
      }
    }
  }, [milletsData, selectedMillet]);

  // Real-time listener for Millets from Backend
  useEffect(() => {
    let unsubscribe = () => {};

    const startListener = async () => {
      try {
        if (!db) {
          console.error("Database (db) not initialized");
          return;
        }
        console.log("Connecting to Firebase millets collection...");
        const milletsRef = collection(db, 'millets');

        unsubscribe = onSnapshot(milletsRef, (snapshot) => {
          console.log(`✅ Firebase Update: Received ${snapshot.docs.length} documents`);

          const liveData = snapshot.docs
            .map(doc => {
              const data = doc.data();
              console.log("Millet Document Data:", doc.id, data);
              const mapped: any = { id: doc.id };

              // Map all possible variations of field names
              const name = data.name || data.Name || data.Sorghum || doc.id;

              // Helper to check if a string contains Kannada characters
              const hasKannada = (str: string) => /[\u0CE6-\u0CFF]/.test(str);

              mapped.name = name;
              mapped.price = Number(data.price || data.Price || 0);
              mapped.kg = Number(data.kg || data.Kg || 0);
              mapped.type = data.type || data.Type || (data.Sorghum ? 'Neutral' : 'General');

              const kName = data.kannadaName || data.KannadaName;
              // If the live data has no Kannada or it's just English, try to find the local hardcoded one
              if (kName && hasKannada(kName)) {
                mapped.kannadaName = kName;
              } else {
                const localMatch = millets.find(m => m.id.toLowerCase() === doc.id.toLowerCase() || m.name.toLowerCase() === name.toLowerCase());
                mapped.kannadaName = localMatch?.kannadaName || kName || name;
              }

              if (data.description || data.Description) mapped.description = data.description || data.Description;
              const img = data.imageUrl || data.ImageUrl || data.image;
              if (img) mapped.imageUrl = img;
              if (Array.isArray(data.benefits)) mapped.benefits = data.benefits;
              if (Array.isArray(data.nutritionalValues)) mapped.nutritionalValues = data.nutritionalValues;
              return mapped;
            })
            .filter(item => item !== null) as Millet[];

          if (liveData.length > 0) {
            setMilletsData(_ => {
              const merged = [...millets];
              liveData.forEach(newMillet => {
                const index = merged.findIndex(m =>
                  m.id.toLowerCase() === newMillet.id.toLowerCase() ||
                  (newMillet.name && m.name && m.name.toLowerCase() === newMillet.name.toLowerCase())
                );
                if (index !== -1) {
                  merged[index] = { ...merged[index], ...newMillet };
                } else {
                  merged.push(newMillet as Millet);
                }
              });
              return merged;
            });
          }
        }, (err) => {
          console.error("Firebase Snapshot Error:", err);
        });
      } catch (e) {
        console.error("Firebase Listener Failed:", e);
      }
    };

    startListener();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Video Generation States
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [videoTutorial, setVideoTutorial] = useState<VideoScene[] | null>(null);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [showStudio, setShowStudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioContext = useRef<AudioContext | null>(null);
  const ambientOsc = useRef<OscillatorNode | null>(null);
  const ambientGain = useRef<GainNode | null>(null);
  const activeUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const initAudio = () => {
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }
    } catch (e) {
      console.warn("Audio init failed:", e);
    }
  };

  const playTransitionSound = () => {
    if (isMuted || !audioContext.current) return;
    const ctx = audioContext.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  const startAmbientScore = () => {
    if (isMuted || !audioContext.current) return;
    const ctx = audioContext.current;
    if (ambientOsc.current) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    ambientOsc.current = osc;
    ambientGain.current = gain;
  };

  const stopAmbientScore = () => {
    if (ambientGain.current && audioContext.current) {
      const ctx = audioContext.current;
      ambientGain.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => {
        ambientOsc.current?.stop();
        ambientOsc.current = null;
        ambientGain.current = null;
      }, 1000);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && videoTutorial) {
      const currentScene = videoTutorial[currentSceneIdx];
      const durationMs = currentScene.duration * 1000;
      const stepMs = 100;
      
      if (sceneProgress === 0) {
        initAudio();
        playTransitionSound();
        startAmbientScore();
        speakText(currentScene.description, language);
      }

      timer = setInterval(() => {
        setSceneProgress(prev => {
          if (prev >= 100) {
            if (currentSceneIdx < videoTutorial.length - 1) {
              setCurrentSceneIdx(prevIdx => prevIdx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + (stepMs / durationMs) * 100;
        });
      }, stepMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIdx, videoTutorial, sceneProgress, language]);

  const togglePlay = () => {
    initAudio();
    if (sceneProgress >= 100 && currentSceneIdx === (videoTutorial?.length || 0) - 1) {
      setCurrentSceneIdx(0);
      setSceneProgress(0);
    }
    const nextPlayState = !isPlaying;
    setIsPlaying(nextPlayState);
    if (nextPlayState) startAmbientScore();
    else stopAmbientScore();
  };

  const generateVideoTutorial = async (millet: Millet) => {
    setIsGeneratingVideo(true);
    setShowStudio(true);
    setVideoTutorial(null);
    setCurrentSceneIdx(0);
    setGenStep(0);
    const interval = setInterval(() => {
      setGenStep(prev => (prev < 5 ? prev + 1 : prev));
    }, 1500);

    const langLabel = language === 'kn' ? 'Kannada' : language === 'hi' ? 'Hindi' : 'English';

    try {
      const genAI = getAiInstance();
      if (!GEMINI_API_KEY) throw new Error("API Key missing");

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", // Using 1.5-flash for better stability in diverse regions
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      const prompt = `You are a culinary video director. Create a 5-scene step-by-step cooking masterclass storyboard for a ${millet.name} (${millet.kannadaName}) recipe.

Write ALL text fields (title, description, visualCue) EXCLUSIVELY in ${langLabel}.
${language === 'kn' ? 'STRICT REQUIREMENT: Use ONLY Kannada script (ಕನ್ನಡ) for all descriptions and titles. Do not use English words.' : ''}

Return ONLY a valid JSON array with exactly 5 objects. Each object must have these exact keys:
- "title": short scene title in ${langLabel}
- "description": 2-3 sentence narration/explanation in ${langLabel}
- "visualCue": what the camera shows, in ${langLabel}
- "duration": number of seconds (between 8 and 15)
- "cameraAngle": one of ["Close-up", "Bird's eye", "Side profile", "Wide shot", "Handheld"]
- "lighting": one of ["Natural", "Cinematic", "Warm", "Moody"]
- "keywords": array of 3 ingredient or technique words in ${langLabel}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) throw new Error("Empty response from AI");

      // Strip markdown code fences if present
      const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      const data = JSON.parse(cleaned);

      if (!Array.isArray(data) || data.length === 0) throw new Error("Invalid response format");

      setVideoTutorial(data.map((s: any, i: number) => ({
        id: `scene-${i}`,
        title: s.title || `Scene ${i + 1}`,
        description: s.description || '',
        visualCue: s.visualCue || '',
        duration: typeof s.duration === 'number' ? s.duration : 10,
        cameraAngle: s.cameraAngle || 'Close-up',
        lighting: s.lighting || 'Natural',
        keywords: Array.isArray(s.keywords) ? s.keywords : [],
      })));
      setGenStep(6);
    } catch (error: any) {
      console.error("Video Generation Error:", error);

      // FALLBACK: Generate local mock tutorial if AI fails so the user isn't stuck
      const fallbackData = [
        {
          id: 'scene-0',
          title: language === 'kn' ? 'ಸಿದ್ಧತೆ' : 'Preparation',
          description: language === 'kn' ? `${millet.kannadaName} ಅನ್ನು ಚೆನ್ನಾಗಿ ತೊಳೆದು 6 ಗಂಟೆಗಳ ಕಾಲ ನೆನೆಸಿ.` : `Clean the ${millet.name} thoroughly and soak it for 6 hours.`,
          visualCue: 'Close-up of grains being washed in water',
          duration: 10,
          cameraAngle: 'Close-up',
          lighting: 'Natural',
          keywords: language === 'kn' ? ['ತೊಳೆಯಿರಿ', 'ನೆನೆಸಿ', 'ಸ್ವಚ್ಛಗೊಳಿಸಿ'] : ['Wash', 'Soak', 'Clean']
        },
        {
          id: 'scene-1',
          title: language === 'kn' ? 'ಕುದಿಸುವುದು' : 'Boiling',
          description: language === 'kn' ? 'ನೆನೆಸಿದ ಧಾನ್ಯವನ್ನು 1:3 ಪ್ರಮಾಣದ ನೀರಿನಲ್ಲಿ ಕುದಿಸಿ.' : 'Boil the soaked grains in 1:3 ratio of water.',
          visualCue: 'Steaming pot on a stove',
          duration: 12,
          cameraAngle: 'Wide shot',
          lighting: 'Cinematic',
          keywords: language === 'kn' ? ['ಕುದಿಸಿ', 'ಬಿಸಿ', 'ಮೆತ್ತಗೆ'] : ['Boil', 'Steam', 'Soft']
        },
        {
          id: 'scene-2',
          title: language === 'kn' ? 'ಮಸಾಲೆ ಸೇರಿಸುವುದು' : 'Adding Spices',
          description: language === 'kn' ? 'ರುಚಿಗೆ ತಕ್ಕಷ್ಟು ಉಪ್ಪು ಮತ್ತು ನಿಮ್ಮ ನೆಚ್ಚಿನ ಮಸಾಲೆಗಳನ್ನು ಸೇರಿಸಿ.' : 'Add salt to taste and your favorite regional spices.',
          visualCue: 'Spices being sprinkled over the cooked millet',
          duration: 10,
          cameraAngle: 'Bird\'s eye',
          lighting: 'Warm',
          keywords: language === 'kn' ? ['ಮಸಾಲೆ', 'ರುಚಿ', 'ಉಪ್ಪು'] : ['Spice', 'Flavor', 'Season']
        },
        {
          id: 'scene-3',
          title: language === 'kn' ? 'ಮಿಶ್ರಣ' : 'Mixing',
          description: language === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ಚೆನ್ನಾಗಿ ಬೆರೆಸಿ ಮತ್ತು 5 ನಿಮಿಷಗಳ ಕಾಲ ಸಣ್ಣ ಉರಿಯಲ್ಲಿ ಬೇಯಿಸಿ.' : 'Mix everything well and simmer for 5 minutes on low flame.',
          visualCue: 'Stirring the mixture slowly',
          duration: 10,
          cameraAngle: 'Handheld',
          lighting: 'Natural',
          keywords: language === 'kn' ? ['ಮಿಶ್ರಣ', 'ಬೇಯಿಸಿ', 'ಸುವಾಸನೆ'] : ['Mix', 'Simmer', 'Aroma']
        },
        {
          id: 'scene-4',
          title: language === 'kn' ? 'ಬಡಿಸುವುದು' : 'Serving',
          description: language === 'kn' ? 'ಬಿಸಿಯಾದ ಮತ್ತು ಪೌಷ್ಟಿಕಾಂಶದ ಆಹಾರ ಸಿದ್ಧವಾಗಿದೆ. ಆನಂದಿಸಿ!' : 'Your hot and nutritious meal is ready. Enjoy!',
          visualCue: 'Beautifully plated millet dish with garnish',
          duration: 15,
          cameraAngle: 'Side profile',
          lighting: 'Cinematic',
          keywords: language === 'kn' ? ['ಬಡಿಸಿ', 'ಆರೋಗ್ಯಕರ', 'ಸಿದ್ಧ'] : ['Serve', 'Healthy', 'Ready']
        }
      ];

      setVideoTutorial(fallbackData as any);
      setGenStep(6); // Skip error and show fallback
    } finally {
      clearInterval(interval);
      setIsGeneratingVideo(false);
    }
  };

  const speakText = (text: string, lang: 'en' | 'kn' | 'hi') => {
    if (isMuted) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'kn') utterance.lang = 'kn-IN';
      else if (lang === 'hi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.volume = 1.0;
      activeUtterance.current = utterance;
      // Small delay fixes Android WebView TTS issue
      setTimeout(() => {
        try { window.speechSynthesis.speak(utterance); } catch(e) { console.warn("TTS speak failed", e); }
      }, 150);
    } catch (error) {
      console.warn("Speech Synthesis Error:", error);
    }
  };

  const filteredMillets = useMemo(() => {
    let list = milletsData;
    if (showSavedOnly) list = list.filter(m => savedMilletIds.includes(m.id));
    return list.filter(m => 
      (m.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.kannadaName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, showSavedOnly, savedMilletIds, milletsData]);

  const handleGenerateRecipe = async (milletName: string) => {
    setIsGeneratingRecipe(true);
    setCurrentRecipe(null);
    try {
      const kannadaName = selectedMillet?.kannadaName;
      const recipe = await generateMilletRecipe(milletName, recipePreference, language, kannadaName);
      setCurrentRecipe(recipe);
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isAuthLoading ? (
        <div key="loading" className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-8 space-y-6">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full" />
        </div>
      ) : !isLoggedIn ? (
        <LoginView key="login" onLoginSuccess={(p) => { setUserProfile(p); setIsLoggedIn(true); }} />
      ) : (
        <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-50 text-slate-900 font-sans relative pb-20">
          <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Wheat size={28} /></div>
                <div><h1 className="text-xl font-black uppercase">Siri-Dhanya</h1><p className="text-[10px] font-bold text-slate-400 uppercase">{t.smartAgriHub}</p></div>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['en', 'kn', 'hi'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-2 md:px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold uppercase transition-all ${language === l ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    {l === 'en' ? 'EN' : l === 'kn' ? 'ಕನ್ನಡ' : 'हिं'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-[20px]">
                {[
                  { id: 'library', label: t.archive, icon: Bookmark },
                  { id: 'dashboard', label: t.marketPulse, icon: Activity },
                  { id: 'services', label: t.farmerAssistant, icon: Sprout },
                  { id: 'security', label: t.securityCenter, icon: ShieldCheck }
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveView(tab.id as any)} className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase transition-all ${activeView === tab.id ? 'bg-white text-emerald-600 shadow-lg' : 'text-slate-400'}`}><tab.icon size={16} /> <span className="hidden md:inline">{tab.label}</span></button>
                ))}
              </div>
              <button onClick={() => setShowProfile(true)} className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm"><User size={24} className="text-slate-500" /></button>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto p-6 md:p-8 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div key={activeView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
                {activeView === 'library' && <LibraryView searchQuery={searchQuery} setSearchQuery={setSearchQuery} showSavedOnly={showSavedOnly} setShowSavedOnly={setShowSavedOnly} setShowCatalog={setShowCatalog} filteredMillets={filteredMillets} savedMilletIds={savedMilletIds} toggleSaveMillet={(e, id) => { e.stopPropagation(); setSavedMilletIds(prev => prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]); }} setSelectedMillet={setSelectedMillet} language={language} />}
                {activeView === 'dashboard' && <MarketDashboard language={language} />}
                {activeView === 'services' && <FarmingAssistant onLocationUpdate={setUserLocation} language={language} />}
                {activeView === 'security' && <SecurityVault language={language} />}
              </motion.div>
            </AnimatePresence>
          </main>
          <AIAdvisor userLocation={userLocation} language={language} />
          <ScientificCatalog showCatalog={showCatalog} setShowCatalog={setShowCatalog} filteredMillets={filteredMillets} handlePrintCatalog={() => window.print()} />
          <MilletDetails millet={selectedMillet} onClose={() => setSelectedMillet(null)} onGenerateRecipe={handleGenerateRecipe} isGeneratingRecipe={isGeneratingRecipe} currentRecipe={currentRecipe} recipePreference={recipePreference} setRecipePreference={setRecipePreference} onGenerateVideo={generateVideoTutorial} language={language} />
          <AIVideoStudio
            showStudio={showStudio}
            setShowStudio={setShowStudio}
            selectedMillet={selectedMillet}
            videoTutorial={videoTutorial}
            genStep={genStep}
            genProcessSteps={genProcessSteps[language]}
            currentSceneIdx={currentSceneIdx}
            setCurrentSceneIdx={setCurrentSceneIdx}
            sceneProgress={sceneProgress}
            setSceneProgress={setSceneProgress}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            togglePlay={togglePlay}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            speakText={speakText}
            stopAmbientScore={stopAmbientScore}
            startAmbientScore={startAmbientScore}
            updateSceneTechnical={(idx, field, value) => { if (videoTutorial) { const nt = [...videoTutorial]; (nt[idx] as any)[field] = value; setVideoTutorial(nt); } }}
            cameraAngles={cameraAngles}
            lightingEffects={lightingEffects}
            language={language}
            onRetry={() => selectedMillet && generateVideoTutorial(selectedMillet)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
