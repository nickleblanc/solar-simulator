"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocationStore } from "@/stores/data";
import { useQuery } from "@tanstack/react-query";
import { Graph } from "@/components/Graph";
import { calculateNumberOfPanels } from "@/lib/panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

export function Dashboard() {
  const defaultSelected: DateRange = {
    from: new Date(2024, 1, 1),
    to: new Date(2024, 1, 7),
  };

  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
  const locations = useLocationStore((state) => state.locations);
  const selectedLocations = locations.filter((location) => location.selected);

  const totalArea = selectedLocations.reduce(
    (acc, location) => acc + location.area,
    0
  );

  const { numPanels, solarProduction, costOfPanels, payback } =
    calculateNumberOfPanels(totalArea);

  const fetchData = async () => {
    const response = await fetch(
      `http://localhost:5001/hist?panels=${numPanels}`
    );
    return response.json();
  };

  const data = useQuery({
    queryKey: ["data"],
    queryFn: fetchData,
    // refetchInterval: 5000,
  });

  if (data.isLoading) {
    return <div>Loading...</div>;
  }

  if (data.isError) {
    return <div>Error: {data.error.message}</div>;
  }

  return (
    <div className="flex flex-col justify-between mt-2 mr-2">
      <div className="flex flex-row">
        <Card className="grow">
          <CardHeader>
            <CardTitle>Total Production</CardTitle>
          </CardHeader>
          <CardContent>{solarProduction} kW</CardContent>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle>Total Cost</CardTitle>
          </CardHeader>
          <CardContent>${costOfPanels}</CardContent>
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
      <Tabs defaultValue="history" className="w-full m-2 mt-4">
        <TabsList>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="flex m-4">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={{ after: new Date() }}
          />
          <div className="flex w-full justify-center">
            <Graph data={data.data} />
          </div>
        </TabsContent>
        <TabsContent value="forecast">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
