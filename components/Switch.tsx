"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useLocationStore } from "@/stores/locations";

interface SwitchSliderProps {
  id: string;
}

export function SwitchSlider({ id }: SwitchSliderProps) {
  const setSelected = useLocationStore((state) => state.setSelected);

  const [isChecked, setChecked] = useState(true);

  useEffect(() => {
    setSelected(id, isChecked);
  }, [setSelected, isChecked, id]);

  return (
    <>
      <Switch checked={isChecked} onCheckedChange={setChecked} />
    </>
  );
}
