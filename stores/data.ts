"use client";
import { create } from "zustand";

interface AreaStore {
  area: number;
  setArea: (area: number) => void;
}

interface LocationStore {
  locations: string[];
  setLocations: (locations: string[]) => void;
}

export const useAreaStore = create<AreaStore>((set) => ({
  area: 0,
  setArea: (area: number) => set({ area }),
}));

export const useLocationStore = create<LocationStore>((set) => ({
  locations: [],
  setLocations: (locations: string[]) => set({ locations }),
}));
