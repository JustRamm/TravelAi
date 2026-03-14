import { motion } from "framer-motion";
import { Download, Plane, BedDouble, DollarSign } from "lucide-react";
import dynamic from "next/dynamic";
import { Itinerary } from "@/types";

const ItineraryMap = dynamic(() => import("@/components/sections/ItineraryMap"), { ssr: false });

interface SidebarInfoProps {
  itinerary: Itinerary;
  activeDayIdx: number;
  onDownload: () => void;
  variants: any;
}

export const SidebarInfo = ({ itinerary, activeDayIdx, onDownload, variants }: SidebarInfoProps) => {
  return (
    <div className="lg:sticky lg:top-8 w-full space-y-10 z-30">
      <motion.div variants={variants} className="text-left space-y-6">
        <div className="flex justify-start">
          <button 
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black hover:scale-105 text-xs font-bold uppercase tracking-[0.1em] transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
        
        <h2 className="text-3xl lg:text-5xl xl:text-6xl font-serif text-white tracking-tight leading-tight">
          The {itinerary.destination} Collection
        </h2>

        {/* Map Component */}
        <div className="w-full pt-4">
          <ItineraryMap itinerary={itinerary} activeDayIdx={activeDayIdx} />
        </div>

        {/* Logistics Section */}
        <div className="grid grid-cols-1 gap-4 pt-4">
          {itinerary.transport && (
            <LogisticsCard 
              icon={<Plane size={18} />}
              title="Arrival Transport"
              description={`${itinerary.transport.mode} - ${itinerary.transport.details}`}
              cost={itinerary.transport.cost}
            />
          )}
          {itinerary.accommodation && (
            <LogisticsCard 
              icon={<BedDouble size={18} />}
              title={itinerary.accommodation.name}
              description={itinerary.accommodation.description}
              cost={`${itinerary.accommodation.cost_per_night}/n`}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

const LogisticsCard = ({ icon, title, description, cost }: { icon: React.ReactNode, title: string, description: string, cost: string }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#D4AF37]/30 transition-colors">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-1.5 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">{icon}</div>
      <h3 className="text-white font-medium">{title}</h3>
    </div>
    <div className="flex justify-between items-end">
      <p className="text-white/70 text-sm line-clamp-1">{description}</p>
      <p className="text-[#D4AF37] font-medium text-sm flex items-center gap-1"><DollarSign size={14} />{cost}</p>
    </div>
  </div>
);
