"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar({ action }: { action?: React.ReactNode }) {
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
        "fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-in-out",
        isScrolled 
          ? "bg-[#050505]/40 backdrop-blur-[30px] border-b border-white/5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)]" 
          : "bg-transparent py-7"
      )}
    >
      {/* Portaling Gradient Effect */}
      <div className={cn(
        "absolute inset-0 -z-10 transition-opacity duration-700",
        isScrolled ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 to-[#050505]/0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" />
        {/* Softened blur extension */}
        <div className="absolute top-full left-0 w-full h-[60px] bg-gradient-to-b from-[#050505]/40 to-transparent backdrop-blur-[15px] pointer-events-none border-t border-white/5" />
      </div>
      <div className="max-w-[1500px] mx-auto px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Logo className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-xl font-bold tracking-tighter text-white font-serif italic">
            Travel <span className="font-sans not-italic text-[#D4AF37]">Architect</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          {action && <div>{action}</div>}
        </div>
      </div>
    </header>
  );
}
