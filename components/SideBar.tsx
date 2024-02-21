"use client";
import { InputForm } from "@/components/input-form";
import { useLocationStore } from "@/stores/data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SideBar() {
  const locations = useLocationStore((state) => state.locations);
  return (
    <div>
      <InputForm />
      <div>
        {locations.map((location) => (
          <div key={location} className="pt-2 flex items-center justify-center">
            <Label key={location}>{location}</Label>
            <Switch id={location} />
          </div>
        ))}
      </div>
    </div>
  );
}
