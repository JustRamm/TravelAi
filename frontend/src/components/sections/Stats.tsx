"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Destinations Cataloged", value: "14,000+" },
  { label: "Private Estates", value: "850" },
  { label: "Neural Pathways", value: "2.4B" },
  { label: "Elite Journeys", value: "9,200" },
];

export function Stats() {
  return (
    <section className="py-24 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-[1500px] mx-auto px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center space-y-2"
            >
              <div className="text-3xl md:text-4xl font-serif text-[#D4AF37]">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
