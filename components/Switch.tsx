"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useLocationStore } from "@/stores/data";

interface SwitchSliderProps {
  id: string;
}

export function SwitchSlider({ id }: SwitchSliderProps) {
  const setSelected = useLocationStore((state) => state.setSelected);

  const [isChecked, setChecked] = useState(true);
  console.log(isChecked);

  useEffect(() => {
    setSelected(id, isChecked);
    // console.log(locations);
  }, [setSelected, isChecked, id]);

  return (
    <>
      <Switch checked={isChecked} onCheckedChange={setChecked} />
    </>
  );
}
