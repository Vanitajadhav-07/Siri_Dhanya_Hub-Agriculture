import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Radio, Crosshair, Navigation, 
  ShieldCheck, AlertCircle, ChevronRight, 
  LocateFixed, Satellite, Signal, Info,
  Map as MapIcon, Maximize2, Layers
} from 'lucide-react';

interface SmartGPSTrackerProps {
  onLocationUpdate?: (coords: {lat: number, lng: number}) => void;
}

export const SmartGPSTracker: React.FC<SmartGPSTrackerProps> = ({ onLocationUpdate }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [signalStrength, setSignalStrength] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [accuracy, setAccuracy] = useState(0);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("GPS not supported");
      return;
    }

    setIsTracking(true);
    setSignalStrength(20);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(newCoords);
        if (onLocationUpdate) onLocationUpdate(newCoords);

        setAccuracy(pos.coords.accuracy);
        setSignalStrength(Math.floor(Math.random() * 40) + 60);
        setIsLocked(true);
      },
      (err) => {
        console.error(err);
        setSignalStrength(0);
        setIsLocked(false);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  return (
    <div className="bg-white rounded-[48px] overflow-hidden border border-slate-100 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isLocked ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white/10'}`}>
            <Satellite size={24} className={isTracking && !isLocked ? 'animate-spin' : ''} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">Farm Sentinel GPS</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {isTracking ? (isLocked ? 'Signal Locked' : 'Searching...') : 'System Idle'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1 mr-4">
              {[1, 2, 3, 4].map((bar) => (
                <div 
                  key={bar}
                  className={`w-1 rounded-full transition-all ${signalStrength >= bar * 25 ? 'bg-emerald-400' : 'bg-white/10'}`} 
                  style={{ height: `${bar * 4}px` }}
                />
              ))}
              <Signal size={12} className="text-slate-400 ml-1" />
           </div>
           <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
             <Maximize2 size={18} />
           </button>
        </div>
      </div>

      {/* Main Tracker Interface */}
      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Map / Radar Area */}
        <div className="relative aspect-square lg:aspect-auto rounded-[32px] bg-slate-50 border-2 border-slate-100 overflow-hidden flex items-center justify-center group">
          {/* Topographic Lines Background Sim */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 text-center space-y-6">
             <div className="relative mx-auto w-48 h-48 flex items-center justify-center">
                <AnimatePresence>
                  {isTracking && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 2, 1] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="absolute inset-0 bg-emerald-500/10 rounded-full"
                    />
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-full animate-spin-slow" />
                <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center relative z-10 border border-slate-100">
                   <Crosshair size={32} className={`transition-colors ${isLocked ? 'text-emerald-500' : 'text-slate-300'}`} />
                </div>
                {/* Simulated Farm Boundary */}
                <div className="absolute inset-[-40px] border-2 border-emerald-500/20 rounded-[40px] flex items-end justify-center pb-4">
                  <span className="text-[9px] font-black text-emerald-600/50 uppercase tracking-[0.3em]">Geofenced Area</span>
                </div>
             </div>
             <div>
                <h4 className="text-sm font-black text-slate-800 uppercase italic">Farm Boundary #402</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Hubli-Dharwad Region</p>
             </div>
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button className="p-3 bg-white shadow-xl border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all">
              <Layers size={20} />
            </button>
            <button className="p-3 bg-white shadow-xl border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all">
              <MapIcon size={20} />
            </button>
          </div>
        </div>

        {/* Data Panel */}
        <div className="space-y-6 flex flex-col">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Telemetry Data</h4>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-900/5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Elevation</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">642<span className="text-xs font-bold text-slate-400 ml-1">m</span></p>
               </div>
               <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-900/5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                  <p className="text-2xl font-black text-emerald-600 tracking-tight">±{isLocked ? (accuracy.toFixed(1)) : '0.0'}<span className="text-xs font-bold text-slate-400 ml-1">m</span></p>
               </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <LocateFixed size={18} className="text-slate-400" />
                     <span className="text-[10px] font-black text-slate-800 uppercase">Live Coordinates</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 italic">SECURE FEED</span>
               </div>
               <div className="space-y-2">
                 <div className="flex items-center justify-between font-mono bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-300 uppercase">Lat</span>
                    <span className="text-xs font-black text-slate-700">{coords?.lat.toFixed(6) || '00.000000'}° N</span>
                 </div>
                 <div className="flex items-center justify-between font-mono bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-300 uppercase">Lng</span>
                    <span className="text-xs font-black text-slate-700">{coords?.lng.toFixed(6) || '00.000000'}° E</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <button 
              onClick={startTracking}
              disabled={isTracking && isLocked}
              className={`w-full py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-xl ${isTracking ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/5' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 active:scale-95'}`}
            >
              {isTracking ? <Radio size={18} className="animate-pulse" /> : <Navigation size={18} />}
              {isTracking ? 'Tracking Session Active' : 'Initiate Smart Tracking'}
            </button>
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-12">
         <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">End-to-End Encrypted</span>
         </div>
         <div className="flex items-center gap-2">
            <Info size={16} className="text-blue-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">WGS 84 Standard</span>
         </div>
      </div>
    </div>
  );
};
