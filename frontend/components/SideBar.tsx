"use client";

import { InputForm } from "@/components/input-form";
import { useLocationStore } from "@/stores/locations";
import { SwitchSlider } from "@/components/Switch";
import { DeleteButton } from "@/components/delete-button";
import { Button } from "@/components/ui/button";
import { PanelSelector } from "@/components/panel-selector";
import { PanelForm } from "@/components/panel-input-form";
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
    <div className="flex flex-col h-full">
      <InputForm />
      <PanelSelector />
      <div>
        <h2 className="font-bold mt-6">Locations</h2>
        {locations.map((location) => {
          return (
            <div key={location.id} className="pb-1">
              <div className="text-base items-center justify-between flex">
                <span>{location.name}</span>
                <div className="flex justify-center flex-row items-center space-x-1">
                  <SwitchSlider id={location.id} />
                  <DeleteButton id={location.id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-full flex flex-col justify-end pb-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Change Panel Parameters</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[750px]">
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
