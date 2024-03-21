"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocationStore } from "@/stores/data";
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

  const { numPanels, solarProduction, costOfPanels, payback } =
    calculateNumberOfPanels(totalArea);

  const fetchHistory = async (start: string, end: string) => {
    const body = {
      parameters: parameters,
      start: start,
      end: end,
      numLocations: numLocations,
      numPanels: numPanels,
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
      numPanels: numPanels,
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

  return (
    <div className="flex flex-col p-2 h-screen">
      <div className="flex flex-row h-1/6 space-x-2">
        <Card className="grow">
          <CardHeader>
            <CardTitle>Array Size</CardTitle>
          </CardHeader>
          <CardContent>{solarProduction / 1000} kW</CardContent>
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
      <Tabs defaultValue="map" className="w-full mt-8 h-full flex flex-col">
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
        <TabsContent value="history" className="flex">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <div className="flex w-full justify-center">
            {graphData && (
              <Graph
                times={graphData.histsearch.times}
                acpower={graphData.histsearch.acpower}
              />
            )}
          </div>
        </TabsContent>
        <TabsContent value="forecast" className="flex">
          <div className="flex w-full justify-center">
            <Button onClick={onClick}>Fetch Forecast</Button>
            {forecastData && (
              <Graph
                times={forecastData.forecast.times}
                acpower={forecastData.forecast.acpower}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
      {/* <div className="flex flex-col h-screen">
        <div>some content</div>
        <div className="flex-1">flex</div>
        <div>another content</div>
      </div> */}
    </div>
  );
}
