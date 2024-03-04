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
    area: number
  ) => void;
  setSelected: (id: string) => void;
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
    area: number
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
          selected: true,
          onCheckedChange: onCheckedChange,
        },
      ],
    })),
  setSelected: (id: string) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === id
          ? { ...location, selected: !location.selected }
          : location
      ),
    })),
}));
