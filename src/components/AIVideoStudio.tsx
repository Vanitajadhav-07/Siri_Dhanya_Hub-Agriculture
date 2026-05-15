import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clapperboard, Wand2, Camera, Zap, Volume2, Play, ArrowRight, Video, CheckCircle, MapPin, Navigation } from 'lucide-react';
import { Millet, VideoScene } from '../types';

interface AIVideoStudioProps {
  showStudio: boolean;
  setShowStudio: (show: boolean) => void;
  selectedMillet: Millet | null;
  videoTutorial: VideoScene[] | null;
  genStep: number;
  genProcessSteps: string[];
  currentSceneIdx: number;
  setCurrentSceneIdx: (idx: number | ((prev: number) => number)) => void;
  sceneProgress: number;
  setSceneProgress: (progress: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  speakText: (text: string, lang: 'en' | 'kn' | 'hi') => void;
  stopAmbientScore: () => void;
  startAmbientScore: () => void;
  updateSceneTechnical: (idx: number, key: string, value: string) => void;
  cameraAngles: string[];
  lightingEffects: string[];
  language: 'en' | 'kn' | 'hi';
}

export const AIVideoStudio: React.FC<AIVideoStudioProps> = ({
  showStudio,
  setShowStudio,
  selectedMillet,
  videoTutorial,
  genStep,
  genProcessSteps,
  currentSceneIdx,
  setCurrentSceneIdx,
  sceneProgress,
  setSceneProgress,
  isPlaying,
  setIsPlaying,
  togglePlay,
  isMuted,
  setIsMuted,
  speakText,
  stopAmbientScore,
  startAmbientScore,
  updateSceneTechnical,
  cameraAngles,
  lightingEffects,
  language
}) => {
  return (
    <AnimatePresence>
      {showStudio && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-0 md:p-4"
        >
          <div className="w-full max-w-5xl h-full md:h-auto md:aspect-video bg-slate-900 md:rounded-[40px] overflow-y-auto md:overflow-hidden border border-white/10 shadow-2xl relative flex flex-col">
            <button 
              onClick={() => setShowStudio(false)}
              className="fixed md:absolute top-8 right-8 z-[1050] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md"
            >
              <X size={24} />
            </button>

            {!videoTutorial ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 overflow-y-auto">
                 <div className="w-full max-w-4xl space-y-8">
                    <div className="text-center space-y-4">
                       <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic">
                         {genStep === -1
                           ? <><span className="text-rose-400">AI Error</span> — Watch on YouTube</>
                           : <><span className="text-emerald-500">AI</span> Recipe Masterclass</>
                         }
                       </h2>
                       <p className="text-lg text-slate-400 font-medium">
                         {genStep === -1
                           ? 'AI generation failed. Watch the recipe video on YouTube below.'
                           : genStep < 6
                             ? genProcessSteps[Math.min(genStep, genProcessSteps.length - 1)]
                             : `Authentic preparation for `
                         }
                         {genStep >= 6 && <span className="text-emerald-400 font-mono font-bold">{selectedMillet?.name}</span>}
                       </p>
                    </div>

                    {/* YouTube — open in browser (works reliably on Android WebView) */}
                    {selectedMillet?.youtubeId ? (
                      <div className="aspect-video w-full rounded-[40px] overflow-hidden border-4 border-white/5 shadow-2xl bg-slate-800 flex flex-col items-center justify-center gap-6">
                        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/40">
                          <Play size={36} fill="white" className="text-white ml-1" />
                        </div>
                        <div className="text-center space-y-2 px-8">
                          <p className="text-white font-bold text-lg">
                            {language === 'kn' ? 'ಯೂಟ್ಯೂಬ್‌ನಲ್ಲಿ ವೀಡಿಯೊ ವೀಕ್ಷಿಸಿ' : language === 'hi' ? 'YouTube पर वीडियो देखें' : 'Watch Recipe Video on YouTube'}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {language === 'kn' ? `${selectedMillet.kannadaName} ರೆಸಿಪಿ ವೀಡಿಯೊ` : `${selectedMillet.name} recipe tutorial`}
                          </p>
                        </div>
                        <button
                          onClick={() => window.open(`https://www.youtube.com/watch?v=${selectedMillet.youtubeId}`, '_blank')}
                          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-600/30 flex items-center gap-3"
                        >
                          <Play size={20} fill="currentColor" />
                          {language === 'kn' ? 'ಯೂಟ್ಯೂಬ್ ತೆರೆಯಿರಿ' : language === 'hi' ? 'YouTube खोलें' : 'Open YouTube'}
                        </button>
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-slate-800 rounded-[40px] flex flex-col items-center justify-center text-slate-500 gap-4 border-2 border-dashed border-white/5">
                         <Video size={64} className="opacity-20" />
                         <p className="font-bold uppercase tracking-widest text-sm">No Tutorial Video Found</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 flex flex-col justify-between gap-6">
                         <div className="space-y-2">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                               <MapPin size={24} />
                             </div>
                             <h4 className="text-xl font-bold text-white uppercase tracking-tight">Visit The Hub</h4>
                           </div>
                           <p className="text-xs text-slate-400 font-medium leading-relaxed">Visit our Siri-Dhanya Smart Agri Hub in Hubli to see the processing live and purchase fresh millets.</p>
                         </div>
                         <button
                           onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=Hubli+Karnataka+Siri+Dhanya+Hub`, '_blank')}
                           className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3"
                         >
                           <Navigation size={20} />
                           Get Route Directions
                         </button>
                      </div>

                      <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 flex flex-col justify-between gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                              <Zap size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-white uppercase tracking-tight">
                              {genStep === -1 ? 'AI Unavailable' : 'AI Generating'}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed">
                            {genStep === -1
                              ? 'Could not connect to AI. Check your internet connection and try again.'
                              : 'The AI Engine is processing your cinematic cooking guide in Kannada. Watch the YouTube video above while it loads.'
                            }
                          </p>
                        </div>
                        {genStep !== -1 && (
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                             <motion.div
                               className="h-full bg-emerald-500"
                               initial={{ width: "0%" }}
                               animate={{ width: `${(genStep / 6) * 100}%` }}
                             />
                          </div>
                        )}
                        {genStep === -1 && (
                          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest">
                            <X size={14} /> Generation Failed
                          </div>
                        )}
                      </div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col md:flex-row min-h-full md:h-full">
                <div className="relative md:flex-1 bg-black aspect-video md:aspect-auto group overflow-hidden shrink-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSceneIdx}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0"
                    >
                      <img 
                        src={
                          currentSceneIdx === 0 ? selectedMillet?.imageUrl :
                          currentSceneIdx === 1 ? (selectedMillet?.earImageUrl || selectedMillet?.imageUrl) :
                          (selectedMillet?.recipeImageUrl || selectedMillet?.imageUrl)
                        }
                        alt="Scene visual" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-60 mix-blend-luminosity brightness-75 transition-all duration-[5000ms] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-2xl px-4 md:px-8 pointer-events-none">
                        <motion.div
                          initial={{ y: 40, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-[24px] md:rounded-[32px]"
                        >
                          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] uppercase font-bold tracking-widest">
                            <Camera size={12} /> {videoTutorial[currentSceneIdx].title}
                          </div>
                          <p className="text-lg md:text-2xl font-medium text-white italic">"{videoTutorial[currentSceneIdx].visualCue}"</p>
                          
                          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-6">
                             <div className="flex items-center gap-2 text-slate-400">
                               <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                 <Camera size={14} className="text-emerald-400" />
                               </div>
                               <span className="text-[10px] uppercase font-mono tracking-widest">{videoTutorial[currentSceneIdx].cameraAngle}</span>
                             </div>
                             <div className="hidden md:block w-px h-4 bg-white/10" />
                             <div className="flex items-center gap-2 text-slate-400">
                               <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                 <Zap size={14} className="text-amber-400" />
                               </div>
                               <span className="text-[10px] uppercase font-mono tracking-widest whitespace-nowrap">{videoTutorial[currentSceneIdx].lighting} Lighting</span>
                             </div>
                             <div className="hidden md:block w-px h-4 bg-white/10" />
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 window.open(`https://www.google.com/maps/dir/?api=1&destination=Hubli+Karnataka+Siri+Dhanya+Hub`, '_blank');
                               }}
                               className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors pointer-events-auto"
                             >
                               <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                 <Navigation size={14} className="text-emerald-400" />
                               </div>
                               <span className="text-[10px] uppercase font-mono tracking-widest">Get Directions</span>
                             </button>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex-1 bg-slate-900 p-6 md:p-12 md:relative flex flex-col justify-between gap-8">
                  <div className="space-y-8">
                    <div className="flex flex-wrap gap-3">
                       {videoTutorial[currentSceneIdx].keywords?.map((kw: any, idx: number) => (
                         <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.8 + (idx * 0.1) }}
                           key={idx}
                           className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col items-center min-w-[90px] flex-1 md:flex-none"
                         >
                           <span className="text-[9px] text-emerald-400 font-mono uppercase tracking-tighter mb-1 select-none">Culinary Key</span>
                           <span className="text-white font-bold text-sm text-center">{typeof kw === 'string' ? kw : (kw as any).en}</span>
                         </motion.div>
                       ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=Hubli+Karnataka+Siri+Dhanya+Hub`, '_blank')}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group/speak shrink-0"
                          >
                            <Navigation size={24} className="text-white group-hover/speak:scale-110 transition-transform" />
                          </button>
                          {selectedMillet?.youtubeId && (
                            <button
                              onClick={() => window.open(`https://www.youtube.com/watch?v=${selectedMillet.youtubeId}`, '_blank')}
                              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group/speak shrink-0"
                            >
                              <Video size={24} className="text-white group-hover/speak:scale-110 transition-transform" />
                            </button>
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest mb-1">
                            {language === 'kn' ? 'ಸ್ಥಳದ ನಿರ್ದೇಶನ' : language === 'hi' ? 'स्थान दिशा' : 'Hub Location'}
                          </p>
                          <p className="text-xl md:text-2xl font-bold text-white leading-tight">{videoTutorial[currentSceneIdx].description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-6 mt-auto">
                    <div className="flex items-center gap-6">
                       <button
                         onClick={togglePlay}
                         className={`p-5 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white rounded-full transition-all shadow-xl`}
                       >
                         {isPlaying ? <span className="font-black px-2 uppercase text-xs">Pause</span> : <Play size={28} fill="currentColor" />}
                       </button>
                       <button
                         disabled={currentSceneIdx === videoTutorial.length - 1}
                         onClick={() => {
                           setCurrentSceneIdx(prev => (prev as number) + 1);
                           setSceneProgress(0);
                         }}
                         className="p-5 bg-white/10 hover:bg-white/20 text-white rounded-full disabled:opacity-30 transition-all"
                       >
                         <ArrowRight size={28} />
                       </button>
                    </div>

                    <div className="flex gap-1.5 w-full max-w-xs justify-center">
                      {videoTutorial.map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1.5 rounded-full transition-all duration-500 relative overflow-hidden ${i <= currentSceneIdx ? 'bg-white/40' : 'bg-white/10'}`}
                        >
                          {i === currentSceneIdx && (
                            <motion.div
                              className="absolute inset-0 bg-emerald-500"
                              style={{ width: `${sceneProgress}%` }}
                            />
                          )}
                          {i < currentSceneIdx && (
                            <div className="absolute inset-0 bg-emerald-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-80 bg-slate-950 border-l border-white/10 p-8 overflow-y-auto hidden lg:block">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-xl">
                        <Video size={20} className="text-emerald-400" />
                      </div>
                      <h3 className="font-bold text-white">Project Timeline</h3>
                    </div>
                    {videoTutorial.map((scene, i) => (
                      <button
                        key={scene.id}
                        onClick={() => {
                          setCurrentSceneIdx(i);
                          setSceneProgress(0);
                          setIsPlaying(false);
                        }}
                        className={`text-left p-4 rounded-2xl border transition-all ${
                          i === currentSceneIdx
                          ? 'bg-white/10 border-emerald-500 text-white ring-1 ring-emerald-500/20'
                          : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/[0.07]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono">SCENE {i + 1}</span>
                          <div className="flex gap-1">
                            {i === currentSceneIdx && isPlaying && <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />}
                          </div>
                        </div>
                        <p className="font-bold text-sm truncate">{scene.title}</p>
                        <div className="flex items-center gap-2 mt-2 opacity-60">
                          <Camera size={10} />
                          <span className="text-[8px] font-mono uppercase tracking-tighter">{scene.cameraAngle}</span>
                        </div>
                      </button>
                    ))}
                    
                    <div className="mt-4 pt-6 border-t border-white/10 space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Camera Angle</h4>
                          <span className="text-[9px] text-emerald-400 font-mono px-2 py-0.5 bg-emerald-500/10 rounded-full">{videoTutorial[currentSceneIdx].cameraAngle}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {cameraAngles.map(angle => (
                            <button
                              key={angle}
                              onClick={() => updateSceneTechnical(currentSceneIdx, 'cameraAngle', angle)}
                              className={`text-[8px] py-2 rounded-lg border transition-all font-bold uppercase tracking-tighter ${
                                videoTutorial[currentSceneIdx].cameraAngle === angle
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                              }`}
                            >
                              {angle.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Lighting FX</h4>
                          <span className="text-[9px] text-amber-400 font-mono px-2 py-0.5 bg-amber-500/10 rounded-full">{videoTutorial[currentSceneIdx].lighting}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {lightingEffects.map(light => (
                            <button
                              key={light}
                              onClick={() => updateSceneTechnical(currentSceneIdx, 'lighting', light)}
                              className={`text-[8px] py-2 rounded-lg border transition-all font-bold uppercase tracking-tighter ${
                                videoTutorial[currentSceneIdx].lighting === light
                                ? 'bg-amber-500 text-white border-amber-500'
                                : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                              }`}
                            >
                              {light}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                       <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-2">Export Quality</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">4K ProRes 422</span>
                            <CheckCircle size={14} className="text-emerald-500" />
                          </div>
                       </div>
                       <button 
                         onClick={() => alert("Rendering full video... Use 'Save for Offline' to download results.")}
                         className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
                       >
                         Render Final Masterpiece
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
