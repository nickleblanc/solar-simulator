"use client";

import { useLocationStore } from "@/stores/locations";
import { useParameterStore } from "@/stores/parameters";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { stringToDollars } from "@/lib/utils";

export function Stats() {
  const locations = useLocationStore((state) => state.locations);
  const selectedLocations = locations.filter((location) => location.selected);

  const parameters = useParameterStore((state) => state);

  const totalArea = selectedLocations.reduce(
    (acc, location) => acc + location.area,
    0
  );

  const totalNumberPanels = selectedLocations.reduce(
    (acc, location) => acc + location.numberPanels,
    0
  );

  const solarProduction = totalNumberPanels * parameters.stc;
  const costOfPanels = Math.round(2.0 * solarProduction * 100) / 100;

  return (
    <div className="flex flex-row h-1/6 space-x-2">
      <Card className="grow">
        <CardHeader>
          <CardTitle>Array Size</CardTitle>
        </CardHeader>
        <CardContent>{solarProduction / 1000} kW</CardContent>
      </Card>
      <Card className="grow">
        <CardHeader>
          <CardTitle>Number of Panels</CardTitle>
        </CardHeader>
        <CardContent>{totalNumberPanels}</CardContent>
      </Card>
      <Card className="grow">
        <CardHeader>
          <CardTitle>Total Cost</CardTitle>
        </CardHeader>
        <CardContent>{stringToDollars.format(costOfPanels)}</CardContent>
      </Card>
      <Card className="grow">
        <CardHeader>
          <CardTitle>Total Surface Area</CardTitle>
        </CardHeader>
        <CardContent>
          <span>{totalArea} m²</span>
        </CardContent>
      </Card>
    </div>
  );
}
