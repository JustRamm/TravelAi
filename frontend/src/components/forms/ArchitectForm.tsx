import { motion } from "framer-motion";
import { MapPin, Compass, Users, Plane, Loader2 } from "lucide-react";
import { ALL_COUNTRIES, COUNTRY_DATA } from "@/lib/countryData";

interface ArchitectFormProps {
  selections: {
    country: string;
    state: string;
    style: string;
    pax: number;
  };
  isLoading: boolean;
  onUpdate: (field: any, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const STYLES = ["Adventure", "Luxury", "Budget", "Family", "Foodie", "Relaxation", "Culture"];

export const ArchitectForm = ({ selections, isLoading, onUpdate, onSubmit }: ArchitectFormProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
      className="max-w-4xl mx-auto relative group/form w-full"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37]/5 to-transparent blur-3xl opacity-0 group-hover/form:opacity-100 transition-opacity duration-1000" />
      <div className="relative bg-[#0a0a0a]/40 backdrop-blur-3xl border border-white/10 p-1.5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="p-8 md:p-10 border border-white/5 rounded-[2.2rem] bg-gradient-to-br from-white/[0.03] to-transparent">
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_200px_100px_auto] gap-6 items-end">
            
            {/* Country Selector */}
            <div className="space-y-4">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                 Country
              </label>
              <div className="relative group/select">
                <select 
                  value={selections.country} 
                  title="Select Destination Country"
                  onChange={(e) => {
                    const country = e.target.value;
                    onUpdate('country', country);
                    const regions = COUNTRY_DATA[country] || [];
                    onUpdate('state', regions.length > 0 ? regions[0] : "Whole Country");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#D4AF37]/30 focus:bg-white/[0.07] transition-all appearance-none outline-none cursor-pointer text-sm font-light relative"
                  required
                >
                  <option value="" disabled className="bg-[#0f0f0f] text-slate-500">Select Country</option>
                  {ALL_COUNTRIES.map(c => <option key={c} value={c} className="bg-[#0f0f0f] text-slate-300">{c}</option>)}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <MapPin size={14} className="group-hover/select:translate-y-[-2px] transition-transform duration-500" />
                </div>
              </div>
            </div>

            {/* State Selector */}
            <div className="space-y-4">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                 Region
              </label>
              <div className="relative group/select">
                <select 
                  value={selections.state} 
                  title="Select Region or State"
                  onChange={(e) => onUpdate('state', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#D4AF37]/30 focus:bg-white/[0.07] transition-all appearance-none outline-none cursor-pointer text-sm font-light relative"
                  required
                >
                  <option value="" disabled className="bg-[#0f0f0f] text-slate-500">Select Region</option>
                  {(COUNTRY_DATA[selections.country] || []).map(s => (
                    <option key={s} value={s} className="bg-[#0f0f0f] text-slate-300">{s}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <Compass size={14} className="group-hover/select:rotate-45 transition-transform duration-500" />
                </div>
              </div>
            </div>

            {/* Style Selector */}
            <div className="space-y-4">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                Style
              </label>
              <div className="relative group/select">
                <select 
                  value={selections.style} 
                  title="Select Travel Style"
                  onChange={(e) => onUpdate('style', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#D4AF37]/30 focus:bg-white/[0.07] transition-all appearance-none outline-none cursor-pointer text-sm font-light relative"
                >
                  <option value="" disabled className="bg-[#0f0f0f] text-slate-500">Select Style</option>
                  {STYLES.map(s => <option key={s} value={s} className="bg-[#0f0f0f] text-slate-300">{s}</option>)}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <Compass size={14} className="group-hover/select:rotate-45 transition-transform duration-500" />
                </div>
              </div>
            </div>

            {/* Travelers */}
            <div className="space-y-4">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                <Users size={10} className="text-[#D4AF37]" /> Pax
              </label>
              <input 
                type="number" min="1" max="20"
                title="Number of Travelers"
                value={selections.pax} onChange={(e) => onUpdate('pax', parseInt(e.target.value) || 1)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#D4AF37]/30 focus:bg-white/[0.07] transition-all outline-none text-sm font-light text-center appearance-none relative"
              />
            </div>

            {/* Submit */}
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={isLoading}
              className="relative overflow-hidden w-full md:w-auto bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-bold py-5 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all h-[62px] shadow-[0_10px_30px_rgba(212,175,55,0.3)] group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Plane size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  <span className="text-sm tracking-tight">Curate</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
