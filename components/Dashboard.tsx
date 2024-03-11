"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocationStore } from "@/stores/data";
import { Graph } from "@/components/Graph";

export function Dashboard() {
  const locations = useLocationStore((state) => state.locations);
  const selectedLocations = locations.filter((location) => location.selected);

  const totalArea = selectedLocations.reduce(
    (acc, location) => acc + location.area,
    0
  );

  return (
    <div className="flex flex-col justify-between mt-2 mr-2">
      <div className="flex flex-row">
        <Card className="grow">
          <CardHeader>
            <CardTitle>Total Production</CardTitle>
          </CardHeader>
          <CardContent>{}</CardContent>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle>Total Cost</CardTitle>
          </CardHeader>
          <CardContent>{}</CardContent>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle>Total Surface Area</CardTitle>
          </CardHeader>
          <CardContent>
            <span>{totalArea} m²</span>
          </CardContent>
        </Card>
        {locations.map((location) => (
          <Card key={location.id} className="grow">
            <CardHeader>
              <CardTitle>{location.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <span>
                {location.selected == true ? "Selected" : "Not Selected"}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      <Graph />
    </div>
  );
}
