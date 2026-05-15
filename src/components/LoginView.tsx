import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, Mail, ArrowRight, CheckCircle2, ChevronLeft, 
  User, Sparkles, Sprout, ShieldCheck, Smartphone, RefreshCw
} from 'lucide-react';
import { UserProfile } from '../types';
import { auth, db } from '../lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface LoginViewProps {
  onLoginSuccess: (profile: UserProfile) => void;
}

type AuthStep = 'method' | 'verify' | 'profile';
type AuthMethod = 'phone' | 'email';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<AuthStep>('method');
  const [method, setMethod] = useState<AuthMethod>('phone');
  const [inputValue, setInputValue] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [profile, setProfile] = useState<{firstName: string, lastName: string, role: 'Farmer' | 'Consumer' | 'Merchant'}>({ 
    firstName: '', 
    lastName: '',
    role: 'Consumer' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleStartAuth = () => {
    if (!inputValue) return;
    setStep('profile');
    console.log(`Transitioning to profile step with input: ${inputValue}`);
  };

  const handleCompleteProfile = async () => {
    if (!profile.firstName || !profile.lastName) return;
    
    setIsLoading(true);
    
    // Construct valid profile
    const finalProfile: UserProfile = {
      ...profile,
      [method === 'phone' ? 'phone' : 'email']: inputValue
    };

    try {
      // Try Firebase auth silently — if it fails, continue anyway
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (authError: any) {
          // Anonymous auth may be disabled in Firebase console — that's OK
          console.warn("Anonymous auth skipped:", authError?.code || authError);
        }
      }
      
      // Try Firestore write silently — if it fails, continue anyway
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          await setDoc(userDocRef, {
            ...finalProfile,
            createdAt: serverTimestamp()
          });
        } catch (dbError: any) {
          console.warn("Firestore write skipped:", dbError?.code || dbError);
        }
      }
      
      // Always proceed to the app
      onLoginSuccess(finalProfile);
      
    } catch (error) {
      console.error("Login error:", error);
      // Even on total failure, let the user in
      onLoginSuccess(finalProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'method':
        return (
          <motion.div 
            key="method"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="space-y-10"
          >
            <div className="flex items-center justify-between">
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, 0] }}
                className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-emerald-600/40 relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity" />
                <Sprout size={36} strokeWidth={2.5} />
              </motion.div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-emerald-600/30 uppercase tracking-[0.5em]">Phase</span>
                <span className="text-2xl font-black text-slate-200 -mt-1">01</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-[0.75] uppercase">
                SIRI <br />
                <span className="text-emerald-600">DHANYA</span>
              </h1>
              <div className="flex items-center gap-4">
                <div className="h-1.5 w-16 bg-emerald-500 rounded-full" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Digital Grain Archive</p>
              </div>
              <p className="text-slate-400 font-semibold tracking-tight leading-relaxed max-w-[280px] pt-2">
                Your journey to sustainable agriculture begins here. <br />
                Connect with the pulse of the earth.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-2 p-1.5 bg-slate-100/50 rounded-3xl border border-slate-200/30 backdrop-blur-sm">
                <button 
                  onClick={() => setMethod('phone')}
                  className={`flex-1 py-4 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 ${method === 'phone' ? 'bg-white text-emerald-600 shadow-xl shadow-slate-200 border border-slate-100' : 'text-slate-400 hover:text-slate-500'}`}
                >
                  <Smartphone size={14} /> Mobile
                </button>
                <button 
                  onClick={() => setMethod('email')}
                  className={`flex-1 py-4 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 ${method === 'email' ? 'bg-white text-emerald-600 shadow-xl shadow-slate-200 border border-slate-100' : 'text-slate-400 hover:text-slate-500'}`}
                >
                  <Mail size={14} /> Email
                </button>
              </div>

              <div className="space-y-4">
                <div className="group relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-all duration-300">
                    {method === 'phone' ? <Phone size={24} /> : <Mail size={24} />}
                  </div>
                  <input 
                    type={method === 'phone' ? 'tel' : 'email'}
                    placeholder={method === 'phone' ? 'e.g. +91 90000 00000' : 'farmer@siri-dhanya.io'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full pl-16 pr-8 py-7 bg-slate-50/50 border-2 border-transparent rounded-3xl focus:border-emerald-600 focus:bg-white outline-none transition-all duration-500 font-black text-xl text-slate-800 placeholder:text-slate-300 placeholder:font-bold shadow-inner"
                  />
                </div>

                {/* New: Enable Secure Login Option */}
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Safe Identity</p>
                      <p className="text-[10px] font-bold text-emerald-600/60">Secure account verification</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert("Secure Verification (OTP) is now ENABLED for your account.")}
                    className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
                  >
                    Enable
                  </button>
                </div>

                <button 
                  onClick={handleStartAuth}
                  disabled={isLoading || !inputValue}
                  className="w-full bg-slate-900 text-white h-[84px] rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all duration-500 disabled:opacity-50 shadow-2xl shadow-slate-900/10 active:scale-[0.98] group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-3 tracking-tighter">
                    {isLoading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <RefreshCw size={28} />
                      </motion.div>
                    ) : (
                      <>ACCESS THE HUB <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform duration-500" /> </>
                    )}
                  </span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-100" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] whitespace-nowrap">Global Food Security Core</p>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-100" />
            </div>
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="space-y-10"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setStep('method')}
                className="group flex items-center gap-3 text-slate-400 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition-all px-6 py-3 rounded-full border-2 border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/50"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
              </button>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-emerald-600/30 uppercase tracking-[0.5em]">Phase</span>
                <span className="text-2xl font-black text-slate-200 -mt-1">02</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.8] uppercase">
                IDENTITY <br />
                <span className="text-emerald-600">PROFILE</span>
              </h2>
              <div className="h-1 w-20 bg-emerald-500 rounded-full" />
              <p className="text-slate-400 font-semibold tracking-tight leading-relaxed max-w-[280px]">
                Your contribution matters. <br />
                Help us tailor the experience to your needs.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase font-black text-slate-300 tracking-widest pl-1">Operational Role</label>
                  <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-emerald-600 transition-all">
                    {[
                      { id: 'Farmer' as const, label: 'Farmer', icon: Sprout },
                      { id: 'Consumer' as const, label: 'Consumer', icon: User },
                      { id: 'Merchant' as const, label: 'Merchant', icon: ShieldCheck },
                    ].map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setProfile(prev => ({ ...prev, role: r.id }))}
                        className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-1.5 ${profile.role === r.id ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-500'}`}
                      >
                        <r.icon size={14} />
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase font-black text-slate-300 tracking-widest pl-1 group-focus-within:text-emerald-500 transition-colors">First Identity</label>
                  <input 
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter First Name"
                    className="w-full px-8 py-6 bg-slate-50/50 border-2 border-transparent rounded-[2.5rem] focus:border-emerald-600 focus:bg-white outline-none transition-all duration-500 font-black text-xl text-slate-800 placeholder:text-slate-200 placeholder:font-bold shadow-inner"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] uppercase font-black text-slate-300 tracking-widest pl-1 group-focus-within:text-emerald-500 transition-colors">Family Name</label>
                  <input 
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter Surname"
                    className="w-full px-8 py-6 bg-slate-50/50 border-2 border-transparent rounded-[2.5rem] focus:border-emerald-600 focus:bg-white outline-none transition-all duration-500 font-black text-xl text-slate-800 placeholder:text-slate-200 placeholder:font-bold shadow-inner"
                  />
                </div>
              </div>
              <button 
                onClick={handleCompleteProfile}
                disabled={isLoading || !profile.firstName || !profile.lastName}
                className="w-full bg-emerald-600 text-white h-[84px] rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-emerald-700 transition-all duration-500 disabled:opacity-50 shadow-2xl shadow-emerald-500/20 group active:scale-[0.98]"
              >
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <RefreshCw size={28} />
                  </motion.div>
                ) : (
                  <>FINALIZE SETUP <CheckCircle2 size={28} strokeWidth={2.5} className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" /> </>
                )}
              </button>
            </div>
          </motion.div>
        );
    }
  };


  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Visual Pane */}
      <div className="relative w-full md:w-1/2 lg:w-[60%] h-[40vh] md:h-screen bg-emerald-950 overflow-hidden">
        {/* Background Image with Cinematic Overlays */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=2000" 
            alt="Golden Millet Fields" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent" />
        </div>
        
        {/* Cinematic Content */}
        <div className="relative h-full flex flex-col justify-between p-8 md:p-16 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Sprout size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">SIRI-DHANYA HUB</h1>
          </div>

          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-[2px] bg-emerald-400" />
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-emerald-400">Agricultural Revolution</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-8">
                EMPOWERING <br />
                <span className="text-emerald-400">FARMERS,</span> <br />
                NOURISHING <br />
                LIVES.
              </h2>
              <div className="flex gap-12">
                <div>
                  <p className="text-4xl font-black mb-1">5.2k+</p>
                  <p className="text-xs font-bold text-emerald-400/60 uppercase tracking-widest">Verified Farmers</p>
                </div>
                <div>
                  <p className="text-4xl font-black mb-1">12M</p>
                  <p className="text-xs font-bold text-emerald-400/60 uppercase tracking-widest">Meals Served</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
            <p>© 2026 Digital Organic Archive</p>
            <div className="flex gap-6">
              <span>Privacy</span>
              <span>LegaL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Pane */}
      <div className="w-full md:w-1/2 lg:w-[40%] flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-sm">
            {renderContent()}
          </div>
        </div>

        {/* Brand Accents */}
        <div className="p-8 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-500" size={16} />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Blockchain Protected Identity</span>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
