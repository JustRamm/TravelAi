import React from 'react';
import { motion } from 'framer-motion';

export const Logo = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`relative ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
      >
        {/* Outer Orbital Path */}
        <circle 
          cx="50" cy="50" r="45" 
          stroke="url(#gold-gradient)" 
          strokeWidth="0.5" 
          strokeDasharray="4 4" 
          className="opacity-40"
        />
        
        {/* Architect's Divider Arms */}
        <path
          d="M50 15L80 85H70L50 35L30 85H20L50 15Z"
          fill="url(#gold-gradient)"
          className="opacity-90"
        />

        {/* Compass Needle - North */}
        <path
          d="M50 10L56 30L50 25L44 30L50 10Z"
          fill="#FFFFFF"
          className="opacity-100"
        />

        {/* Central Core */}
        <circle cx="50" cy="35" r="4" fill="#FFFFFF" />
        
        {/* Horizontal Leveler Line */}
        <rect x="25" y="65" width="50" height="1" fill="url(#gold-gradient)" className="opacity-50" />

        <defs>
          <linearGradient id="gold-gradient" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F3E5AB" />
            <stop offset="0.5" stopColor="#D4AF37" />
            <stop offset="1" stopColor="#AA841D" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};
