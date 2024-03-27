"use client";

import { create } from "zustand";

interface FormState {
  lat: number | null;
  lng: number | null;
  setValues: (lat: number | null, lng: number | null) => void;
}

export const useFormValueStore = create<FormState>((set) => ({
  lat: null,
  lng: null,
  setValues: (lat, lng) => set((state) => ({ lat, lng })),
}));
