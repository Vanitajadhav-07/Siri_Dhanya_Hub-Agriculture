import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Bot, User, Sparkles, MessageSquare, 
  X, Maximize2, Minimize2, Languages, Volume2, 
  RefreshCw, Mic, Paperclip, ChevronRight, Sprout
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from '../lib/config';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAdvisorProps {
  userLocation: {lat: number, lng: number} | null;
  language: 'en' | 'kn' | 'hi';
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ userLocation, language }) => {
  const ai = React.useMemo(() => {
    console.log("Gemini Advisor: Initializing with key length", GEMINI_API_KEY.length);
    return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }, []);

  const translations = {
    en: {
      welcome: "Namaste! I am your Siri-Dhanya AI Advisor. I can help you with millet farming tips, nutritional facts, or market insights. How can I assist you today?",
      placeholder: "Ask anything about millets...",
      suggestions: [
        "Best time to sow Ragi?",
        "Health benefits of Foxtail millet?",
        "How to make Kodo millet upma?",
        "Direct market contacts for farmers?"
      ],
      system: "Active System",
      global: "Global Agri Knowledge Interface"
    },
    kn: {
      welcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸಿರಿ-ಧಾನ್ಯ ಎಐ ಸಲಹೆಗಾರ. ಸಿರಿಧಾನ್ಯ ಬೆಳೆಯುವ ಬಗ್ಗೆ, ಪೌಷ್ಟಿಕಾಂಶದ ಬಗ್ಗೆ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿಗಾಗಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
      placeholder: "ಸಿರಿಧಾನ್ಯಗಳ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ...",
      suggestions: [
        "ರಾಗಿ ಬಿತ್ತನೆಗೆ ಉತ್ತಮ ಸಮಯ ಯಾವುದು?",
        "ನವಣೆಯ ಆರೋಗ್ಯ ಪ್ರಯೋಜನಗಳೇನು?",
        "ಹಾರಕ ಉಪ್ಪಿಟ್ಟು ಮಾಡುವುದು ಹೇಗೆ?",
        "ರೈತರಿಗಾಗಿ ನೇರ ಮಾರುಕಟ್ಟೆ ಸಂಪರ್ಕಗಳು?"
      ],
      system: "ಸಕ್ರಿಯ ವ್ಯವಸ್ಥೆ",
      global: "ಜಾಗತಿಕ ಕೃಷಿ ಜ್ಞಾನ ಇಂಟರ್ಫೇಸ್"
    },
    hi: {
      welcome: "नमस्ते! मैं आपका सिरी-धान्य एआई सलाहकार हूं। मैं बाजरा की खेती के सुझावों, पोषण संबंधी तथ्यों या बाजार की जानकारी में आपकी मदद कर सकता हूं। आज मैं आपकी क्या सहायता कर सकता हूँ?",
      placeholder: "बाजरा के बारे में कुछ भी पूछें...",
      suggestions: [
        "रागी बोने का सबसे अच्छा समय क्या है?",
        "कंगनी बाजरा के स्वास्थ्य लाभ?",
        "कोदो बाजरा उपमा कैसे बनाये?",
        "किसानों के लिए प्रत्यक्ष बाजार संपर्क?"
      ],
      system: "सक्रिय प्रणाली",
      global: "ग्लोबल एग्री नॉलेज इंटरफ़ेस"
    }
  };

  const t = translations[language];

  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: t.welcome,
      timestamp: new Date()
    }
  ]);

  // Update initial message when language changes if no other messages exist
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{
        role: 'assistant',
        content: t.welcome,
        timestamp: new Date()
      }]);
    }
  }, [language]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are the "Siri-Dhanya Hub Advisor", an expert on millets (Siri-Dhanya) in Karnataka, India.
          Current User Context:
          - Language: ${language}
          - Live GPS: ${userLocation ? `${userLocation.lat}, ${userLocation.lng}` : 'Unknown'}

          Your goals:
          1. Provide accurate farming advice (sowing, harvesting, soil health).
          2. Explain nutritional benefits of millets like Ragi, Foxtail, Kodo, etc.
          3. Suggest traditional and healthy recipes.
          4. Assist with market price analysis.
          5. Use the user's GPS coordinates to provide location-specific crop advice if coordinates are available.

          Keep responses concise, professional, and helpful. Use a warm, encouraging tone.
          Respond in ${language === 'kn' ? 'Kannada' : language === 'hi' ? 'Hindi' : 'English'}.
          Mention local Kannada names alongside English names when relevant (e.g. Navane/Foxtail).`;

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: input,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: result.text || "I apologize, I couldn't process that. Please try again.",
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to the network. Please check your internet and try again.", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Best time to sow Ragi?",
    "Health benefits of Foxtail millet?",
    "How to make Kodo millet upma?",
    "Direct market contacts for farmers?"
  ];

  if (isMinimized) {
    return (
      <motion.button
        layoutId="ai-chat"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-8 right-8 z-[200] w-16 h-16 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center justify-center group hover:bg-emerald-700 transition-all active:scale-95"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <Bot size={28} />
        </motion.div>
        <div className="absolute -top-2 -right-2 bg-rose-500 w-4 h-4 rounded-full border-2 border-white animate-ping" />
      </motion.button>
    );
  }

  return (
    <motion.div
      layoutId="ai-chat"
      className="fixed bottom-8 right-8 z-[200] w-[400px] h-[600px] bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Sprout size={24} />
          </div>
          <div>
            <h3 className="font-black tracking-tight leading-none uppercase text-sm">Siri-Dhanya AI</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">{t.system}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Minimize2 size={18} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 shadow-sm border border-slate-100'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-600/10' : 'bg-white text-slate-800 rounded-tl-none shadow-sm border border-slate-100'}`}>
                  {msg.content}
                  <div className={`text-[9px] mt-2 font-bold uppercase tracking-tighter ${msg.role === 'user' ? 'text-emerald-200' : 'text-slate-300'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-emerald-600 shadow-sm border border-slate-100 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggested Questions */}
      {messages.length < 3 && !isLoading && (
        <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap bg-slate-50/50">
          {t.suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center gap-2"
            >
              <Sparkles size={12} className="text-emerald-500" />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            placeholder={t.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 pl-4 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Send size={20} fill="currentColor" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{t.global}</p>
        </div>
      </div>
    </motion.div>
  );
};
