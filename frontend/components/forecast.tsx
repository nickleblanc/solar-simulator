"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Graph } from "@/components/Graph";
import { FormError } from "@/components/form-error";
import { useLocationStore } from "@/stores/locations";
import { useParameterStore } from "@/stores/parameters";
import { createExcel } from "@/lib/utils";

export function Forecast() {
  const [forecastData, setForecastData] = useState<any>(null);
  const [error, setError] = useState<string | undefined>("");

  const locations = useLocationStore((state) => state.locations);
  const selectedLocations = locations.filter((location) => location.selected);

  const parameters = useParameterStore((state) => state);

  const numLocations = selectedLocations.length;

  const totalNumberPanels = selectedLocations.reduce(
    (acc, location) => acc + location.numberPanels,
    0
  );

  const fetchForecast = async () => {
    const body = {
      parameters: parameters,
      numLocations: numLocations,
      numPanels: totalNumberPanels,
    };
    try {
      const response = await fetch(`http://localhost:5001/forecast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return response.json();
    } catch (error) {
      console.log(error);
      return { error: "Failed to fetch forecast" };
    }
  };

  async function onClick() {
    setError("");
    const forecast = await fetchForecast();
    if (forecast.error) {
      setError(forecast.error);
      return;
    }
    setForecastData(forecast);
  }

  return (
    <div className="flex w-full justify-center space-x-2">
      <div className="mt-2">
        <Button onClick={onClick}>Fetch Forecast</Button>
      </div>
      <FormError message={error} />
      <div className="flex w-full justify-center h-full">
        {forecastData && (
          <div className="flex flex-col space-y-4 h-full w-full pl-8">
            <Graph
              times={forecastData.forecast.times}
              acpower={forecastData.forecast.acpower}
            />
            <Button onClick={() => createExcel(forecastData)}>
              Export to Excel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
