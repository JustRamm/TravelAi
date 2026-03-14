"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Itinerary } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom gold icon with order number
const createNumberedIcon = (number: number) => L.divIcon({
  className: "custom-div-icon",
  html: `
    <div style="
      background-color: #D4AF37; 
      width: 24px; 
      height: 24px; 
      border-radius: 50%; 
      border: 2px solid white; 
      box-shadow: 0 0 10px rgba(212,175,55,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: black;
      font-weight: bold;
      font-size: 10px;
      font-family: sans-serif;
    ">
      ${number}
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface ItineraryMapProps {
  itinerary: Itinerary;
  activeDayIdx?: number;
}

export default function ItineraryMap({ itinerary, activeDayIdx }: ItineraryMapProps) {
  // If activeDayIdx is provided, only show that day's activities. Otherwise show all.
  const activeActivities = activeDayIdx !== undefined 
    ? itinerary.days[activeDayIdx]?.activities || []
    : itinerary.days.flatMap(day => day.activities);
  
  // Calculate average coordinates to center the map
  const totalPoints = activeActivities.length || 1;
  const avgLat = activeActivities.reduce((acc, act) => acc + act.lat, 0) / totalPoints;
  const avgLng = activeActivities.reduce((acc, act) => acc + act.lng, 0) / totalPoints;

  const polylinePoints: [number, number][] = activeActivities.map(act => [act.lat, act.lng]);


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[500px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative z-0 mt-12 mb-24"
    >
      <MapContainer 
        center={[avgLat, avgLng]} 
        zoom={12} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater center={[avgLat, avgLng]} zoom={12} />
        
        {activeActivities.map((activity, idx) => (
          <Marker 
            key={idx} 
            position={[activity.lat, activity.lng]} 
            icon={createNumberedIcon(idx + 1)}
          >
            <Popup className="premium-popup">
              <div className="bg-[#0f0f0f] text-white p-2 rounded-lg border border-[#D4AF37]/20">
                <h4 className="font-serif text-[#D4AF37] text-sm mb-1">{activity.location}</h4>
                <p className="text-[10px] text-slate-400 font-light">{activity.time}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <Polyline 
          positions={polylinePoints} 
          pathOptions={{ color: '#D4AF37', weight: 1, dashArray: '5, 10', opacity: 0.5 }} 
        />
      </MapContainer>
      
      {/* Decorative overlay */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-[#050505] rounded-[2rem]"></div>
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505]/80 to-transparent pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505]/80 to-transparent pointer-events-none"></div>
    </motion.div>
  );
}
