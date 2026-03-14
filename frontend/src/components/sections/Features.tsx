"use client";

import { motion } from "framer-motion";
import { Sparkles, Shield, Zap, Globe, Compass, Anchor } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="text-[#D4AF37]" size={24} />,
    title: "AI precision",
    description: "Our neural networks process millions of data points to calculate the perfect synchronization of timing, location, and atmosphere."
  },
  {
    icon: <Globe className="text-[#D4AF37]" size={24} />,
    title: "Global Reach",
    description: "Exclusive access to private estates, hidden retreats, and uncharted territories across all seven continents."
  },
  {
    icon: <Shield className="text-[#D4AF37]" size={24} />,
    title: "White-Glove Support",
    description: "24/7 hyper-personalized concierge service that anticipate your needs before you even realize them."
  },
  {
    icon: <Compass className="text-[#D4AF37]" size={24} />,
    title: "Authentic Discovery",
    description: "Bypassing the tourist traps to connect you with the soul of a destination through local masters."
  },
  {
    icon: <Zap className="text-[#D4AF37]" size={24} />,
    title: "Infinite Iteration",
    description: "Instantly regenerate and refine your itinerary until every single detail vibrates with your intent."
  },
  {
    icon: <Anchor className="text-[#D4AF37]" size={24} />,
    title: "Steady Hands",
    description: "A seamless orchestration of logistics, leaving you free to exist entirely in the moment."
  }
];

export function Features() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-8">
        <div className="text-center mb-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white tracking-tight"
          >
            Engineered for <span className="italic">Excellence</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-slate-500 max-w-2xl mx-auto font-light leading-relaxed"
          >
            We've combined advanced computational intelligence with deep artistic intuition to redefine the architecture of travel.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all duration-500 group"
            >
              <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 w-fit group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/30 transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-serif text-white mb-4 group-hover:text-[#D4AF37] transition-colors">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
