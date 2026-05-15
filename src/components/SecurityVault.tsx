import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Lock, Eye, Key, 
  Smartphone, Bell, ShieldAlert,
  Fingerprint, FileLock, Wifi,
  ChevronRight, RefreshCw, X
} from 'lucide-react';

interface SecurityVaultProps {
  language?: 'en' | 'kn' | 'hi';
}

export const SecurityVault: React.FC<SecurityVaultProps> = ({ language = 'en' }) => {
  const translations = {
    en: {
      title: "Security Center",
      protected: "Digital Shield Protected",
      enterPin: "Enter Secure PIN",
      vaultLocked: "Vault Locked",
      accessSensitive: "Enter 4-digit PIN to access sensitive logs",
      healthScore: "Health Score",
      encryptedSync: "Encrypted Sync",
      liveFeed: "Live Security Feed",
      relockVault: "Relock Vault",
      securityScan: "Security Scan",
      scanning: "Scanning...",
      noThreat: "No Active Threat Detected",
      manageRules: "Manage Rules",
      aesEnabled: "AES-256 Enabled",
      systemActive: "System Active"
    },
    kn: {
      title: "ಭದ್ರತಾ ಕೇಂದ್ರ",
      protected: "ಡಿಜಿಟಲ್ ಶೀಲ್ಡ್ ಸಂರಕ್ಷಿಸಲಾಗಿದೆ",
      enterPin: "ಪಿನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
      vaultLocked: "ವಾಲ್ಟ್ ಲಾಕ್ ಆಗಿದೆ",
      accessSensitive: "ಸೂಕ್ಷ್ಮ ಲಾಗ್‌ಗಳನ್ನು ಪ್ರವೇಶಿಸಲು 4-ಅಂಕಿಯ ಪಿನ್ ನಮೂದಿಸಿ",
      healthScore: "ಆರೋಗ್ಯ ಸ್ಕೋರ್",
      encryptedSync: "ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಸಿಂಕ್",
      liveFeed: "ಲೈವ್ ಭದ್ರತಾ ಫೀಡ್",
      relockVault: "ವಾಲ್ಟ್ ಅನ್ನು ಮರು-ಲಾಕ್ ಮಾಡಿ",
      securityScan: "ಭದ್ರತಾ ಸ್ಕ್ಯಾನ್",
      scanning: "ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
      noThreat: "ಯಾವುದೇ ಬೆದರಿಕೆ ಪತ್ತೆಯಾಗಿಲ್ಲ",
      manageRules: "ನಿಯಮಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
      aesEnabled: "AES-256 ಸಕ್ರಿಯ",
      systemActive: "ಸಿಸ್ಟಮ್ ಸಕ್ರಿಯವಾಗಿದೆ"
    },
    hi: {
      title: "सुरक्षा केंद्र",
      protected: "डिजिटल शील्ड सुरक्षित",
      enterPin: "सुरक्षित पिन दर्ज करें",
      vaultLocked: "वॉल्ट लॉक है",
      accessSensitive: "संवेदनशील लॉग तक पहुंचने के लिए 4-अंकीय पिन दर्ज करें",
      healthScore: "स्वास्थ्य स्कोर",
      encryptedSync: "एन्क्रिप्टेड सिंक",
      liveFeed: "लाइव सुरक्षा फ़ीड",
      relockVault: "वॉल्ट फिर से लॉक करें",
      securityScan: "सुरक्षा स्कैन",
      scanning: "स्कैनिंग...",
      noThreat: "कोई सक्रिय खतरा नहीं मिला",
      manageRules: "नियम प्रबंधित करें",
      aesEnabled: "AES-256 सक्षम",
      systemActive: "सिस्टम सक्रिय"
    }
  };

  const t = translations[language];

  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [showLogs, setShowLogs] = useState(false);

  // Simulated Security Logs
  const securityLogs = [
    {
      id: 1,
      event: language === 'kn' ? 'ಜಿಪಿಎಸ್ ಜಿಯೋಫೆನ್ಸ್ ಉಲ್ಲಂಘನೆ' : language === 'hi' ? 'जीपीएस जियोफेंस उल्लंघन' : 'GPS Geofence Breach',
      time: language === 'kn' ? 'ಪೂರ್ವಾಹ್ನ 10:15' : language === 'hi' ? 'सुबह 10:15' : '10:15 AM',
      status: language === 'kn' ? 'ಪರಿಹರಿಸಲಾಗಿಲ್ಲ' : language === 'hi' ? 'अनसुलझा' : 'UNRESOLVED',
      location: language === 'kn' ? 'ಉತ್ತರ ಕ್ಷೇತ್ರ' : language === 'hi' ? 'उत्तरी क्षेत्र' : 'North Field'
    },
    {
      id: 2,
      event: language === 'kn' ? 'ಹೊಸ ಸಾಧನ ಲಾಗಿನ್' : language === 'hi' ? 'नया डिवाइस लॉगिन' : 'New Device Login',
      time: language === 'kn' ? 'ನಿನ್ನೆ' : language === 'hi' ? 'कल' : 'Yesterday',
      status: language === 'kn' ? 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ' : language === 'hi' ? 'सत्यापित' : 'VERIFIED',
      location: language === 'kn' ? 'ಹುಬ್ಬಳ್ಳಿ (ಈ ಸಾಧನ)' : language === 'hi' ? 'हुबली (यह डिवाइस)' : 'Hubli (This Device)'
    },
  ];

  const [logs, setLogs] = useState(securityLogs);
  const [isScanning, setIsScanning] = useState(false);

  const startSecurityScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert('SECURITY SCAN COMPLETE: Cloud nodes verified. No unauthorized digital traces found in your farm ledger.');
      // Automatically resolve any pending breaches after a scan
      setLogs(prev => prev.map(log => ({ ...log, status: 'RESOLVED' })));
    }, 2500);
  };

  const resolveAlert = (id: number) => {
    setLogs(prev => prev.map(log => {
      if (log.id === id) {
        return { ...log, status: 'RESOLVED' };
      }
      return log;
    }));
    alert('SECURE FIX APPLIED: Patch deployed to local beacon. Breach status cleared.');
  };

  const handleUnlock = () => {
    if (pin === '1234') { 
      setIsLocked(false);
      setPin('');
    } else {
      alert('Access Denied: Invalid Security Token');
      setPin('');
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">{t.title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Farm Protocol v2.4</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end mr-3">
             <span className="text-[10px] font-black text-emerald-400 uppercase">{t.systemActive}</span>
             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{t.aesEnabled}</span>
          </div>
          <Fingerprint size={20} className="text-slate-500" />
        </div>
      </div>

      <div className="flex-1 p-8 relative">
        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div 
              key="locked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-6 text-center"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Lock size={40} className="text-slate-300" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-800 uppercase italic">{t.vaultLocked}</h4>
                <p className="text-xs text-slate-400 font-medium">{t.accessSensitive}</p>
              </div>
              
              <div className="flex gap-4 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full border-2 border-slate-200 transition-all ${pin.length >= i ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-lg shadow-emerald-500/20' : ''}`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'X'].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      if (num === 'C') {
                        setPin('');
                      } else if (num === 'X') {
                        setPin(prev => prev.slice(0, -1));
                      } else if (pin.length < 4) {
                        const newPin = pin + num;
                        setPin(newPin);
                        if (newPin === '1234') {
                          setTimeout(() => {
                            setIsLocked(false);
                            setPin('');
                          }, 300);
                        } else if (newPin.length === 4) {
                          setTimeout(() => {
                            alert('Access Denied: Invalid Security Token');
                            setPin('');
                          }, 300);
                        }
                      }
                    }}
                    className="w-full h-14 bg-slate-50 hover:bg-white hover:shadow-lg rounded-2xl font-black text-lg transition-all active:scale-95 border border-slate-100 flex items-center justify-center text-slate-700"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="unlocked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Security Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-emerald-50 rounded-[28px] border border-emerald-100 relative overflow-hidden">
                   <ShieldCheck className="absolute top-[-10px] right-[-10px] size-20 text-emerald-600/5 rotate-12" />
                   <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t.healthScore}</p>
                   <p className="text-3xl font-black text-emerald-700 tracking-tight">98%</p>
                </div>
                <div className="p-6 bg-slate-900 rounded-[28px] text-white overflow-hidden relative">
                   <Wifi className="absolute top-[-10px] right-[-10px] size-20 text-white/5 rotate-12" />
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.encryptedSync}</p>
                   <p className="text-3xl font-black tracking-tight">{language === 'kn' ? 'ಸಕ್ರಿಯ' : language === 'hi' ? 'सक्रिय' : 'ACTIVE'}</p>
                </div>
              </div>

              {/* Security Actions */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">{t.liveFeed}</h4>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <button 
                      key={log.id} 
                      onClick={() => log.status !== 'RESOLVED' && resolveAlert(log.id)}
                      className={`w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border transition-all text-left group ${log.status !== 'RESOLVED' ? 'border-rose-200 bg-rose-50/30 hover:bg-white hover:shadow-xl hover:shadow-rose-900/5' : 'border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.event.includes('Breach') && log.status !== 'RESOLVED' ? 'bg-rose-500 text-white animate-pulse' : log.event.includes('Breach') ? 'bg-slate-200 text-slate-500' : 'bg-blue-50 text-blue-500'}`}>
                          {log.event.includes('Breach') ? <ShieldAlert size={18} /> : <Smartphone size={18} />}
                        </div>
                        <div>
                          <p className={`text-xs font-black uppercase tracking-tight ${log.status !== 'RESOLVED' ? 'text-rose-600' : 'text-slate-800'}`}>{log.event}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{log.time} • {log.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         {log.status !== 'RESOLVED' && <span className="text-[7px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded tracking-widest animate-bounce">ACT NOW</span>}
                         <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${log.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                           {log.status}
                         </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setIsLocked(true)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all outline-none"
                >
                  {t.relockVault}
                </button>
                <button 
                  onClick={startSecurityScan}
                  disabled={isScanning}
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 transition-all outline-none flex items-center justify-center gap-2"
                >
                  {isScanning ? <RefreshCw size={14} className="animate-spin" /> : null}
                  {isScanning ? t.scanning : t.securityScan}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Notifications */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell size={16} className="text-slate-400 animate-swing" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.noThreat}</span>
        </div>
        <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
          {t.manageRules} <ChevronRight size={10} />
        </button>
      </div>
    </div>
  );
};
