"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocationStore } from "@/stores/locations";
import { useParameterStore } from "@/stores/parameters";
import { useFormValueStore } from "@/stores/form-values";
import { Graph } from "@/components/Graph";
import { calculateNumberOfPanels } from "@/lib/panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

import {
  APIProvider,
  Map,
  MapMouseEvent,
  Marker,
} from "@vis.gl/react-google-maps";

import { getRoofArea } from "@/actions/google-solar";

import * as XLSX from "xlsx";

const FormSchema = z.object({
  daterange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

export function Dashboard() {
  const defaultSelected: DateRange = {
    from: new Date(2024, 2, 1),
    to: new Date(2024, 2, 7),
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [graphData, setGraphData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);

  const addLocation = useLocationStore((state) => state.addLocation);
  const locations = useLocationStore((state) => state.locations);

  const selectedLocations = locations.filter((location) => location.selected);

  const parameters = useParameterStore((state) => state);

  const setFormValues = useFormValueStore((state) => state.setValues);

  const totalArea = selectedLocations.reduce(
    (acc, location) => acc + location.area,
    0
  );

  const numLocations = selectedLocations.length;

  const totalNumberPanels = selectedLocations.reduce(
    (acc, location) => acc + location.numberPanels,
    0
  );

  const solarProduction = totalNumberPanels * parameters.stc;
  const costOfPanels = Math.round(2.0 * solarProduction * 100) / 100;
  const payback = costOfPanels / 2125;

  const roi = getSavings();

  // const { numPanels, solarProduction, costOfPanels, payback } =
  //   calculateNumberOfPanels(totalArea);

  const fetchHistory = async (start: string, end: string) => {
    const body = {
      parameters: parameters,
      start: start,
      end: end,
      numLocations: numLocations,
      numPanels: totalNumberPanels,
    };
    const response = await fetch(`http://localhost:5001/hist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  const fetchForecast = async () => {
    const body = {
      parameters: parameters,
      numLocations: numLocations,
      numPanels: totalNumberPanels,
    };
    const response = await fetch(`http://localhost:5001/forecast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  async function onClick() {
    const test = await fetchForecast();
    console.log(test);
    setForecastData(test);
  }

  function getDateString(date: Date) {
    return `${date.getFullYear().toString()},${(
      date.getMonth() + 1
    ).toString()},${date.getDate().toString()}`;
  }

  async function onSubmit(data: any) {
    console.log(data);
    const test = await fetchHistory(
      getDateString(data.daterange.from),
      getDateString(data.daterange.to)
    );
    console.log(test);
    setGraphData(test);
  }

  async function onMapClick(ev: MapMouseEvent) {
    if (!ev.detail.latLng) return;
    setFormValues(ev.detail.latLng.lat, ev.detail.latLng.lng);
  }

  const stringToDollars = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  function convertToObj(a: string[], b: number[]) {
    if (a.length != b.length || a.length == 0 || b.length == 0) {
      return null;
    }

    let object = a.map((val1, index) => ({
      time: val1,
      acpower: b[index],
    }));

    return object;
  }

  const createExcel = () => {
    let arrayOfObjects = convertToObj(
      graphData.histsearch.times,
      graphData.histsearch.acpower
    );
    if (!arrayOfObjects) {
      return;
    }
    console.log(arrayOfObjects);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(arrayOfObjects);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "solar-data.xlsx");
  };

  function getSavings() {
    if (!graphData) {
      return 0;
    }
    let t1 =
      graphData.histsearch.times[1][9] + graphData.histsearch.times[1][10];
    let t2 =
      graphData.histsearch.times[2][9] + graphData.histsearch.times[2][10];
    let diff = t2 - t1;
    diff = diff / 60;
    let sum = 0;
    for (const el of graphData.histsearch.acpower) {
      sum += el;
    }
    let savings = (sum * diff * 15.87) / 100000;
    return savings;
  }

  return (
    <div className="flex flex-col p-4 h-screen">
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
      <Tabs defaultValue="map" className="w-full mt-6 h-full flex flex-col">
        <TabsList className="w-[215px]">
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>
        <TabsContent value="map" className="grow">
          <Card className="w-full h-full">
            <APIProvider apiKey={"AIzaSyB334Kl5IrbMcEa39Y30yCG6-ulbL_5B18"}>
              <Map
                defaultCenter={{ lat: 45.946, lng: -66.638 }}
                defaultZoom={15}
                gestureHandling={"greedy"}
                disableDefaultUI={false}
                onClick={onMapClick}
                mapTypeId={"satellite"}
                className="rounded-md h-full w-full"
              >
                {selectedLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={{
                      lat: location.latitude,
                      lng: location.longitude,
                    }}
                  />
                ))}
              </Map>
            </APIProvider>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="grow">
          <div className="flex h-full">
            <div className="flex flex-col h-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="daterange"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Calendar
                          mode="range"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={{ after: new Date() }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
              {graphData && (
                <Card className="w-full mt-4">
                  <CardHeader>
                    <CardTitle>Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span>{stringToDollars.format(roi)}</span>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="flex w-full justify-center h-full">
              {graphData && (
                <div className="flex flex-col space-y-4 h-full w-full pl-8">
                  <Graph
                    times={graphData.histsearch.times}
                    acpower={graphData.histsearch.acpower}
                  />
                  <Button onClick={createExcel}>Export to Excel</Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="forecast" className="flex">
          <div className="flex w-full justify-center space-x-2">
            <div className="mt-2">
              <Button onClick={onClick}>Fetch Forecast</Button>
            </div>
            <div className="flex w-full justify-center h-full">
              {forecastData && (
                <div className="flex flex-col space-y-4 h-full w-full pl-8">
                  <Graph
                    times={forecastData.forecast.times}
                    acpower={forecastData.forecast.acpower}
                  />
                  <Button onClick={createExcel}>Export to Excel</Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
