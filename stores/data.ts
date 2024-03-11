"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

interface Location {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  area: number;
  selected: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

interface LocationState {
  locations: Location[];
  addLocation: (
    name: string,
    latitude: string,
    longitude: string,
    area: number,
    selected: boolean
  ) => void;
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
    latitude: string,
    longitude: string,
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
  setSelected: (id: string, selected: boolean) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === id ? { ...location, selected: selected } : location
      ),
    })),
}));
