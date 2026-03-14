import { useState } from "react";
import { Itinerary } from "@/types";

export type ViewState = 'search' | 'loading' | 'result';

export const useTravelArchitect = () => {
  const [viewState, setViewState] = useState<ViewState>('search');
  
  // Navigation & User Preferences
  const [selections, setSelections] = useState({
    country: "",
    state: "",
    style: "",
    pax: 1
  });

  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [context, setContext] = useState({ country: "", state: "", pax: 1 });
  
  const [error, setError] = useState("");
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);

  const updateSelection = (field: keyof typeof selections, value: any) => {
    setSelections(prev => ({ ...prev, [field]: value }));
  };

  const handleStartSearch = async () => {
    if (!selections.country.trim() || !selections.state.trim()) return;

    setViewState('loading');
    setItinerary(null);
    setActiveDayIdx(0);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: selections.country,
          state: selections.state,
          travel_style: selections.style,
          num_people: selections.pax
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const rawDetail = errorData.detail;
        const message = typeof rawDetail === 'string' 
          ? rawDetail 
          : Array.isArray(rawDetail)
            ? rawDetail.map(d => {
                const loc = d.loc ? `(${d.loc[d.loc.length - 1]}) ` : "";
                return `${loc}${d.msg || JSON.stringify(d)}`;
              }).join(", ")
            : JSON.stringify(rawDetail) || "Architectural engine failed to initialize.";
        
        throw new Error(message);
      }

      const data = await response.json();
      setItinerary(data);
      setContext({ 
        country: selections.country, 
        state: selections.state, 
        pax: selections.pax 
      });
      
      // Intentional delay for aesthetic transition
      setTimeout(() => setViewState('result'), 600); 

    } catch (err: any) {
      setError(err.message || "Failed to establish bridge to the engine.");
      setViewState('search');
    }
  };

  const resetArchitect = () => {
    setViewState('search');
    setTimeout(() => {
      setItinerary(null);
      setSelections({ country: "", state: "", style: "", pax: 1 });
    }, 1000);
  };

  const regenerateActivity = async (dayIdx: number, actIdx: number, dayContext: any, oldAct: any) => {
    if (!itinerary) return;
    const key = `${dayIdx}-${actIdx}`;
    setIsRegenerating(key);

    try {
      const resp = await fetch("http://localhost:8000/api/regenerate_activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: context.country,
          state: context.state,
          travel_style: itinerary.travel_style,
          day_theme: dayContext.theme,
          time: oldAct.time,
          old_activity: oldAct.location
        }),
      });

      if (!resp.ok) throw new Error("Component regeneration failed.");

      const newActivity = await resp.json();
      const updated = { ...itinerary };
      updated.days[dayIdx].activities[actIdx] = newActivity;
      setItinerary(updated);
    } catch (err) {
      console.error("[Architect Error] Regeneration fault:", err);
    } finally {
      setIsRegenerating(null);
    }
  };

  return {
    viewState,
    setViewState,
    selections,
    updateSelection,
    activeDayIdx,
    setActiveDayIdx,
    itinerary,
    context,
    error,
    isRegenerating,
    handleStartSearch,
    resetArchitect,
    regenerateActivity
  };
};
