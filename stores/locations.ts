"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  area: number;
  selected: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

interface LocationState {
  locations: Location[];
  addLocation: (
    name: string,
    latitude: number,
    longitude: number,
    area: number,
    selected: boolean
  ) => void;
  deleteLocation: (id: string) => void;
  setSelected: (id: string, selected: boolean) => void;
}

const onCheckedChange = (checked: boolean) => {
  console.log();
  console.log(checked);
};

export const useLocationStore = create<LocationState>((set) => ({
  locations: [],
  addLocation: (
    name: string,
    latitude: number,
    longitude: number,
    area: number,
    selected: boolean
  ) =>
    set((state) => ({
      locations: [
        ...state.locations,
        {
          id: uuidv4(),
          name,
          latitude,
          longitude,
          area,
          selected,
          onCheckedChange: onCheckedChange,
        },
      ],
    })),
  deleteLocation: (id: string) =>
    set((state) => ({
      locations: state.locations.filter((location) => location.id !== id),
    })),
  setSelected: (id: string, selected: boolean) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === id ? { ...location, selected: selected } : location
      ),
    })),
}));
