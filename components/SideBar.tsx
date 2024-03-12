"use client";

import { InputForm } from "@/components/input-form";
import { useLocationStore } from "@/stores/data";
import { SwitchSlider } from "./Switch";
import { Button } from "@/components/ui/button";

export function SideBar() {
  const locations = useLocationStore((state) => state.locations);

  return (
    <div>
      <InputForm />
      <div>
        <h2 className="font-bold mt-6">Locations</h2>
        {locations.map((location) => {
          return (
            <div key={location.id} className="pb-1">
              <div className="text-base items-center justify-between flex">
                <span>{location.name}</span>
                <SwitchSlider id={location.id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
