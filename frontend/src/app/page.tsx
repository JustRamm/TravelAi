"use client";

import { motion } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";
import { useTravelArchitect } from "@/hooks/useTravelArchitect";
import { ArchitectForm } from "@/components/forms/ArchitectForm";
import { SidebarInfo } from "@/components/itinerary/SidebarInfo";
import { DayTimeline } from "@/components/itinerary/DayTimeline";
import { Logo } from "@/components/ui/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe } from "@/components/ui/globe";

/**
 * Main Application Entrance
 * Architects bespoke travel journeys using high-fidelity LLM engines.
 * 
 * Modular implementation to ensure long-term maintainability 
 * and clear separation of concerns.
 */
export default function Home() {
  const {
    viewState,
    selections,
    updateSelection,
    activeDayIdx,
    setActiveDayIdx,
    itinerary,
    error,
    isRegenerating,
    handleStartSearch,
    resetArchitect,
    regenerateActivity
  } = useTravelArchitect();

  // Animation Variants for orchestrated entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  const downloadAsPDF = async () => {
    if (!itinerary) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; background: #fff;">
        <h1 style="border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">The ${itinerary.destination} Collection</h1>
        <p style="font-style: italic;">${itinerary.summary}</p>
        ${itinerary.days.map(day => `
          <h3>Day ${day.day_number}: ${day.theme}</h3>
          ${day.activities.map(act => `
            <p><strong>${act.time} - ${act.location}</strong><br/>${act.description}</p>
          `).join('')}
        `).join('')}
      </div>
    `;
    html2pdf().from(htmlContent).save(`${itinerary.destination}_itinerary.pdf`);
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#050505] text-slate-300 selection:bg-[#D4AF37]/30 relative flex flex-col">
      
      {/* Dynamic Background Architecture */}
      <BackgroundEngine viewState={viewState} />

      {/* Primary Search Interface */}
      <motion.div 
        animate={{ y: viewState === 'result' ? '-100vh' : '0vh', opacity: viewState === 'result' ? 0 : 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute inset-0 z-10 w-full h-full flex flex-col justify-center items-center px-4 ${viewState === 'result' ? 'pointer-events-none' : ''}`}
      >
        <div className="max-w-[1500px] w-full mx-auto">
          {error && <ErrorOverlay message={error} />}

          <header className="text-center mb-16 px-4 flex flex-col items-center">
            <Logo className="w-20 h-20 mb-8" />
            <div className="overflow-hidden mb-6">
              <motion.h1 
                initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.8 }}
                className="text-5xl lg:text-7xl font-serif italic font-light tracking-tight text-white leading-[1.1]"
              >
                Travel <span className="font-sans not-italic font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#F3E5AB] to-[#D4AF37]">Architect</span>
              </motion.h1>
            </div>
            <p className="text-slate-500 text-sm lg:text-base max-w-lg mx-auto font-light leading-relaxed tracking-wide">
              Engineering bespoke high-end travel experiences through the lens of computational artistry.
            </p>
          </header>

          <ArchitectForm 
            selections={selections}
            isLoading={viewState === 'loading'}
            onUpdate={updateSelection}
            onSubmit={(e) => { e.preventDefault(); handleStartSearch(); }}
          />
        </div>
      </motion.div>

      {/* Specialized Result Dashboard */}
      <motion.div 
        animate={{ y: viewState === 'result' ? '0vh' : '100vh', opacity: viewState === 'result' ? 1 : 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute inset-0 z-20 w-full h-full flex flex-col ${viewState !== 'result' ? 'pointer-events-none' : ''}`}
      >
        {/* Navigation Header */}
        <div className="w-full flex justify-between items-center px-8 py-6 bg-gradient-to-b from-[#050505] to-transparent z-50 shrink-0">
          <button onClick={resetArchitect} className="flex items-center gap-3 group">
            <Logo className="w-8 h-8" />
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] group-hover:text-[#D4AF37] transition-colors">Architect</span>
          </button>
          <button 
            onClick={resetArchitect}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <ArrowUpCircle size={14} className="text-[#D4AF37] group-hover:-translate-y-1 transition-transform" /> 
            Try Another Destination
          </button>
        </div>

        {/* Dynamic Content Grid */}
        <div className="flex-1 overflow-y-auto scrollbar-hide w-full px-4 lg:px-8 pb-32">
          {itinerary && (
            <motion.div key="itinerary-grid" variants={containerVariants} initial="hidden" animate="visible" className="max-w-[1700px] mx-auto pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start relative">
                
                <SidebarInfo 
                  itinerary={itinerary} 
                  activeDayIdx={activeDayIdx}
                  onDownload={downloadAsPDF}
                  variants={itemVariants} 
                />

                <DayTimeline 
                  itinerary={itinerary}
                  activeDayIdx={activeDayIdx}
                  setActiveDayIdx={setActiveDayIdx}
                  isRegenerating={isRegenerating}
                  onRegenerate={regenerateActivity}
                />

              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  );
}

/**
 * Support Components (Internal to Page for scoping)
 */
const BackgroundEngine = ({ viewState }: { viewState: string }) => (
  <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
    <motion.div 
      animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
      className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] blur-[140px] rounded-full" 
    />
    <motion.div 
      animate={{
        y: viewState === 'loading' ? "-60vh" : viewState === 'result' ? "-120vh" : "0vh"
      }}
      transition={{ type: "tween", duration: 2, ease: "easeInOut" }}
      className="absolute top-[65vh] left-1/2 -translate-x-1/2 w-full max-w-[1600px] aspect-square opacity-20 pointer-events-none"
    >
      <Globe className="scale-[2.5]" />
    </motion.div>
  </div>
);

const ErrorOverlay = ({ message }: { message: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center backdrop-blur-md mb-8 max-w-xl mx-auto"
  >
    {message}
  </motion.div>
);
