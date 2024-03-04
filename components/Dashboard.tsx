"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocationStore } from "@/stores/data";
import { TestPython } from "@/lib/test";

export function Dashboard() {
  const locations = useLocationStore((state) => state.locations);
  const selectedLocations = locations.filter((location) => location.selected);

  const hasWindow = typeof window !== "undefined";

  if (hasWindow) {
    TestPython();
  }

  const totalArea = selectedLocations.reduce(
    (acc, location) => acc + location.area,
    0
  );

  return (
    <div className="flex justify-between mt-2 mr-2">
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
    </div>
  );
}
