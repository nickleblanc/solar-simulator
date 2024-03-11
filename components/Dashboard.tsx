"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocationStore } from "@/stores/data";
import { useQuery } from "@tanstack/react-query";
import { Graph } from "@/components/Graph";

export function Dashboard() {
  const locations = useLocationStore((state) => state.locations);
  const selectedLocations = locations.filter((location) => location.selected);

  const fetchData = async () => {
    const response = await fetch("http://localhost:5001/hist");
    return response.json();
  };

  const data = useQuery({ queryKey: ["data"], queryFn: fetchData });

  if (data.isLoading) {
    return <div>Loading...</div>;
  }

  if (data.isError) {
    return <div>Error: {data.error.message}</div>;
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
