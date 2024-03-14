"use client";

import { InputForm } from "@/components/input-form";
import { useLocationStore } from "@/stores/data";
import { SwitchSlider } from "@/components/Switch";
import { Button } from "@/components/ui/button";
import { PanelForm } from "@/components/panel-input-form";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      <div>
        <h2 className="font-bold mt-6">Panel Parameters</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Change Panel Parameters</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Change Solar Panel Parameters</DialogTitle>
              {/* <DialogDescription>
              </DialogDescription> */}
            </DialogHeader>
            <PanelForm />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
