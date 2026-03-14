"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Menu, X, Compass, User, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Architect", href: "/" },
    { name: "Destinations", href: "#" },
    { name: "Experiences", href: "#" },
    { name: "Portfolio", href: "#" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500",
        isScrolled 
          ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4" 
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-[1500px] mx-auto px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Plane className="text-[#D4AF37] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" size={24} />
            <motion.div 
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute -top-1 -right-1 bg-[#D4AF37] w-1.5 h-1.5 rounded-full blur-[2px]"
            />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white font-serif italic">
            Travel <span className="font-sans not-italic text-[#D4AF37]">Architect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#D4AF37] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37]/10 transition-colors"
          >
            <Sparkles size={12} />
            Concierge
          </motion.button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-[#0d0d0d] border-b border-white/5 p-6 flex flex-col gap-6 md:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif text-white hover:text-[#D4AF37] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-bold text-sm uppercase tracking-widest">
              Consult Concierge
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
