"use client";

import { motion } from "framer-motion";
import { Plane, Compass, MapPin, Instagram, Twitter, Facebook } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-24 pb-12">
      <div className="max-w-[1500px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <Plane className="text-[#D4AF37]" size={24} />
            <span className="text-xl font-bold tracking-tighter text-white font-serif italic">
              Travel <span className="font-sans not-italic text-[#D4AF37]">Architect</span>
            </span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed font-light pr-4">
            Curating the world's most exclusive journeys through elite artificial intelligence and human inspiration.
          </p>
        </div>

        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-8">Studio</h4>
          <ul className="space-y-4">
            <li><Link href="#" className="text-slate-500 text-sm hover:text-[#D4AF37] transition-colors font-light">The Architecture</Link></li>
            <li><Link href="#" className="text-slate-500 text-sm hover:text-[#D4AF37] transition-colors font-light">Elite Concierge</Link></li>
            <li><Link href="#" className="text-slate-500 text-sm hover:text-[#D4AF37] transition-colors font-light">Global Portfolio</Link></li>
            <li><Link href="#" className="text-slate-500 text-sm hover:text-[#D4AF37] transition-colors font-light">Legal & Privacy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-8">Regions</h4>
          <ul className="space-y-4">
            <li><Link href="#" className="text-slate-500 text-sm hover:text-[#D4AF37] transition-colors font-light">Trans-Siberian</Link></li>
            <li><Link href="#" className="text-slate-500 text-sm hover:text-[#D4AF37] transition-colors font-light">Amalfi Coast</Link></li>
            <li><Link href="#" className="text-slate-500 text-sm hover:text-[#D4AF37] transition-colors font-light">Kyoto Zen</Link></li>
            <li><Link href="#" className="text-slate-500 text-sm hover:text-[#D4AF37] transition-colors font-light">Patagonian Wilds</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-8">Dispatch</h4>
          <div className="flex gap-4 mb-8">
            <motion.a whileHover={{ y: -3, color: "#D4AF37" }} href="#" className="text-slate-600 transition-colors"><Instagram size={20} /></motion.a>
            <motion.a whileHover={{ y: -3, color: "#D4AF37" }} href="#" className="text-slate-600 transition-colors"><Twitter size={20} /></motion.a>
            <motion.a whileHover={{ y: -3, color: "#D4AF37" }} href="#" className="text-slate-600 transition-colors"><Facebook size={20} /></motion.a>
          </div>
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest leading-relaxed">
            Headquarters: London • Dubai • Singapore
          </p>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-8 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-slate-700 text-[10px] font-bold uppercase tracking-[0.4em] text-center md:text-left">
          © 2026 Travel Architect Studio — Luxury Artificial Intelligence
        </p>
        <div className="flex gap-8">
          <Compass size={20} className="text-slate-800" />
          <Plane size={20} className="text-slate-800" />
          <MapPin size={20} className="text-slate-800" />
        </div>
      </div>
    </footer>
  );
}
