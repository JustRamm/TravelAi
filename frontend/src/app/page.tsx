"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, MapPin, Compass, Loader2, Sparkles, Calendar, Clock } from "lucide-react";
import { Itinerary } from "@/types";

export default function Home() {
  const [destination, setDestination] = useState("");
  const [style, setStyle] = useState("Adventure");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;

    setLoading(true);
    setItinerary(null);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, travel_style: style }),
      });

      if (!response.ok) throw new Error("Failed to generate itinerary");
      const data = await response.json();
      setItinerary(data);
    } catch (err) {
      setError("Something went wrong. Please check if the backend is running and your API key is valid.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const styles = ["Adventure", "Luxury", "Budget", "Family", "Foodie", "Relaxation", "Culture"];

  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-indigo-500/30">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 lg:py-20">
        {/* Header */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6"
          >
            <Sparkles size={14} />
            AI-Powered Travel Planning
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
          >
            AI Travel Architect
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Transform your travel dreams into a perfectly curated 3-day itinerary in seconds.
          </motion.p>
        </header>

        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl mb-12"
        >
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label htmlFor="destination" className="text-sm font-medium text-gray-400 ml-1 flex items-center gap-2">
                <MapPin size={14} /> Destination
              </label>
              <input 
                id="destination"
                type="text"
                placeholder="Where to next? (e.g. Kyoto, Paris)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="travel-style" className="text-sm font-medium text-gray-400 ml-1 flex items-center gap-2">
                <Compass size={14} /> Travel Style
              </label>
              <select 
                id="travel-style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
              >
                {styles.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
              </select>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all h-[50px] shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Architecting...
                </>
              ) : (
                <>
                  <Plane size={20} />
                  Plan My Trip
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center mb-8"
            >
              {error}
            </motion.div>
          )}

          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 grayscale opacity-50"
            >
              <Compass size={64} className="text-indigo-500 animate-[spin_3s_linear_infinite] mb-6" />
              <p className="text-gray-400 animate-pulse">Consulting travel guides and local secrets...</p>
            </motion.div>
          )}

          {itinerary && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 pb-20"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-3">Your Trip to {itinerary.destination}</h2>
                <p className="text-gray-400 italic">"{itinerary.summary}"</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {itinerary.days.map((day, idx) => (
                  <motion.div 
                    key={day.day_number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col h-full hover:border-indigo-500/30 transition-colors group"
                  >
                    <div className="p-6 border-b border-white/10 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-indigo-400 font-bold flex items-center gap-2">
                          <Calendar size={16} /> Day {day.day_number}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{day.theme}</h3>
                    </div>
                    <div className="p-6 space-y-6 flex-grow">
                      {day.activities.map((activity, aIdx) => (
                        <div key={aIdx} className="relative pl-6 border-l border-white/10 last:border-0 pb-2">
                          <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500/50 border border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
                            <Clock size={12} /> {activity.time}
                          </div>
                          <div className="font-semibold text-sm mb-1">{activity.location}</div>
                          <div className="text-gray-400 text-sm leading-relaxed">
                            {activity.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="relative z-10 border-t border-white/5 py-12 text-center text-gray-600 text-sm">
        <p>© 2026 AI Travel Architect. Crafted for Mathew Voyages.</p>
      </footer>
    </main>
  );
}
