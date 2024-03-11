"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocationStore } from "@/stores/data";
import { TestPython } from "@/lib/test";
import { Graph } from "@/components/Graph";

export function Dashboard() {
  const [output, setOutput] = useState("No output" as string);
  const locations = useLocationStore((state) => state.locations);
  const selectedLocations = locations.filter((location) => location.selected);

  const hasWindow = typeof window !== "undefined";

  const totalArea = selectedLocations.reduce(
    (acc, location) => acc + location.area,
    0
  );

  let out = "No output";

  // if (hasWindow) {
  //   TestPython(totalArea).then((res) => {
  //     out = res;
  //   });
  // }

  if (hasWindow) {
    const output = async () => {
      const res = await TestPython(totalArea);
      setOutput(res);
    };
    output();
  }

  // fetch("http://127.0.0.1:5001/").then((req) => {
  //   console.log(req.body);
  // });

  // async function callApi() {
  //   const response = await fetch("http://127.0.0.1:5001/");
  //   // const data = await response.json();
  //   console.log(response.json());
  // }

  return (
    <div className="flex flex-col justify-between mt-2 mr-2">
      <div className="flex flex-row">
        <Card className="grow">
          <CardHeader>
            <CardTitle>Total Production</CardTitle>
          </CardHeader>
          <CardContent>{output}</CardContent>
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
