"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
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
        <Link href="/" className="flex items-center gap-3 group">
          <Logo className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-xl font-bold tracking-tighter text-white font-serif italic">
            Travel <span className="font-sans not-italic text-[#D4AF37]">Architect</span>
          </span>
        </Link>

        {/* Navigation Elements Removed per instruction */}
      </div>
    </header>
  );
}
