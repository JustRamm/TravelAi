/**
 * Global Geographical Registry
 * Processes industrial-grade JSON data into a lightweight registry for localized travel planning.
 */

import countriesJson from "../data/countries.json";

export interface CountrySchema {
  name: string;
  states: string[];
}

/**
 * Optimized Registry Mapping
 * Stores countries as keys with an array of their regions/states as values.
 */
export const COUNTRY_DATA: Record<string, string[]> = countriesJson.reduce((acc: Record<string, string[]>, country: any) => {
  const stateNames = country.states.map((s: any) => s.name);
  
  // Logical Fallback: If no sub-regions defined, provide a global anchor
  acc[country.name] = stateNames.length > 0 ? stateNames : ["Whole Country"];
  return acc;
}, {});

/**
 * Industrial-sort of available countries for high-speed lookup components.
 */
export const ALL_COUNTRIES = Object.keys(COUNTRY_DATA).sort((a, b) => a.localeCompare(b));

/**
 * Utility to retrieve regions for a specific country with safe fallbacks.
 */
export const getRegionsByCountry = (country: string): string[] => {
  return COUNTRY_DATA[country] || ["Unknown Region"];
};
