import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Clock, RefreshCw, MapPin, IndianRupee, Navigation, Train, ChevronLeft, ChevronRight } from "lucide-react";
import { Itinerary } from "@/types";

interface DayTimelineProps {
  itinerary: Itinerary;
  activeDayIdx: number;
  setActiveDayIdx: (idx: number) => void;
  isRegenerating: string | null;
  onRegenerate: (dIdx: number, aIdx: number, day: any, activity: any) => void;
}

export const DayTimeline = ({ itinerary, activeDayIdx, setActiveDayIdx, isRegenerating, onRegenerate }: DayTimelineProps) => {
  const day = itinerary.days[activeDayIdx];

  return (
    <div className="w-full relative z-20">
      <div className="space-y-6">
        {/* Floating Navigation Controls - Relocated for Better Focus */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-b-white/5 ring-1 ring-white/5">
          <button 
            onClick={() => setActiveDayIdx(Math.max(0, activeDayIdx - 1))}
            disabled={activeDayIdx === 0}
            aria-label="Previous Day"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 group"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <div className="flex items-center gap-4 px-4 border-l border-r border-white/10">
            {itinerary.days.map((_: any, idx: number) => (
              <button
                key={idx} 
                onClick={() => setActiveDayIdx(idx)} 
                className="group relative flex items-center justify-center p-1"
              >
                <div 
                  className={`transition-all duration-500 rounded-full ${
                    idx === activeDayIdx 
                      ? 'bg-[#D4AF37] w-2.5 h-2.5 shadow-[0_0_15px_rgba(212,175,55,0.8)]' 
                      : 'bg-white/20 w-1.5 h-1.5 group-hover:bg-white/40'
                  }`} 
                />
                {idx === activeDayIdx && (
                  <motion.div 
                    layoutId="activeDayGlow"
                    className="absolute -inset-2 bg-[#D4AF37]/20 blur-md rounded-full -z-10"
                  />
                )}
                <span className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                  Day {idx + 1}
                </span>
              </button>
            ))}
          </div>

          <button 
            onClick={() => setActiveDayIdx(Math.min(itinerary.days.length - 1, activeDayIdx + 1))}
            disabled={activeDayIdx === itinerary.days.length - 1}
            aria-label="Next Day"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 group"
          >
            <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.section 
            key={activeDayIdx}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-12 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4 z-20 bg-[#050505]">
                <span className="text-4xl font-serif text-[#D4AF37]/30 font-light italic select-none">
                  {day.day_number.toString().padStart(2, '0')}
                </span>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-[#D4AF37]/60 uppercase tracking-[0.3em] block">JOURNEY PHASE</span>
                  <h3 className="text-xl md:text-2xl font-serif text-white tracking-tight">{day.theme}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-medium md:ml-auto w-fit z-20">
                <Cloud size={12} className="text-[#D4AF37]/60" />
                <span>{day.weather}</span>
              </div>
            </div>

            <div className="relative space-y-16 ml-2 md:ml-12 border-l border-white/10 pl-8 md:pl-16 py-4">
              {day.activities.map((activity: any, aIdx: number) => (
                <motion.div 
                  key={aIdx}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: aIdx * 0.1 }} viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="absolute -left-[35px] md:-left-[67px] top-2 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#050505] border-[2px] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.6)] group-hover:bg-[#D4AF37] group-hover:scale-125 transition-all duration-500" />
                    <div className="absolute w-8 h-[1px] bg-white/10 -z-10" />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[100px_1fr] gap-3 xl:gap-6">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1.5 flex flex-col items-start gap-4">
                      <div className="flex items-center gap-2 text-[#D4AF37]">
                        <Clock size={12} className="opacity-70" /> {activity.time}
                      </div>
                      <button
                        onClick={() => onRegenerate(activeDayIdx, aIdx, day, activity)}
                        disabled={isRegenerating === `${activeDayIdx}-${aIdx}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white/5 hover:bg-[#D4AF37]/10 text-slate-400 hover:text-[#D4AF37] border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw size={10} className={isRegenerating === `${activeDayIdx}-${aIdx}` ? "animate-spin text-[#D4AF37]" : ""} />
                        <span>Regenerate</span>
                      </button>
                    </div>
                    <div className="space-y-4 bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors">
                      <div className="space-y-2">
                        <h4 className="text-xl font-medium text-white/90 group-hover:text-[#F3E5AB] transition-colors leading-tight inline-block">
                          <a href={`https://www.google.com/maps/search/?api=1&query=${activity.lat},${activity.lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline decoration-[#D4AF37]/50 underline-offset-4 w-full">
                            {activity.location}
                            <MapPin size={12} className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed font-light max-w-2xl text-balance">
                          {activity.description}
                        </p>
                      </div>
                      
                      {(activity.cost_estimate || activity.transport_details || activity.nearest_station) && (
                        <div className="flex flex-wrap items-center gap-3 pt-4 mt-2 border-t border-white/5">
                          {activity.cost_estimate && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-[10px] font-medium border border-green-500/20">
                              <IndianRupee size={10} /> {activity.cost_estimate}
                            </div>
                          )}
                          {activity.transport_details && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-medium border border-blue-500/20 max-w-full truncate">
                              <Navigation size={10} className="shrink-0" /> {activity.transport_details}
                            </div>
                          )}
                          {activity.nearest_station && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-medium border border-[#D4AF37]/20">
                              <Train size={10} className="shrink-0" /> {activity.nearest_station}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
};
