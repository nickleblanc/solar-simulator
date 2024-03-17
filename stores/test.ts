"use client";

import { create } from "zustand";

interface TestState {
  lat: number | null;
  lng: number | null;
}

interface Actions {
  setParameters: (lat: number, lng: number) => void;
}

export const useTestStore = create<TestState & Actions>((set) => ({
  lat: null,
  lng: null,
  setParameters: (lat, lng) => set((state) => ({ lat, lng })),
}));
